import { 
  users, type User, type InsertUser,
  receiptItems, type ReceiptItem, type InsertReceiptItem 
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Receipt item methods
  createReceiptItem(item: InsertReceiptItem): Promise<ReceiptItem>;
  getReceiptItems(): Promise<ReceiptItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private receiptItems: Map<number, ReceiptItem>;
  private userCurrentId: number;
  private receiptItemCurrentId: number;

  constructor() {
    this.users = new Map();
    this.receiptItems = new Map();
    this.userCurrentId = 1;
    this.receiptItemCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createReceiptItem(insertItem: InsertReceiptItem): Promise<ReceiptItem> {
    const id = this.receiptItemCurrentId++;
    const now = new Date();
    const item: ReceiptItem = { 
      ...insertItem, 
      id, 
      createdAt: now 
    };
    this.receiptItems.set(id, item);
    return item;
  }

  async getReceiptItems(): Promise<ReceiptItem[]> {
    return Array.from(this.receiptItems.values());
  }
}

export const storage = new MemStorage();
