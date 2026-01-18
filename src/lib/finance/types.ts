export type TransactionType = 'income' | 'expense';
export type AccountType = 'cash' | 'bank' | 'wallet';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description: string;
  tags: string[];
  date: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  period: 'monthly' | 'yearly';
}

export interface FinanceState {
  version: number;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  theme: 'light' | 'dark';
  currency: CurrencyCode;
}

export interface FilterOptions {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: string;
  accountId?: string;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
  tags?: string[];
}

export interface InsightData {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  expensesByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
  monthlyTrend: { month: string; income: number; expenses: number }[];
  topExpenseCategories: { categoryId: string; amount: number; percentage: number }[];
}
