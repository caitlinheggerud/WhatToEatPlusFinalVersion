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

/**
 * Fetches all receipts
 */
export async function getReceipts(): Promise<any> {
  const response = await apiRequest('GET', '/api/receipts');
  return await response.json();
}

/**
 * Get a specific receipt with items
 */
export async function getReceiptDetails(id: number): Promise<any> {
  const response = await apiRequest('GET', `/api/receipts/${id}`);
  return await response.json();
}

/**
 * Adds receipt items to inventory
 */
export async function addReceiptToInventory(receiptId: number): Promise<any> {
  const response = await apiRequest('POST', `/api/receipts/${receiptId}/to-inventory`);
  return await response.json();
}

/**
 * Get all inventory items
 */
export async function getInventoryItems(): Promise<any> {
  const response = await apiRequest('GET', '/api/inventory');
  return await response.json();
}

/**
 * Add an item to inventory
 */
export async function addInventoryItem(item: any): Promise<any> {
  const response = await apiRequest('POST', '/api/inventory', item);
  return await response.json();
}

/**
 * Update an inventory item
 */
export async function updateInventoryItem(id: number, itemData: any): Promise<any> {
  const response = await apiRequest('PATCH', `/api/inventory/${id}`, itemData);
  return await response.json();
}

/**
 * Delete an inventory item
 */
export async function deleteInventoryItem(id: number): Promise<any> {
  const response = await apiRequest('DELETE', `/api/inventory/${id}`);
  // For 204 No Content responses, which don't have a body to parse
  if (response.status === 204) {
    return { success: true };
  }
  return response.json();
}

/**
 * Get meal types
 */
export async function getMealTypes(): Promise<any> {
  const response = await apiRequest('GET', '/api/meal-types');
  return await response.json();
}

/**
 * Get dietary preferences
 */
export async function getDietaryPreferences(): Promise<any> {
  const response = await apiRequest('GET', '/api/dietary-preferences');
  return await response.json();
}

/**
 * Get recipes with optional filtering
 */
export async function getRecipes(params: {
  mealTypeId?: number | string;
  dietaryRestrictions?: number[];
  searchTerm?: string;
  inventoryBased?: boolean;
  servings?: number;
  useApi?: boolean;
  allergies?: string[];
}): Promise<any> {
  const searchParams = new URLSearchParams();
  
  // Set default value for useApi to true
  const useApi = params.useApi !== undefined ? params.useApi : true;
  searchParams.append('useApi', useApi.toString());
  
  if (params.mealTypeId) {
    searchParams.append('mealTypeId', params.mealTypeId.toString());
  }
  
  if (params.dietaryRestrictions && params.dietaryRestrictions.length) {
    searchParams.append('dietaryRestrictions', params.dietaryRestrictions.join(','));
  }
  
  if (params.allergies && params.allergies.length) {
    searchParams.append('allergies', params.allergies.join(','));
  }
  
  if (params.searchTerm) {
    searchParams.append('searchTerm', params.searchTerm);
  }
  
  if (params.inventoryBased) {
    searchParams.append('inventoryBased', 'true');
  }
  
  if (params.servings) {
    searchParams.append('servings', params.servings.toString());
  }

  try {
    const response = await apiRequest('GET', `/api/recipes?${searchParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch recipes');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    
    // Check if error is related to the Spoonacular API specifically
    if (error.message && error.message.includes('Spoonacular API')) {
      throw new Error('Online recipe search is temporarily unavailable. Please try again later or use local recipes.');
    }
    
    throw error;
  }
}

/**
 * Get a random recipe
 */
export async function getRandomRecipe(params: {
  mealTypeId?: number | string;
  dietaryRestrictions?: number[];
  inventoryBased?: boolean;
  useApi?: boolean;
  allergies?: string[];
}): Promise<any> {
  const searchParams = new URLSearchParams();
  
  // Set default value for useApi to true
  const useApi = params.useApi !== undefined ? params.useApi : true;
  searchParams.append('useApi', useApi.toString());
  
  if (params.mealTypeId) {
    searchParams.append('mealTypeId', params.mealTypeId.toString());
  }
  
  if (params.dietaryRestrictions && params.dietaryRestrictions.length) {
    searchParams.append('dietaryRestrictions', params.dietaryRestrictions.join(','));
  }
  
  if (params.allergies && params.allergies.length) {
    searchParams.append('allergies', params.allergies.join(','));
  }
  
  if (params.inventoryBased) {
    searchParams.append('inventoryBased', 'true');
  }
  
  try {
    const response = await apiRequest('GET', `/api/recipes/random?${searchParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch random recipe');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching random recipe:', error);
    
    // Check if error is related to the Spoonacular API specifically
    if (error.message && error.message.includes('Spoonacular API')) {
      throw new Error('Online recipe search is temporarily unavailable. Please try again later or use local recipes.');
    }
    
    throw error;
  }
}


