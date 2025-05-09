// This file shows how to integrate the spending functionality with your existing Dashboard
// You don't need to use this file directly - copy the relevant code into your existing components

import React, { useEffect, useState } from 'react';
import { getReceipts, getReceiptDetails } from '../lib/api';
import { calculateSpendingByCategory } from '../utils/calculateSpendingByCategory';

// ========================================================
// OPTION 1: USING DIRECT STATE (NO CONTEXT)
// ========================================================

function DashboardWithState() {
  // Store spending data directly in component state
  const [spendingData, setSpendingData] = useState<{
    categoryTotals: Record<string, number>;
    total: number;
  }>({
    categoryTotals: {},
    total: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  // Load receipt data when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 1. Fetch all receipts
        const receipts = await getReceipts();
        
        // 2. Get detailed receipt data with items
        const allItems = [];
        for (const receipt of receipts) {
          try {
            const details = await getReceiptDetails(receipt.id);
            if (details.items && details.items.length) {
              allItems.push(...details.items);
            }
          } catch (error) {
            console.error(`Error fetching details for receipt ${receipt.id}:`, error);
          }
        }
        
        // 3. Calculate spending data from all receipt items
        const calculatedSpending = calculateSpendingByCategory(allItems);
        
        // 4. Update state with calculated data
        setSpendingData({
          categoryTotals: calculatedSpending,
          total: calculatedSpending.total
        });
      } catch (error) {
        console.error('Error loading receipt data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // -------- YOUR EXISTING DASHBOARD UI --------
  // This is where you'll integrate with your existing dashboard
  return (
    <div className="dashboard">
      {loading ? (
        <div>Loading spending data...</div>
      ) : (
        <>
          {/* Your existing dashboard UI, with spending data inserted */}
          
          {/* Example: Total Spending Card */}
          <div className="spending-card">
            <h3>Total Spent</h3>
            <p className="total-amount">{formatCurrency(spendingData.total)}</p>
          </div>
          
          {/* Example: Category Cards */}
          <div className="category-cards">
            {/* Food Card */}
            <div className="category-card">
              <h4>Food</h4>
              <p>{formatCurrency(
                (spendingData.categoryTotals['Produce'] || 0) +
                (spendingData.categoryTotals['Meat'] || 0) +
                (spendingData.categoryTotals['Dairy'] || 0) +
                (spendingData.categoryTotals['Bakery'] || 0)
              )}</p>
            </div>
            
            {/* Household Card */}
            <div className="category-card">
              <h4>Household</h4>
              <p>{formatCurrency(
                (spendingData.categoryTotals['Household'] || 0) +
                (spendingData.categoryTotals['Cleaning'] || 0)
              )}</p>
            </div>
            
            {/* Other categories... */}
          </div>
          
          {/* Example: Category Breakdown Table */}
          <div className="category-table">
            <h3>Spending by Category</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(spendingData.categoryTotals)
                  .filter(([category]) => category !== 'total')
                  .sort((a, b) => b[1] - a[1]) // Sort by amount (descending)
                  .map(([category, amount]) => (
                    <tr key={category}>
                      <td>{category}</td>
                      <td>{formatCurrency(amount)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ========================================================
// OPTION 2: UPDATING EXISTING DASHBOARD COMPONENT
// ========================================================

// This shows how to add the spending data to your existing dashboard component
// without completely rewriting it

// Assuming your existing dashboard component looks something like this:
type ExistingDashboardProps = {
  // Your existing props
  title?: string;
  // Add new props for spending data
  categoryTotals?: Record<string, number>;
  totalSpent?: number;
};

function ExistingDashboard({ 
  title = "Dashboard",
  categoryTotals = {},
  totalSpent = 0 
}: ExistingDashboardProps) {
  // Your existing component code
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <div className="dashboard">
      <h1>{title}</h1>
      
      {/* Your existing dashboard UI */}
      <div className="dashboard-content">
        
        {/* Example: Add the spending data to your existing UI */}
        <div className="spending-section">
          <h2>Spending Overview</h2>
          
          {/* Total Spent */}
          <div className="total-spent-card">
            <h3>Total Spent</h3>
            <p className="amount">{formatCurrency(totalSpent)}</p>
          </div>
          
          {/* Category Totals */}
          <div className="category-cards">
            {/* Example of grouped categories */}
            <div className="category-card">
              <h4>Food</h4>
              <p>{formatCurrency(
                (categoryTotals['Produce'] || 0) +
                (categoryTotals['Meat'] || 0) +
                (categoryTotals['Dairy'] || 0) +
                (categoryTotals['Bakery'] || 0)
              )}</p>
            </div>
            
            {/* Add more category cards as needed */}
          </div>
        </div>
        
        {/* Rest of your dashboard */}
      </div>
    </div>
  );
}

// Wrapper component that fetches spending data and passes it to your existing dashboard
function DashboardWrapper() {
  const [spendingData, setSpendingData] = useState<{
    categoryTotals: Record<string, number>;
    total: number;
  }>({
    categoryTotals: {},
    total: 0
  });
  
  // Similar useEffect as above to fetch and calculate spending data
  useEffect(() => {
    // Fetch receipt data and calculate spending
    async function fetchData() {
      // Code to fetch receipts and calculate spending (same as in DashboardWithState)
      const receipts = await getReceipts();
      
      // Get all receipt items
      const allItems = [];
      for (const receipt of receipts) {
        try {
          const details = await getReceiptDetails(receipt.id);
          if (details.items && details.items.length) {
            allItems.push(...details.items);
          }
        } catch (error) {
          console.error(`Error fetching details for receipt ${receipt.id}:`, error);
        }
      }
      
      // Calculate spending data
      const calculatedSpending = calculateSpendingByCategory(allItems);
      
      // Update state
      setSpendingData({
        categoryTotals: calculatedSpending,
        total: calculatedSpending.total
      });
    }
    
    fetchData();
  }, []);
  
  // Pass the spending data to your existing dashboard
  return (
    <ExistingDashboard
      title="Spending Dashboard"
      categoryTotals={spendingData.categoryTotals}
      totalSpent={spendingData.total}
    />
  );
}