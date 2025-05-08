import { apiRequest } from "./queryClient";
import { type ReceiptItemResponse, type ReceiptWithItems } from "@shared/schema";

/**
 * Uploads a receipt image and analyzes it using Gemini API
 */
export async function analyzeReceipt(file: File): Promise<ReceiptItemResponse[]> {
  // Create FormData to send the file
  const formData = new FormData();
  formData.append('receipt', file);
  
  // Make the API request
  const response = await fetch('/api/receipts/analyze', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to analyze receipt: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Saves receipt items to the server
 */
export async function saveReceiptItems(items: ReceiptItemResponse[]): Promise<ReceiptWithItems> {
  const response = await apiRequest('POST', '/api/receipts/items', items);
  return await response.json();
}

/**
 * Fetches all receipts from the server
 */
export async function getReceipts(): Promise<any> {
  const response = await apiRequest('GET', '/api/receipts');
  return await response.json();
}

/**
 * Fetches a specific receipt with its items
 */
export async function getReceiptWithItems(id: number): Promise<ReceiptWithItems> {
  const response = await apiRequest('GET', `/api/receipts/${id}`);
  return await response.json();
}

/**
 * Legacy: Fetches all receipt items from the server (flattened, not grouped by receipt)
 */
export async function getReceiptItems(): Promise<any> {
  const response = await apiRequest('GET', '/api/receipt-items');
  return await response.json();
}
