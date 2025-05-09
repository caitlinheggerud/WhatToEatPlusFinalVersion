/**
 * Represents a receipt item with name, category and price
 */
type ReceiptItem = {
  name: string;
  category: string;
  price: number | string;
  [key: string]: any; // Allow for additional properties
};

/**
 * Object containing spending totals by category
 */
type CategorySpending = {
  [category: string]: number;
};

/**
 * Calculate spending by category from receipt items
 * @param items Array of receipt items with price and category
 * @returns Object with category totals and calculated overall total
 */
export function calculateSpendingByCategory(items: ReceiptItem[]): CategorySpending & { total: number } {
  const categoryTotals: CategorySpending = {};
  let total = 0;

  // Process each item
  items.forEach(item => {
    // Convert price to number if it's a string
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) 
      : item.price;
      
    if (!isNaN(price) && price > 0) {
      // Standardize category name and handle missing categories
      const category = item.category ? item.category.trim() : 'Other';
      
      // Add to category total
      categoryTotals[category] = (categoryTotals[category] || 0) + price;
      
      // Add to overall total
      total += price;
    }
  });

  // Add the total to the result
  return {
    ...categoryTotals,
    total
  };
}