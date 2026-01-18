'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FinanceState,
  Transaction,
  Account,
  Budget,
  FilterOptions,
  CurrencyCode,
  loadState,
  saveState,
  getDefaultState,
  resetToDefault,
  generateId,
  filterTransactions,
  sortTransactionsByDate,
  calculateInsights,
  getBudgetStatus,
  calculateTotalBalance,
  getExpenseTrend,
  getAllTags,
} from '@/lib/finance';

export function useFinanceState() {
  const [state, setState] = useState<FinanceState>(getDefaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveState(state);
    }
  }, [state, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }
  }, [state.theme, isLoaded]);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const setCurrency = useCallback((currency: CurrencyCode) => {
    setState((prev) => ({
      ...prev,
      currency,
    }));
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const addAccount = useCallback((account: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...account,
      id: generateId(),
    };
    setState((prev) => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
    }));
    return newAccount;
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<Account>) => {
    setState((prev) => ({
      ...prev,
      accounts: prev.accounts.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      accounts: prev.accounts.filter((a) => a.id !== id),
      transactions: prev.transactions.filter((t) => t.accountId !== id),
    }));
  }, []);

  const addBudget = useCallback((budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: generateId(),
    };
    setState((prev) => ({
      ...prev,
      budgets: [...prev.budgets, newBudget],
    }));
    return newBudget;
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    }));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((b) => b.id !== id),
    }));
  }, []);

  const getFilteredTransactions = useCallback(
    (filters: FilterOptions) => {
      const filtered = filterTransactions(state.transactions, filters);
      return sortTransactionsByDate(filtered);
    },
    [state.transactions]
  );

  const insights = useMemo(() => {
    return calculateInsights(state.transactions, state.categories);
  }, [state.transactions, state.categories]);

  const budgetStatuses = useMemo(() => {
    return state.budgets.map((budget) => ({
      budget,
      ...getBudgetStatus(budget, state.transactions, state.categories),
    }));
  }, [state.budgets, state.transactions, state.categories]);

  const totalBalance = useMemo(() => {
    return calculateTotalBalance(state.transactions, state.accounts);
  }, [state.transactions, state.accounts]);

  const expenseTrend = useMemo(() => {
    return getExpenseTrend(state.transactions);
  }, [state.transactions]);

  const allTags = useMemo(() => {
    return getAllTags(state.transactions);
  }, [state.transactions]);

  const reset = useCallback(() => {
    const defaultState = resetToDefault();
    setState(defaultState);
  }, []);

  return {
    state,
    isLoaded,
    toggleTheme,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addBudget,
    updateBudget,
    deleteBudget,
    getFilteredTransactions,
    insights,
    budgetStatuses,
    totalBalance,
    expenseTrend,
    allTags,
    reset,
  };
}
