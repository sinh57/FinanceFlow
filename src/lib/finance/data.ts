import { FinanceState, Account, Category, Transaction, Budget } from './types';
import { generateId } from './utils';

const STORAGE_KEY = 'finance_dashboard_v2';
const CURRENT_VERSION = 2;

export const defaultAccounts: Account[] = [
  { id: 'acc-1', name: 'Cash', type: 'cash', balance: 2450.0, color: '#10b981', icon: '💵' },
  { id: 'acc-2', name: 'Bank Account', type: 'bank', balance: 15780.5, color: '#3b82f6', icon: '🏦' },
  { id: 'acc-3', name: 'Digital Wallet', type: 'wallet', balance: 890.25, color: '#8b5cf6', icon: '📱' },
];

export const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
  { id: 'cat-2', name: 'Freelance', type: 'income', icon: '💻', color: '#06b6d4' },
  { id: 'cat-3', name: 'Investments', type: 'income', icon: '📈', color: '#8b5cf6' },
  { id: 'cat-4', name: 'Other Income', type: 'income', icon: '🎁', color: '#f59e0b' },
  { id: 'cat-5', name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444' },
  { id: 'cat-6', name: 'Transportation', type: 'expense', icon: '🚗', color: '#f97316' },
  { id: 'cat-7', name: 'Shopping', type: 'expense', icon: '🛍️', color: '#ec4899' },
  { id: 'cat-8', name: 'Entertainment', type: 'expense', icon: '🎬', color: '#a855f7' },
  { id: 'cat-9', name: 'Bills & Utilities', type: 'expense', icon: '📄', color: '#6366f1' },
  { id: 'cat-10', name: 'Healthcare', type: 'expense', icon: '🏥', color: '#14b8a6' },
  { id: 'cat-11', name: 'Education', type: 'expense', icon: '📚', color: '#0ea5e9' },
  { id: 'cat-12', name: 'Travel', type: 'expense', icon: '✈️', color: '#f43f5e' },
];

export const defaultBudgets: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-5', limit: 600, period: 'monthly' },
  { id: 'bud-2', categoryId: 'cat-6', limit: 300, period: 'monthly' },
  { id: 'bud-3', categoryId: 'cat-7', limit: 400, period: 'monthly' },
  { id: 'bud-4', categoryId: 'cat-8', limit: 200, period: 'monthly' },
  { id: 'bud-5', categoryId: 'cat-9', limit: 500, period: 'monthly' },
];

function generateSeedTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  const seedData = [
    { type: 'income' as const, categoryId: 'cat-1', amount: 5500, desc: 'Monthly Salary', accountId: 'acc-2', daysAgo: 2 },
    { type: 'income' as const, categoryId: 'cat-1', amount: 5500, desc: 'Monthly Salary', accountId: 'acc-2', daysAgo: 32 },
    { type: 'income' as const, categoryId: 'cat-1', amount: 5500, desc: 'Monthly Salary', accountId: 'acc-2', daysAgo: 62 },
    { type: 'income' as const, categoryId: 'cat-2', amount: 1200, desc: 'Website Project', accountId: 'acc-3', daysAgo: 5, tags: ['client-a'] },
    { type: 'income' as const, categoryId: 'cat-2', amount: 800, desc: 'Logo Design', accountId: 'acc-3', daysAgo: 15, tags: ['design'] },
    { type: 'income' as const, categoryId: 'cat-3', amount: 350, desc: 'Stock Dividends', accountId: 'acc-2', daysAgo: 10 },
    { type: 'income' as const, categoryId: 'cat-2', amount: 2000, desc: 'Mobile App Project', accountId: 'acc-2', daysAgo: 45, tags: ['client-b'] },
    { type: 'expense' as const, categoryId: 'cat-5', amount: 85.50, desc: 'Grocery Shopping', accountId: 'acc-1', daysAgo: 1, tags: ['weekly'] },
    { type: 'expense' as const, categoryId: 'cat-5', amount: 42.00, desc: 'Restaurant Dinner', accountId: 'acc-1', daysAgo: 3 },
    { type: 'expense' as const, categoryId: 'cat-5', amount: 28.50, desc: 'Coffee & Snacks', accountId: 'acc-3', daysAgo: 4 },
    { type: 'expense' as const, categoryId: 'cat-5', amount: 95.00, desc: 'Grocery Shopping', accountId: 'acc-1', daysAgo: 8, tags: ['weekly'] },
    { type: 'expense' as const, categoryId: 'cat-5', amount: 65.00, desc: 'Takeout Orders', accountId: 'acc-3', daysAgo: 12 },
    { type: 'expense' as const, categoryId: 'cat-6', amount: 55.00, desc: 'Gas Station', accountId: 'acc-1', daysAgo: 2 },
    { type: 'expense' as const, categoryId: 'cat-6', amount: 120.00, desc: 'Car Maintenance', accountId: 'acc-2', daysAgo: 14, tags: ['maintenance'] },
    { type: 'expense' as const, categoryId: 'cat-6', amount: 35.00, desc: 'Uber Rides', accountId: 'acc-3', daysAgo: 6 },
    { type: 'expense' as const, categoryId: 'cat-7', amount: 189.99, desc: 'New Headphones', accountId: 'acc-2', daysAgo: 7, tags: ['electronics'] },
    { type: 'expense' as const, categoryId: 'cat-7', amount: 75.00, desc: 'Clothing', accountId: 'acc-1', daysAgo: 11 },
    { type: 'expense' as const, categoryId: 'cat-7', amount: 250.00, desc: 'Smart Watch', accountId: 'acc-2', daysAgo: 25, tags: ['electronics'] },
    { type: 'expense' as const, categoryId: 'cat-8', amount: 15.99, desc: 'Netflix Subscription', accountId: 'acc-3', daysAgo: 1, tags: ['subscription'] },
    { type: 'expense' as const, categoryId: 'cat-8', amount: 12.99, desc: 'Spotify Premium', accountId: 'acc-3', daysAgo: 1, tags: ['subscription'] },
    { type: 'expense' as const, categoryId: 'cat-8', amount: 45.00, desc: 'Movie Night', accountId: 'acc-1', daysAgo: 9 },
    { type: 'expense' as const, categoryId: 'cat-9', amount: 150.00, desc: 'Electricity Bill', accountId: 'acc-2', daysAgo: 5, tags: ['bills'] },
    { type: 'expense' as const, categoryId: 'cat-9', amount: 80.00, desc: 'Internet Bill', accountId: 'acc-2', daysAgo: 5, tags: ['bills'] },
    { type: 'expense' as const, categoryId: 'cat-9', amount: 45.00, desc: 'Phone Bill', accountId: 'acc-2', daysAgo: 5, tags: ['bills'] },
    { type: 'expense' as const, categoryId: 'cat-10', amount: 120.00, desc: 'Doctor Visit', accountId: 'acc-2', daysAgo: 20 },
    { type: 'expense' as const, categoryId: 'cat-10', amount: 35.00, desc: 'Pharmacy', accountId: 'acc-1', daysAgo: 18 },
    { type: 'expense' as const, categoryId: 'cat-11', amount: 49.99, desc: 'Online Course', accountId: 'acc-3', daysAgo: 22, tags: ['learning'] },
    { type: 'expense' as const, categoryId: 'cat-12', amount: 450.00, desc: 'Weekend Trip', accountId: 'acc-2', daysAgo: 30, tags: ['vacation'] },
    { type: 'expense' as const, categoryId: 'cat-5', amount: 78.00, desc: 'Grocery Shopping', accountId: 'acc-1', daysAgo: 35, tags: ['weekly'] },
    { type: 'expense' as const, categoryId: 'cat-6', amount: 48.00, desc: 'Gas Station', accountId: 'acc-1', daysAgo: 38 },
    { type: 'expense' as const, categoryId: 'cat-8', amount: 15.99, desc: 'Netflix Subscription', accountId: 'acc-3', daysAgo: 31, tags: ['subscription'] },
    { type: 'expense' as const, categoryId: 'cat-9', amount: 145.00, desc: 'Electricity Bill', accountId: 'acc-2', daysAgo: 35, tags: ['bills'] },
  ];

  seedData.forEach((item, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - item.daysAgo);
    
    transactions.push({
      id: generateId() + index,
      accountId: item.accountId,
      categoryId: item.categoryId,
      type: item.type,
      amount: item.amount,
      description: item.desc,
      tags: item.tags || [],
      date: date.toISOString().split('T')[0],
      createdAt: date.toISOString(),
    });
  });

  return transactions;
}

export function getDefaultState(): FinanceState {
  return {
    version: CURRENT_VERSION,
    accounts: defaultAccounts,
    categories: defaultCategories,
    transactions: generateSeedTransactions(),
    budgets: defaultBudgets,
    theme: 'dark',
    currency: 'INR',
  };
}

export function loadState(): FinanceState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultState = getDefaultState();
      saveState(defaultState);
      return defaultState;
    }

    const parsed = JSON.parse(stored) as FinanceState;

    if (parsed.version !== CURRENT_VERSION) {
      const migrated = migrateState(parsed);
      saveState(migrated);
      return migrated;
    }

    return parsed;
  } catch {
    const defaultState = getDefaultState();
    saveState(defaultState);
    return defaultState;
  }
}

export function saveState(state: FinanceState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

function migrateState(oldState: FinanceState): FinanceState {
  const newState = { ...getDefaultState() };

  if (oldState.accounts?.length) {
    newState.accounts = oldState.accounts;
  }
  if (oldState.categories?.length) {
    newState.categories = oldState.categories;
  }
  if (oldState.transactions?.length) {
    newState.transactions = oldState.transactions;
  }
  if (oldState.budgets?.length) {
    newState.budgets = oldState.budgets;
  }
  if (oldState.theme) {
    newState.theme = oldState.theme;
  }

  newState.version = CURRENT_VERSION;
  return newState;
}

export function resetToDefault(): FinanceState {
  const defaultState = getDefaultState();
  saveState(defaultState);
  return defaultState;
}
