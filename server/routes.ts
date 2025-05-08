import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { insertReceiptItemSchema, receiptItemsResponseSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import fs from "fs";
import path from "path";
import os from "os";

// Extended Request type to include file from multer
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Create temp directory if it doesn't exist
      const tempDir = path.join(os.tmpdir(), 'receipt-uploads');
      fs.mkdirSync(tempDir, { recursive: true });
      cb(null, tempDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    // Accept only jpeg and png
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only JPEG and PNG are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

  // Receipt image upload and analysis endpoint
  app.post(
    "/api/receipts/analyze", 
    upload.single('receipt'), 
    async (req: RequestWithFile, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        // Read the uploaded file
        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);
        
        // Convert to base64
        const base64Image = fileBuffer.toString('base64');
        
        // Prepare the prompt for Gemini API
        const prompt = `
          Analyze this receipt and extract the following information as a valid JSON array:
          
          For each item on the receipt, include:
          - "name": The product name (expand any abbreviations)
          - "description": Brand, size, or other details (or null if none)
          - "price": Price with currency symbol
          - "category": One of these categories: Food, Beverage, Household, Clothing, Electronics, Personal Care, Others
          
          VERY IMPORTANT: Look carefully for GST (Goods and Services Tax) or any tax amount on the receipt. 
          It may appear as a separate line near the total or subtotal. Even if it's small or partially visible, 
          include it as a separate item like this:
          - "name": "GST" 
          - "description": "Goods and Services Tax"
          - "price": The exact tax amount with currency symbol
          - "category": "Tax"
          
          If there's a total amount, include it as:
          - "name": "TOTAL"
          - "description": "Total Payment"
          - "price": The total amount with currency symbol
          - "category": "Total"
          
          Format your response ONLY as a valid JSON array like this:
          [
            {"name": "Item 1", "description": "Description 1", "price": "$10.00", "category": "Food"},
            {"name": "GST", "description": "Goods and Services Tax", "price": "$1.00", "category": "Tax"},
            {"name": "TOTAL", "description": "Total Payment", "price": "$11.00", "category": "Total"}
          ]
          
          Provide nothing but the properly formatted JSON array. Make sure to include the GST entry if it appears on the receipt.
        `;

        // Generate content with Gemini
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: req.file.mimetype,
              data: base64Image
            }
          }
        ]);
        
        // Extract the response
        const response = result.response;
        const text = response.text();
        
        // Clean the text to ensure it's valid JSON
        let jsonText = text.replace(/```json|```/g, '').trim();
        
        // Additional cleaning to handle potential JSON formatting issues
        if (!jsonText.startsWith('[') || !jsonText.endsWith(']')) {
          const startIdx = jsonText.indexOf('[');
          const endIdx = jsonText.lastIndexOf(']');
          if (startIdx !== -1 && endIdx !== -1) {
            jsonText = jsonText.substring(startIdx, endIdx + 1);
          }
        }
        
        // If GST isn't found in the response, check if subtotal and total differ, and calculate GST
        try {
          // First parse without modifying to see if GST is included
          const prelimItems = JSON.parse(jsonText);
          
          // Check if GST is missing
          const hasGst = prelimItems.some(item => 
            item.category === 'Tax' || 
            ['GST', 'TAX', 'VAT'].includes(String(item.name).toUpperCase())
          );
          
          if (!hasGst) {
            // Find subtotal and total items
            const regularItems = prelimItems.filter(item => 
              item.category !== 'Total' && 
              !['TOTAL', 'AMOUNT', 'PAYMENT'].includes(String(item.name).toUpperCase())
            );
            
            const totalItem = prelimItems.find(item => 
              item.category === 'Total' || 
              ['TOTAL', 'AMOUNT', 'PAYMENT'].includes(String(item.name).toUpperCase())
            );
            
            if (totalItem) {
              // Calculate subtotal
              const subtotal = regularItems.reduce((sum, item) => {
                const priceValue = parseFloat(String(item.price).replace(/[^\d.-]/g, ''));
                return sum + (isNaN(priceValue) ? 0 : priceValue);
              }, 0);
              
              // Get total value
              const totalValue = parseFloat(String(totalItem.price).replace(/[^\d.-]/g, ''));
              
              // If total > subtotal, the difference might be GST
              if (totalValue > subtotal) {
                const possibleGst = totalValue - subtotal;
                
                // Get currency symbol from the first item
                const currencySymbol = regularItems.length > 0 ? 
                  String(regularItems[0].price).replace(/[\d.-]/g, '').trim() || '$' : 
                  '$';
                
                // Add GST item to the items array
                prelimItems.push({
                  "name": "GST",
                  "description": "Goods and Services Tax",
                  "price": `${currencySymbol}${possibleGst.toFixed(2)}`,
                  "category": "Tax"
                });
                
                // Update jsonText with the new array including GST
                jsonText = JSON.stringify(prelimItems);
              }
            }
          }
        } catch (e) {
          // If preliminary parsing fails, continue with original jsonText
          console.log("Preliminary parsing for GST calculation failed:", e);
        }
        
        try {
          // Log the text being parsed
          console.log("Attempting to parse JSON:", jsonText);
          
          // Parse the response
          const parsedItems = JSON.parse(jsonText);
          
          // Validate with our schema
          const validatedItems = receiptItemsResponseSchema.parse(parsedItems);
          
          // Clean up the temporary file
          fs.unlinkSync(filePath);
          
          return res.status(200).json(validatedItems);
        } catch (error) {
          console.error("Failed to parse Gemini API response:", error);
          
          if (error instanceof SyntaxError) {
            return res.status(422).json({ 
              message: "Failed to parse receipt data from Gemini API response",
              rawResponse: text
            });
          }
          
          if (error instanceof z.ZodError) {
            const validationError = fromZodError(error);
            return res.status(422).json({ 
              message: validationError.message 
            });
          }
          
          throw error;
        }
      } catch (error) {
        console.error("Error analyzing receipt:", error);
        
        if (req.file?.path) {
          // Clean up the temporary file in case of errors
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkError) {
            console.error("Failed to unlink temporary file:", unlinkError);
          }
        }
        
        return res.status(500).json({ 
          message: error instanceof Error ? error.message : "Unknown error occurred" 
        });
      }
    }
  );

  // Save receipt items
  app.post("/api/receipts/items", async (req: Request, res: Response) => {
    try {
      const itemsData = req.body;
      
      if (!Array.isArray(itemsData)) {
        return res.status(400).json({ message: "Expected an array of receipt items" });
      }
      
      const savedItems = [];
      
      for (const itemData of itemsData) {
        try {
          // Validate each item
          const validatedItem = insertReceiptItemSchema.parse({
            name: itemData.name,
            description: itemData.description || null,
            price: parseFloat(itemData.price.replace(/[^\d.-]/g, '')), // Remove currency symbols
            category: itemData.category || "Others"
          });
          
          // Save to storage
          const savedItem = await storage.createReceiptItem(validatedItem);
          savedItems.push(savedItem);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const validationError = fromZodError(error);
            return res.status(400).json({ message: validationError.message });
          }
          throw error;
        }
      }
      
      return res.status(201).json(savedItems);
    } catch (error) {
      console.error("Error saving receipt items:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Unknown error occurred while saving receipt items" 
      });
    }
  });

  // Get all receipt items
  app.get("/api/receipts/items", async (req: Request, res: Response) => {
    try {
      const items = await storage.getReceiptItems();
      return res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching receipt items:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Unknown error occurred while fetching receipt items" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
