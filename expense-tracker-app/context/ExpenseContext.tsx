/**
 * Expense Context
 * Manages expense data and expense-related operations
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { expenseAPI, Expense, CreateExpensePayload, SummaryResponse } from '../services/api';
import { AuthProvider,useAuth } from './AuthContext';
import {cacheService} from '../services/cacheService';
import {syncQueueService} from '../services/syncQueueService';

interface ExpenseContextType {
  expenses: Expense[];
  summary: SummaryResponse['summary'] | null;
  isLoading: boolean;
  error: string | null;
  
  // Expense operations
  fetchExpenses: (category?: string, startDate?: string, endDate?: string) => Promise<void>;
  createExpense: (payload: CreateExpensePayload) => Promise<void>;
  updateExpense: (id: string, payload: Partial<CreateExpensePayload>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  fetchSummary: () => Promise<void>;
  
  // UI helpers
  clearError: () => void;
  getTotalExpenses: () => number;
  getExpensesByCategory: (category: string) => Expense[];
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(
  undefined
);

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const { isSignedIn } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<SummaryResponse['summary'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(
    async (category?: string, startDate?: string, endDate?: string) => {
      if (!isSignedIn) return;
      
      try {
        setIsLoading(true);
        setError(null);
        //cache first then only fetch fresh data
        const cachedExpenses =await cacheService.get<Expense[]>('expenses');
        if(cachedExpenses){
          setExpenses(cachedExpenses);
        }

        //fetching fresh data because may be cache is not present
        const response = await expenseAPI.getExpenses(category, startDate, endDate);
        
        if (response.success && response.data?.expenses) {
          setExpenses(response.data.expenses);
        } else if (response.success && response.expenses) {
          setExpenses(response.expenses);
        }

       //cache the result 
       await cacheService.set('expenses',response.data?.expenses,30);
       setError(null);


      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch expenses';
        setError(errorMessage);
           console.error('Fetch expenses error:', err);
        //Return the cached data if available
        const cached =await cacheService.get<Expense[]>('expenses');
        if(cached){
          setExpenses(cached);

        }
     
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn]
  );

  const createExpense = useCallback(
    async (payload: CreateExpensePayload) => {
      if (!isSignedIn) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await expenseAPI.createExpense(payload);
        
        if (response.success && response.expense) {
          setExpenses(prev => [response.expense!, ...prev]);
          await fetchSummary();
        } else {
          setError(response.message || 'Failed to create expense');
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to create expense';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn]
  );

  const updateExpense = useCallback(
    async (id: string, payload: Partial<CreateExpensePayload>) => {
      if (!isSignedIn) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await expenseAPI.updateExpense(id, payload);
        
        if (response.success) {
          // Update local expenses list
          setExpenses(prev =>
            prev.map(exp => (exp._id === id ? { ...exp, ...response.expense } : exp))
          );
          await fetchSummary();
        } else {
          setError(response.message || 'Failed to update expense');
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to update expense';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (!isSignedIn) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await expenseAPI.deleteExpense(id);
        
        if (response.success) {
          // Remove from local list
          setExpenses(prev => prev.filter(exp => exp._id !== id));
          await fetchSummary();
        } else {
          setError(response.message || 'Failed to delete expense');
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to delete expense';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn]
  );

  const fetchSummary = useCallback(async () => {
    if (!isSignedIn) return;
    
    try {
      const response = await expenseAPI.getSummary();
      if (response.success) {
        setSummary(response.summary);
      }
    } catch (err) {
      console.error('Fetch summary error:', err);
    }
  }, [isSignedIn]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const getExpensesByCategory = useCallback(
    (category: string) => {
      return expenses.filter(exp => exp.category === category);
    },
    [expenses]
  );

  const value: ExpenseContextType = {
    expenses,
    summary,
    isLoading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchSummary,
    clearError,
    getTotalExpenses,
    getExpensesByCategory,
  };

  return (
    <AuthProvider>
      <ExpenseContext.Provider value={value}>
        {children}
      </ExpenseContext.Provider>
    </AuthProvider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
