import { apiRequest } from "./queryClient";
import { type ReceiptItemResponse } from "@shared/schema";

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
export async function saveReceiptItems(items: ReceiptItemResponse[]): Promise<any> {
  const response = await apiRequest('POST', '/api/receipts/items', items);
  return await response.json();
}

/**
 * Fetches all receipt items from the server
 */
export async function getReceiptItems(): Promise<any> {
  const response = await apiRequest('GET', '/api/receipts/items');
  return await response.json();
}
