import { 
  users, type User, type InsertUser,
  receipts, type Receipt, type InsertReceipt, 
  receiptItems, type ReceiptItem, type InsertReceiptItem,
  type ReceiptWithItems
} from "@shared/schema";
import { db, eq, desc } from "./db";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
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
}

export const storage = new DatabaseStorage();
