import { 
  users, type User, type InsertUser,
  receipts, type Receipt, type InsertReceipt, 
  receiptItems, type ReceiptItem, type InsertReceiptItem,
  type ReceiptWithItems,
  inventoryItems, type InventoryItem, type InsertInventoryItem,
  dietaryPreferences, type DietaryPreference, type InsertDietaryPreference,
  mealTypes, type MealType, type InsertMealType,
  recipes, type Recipe, type InsertRecipe,
  recipeIngredients, type RecipeIngredient, type InsertRecipeIngredient,
  recipeDietaryRestrictions, type RecipeDietaryRestriction, type InsertRecipeDietaryRestriction,
  type RecipeFull
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray, like, or, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Receipt methods
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  getReceipt(id: number): Promise<Receipt | undefined>;
  getReceipts(): Promise<Receipt[]>;
  getReceiptWithItems(id: number): Promise<ReceiptWithItems | undefined>;
  
  // Receipt item methods
  createReceiptItem(item: InsertReceiptItem): Promise<ReceiptItem>;
  getReceiptItems(): Promise<ReceiptItem[]>;
  getReceiptItemsByReceiptId(receiptId: number): Promise<ReceiptItem[]>;
  createReceiptWithItems(receipt: InsertReceipt, items: InsertReceiptItem[]): Promise<ReceiptWithItems>;
  
  // Inventory methods
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  getInventoryItems(): Promise<InventoryItem[]>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  addReceiptItemsToInventory(receiptId: number): Promise<InventoryItem[]>;
  
  // Recipe methods
  createRecipe(recipe: InsertRecipe, ingredients: InsertRecipeIngredient[], dietaryRestrictionIds: number[]): Promise<Recipe>;
  getRecipes(filters?: {
    mealTypeId?: number;
    dietaryRestrictions?: number[];
    searchTerm?: string;
    inventoryBased?: boolean;
  }): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<RecipeFull | undefined>;
  getRandomRecipe(filters?: {
    mealTypeId?: number;
    dietaryRestrictions?: number[];
    inventoryBased?: boolean;
  }): Promise<RecipeFull | undefined>;
  
  // Dietary preferences/meal types
  getDietaryPreferences(): Promise<DietaryPreference[]>;
  getMealTypes(): Promise<MealType[]>;
  createDietaryPreference(pref: InsertDietaryPreference): Promise<DietaryPreference>;
  createMealType(type: InsertMealType): Promise<MealType>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Receipt methods
  async createReceipt(receipt: InsertReceipt): Promise<Receipt> {
    const [createdReceipt] = await db
      .insert(receipts)
      .values(receipt)
      .returning();
    return createdReceipt;
  }

  async getReceipt(id: number): Promise<Receipt | undefined> {
    const [receipt] = await db
      .select()
      .from(receipts)
      .where(eq(receipts.id, id));
    return receipt;
  }

  async getReceipts(): Promise<Receipt[]> {
    const allReceipts = await db
      .select()
      .from(receipts)
      .orderBy(desc(receipts.createdAt));
    return allReceipts;
  }

  async getReceiptWithItems(id: number): Promise<ReceiptWithItems | undefined> {
    const receipt = await this.getReceipt(id);
    if (!receipt) return undefined;
    
    const items = await this.getReceiptItemsByReceiptId(id);
    
    return {
      ...receipt,
      items
    };
  }

  // Receipt item methods
  async createReceiptItem(item: InsertReceiptItem): Promise<ReceiptItem> {
    const [createdItem] = await db
      .insert(receiptItems)
      .values(item)
      .returning();
    return createdItem;
  }

  async getReceiptItems(): Promise<ReceiptItem[]> {
    const allItems = await db
      .select()
      .from(receiptItems)
      .orderBy(desc(receiptItems.createdAt));
    return allItems;
  }

  async getReceiptItemsByReceiptId(receiptId: number): Promise<ReceiptItem[]> {
    const items = await db
      .select()
      .from(receiptItems)
      .where(eq(receiptItems.receiptId, receiptId))
      .orderBy(desc(receiptItems.createdAt));
    return items;
  }

  async createReceiptWithItems(receipt: InsertReceipt, items: InsertReceiptItem[]): Promise<ReceiptWithItems> {
    // Create receipt first
    const createdReceipt = await this.createReceipt(receipt);
    
    // Then create all items with the receipt ID
    const createdItems = await Promise.all(
      items.map(item => this.createReceiptItem({
        ...item,
        receiptId: createdReceipt.id
      }))
    );
    
    // Return receipt with items
    return {
      ...createdReceipt,
      items: createdItems
    };
  }

  // Inventory methods
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [createdItem] = await db
      .insert(inventoryItems)
      .values(item)
      .returning();
    return createdItem;
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    const items = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.isInInventory, true))
      .orderBy(desc(inventoryItems.createdAt));
    return items;
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const [updatedItem] = await db
      .update(inventoryItems)
      .set(item)
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    // Soft delete by setting isInInventory to false
    const [updatedItem] = await db
      .update(inventoryItems)
      .set({ isInInventory: false })
      .where(eq(inventoryItems.id, id))
      .returning();
    
    return !!updatedItem;
  }

  async addReceiptItemsToInventory(receiptId: number): Promise<InventoryItem[]> {
    // Get receipt items
    const receiptItems = await this.getReceiptItemsByReceiptId(receiptId);
    
    // Filter out non-food items like tax, fees, etc.
    const foodItems = receiptItems.filter(item => {
      const category = item.category?.toLowerCase() || '';
      return !['tax', 'fee', 'deposit', 'total', 'subtotal'].includes(category);
    });
    
    // Add each item to inventory
    const inventoryItemsPromises = foodItems.map(item => {
      // Default expiry date to 7 days from now for perishables, null for non-perishables
      const expiryDate = this.getDefaultExpiryDate(item.category || 'Other');
      
      return this.createInventoryItem({
        name: item.name,
        description: item.description || null,
        quantity: "1", // Default quantity
        category: item.category || 'Other',
        expiryDate,
        isInInventory: true,
        sourceReceiptId: receiptId
      });
    });
    
    return Promise.all(inventoryItemsPromises);
  }
  
  private getDefaultExpiryDate(category: string): Date | null {
    // Simple logic to set default expiry dates based on category
    const lowerCategory = category.toLowerCase();
    const now = new Date();
    
    if (['produce', 'fruit', 'vegetable', 'vegetables', 'dairy', 'meat', 'seafood'].some(c => lowerCategory.includes(c))) {
      // Perishables: 7 days
      const expiry = new Date(now);
      expiry.setDate(expiry.getDate() + 7);
      return expiry;
    } else if (['bakery', 'bread'].some(c => lowerCategory.includes(c))) {
      // Bakery: 3 days
      const expiry = new Date(now);
      expiry.setDate(expiry.getDate() + 3);
      return expiry;
    } else if (['frozen'].some(c => lowerCategory.includes(c))) {
      // Frozen: 90 days
      const expiry = new Date(now);
      expiry.setDate(expiry.getDate() + 90);
      return expiry;
    }
    
    // Non-perishables, unknown categories: no expiry
    return null;
  }

  // Dietary preferences/meal types
  async getDietaryPreferences(): Promise<DietaryPreference[]> {
    return db.select().from(dietaryPreferences);
  }

  async getMealTypes(): Promise<MealType[]> {
    return db.select().from(mealTypes);
  }

  async createDietaryPreference(pref: InsertDietaryPreference): Promise<DietaryPreference> {
    const [created] = await db
      .insert(dietaryPreferences)
      .values(pref)
      .returning();
    return created;
  }

  async createMealType(type: InsertMealType): Promise<MealType> {
    const [created] = await db
      .insert(mealTypes)
      .values(type)
      .returning();
    return created;
  }

  // Recipe methods
  async createRecipe(
    recipe: InsertRecipe, 
    ingredients: InsertRecipeIngredient[], 
    dietaryRestrictionIds: number[]
  ): Promise<Recipe> {
    // Create recipe
    const [createdRecipe] = await db
      .insert(recipes)
      .values(recipe)
      .returning();
    
    // Add ingredients
    await Promise.all(
      ingredients.map(ingredient => 
        db.insert(recipeIngredients).values({
          ...ingredient,
          recipeId: createdRecipe.id,
        })
      )
    );
    
    // Add dietary restrictions
    if (dietaryRestrictionIds.length > 0) {
      await Promise.all(
        dietaryRestrictionIds.map(dietaryPreferenceId => 
          db.insert(recipeDietaryRestrictions).values({
            recipeId: createdRecipe.id,
            dietaryPreferenceId,
          })
        )
      );
    }
    
    return createdRecipe;
  }

  async getRecipes(filters?: {
    mealTypeId?: number;
    dietaryRestrictions?: number[];
    searchTerm?: string;
    inventoryBased?: boolean;
  }): Promise<Recipe[]> {
    let query = db.select().from(recipes);
    
    // Apply filters
    if (filters) {
      if (filters.mealTypeId) {
        query = query.where(eq(recipes.mealTypeId, filters.mealTypeId));
      }
      
      if (filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
        // Join with dietary restrictions to filter
        const subquery = db.select({ id: recipeDietaryRestrictions.recipeId })
          .from(recipeDietaryRestrictions)
          .where(inArray(recipeDietaryRestrictions.dietaryPreferenceId, filters.dietaryRestrictions))
          .groupBy(recipeDietaryRestrictions.recipeId)
          .having({ count: sql`count(*)`.gte(filters.dietaryRestrictions.length) });
        
        query = query.where(inArray(recipes.id, subquery));
      }
      
      if (filters.searchTerm) {
        const searchTerm = `%${filters.searchTerm}%`;
        query = query.where(like(recipes.title, searchTerm));
      }
      
      if (filters.inventoryBased) {
        // Get inventory items
        const inventoryItemNames = await db
          .select({ name: inventoryItems.name })
          .from(inventoryItems)
          .where(eq(inventoryItems.isInInventory, true));
        
        if (inventoryItemNames.length > 0) {
          // Find recipes where at least some ingredients match inventory
          const ingredientNames = inventoryItemNames.map(item => item.name.toLowerCase());
          
          if (ingredientNames.length > 0) {
            // Get all recipe ingredients first
            const allRecipeIngredients = await db
              .select({
                recipeId: recipeIngredients.recipeId,
                name: recipeIngredients.name
              })
              .from(recipeIngredients);
            
            // Find recipes where ingredients match inventory
            // Group recipe IDs by those that have at least one matching ingredient
            const recipeIdsWithMatchingIngredients = new Set<number>();
            
            allRecipeIngredients.forEach(ingredient => {
              const ingredientNameLower = ingredient.name.toLowerCase();
              for (const inventoryItemName of ingredientNames) {
                // Check if the ingredient contains the inventory item name or vice versa
                if (ingredientNameLower.includes(inventoryItemName) || 
                    inventoryItemName.includes(ingredientNameLower)) {
                  recipeIdsWithMatchingIngredients.add(ingredient.recipeId);
                  break;
                }
              }
            });
            
            // Apply the filter if we found any matches
            if (recipeIdsWithMatchingIngredients.size > 0) {
              query = query.where(
                inArray(
                  recipes.id, 
                  Array.from(recipeIdsWithMatchingIngredients)
                )
              );
            } else {
              // If we have inventory items but no recipes match, return empty result
              return [];
            }
          }
        }
      }
    }
    
    return query.orderBy(desc(recipes.createdAt));
  }

  async getRecipeById(id: number): Promise<RecipeFull | undefined> {
    const recipe = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);
    
    if (recipe.length === 0) {
      return undefined;
    }
    
    const [recipeData] = recipe;
    
    // Get meal type
    let mealType = null;
    if (recipeData.mealTypeId) {
      const [mealTypeData] = await db
        .select()
        .from(mealTypes)
        .where(eq(mealTypes.id, recipeData.mealTypeId));
      
      if (mealTypeData) {
        mealType = {
          id: mealTypeData.id,
          name: mealTypeData.name,
        };
      }
    }
    
    // Get ingredients
    const ingredients = await db
      .select()
      .from(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, id));
    
    // Get dietary restrictions
    const dietaryRestrictionsJoins = await db
      .select({
        id: dietaryPreferences.id,
        name: dietaryPreferences.name,
      })
      .from(recipeDietaryRestrictions)
      .innerJoin(
        dietaryPreferences,
        eq(recipeDietaryRestrictions.dietaryPreferenceId, dietaryPreferences.id)
      )
      .where(eq(recipeDietaryRestrictions.recipeId, id));
    
    return {
      id: recipeData.id,
      title: recipeData.title,
      instructions: recipeData.instructions,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
      calories: recipeData.calories,
      imageUrl: recipeData.imageUrl,
      mealType,
      ingredients,
      dietaryRestrictions: dietaryRestrictionsJoins,
    };
  }

  async getRandomRecipe(filters?: {
    mealTypeId?: number;
    dietaryRestrictions?: number[];
    inventoryBased?: boolean;
  }): Promise<RecipeFull | undefined> {
    const recipes = await this.getRecipes(filters);
    
    if (recipes.length === 0) {
      return undefined;
    }
    
    // Select a random recipe
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const randomRecipe = recipes[randomIndex];
    
    // Get full recipe details
    return this.getRecipeById(randomRecipe.id);
  }
}

export const storage = new DatabaseStorage();
