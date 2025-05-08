import type { Express, Request, Response } from "express";
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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Receipt image upload and analysis endpoint
  app.post(
    "/api/receipts/analyze", 
    upload.single('receipt'), 
    async (req: Request, res: Response) => {
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
          Extract the items from this receipt. For each item, provide:
          1. Name (product name)
          2. Description (if available, like brand, size, etc.)
          3. Price (including currency symbol if present)
          
          Format your response as a JSON array like this:
          [
            {"name": "Item Name", "description": "Item Description", "price": "¥10.00"},
            {"name": "Another Item", "description": "Another Description", "price": "¥5.50"}
          ]
          
          Only include the JSON array in your response, nothing else.
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
        const jsonText = text.replace(/```json|```/g, '').trim();
        
        try {
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
            price: parseFloat(itemData.price.replace(/[^\d.-]/g, '')) // Remove currency symbols
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
