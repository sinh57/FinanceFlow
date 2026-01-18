import { Transaction, FilterOptions, Category, Account, CurrencyCode, CurrencyInfo } from './types';

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  const currencyInfo = CURRENCIES[currency];
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthYear(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function debounce<T extends string>(
  fn: (arg: T) => void,
  delay: number
): (arg: T) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (arg: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(arg), delay);
  };
}

export function filterTransactions(
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] {
  return transactions.filter((t) => {
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    if (filters.categoryId && t.categoryId !== filters.categoryId) return false;
    if (filters.accountId && t.accountId !== filters.accountId) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.minAmount !== undefined && t.amount < filters.minAmount) return false;
    if (filters.maxAmount !== undefined && t.amount > filters.maxAmount) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesDescription = t.description.toLowerCase().includes(query);
      const matchesTags = t.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!matchesDescription && !matchesTags) return false;
    }
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => t.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    return true;
  });
}

export function sortTransactionsByDate(
  transactions: Transaction[],
  ascending = false
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return ascending ? -diff : diff;
  });
}

export function groupTransactionsByDate(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);
}

export function getCategoryById(categories: Category[], id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getAccountById(accounts: Account[], id: string): Account | undefined {
  return accounts.find((a) => a.id === id);
}

export function validateTransaction(transaction: Partial<Transaction>): string[] {
  const errors: string[] = [];
  if (!transaction.accountId) errors.push('Account is required');
  if (!transaction.categoryId) errors.push('Category is required');
  if (!transaction.type) errors.push('Transaction type is required');
  if (transaction.amount === undefined || transaction.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  if (!transaction.date) errors.push('Date is required');
  return errors;
}

export function getDateRangeForPeriod(period: 'week' | 'month' | 'year' | 'all'): {
  from: string;
  to: string;
} {
  const today = new Date();
  const to = today.toISOString().split('T')[0];
  let from: Date;

  switch (period) {
    case 'week':
      from = new Date(today);
      from.setDate(from.getDate() - 7);
      break;
    case 'month':
      from = new Date(today);
      from.setMonth(from.getMonth() - 1);
      break;
    case 'year':
      from = new Date(today);
      from.setFullYear(from.getFullYear() - 1);
      break;
    case 'all':
    default:
      from = new Date(2020, 0, 1);
  }

  return { from: from.toISOString().split('T')[0], to };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
