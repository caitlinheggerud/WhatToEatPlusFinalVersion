import { pgTable, text, serial, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

// Receipts model
export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  store: text("store"),
  totalAmount: text("total_amount"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const receiptRelations = relations(receipts, ({ many }) => ({
  items: many(receiptItems),
}));

export const insertReceiptSchema = createInsertSchema(receipts).omit({
  id: true,
  createdAt: true,
});

export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Receipt = typeof receipts.$inferSelect;

// Receipt item model
export const receiptItems = pgTable("receipt_items", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id").references(() => receipts.id),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const receiptItemsRelations = relations(receiptItems, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptItems.receiptId],
    references: [receipts.id],
  }),
}));

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

// Schema for a receipt with its items
export const receiptWithItemsSchema = z.object({
  id: z.number(),
  store: z.string().nullable(),
  totalAmount: z.string().nullable(),
  date: z.date(),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      price: z.string(),
      category: z.string().nullable()
    })
  )
});

export type ReceiptWithItems = z.infer<typeof receiptWithItemsSchema>;
