import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  insertReceiptItemSchema, 
  receiptItemsResponseSchema,
  insertReceiptSchema 
} from "@shared/schema";
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
          Analyze this receipt and extract the items, GST (tax), and total in a simple JSON format.
          
          Format each regular item as:
          {"name": "Item Name", "description": "Details if any", "price": "$XX.XX", "category": "Food/Beverage/etc"}
          
          Be sure to include GST/tax (very important):
          {"name": "GST", "description": "Goods and Services Tax", "price": "$X.XX", "category": "Tax"}
          
          And the total:
          {"name": "TOTAL", "description": "Total Payment", "price": "$XX.XX", "category": "Total"}
          
          Return ONLY a properly formatted JSON array with no explanations:
          [
            {"name": "First Item", "description": "Description", "price": "$10.00", "category": "Food"},
            {"name": "GST", "description": "Goods and Services Tax", "price": "$1.00", "category": "Tax"},
            {"name": "TOTAL", "description": "Total Payment", "price": "$11.00", "category": "Total"}
          ]
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
        
        // Advanced JSON cleaning for common errors
        // Fix missing commas between objects
        jsonText = jsonText.replace(/}(\s*){/g, '},{');
        
        // Fix trailing commas
        jsonText = jsonText.replace(/,(\s*)}]/g, '}]');
        jsonText = jsonText.replace(/,(\s*)]/g, ']');
        
        // Fix missing quotes around property names
        jsonText = jsonText.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
        
        // More robust approach to handle problematic JSON
        const sanitizeJsonText = (text: string): string => {
          try {
            // First try to parse it directly - if it works, no need for complex handling
            JSON.parse(text);
            return text;
          } catch (e) {
            // If it fails, implement a more aggressive cleaning strategy
            console.log("Initial JSON parsing failed, attempting more aggressive cleaning");
            
            // Fix any bad escape sequences and control characters
            let result = text
              // Handle escaped quotes that create invalid JSON  
              .replace(/\\"/g, "'")  // Replace escaped quotes with single quotes
              .replace(/(?<!\\\")\\(?!\\\")/g, "\\\\") // Escape backslashes properly
              
              // Handle mismatched quotes in values
              .replace(/([{,]\s*"[^"]+"\s*:\s*)"([^"]*)([^\\])"([,}])/g, '$1"$2$3"$4')
              
              // Replace any control characters with spaces
              .replace(/[\x00-\x1F\x7F]/g, ' ');
            
            // Convert all category values to proper format with double quotes
            result = result.replace(/"category"\s*:\s*"?([^,"}\]]+)"?/g, '"category": "$1"');
            
            // Remove backslashes before double quotes in values
            result = result.replace(/"([^"]+)\\\"([^"]+)"/g, '"$1\'$2"');
            
            // Final fix for any trailing commas in arrays
            result = result.replace(/,\s*]/g, ']');
            
            console.log("After aggressive cleaning:", result);
            
            try {
              // Try to parse the cleaned JSON
              JSON.parse(result);
              return result;
            } catch (err) {
              console.log("Aggressive cleaning failed, using hackish approach");
              
              // If all else fails, use a more hackish approach to forcibly extract and rebuild the JSON
              const extractItems = /\{\s*"name"\s*:\s*"([^"]+)"\s*,\s*"description"\s*:\s*(?:null|"[^"]*")\s*,\s*"price"\s*:\s*"([^"]+)"\s*,\s*"category"\s*:\s*"([^"]+)"\s*\}/g;
              
              let matches = [];
              let match;
              
              while ((match = extractItems.exec(text)) !== null) {
                matches.push({
                  name: match[1],
                  description: null, // Simplify by defaulting to null
                  price: match[2],
                  category: match[3].replace(/[\\"\s]/g, '') // Clean up category
                });
              }
              
              if (matches.length > 0) {
                return JSON.stringify(matches);
              }
              
              // If extraction still failed, return a version with all quotes handled
              return text.replace(/"/g, '\\"').replace(/\\\\"/g, '\\"');
            }
          }
        };
        
        // Apply our more robust sanitization function
        jsonText = sanitizeJsonText(jsonText);
        
        // Log the cleaned JSON
        console.log("Cleaned JSON:", jsonText);
        
        // If GST isn't found in the response, check if subtotal and total differ, and calculate GST
        try {
          // First parse without modifying to see if GST is included
          const prelimItems = JSON.parse(jsonText);
          
          // Check if GST is missing
          const hasGst = prelimItems.some((item: any) => 
            item.category === 'Tax' || 
            ['GST', 'TAX', 'VAT'].includes(String(item.name).toUpperCase())
          );
          
          if (!hasGst) {
            // Find subtotal and total items
            const regularItems = prelimItems.filter((item: any) => 
              item.category !== 'Total' && 
              !['TOTAL', 'AMOUNT', 'PAYMENT'].includes(String(item.name).toUpperCase())
            );
            
            const totalItem = prelimItems.find((item: any) => 
              item.category === 'Total' || 
              ['TOTAL', 'AMOUNT', 'PAYMENT'].includes(String(item.name).toUpperCase())
            );
            
            if (totalItem) {
              // Calculate subtotal
              const subtotal = regularItems.reduce((sum: number, item: any) => {
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

  // Save receipt with items
  app.post("/api/receipts/items", async (req: Request, res: Response) => {
    try {
      const itemsData = req.body;
      
      if (!Array.isArray(itemsData)) {
        return res.status(400).json({ message: "Expected an array of receipt items" });
      }
      
      // Find the total amount from the receipt data
      const totalItem = itemsData.find(item => 
        item.category === 'Total' || ['TOTAL', 'AMOUNT', 'PAYMENT'].includes(String(item.name).toUpperCase())
      );
      
      // Create receipt
      const receiptData = {
        store: "Unknown Store", // In a real app, you might extract this from the receipt
        totalAmount: totalItem?.price || null,
        date: new Date()
      };
      
      // Filter out items that aren't actual items (like Total and Tax)
      const actualItems = itemsData.filter(item => 
        item.category !== 'Total' && !['TOTAL', 'AMOUNT', 'PAYMENT'].includes(String(item.name).toUpperCase())
      );
      
      // Prepare items for insertion
      const insertItems = actualItems.map(item => ({
        name: item.name,
        description: item.description || null,
        price: item.price,
        category: item.category || "Others"
      }));
      
      // Save receipt and items
      const receiptWithItems = await storage.createReceiptWithItems(receiptData, insertItems);
      
      return res.status(201).json(receiptWithItems);
    } catch (error) {
      console.error("Error saving receipt items:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Unknown error occurred while saving receipt items" 
      });
    }
  });

  // Get all receipts
  app.get("/api/receipts", async (req: Request, res: Response) => {
    try {
      const receipts = await storage.getReceipts();
      return res.status(200).json(receipts);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Unknown error occurred while fetching receipts" 
      });
    }
  });
  
  // Get receipt with items
  app.get("/api/receipts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid receipt ID" });
      }
      
      const receipt = await storage.getReceiptWithItems(id);
      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }
      
      return res.status(200).json(receipt);
    } catch (error) {
      console.error("Error fetching receipt:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Unknown error occurred while fetching receipt" 
      });
    }
  });

  // Get all receipt items (legacy endpoint)
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
