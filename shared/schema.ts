import { pgTable, text, serial, numeric, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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

// Inventory item model
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  quantity: text("quantity").default("1").notNull(),
  category: text("category").default("Other").notNull(),
  price: text("price"),  // Add price field to track item costs
  expiryDate: timestamp("expiry_date"),
  isInInventory: boolean("is_in_inventory").default(true).notNull(),
  sourceReceiptId: integer("source_receipt_id").references(() => receipts.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  sourceReceipt: one(receipts, {
    fields: [inventoryItems.sourceReceiptId],
    references: [receipts.id],
  }),
}));

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Dietary preferences/restrictions for recipe filtering
export const dietaryPreferences = pgTable("dietary_preferences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const insertDietaryPreferenceSchema = createInsertSchema(dietaryPreferences).omit({
  id: true,
});

export type InsertDietaryPreference = z.infer<typeof insertDietaryPreferenceSchema>;
export type DietaryPreference = typeof dietaryPreferences.$inferSelect;

// Meal type categorization
export const mealTypes = pgTable("meal_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Breakfast, Lunch, Dinner, Dessert, Snack
  description: text("description"),
});

export const insertMealTypeSchema = createInsertSchema(mealTypes).omit({
  id: true,
});

export type InsertMealType = z.infer<typeof insertMealTypeSchema>;
export type MealType = typeof mealTypes.$inferSelect;

// Recipes model
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  instructions: text("instructions").notNull(),
  prepTime: integer("prep_time"), // in minutes
  cookTime: integer("cook_time"), // in minutes
  servings: integer("servings").notNull().default(4),
  calories: integer("calories"), // per serving
  imageUrl: text("image_url"),
  mealTypeId: integer("meal_type_id").references(() => mealTypes.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recipeRelations = relations(recipes, ({ many, one }) => ({
  ingredients: many(recipeIngredients),
  dietaryRestrictions: many(recipeDietaryRestrictions),
  mealType: one(mealTypes, {
    fields: [recipes.mealTypeId],
    references: [mealTypes.id],
  }),
}));

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Recipe ingredients model
export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id),
  name: text("name").notNull(),
  amount: text("amount").notNull(),
  unit: text("unit"),
  optional: boolean("optional").default(false),
});

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
}));

export const insertRecipeIngredientSchema = createInsertSchema(recipeIngredients).omit({
  id: true,
});

export type InsertRecipeIngredient = z.infer<typeof insertRecipeIngredientSchema>;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;

// Recipe dietary restrictions junction table
export const recipeDietaryRestrictions = pgTable("recipe_dietary_restrictions", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id),
  dietaryPreferenceId: integer("dietary_preference_id").notNull().references(() => dietaryPreferences.id),
});

export const recipeDietaryRestrictionsRelations = relations(recipeDietaryRestrictions, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeDietaryRestrictions.recipeId],
    references: [recipes.id],
  }),
  dietaryPreference: one(dietaryPreferences, {
    fields: [recipeDietaryRestrictions.dietaryPreferenceId],
    references: [dietaryPreferences.id],
  }),
}));

export const insertRecipeDietaryRestrictionSchema = createInsertSchema(recipeDietaryRestrictions).omit({
  id: true,
});

export type InsertRecipeDietaryRestriction = z.infer<typeof insertRecipeDietaryRestrictionSchema>;
export type RecipeDietaryRestriction = typeof recipeDietaryRestrictions.$inferSelect;

// Recipe with all its details
export const recipeFullSchema = z.object({
  id: z.number(),
  title: z.string(),
  instructions: z.string(),
  prepTime: z.number().nullable(),
  cookTime: z.number().nullable(),
  servings: z.number(),
  calories: z.number().nullable(),
  imageUrl: z.string().nullable(),
  mealType: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  ingredients: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      amount: z.string(),
      unit: z.string().nullable(),
      optional: z.boolean(),
    })
  ),
  dietaryRestrictions: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

export type RecipeFull = z.infer<typeof recipeFullSchema>;
