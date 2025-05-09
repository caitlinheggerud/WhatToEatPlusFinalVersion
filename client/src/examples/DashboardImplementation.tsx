// This file provides a minimal example of how to implement 
// the spending calculation in an existing dashboard component

import React, { useEffect, useState } from 'react';
import { getReceipts, getReceiptDetails } from '../lib/api';
import { calculateSpendingByCategory } from '../utils/calculateSpendingByCategory';

// This is a direct implementation you can use as a reference
function Dashboard() {
  // Your existing component state
  const [yourExistingState, setYourExistingState] = useState(null);
  
  // Add this state for spending data
  const [spendingData, setSpendingData] = useState({
    categoryTotals: {} as Record<string, number>,
    total: 0
  });
  
  // Add this useEffect to load and calculate spending data
  useEffect(() => {
    async function loadSpendingData() {
      try {
        // 1. Fetch receipt data
        const receipts = await getReceipts();
        
        // 2. Collect all items from all receipts
        const allItems = [];
        for (const receipt of receipts) {
          try {
            const details = await getReceiptDetails(receipt.id);
            if (details.items && details.items.length) {
              allItems.push(...details.items);
            }
          } catch (err) {
            console.error(`Error fetching receipt ${receipt.id}:`, err);
          }
        }
        
        // 3. Calculate spending by category
        const result = calculateSpendingByCategory(allItems);
        
        // 4. Store the result in state
        const { total, ...categories } = result;
        setSpendingData({
          categoryTotals: categories,
          total
        });
      } catch (err) {
        console.error('Error loading spending data:', err);
      }
    }
    
    loadSpendingData();
  }, []); // Run once when component mounts
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Calculate grouped category totals
  const foodTotal = (
    (spendingData.categoryTotals['Produce'] || 0) + 
    (spendingData.categoryTotals['Meat'] || 0) +
    (spendingData.categoryTotals['Seafood'] || 0) + 
    (spendingData.categoryTotals['Dairy'] || 0)
  );
  
  const householdTotal = (
    (spendingData.categoryTotals['Household'] || 0) + 
    (spendingData.categoryTotals['Cleaning'] || 0)
  );
  
  const beveragesTotal = spendingData.categoryTotals['Beverages'] || 0;
  const snacksTotal = spendingData.categoryTotals['Snacks'] || 0;
  const otherTotal = spendingData.categoryTotals['Other'] || 0;
  
  // Your existing render code with spending data added
  return (
    <div className="dashboard">
      {/* Your existing dashboard UI here */}
      
      {/* Add spending sections where needed */}
      <div className="spending-overview">
        <h2>Spending Overview</h2>
        
        {/* Total Spending */}
        <div className="spending-card total">
          <h3>Total Spent</h3>
          <p className="amount">{formatCurrency(spendingData.total)}</p>
        </div>
        
        {/* Category Cards */}
        <div className="spending-categories">
          {/* Add these cards to your existing UI */}
          <div className="category-card">
            <h4>Food</h4>
            <p>{formatCurrency(foodTotal)}</p>
          </div>
          
          <div className="category-card">
            <h4>Household</h4>
            <p>{formatCurrency(householdTotal)}</p>
          </div>
          
          <div className="category-card">
            <h4>Beverages</h4>
            <p>{formatCurrency(beveragesTotal)}</p>
          </div>
          
          <div className="category-card">
            <h4>Snacks</h4>
            <p>{formatCurrency(snacksTotal)}</p>
          </div>
          
          <div className="category-card">
            <h4>Other</h4>
            <p>{formatCurrency(otherTotal)}</p>
          </div>
        </div>
        
        {/* Detailed Category Breakdown */}
        <div className="category-breakdown">
          <h3>Detailed Breakdown</h3>
          <ul>
            {Object.entries(spendingData.categoryTotals)
              .filter(([category]) => category !== 'total')
              .sort((a, b) => b[1] - a[1]) // Sort by amount (highest first)
              .map(([category, amount]) => (
                <li key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">{formatCurrency(amount)}</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      
      {/* Rest of your dashboard UI */}
    </div>
  );
}

// Alternative approach: If your dashboard receives data as props
type DashboardProps = {
  // Your existing props
  yourExistingProp?: any;
};

function DashboardWithProps({ yourExistingProp }: DashboardProps) {
  // Add state for spending data
  const [spendingData, setSpendingData] = useState({
    categoryTotals: {} as Record<string, number>,
    total: 0
  });
  
  // Same useEffect and formatting functions as above
  
  // Your existing render code with spending data added
  return (
    <div className="dashboard">
      {/* Your existing dashboard UI here, with spending data added */}
    </div>
  );
}