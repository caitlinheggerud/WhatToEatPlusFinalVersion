// This is an example file showing how to use the spending context with your existing components
// You can copy parts of this code into your actual components as needed

import React, { useEffect } from 'react';
import { useSpending, SpendingProvider } from '../contexts/SpendingContext';
import { getReceipts, getReceiptDetails } from '../lib/api';

/**
 * Example of how to update the spending data when receipts are processed
 */
export function ReceiptProcessingExample() {
  const { updateSpendingData } = useSpending();
  
  // Example of updating spending data after a receipt is processed
  const handleReceiptProcessed = (receiptItems: any[]) => {
    // Update spending data with the new items
    updateSpendingData(receiptItems);
  };
  
  return (
    <div>
      {/* Your existing receipt upload and processing UI */}
      {/* When receipt processing is complete, call handleReceiptProcessed with the items */}
    </div>
  );
}

/**
 * Example of how to load all receipt data on app initialization
 */
export function LoadAllReceiptData() {
  const { updateSpendingData } = useSpending();
  
  useEffect(() => {
    // Function to load all receipt data from the API
    async function loadAllReceiptData() {
      try {
        // Get all receipts
        const receipts = await getReceipts();
        
        // Collect all items from all receipts
        let allItems: any[] = [];
        
        // For each receipt, get its items and add them to the collection
        for (const receipt of receipts) {
          const receiptDetail = await getReceiptDetails(receipt.id);
          if (receiptDetail.items && receiptDetail.items.length > 0) {
            allItems = [...allItems, ...receiptDetail.items];
          }
        }
        
        // Update the spending data with all collected items
        updateSpendingData(allItems);
      } catch (error) {
        console.error('Failed to load receipt data:', error);
      }
    }
    
    loadAllReceiptData();
  }, [updateSpendingData]);
  
  return null; // This component doesn't render anything
}

/**
 * Example of how to use the spending data in your dashboard
 */
export function SpendingDashboardExample() {
  const { categoryTotals, totalSpent } = useSpending();
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <div>
      {/* This is an example of how you might render the data in your existing dashboard */}
      <h2>Spending Dashboard</h2>
      
      <div className="total-spent">
        <h3>Total Spent</h3>
        <p>{formatCurrency(totalSpent)}</p>
      </div>
      
      <div className="category-breakdown">
        <h3>Spending by Category</h3>
        <ul>
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <li key={category}>
              <span className="category-name">{category}</span>
              <span className="category-amount">{formatCurrency(amount)}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Example of how you might show specific category groups */}
      <div className="category-groups">
        <div className="category-group">
          <h4>Food</h4>
          <p>
            {formatCurrency(
              (categoryTotals['Produce'] || 0) +
              (categoryTotals['Meat'] || 0) +
              (categoryTotals['Dairy'] || 0) +
              (categoryTotals['Bakery'] || 0)
            )}
          </p>
        </div>
        
        <div className="category-group">
          <h4>Household</h4>
          <p>
            {formatCurrency(
              (categoryTotals['Household'] || 0) +
              (categoryTotals['Cleaning'] || 0)
            )}
          </p>
        </div>
        
        {/* Add more category groups as needed */}
      </div>
    </div>
  );
}

/**
 * Example of how to wrap your app with the SpendingProvider
 */
export function AppWithSpendingContext() {
  return (
    <SpendingProvider>
      {/* Your existing app components */}
      <LoadAllReceiptData /> {/* This component loads the data but doesn't render anything */}
      <YourExistingApp />
    </SpendingProvider>
  );
}

// Placeholder for your existing app component
function YourExistingApp() {
  return (
    <>
      {/* Your existing app structure */}
      <ReceiptProcessingExample />
      <SpendingDashboardExample />
    </>
  );
}