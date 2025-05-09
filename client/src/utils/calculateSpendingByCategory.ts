type ReceiptItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: string | number;
  receiptId: number;
};

type Receipt = {
  id: number;
  store: string;
  totalAmount: number;
  date: string;
  items?: ReceiptItem[];
};

type CategorySpending = {
  [category: string]: number;
};

type SpendingData = {
  totalSpent: number;
  categoryTotals: CategorySpending;
};

/**
 * Calculate spending by category from receipts
 * @param receipts Array of receipt objects with items
 * @returns Object with totalSpent and categoryTotals
 */
export function calculateSpendingByCategory(receipts: Receipt[]): SpendingData {
  const categoryTotals: CategorySpending = {};
  let totalSpent = 0;

  // Process each receipt and its items
  receipts.forEach(receipt => {
    if (receipt.items && receipt.items.length > 0) {
      receipt.items.forEach(item => {
        const price = parseFloat(item.price.toString());
        if (!isNaN(price)) {
          // Add to category total
          const category = item.category || 'Other';
          categoryTotals[category] = (categoryTotals[category] || 0) + price;
          
          // Add to overall total
          totalSpent += price;
        }
      });
    } else if (receipt.totalAmount) {
      // If receipt has no items but has a total, add to "Other" category
      categoryTotals['Other'] = (categoryTotals['Other'] || 0) + receipt.totalAmount;
      totalSpent += receipt.totalAmount;
    }
  });

  return {
    totalSpent,
    categoryTotals
  };
}