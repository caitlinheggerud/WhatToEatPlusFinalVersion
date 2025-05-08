import { pgTable, text, serial, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (from existing schema, kept for reference)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Receipt item model
export const receiptItems = pgTable("receipt_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReceiptItemSchema = createInsertSchema(receiptItems).omit({
  id: true,
  createdAt: true,
});

export type InsertReceiptItem = z.infer<typeof insertReceiptItemSchema>;
export type ReceiptItem = typeof receiptItems.$inferSelect;

// Schema for Gemini API response parsing
export const receiptItemsResponseSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.string(),
    category: z.string().optional()
  })
);

export type ReceiptItemResponse = z.infer<typeof receiptItemsResponseSchema>[0];
