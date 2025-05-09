import React, { createContext, useContext, useState, ReactNode } from 'react';
import { calculateSpendingByCategory } from '../utils/calculateSpendingByCategory';

// Define types for our context
type SpendingContextType = {
  categoryTotals: Record<string, number>;
  totalSpent: number;
  updateSpendingData: (items: any[]) => void;
};

// Create the context with default values
const SpendingContext = createContext<SpendingContextType>({
  categoryTotals: {},
  totalSpent: 0,
  updateSpendingData: () => {},
});

// Create a provider component
export function SpendingProvider({ children }: { children: ReactNode }) {
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [totalSpent, setTotalSpent] = useState<number>(0);

  // Function to update spending data based on receipt items
  const updateSpendingData = (items: any[]) => {
    if (!items || items.length === 0) return;
    
    // Calculate spending totals
    const result = calculateSpendingByCategory(items);
    
    // Update state
    const { total, ...categories } = result;
    setCategoryTotals(categories);
    setTotalSpent(total);
  };

  // Provide the context values to children components
  return (
    <SpendingContext.Provider value={{ categoryTotals, totalSpent, updateSpendingData }}>
      {children}
    </SpendingContext.Provider>
  );
}

// Custom hook to use the spending context
export function useSpending() {
  return useContext(SpendingContext);
}