import { Transaction, Category, Budget, InsightData } from './types';
import { filterTransactions, getMonthYear } from './utils';

export function calculateInsights(
  transactions: Transaction[],
  categories: Category[],
  dateFrom?: string,
  dateTo?: string
): InsightData {
  const filtered = filterTransactions(transactions, { dateFrom, dateTo });

  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const expensesByCategory: Record<string, number> = {};
  const incomeByCategory: Record<string, number> = {};

  filtered.forEach((t) => {
    if (t.type === 'expense') {
      expensesByCategory[t.categoryId] = (expensesByCategory[t.categoryId] || 0) + t.amount;
    } else {
      incomeByCategory[t.categoryId] = (incomeByCategory[t.categoryId] || 0) + t.amount;
    }
  });

  const topExpenseCategories = Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => ({
      categoryId,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  filtered.forEach((t) => {
    const month = getMonthYear(t.date);
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expenses += t.amount;
    }
  });

  const monthlyTrend = Object.entries(monthlyData)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    expensesByCategory,
    incomeByCategory,
    monthlyTrend,
    topExpenseCategories,
  };
}

export function getBudgetStatus(
  budget: Budget,
  transactions: Transaction[],
  categories: Category[]
): {
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  isWarning: boolean;
} {
  const now = new Date();
  let dateFrom: string;

  if (budget.period === 'monthly') {
    dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  } else {
    dateFrom = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
  }

  const relevantTransactions = filterTransactions(transactions, {
    dateFrom,
    categoryId: budget.categoryId,
    type: 'expense',
  });

  const spent = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = Math.max(0, budget.limit - spent);
  const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
  const isOverBudget = spent > budget.limit;
  const isWarning = percentage >= 80 && !isOverBudget;

  return { spent, remaining, percentage, isOverBudget, isWarning };
}

export function getAccountBalance(
  accountId: string,
  transactions: Transaction[],
  initialBalance: number
): number {
  const accountTransactions = transactions.filter((t) => t.accountId === accountId);
  
  return accountTransactions.reduce((balance, t) => {
    return t.type === 'income' ? balance + t.amount : balance - t.amount;
  }, initialBalance);
}

export function calculateTotalBalance(
  transactions: Transaction[],
  accounts: { id: string; balance: number }[]
): number {
  const totalInitial = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return totalInitial + totalIncome - totalExpenses;
}

export function getExpenseTrend(
  transactions: Transaction[],
  months: number = 3
): 'up' | 'down' | 'stable' {
  const now = new Date();
  const periods: number[] = [];

  for (let i = 0; i < months; i++) {
    const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const periodExpenses = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= startDate && date <= endDate;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    periods.push(periodExpenses);
  }

  if (periods.length < 2) return 'stable';

  const [current, previous] = periods;
  const changePercent = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  if (changePercent > 10) return 'up';
  if (changePercent < -10) return 'down';
  return 'stable';
}

export function getAllTags(transactions: Transaction[]): string[] {
  const tagSet = new Set<string>();
  transactions.forEach((t) => {
    t.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
