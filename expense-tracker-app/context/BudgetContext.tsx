import React, { createContext, useState, useCallback } from 'react';

export interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
  alertThreshold: number;
}

interface BudgetContextType {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  createBudget: (budget: Omit<Budget, '_id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

export const BudgetContext = createContext<BudgetContextType>({} as BudgetContextType);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      // Call API to fetch budgets
      // setBudgets(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        isLoading,
        error,
        fetchBudgets,
        createBudget: async () => {},
        updateBudget: async () => {},
        deleteBudget: async () => {},
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = React.useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};