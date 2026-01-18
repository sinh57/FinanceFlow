'use client';

import { useState, useMemo, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { useFinanceState } from '@/hooks/useFinanceState';
import {
  formatCurrency,
  formatDate,
  getCategoryById,
  getAccountById,
  debounce,
  FilterOptions,
  Transaction,
  TransactionType,
  Account,
  Budget,
  CurrencyCode,
  CURRENCIES,
} from '@/lib/finance';

type TabType = 'overview' | 'transactions' | 'insights' | 'settings';

export function FinanceDashboard() {
  const {
    state,
    isLoaded,
    toggleTheme,
    setCurrency,
    addTransaction,
    deleteTransaction,
    addAccount,
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
  } = useFinanceState();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);

  const isDark = state.theme === 'dark';
  const currency = state.currency;

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setFilters((prev) => ({ ...prev, searchQuery: query }));
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const filteredTransactions = useMemo(
    () => getFilteredTransactions(filters),
    [getFilteredTransactions, filters]
  );

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="animate-pulse text-2xl font-light tracking-wider text-emerald-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-[system-ui] transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f] text-gray-100' : 'bg-slate-100 text-gray-900'}`}>
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${isDark ? 'from-emerald-900/20' : 'from-emerald-200/70'} via-transparent to-transparent pointer-events-none`} />
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] pointer-events-none ${isDark ? 'opacity-50' : 'opacity-0'}`} />

      <Header theme={state.theme} toggleTheme={toggleTheme} isDark={isDark} currency={currency} setCurrency={setCurrency} />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} />

        {activeTab === 'overview' && (
          <OverviewTab
            accounts={state.accounts}
            totalBalance={totalBalance}
            insights={insights}
            budgetStatuses={budgetStatuses}
            categories={state.categories}
            expenseTrend={expenseTrend}
            recentTransactions={filteredTransactions.slice(0, 5)}
            isDark={isDark}
            currency={currency}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab
            transactions={filteredTransactions}
            categories={state.categories}
            accounts={state.accounts}
            filters={filters}
            setFilters={setFilters}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            allTags={allTags}
            showAddTransaction={showAddTransaction}
            setShowAddTransaction={setShowAddTransaction}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
            isDark={isDark}
            currency={currency}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsTab
            insights={insights}
            categories={state.categories}
            transactions={state.transactions}
            isDark={isDark}
            currency={currency}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            accounts={state.accounts}
            budgets={state.budgets}
            categories={state.categories}
            budgetStatuses={budgetStatuses}
            showAddAccount={showAddAccount}
            setShowAddAccount={setShowAddAccount}
            showAddBudget={showAddBudget}
            setShowAddBudget={setShowAddBudget}
            addAccount={addAccount}
            deleteAccount={deleteAccount}
            addBudget={addBudget}
            updateBudget={updateBudget}
            deleteBudget={deleteBudget}
            reset={reset}
            isDark={isDark}
            currency={currency}
          />
        )}
      </main>
    </div>
  );
}

function Header({ theme, toggleTheme, isDark, currency, setCurrency }: { theme: 'light' | 'dark'; toggleTheme: () => void; isDark: boolean; currency: CurrencyCode; setCurrency: (c: CurrencyCode) => void }) {
  return (
    <header className={`relative border-b backdrop-blur-xl transition-colors duration-300 ${isDark ? 'border-white/5 bg-black/20' : 'border-gray-200 bg-white/80'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>FinanceFlow</h1>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Smart Money Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className={`px-3 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-gray-100 border border-gray-200 text-gray-900'}`}
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code} className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function TabNavigation({ activeTab, setActiveTab, isDark }: { activeTab: TabType; setActiveTab: (tab: TabType) => void; isDark: boolean }) {
  const tabs: { id: TabType; label: string; icon: ReactNode }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="mb-8">
      <div className={`flex gap-1 p-1 rounded-2xl border w-fit ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20'
                : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function OverviewTab({
  accounts,
  totalBalance,
  insights,
  budgetStatuses,
  categories,
  expenseTrend,
  recentTransactions,
  isDark,
  currency,
}: {
  accounts: Account[];
  totalBalance: number;
  insights: ReturnType<typeof useFinanceState>['insights'];
  budgetStatuses: ReturnType<typeof useFinanceState>['budgetStatuses'];
  categories: ReturnType<typeof useFinanceState>['state']['categories'];
  expenseTrend: 'up' | 'down' | 'stable';
  recentTransactions: Transaction[];
  isDark: boolean;
  currency: CurrencyCode;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Total Balance"
          value={formatCurrency(totalBalance, currency)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
          color="emerald"
          isDark={isDark}
        />
        <InsightCard
          title="Monthly Income"
          value={formatCurrency(insights.totalIncome, currency)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
          color="cyan"
          isDark={isDark}
        />
        <InsightCard
          title="Monthly Expenses"
          value={formatCurrency(insights.totalExpenses, currency)}
          trend={expenseTrend}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          }
          color="rose"
          isDark={isDark}
        />
        <InsightCard
          title="Savings Rate"
          value={`${insights.savingsRate.toFixed(1)}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
          color="violet"
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Income vs Expenses</h3>
          <BarChart data={insights.monthlyTrend} isDark={isDark} currency={currency} />
        </div>

        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Accounts</h3>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{account.icon}</span>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{account.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                  </div>
                </div>
                <p className="font-semibold text-emerald-500">{formatCurrency(account.balance, currency)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Budget Status</h3>
          <div className="space-y-4">
            {budgetStatuses.slice(0, 4).map(({ budget, spent, percentage, isOverBudget, isWarning }) => {
              const category = getCategoryById(categories, budget.categoryId);
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{category?.icon}</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{category?.name}</span>
                    </div>
                    <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {formatCurrency(spent, currency)} / {formatCurrency(budget.limit, currency)}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = getCategoryById(categories, transaction.categoryId);
              return (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category?.icon}</span>
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{transaction.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  value,
  icon,
  color,
  trend,
  isDark,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  color: 'emerald' | 'cyan' | 'rose' | 'violet';
  trend?: 'up' | 'down' | 'stable';
  isDark: boolean;
}) {
  const darkColorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
  };

  const lightColorClasses = {
    emerald: 'from-emerald-100 to-emerald-50 border-emerald-200 text-emerald-600',
    cyan: 'from-cyan-100 to-cyan-50 border-cyan-200 text-cyan-600',
    rose: 'from-rose-100 to-rose-50 border-rose-200 text-rose-600',
    violet: 'from-violet-100 to-violet-50 border-violet-200 text-violet-600',
  };

  const colorClasses = isDark ? darkColorClasses : lightColorClasses;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' && (
                <>
                  <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-rose-500">Trending up</span>
                </>
              )}
              {trend === 'down' && (
                <>
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-emerald-500">Trending down</span>
                </>
              )}
              {trend === 'stable' && (
                <>
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-gray-500">Stable</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white/60'} ${colorClasses[color].split(' ').pop()}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function BarChart({ data, isDark, currency }: { data: { month: string; income: number; expenses: number }[]; isDark: boolean; currency: CurrencyCode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expenses])) * 1.1;
    const barWidth = chartWidth / data.length / 3;
    const barGap = barWidth * 0.5;

    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)';
    const labelColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)';
    const legendColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      const value = maxValue - (maxValue / 4) * i;
      ctx.fillText(formatCurrency(value, currency).replace('.00', ''), padding.left - 8, y + 4);
    }

    data.forEach((d, i) => {
      const x = padding.left + (chartWidth / data.length) * i + chartWidth / data.length / 2;

      const incomeHeight = (d.income / maxValue) * chartHeight;
      const incomeGradient = ctx.createLinearGradient(0, height - padding.bottom - incomeHeight, 0, height - padding.bottom);
      incomeGradient.addColorStop(0, '#06b6d4');
      incomeGradient.addColorStop(1, '#06b6d4aa');
      ctx.fillStyle = incomeGradient;
      roundedRect(ctx, x - barWidth - barGap / 2, height - padding.bottom - incomeHeight, barWidth, incomeHeight, 4);

      const expenseHeight = (d.expenses / maxValue) * chartHeight;
      const expenseGradient = ctx.createLinearGradient(0, height - padding.bottom - expenseHeight, 0, height - padding.bottom);
      expenseGradient.addColorStop(0, '#f43f5e');
      expenseGradient.addColorStop(1, '#f43f5eaa');
      ctx.fillStyle = expenseGradient;
      roundedRect(ctx, x + barGap / 2, height - padding.bottom - expenseHeight, barWidth, expenseHeight, 4);

      ctx.fillStyle = labelColor;
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(d.month.split(' ')[0], x, height - padding.bottom + 20);
    });

    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(width - 140, 8, 12, 12);
    ctx.fillStyle = legendColor;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('Income', width - 122, 18);

    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(width - 70, 8, 12, 12);
    ctx.fillStyle = legendColor;
    ctx.fillText('Expenses', width - 52, 18);
  }, [data, isDark, currency]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64"
      style={{ width: '100%', height: '256px' }}
    />
  );
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (h < r * 2) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function TransactionsTab({
  transactions,
  categories,
  accounts,
  filters,
  setFilters,
  searchQuery,
  onSearchChange,
  allTags,
  showAddTransaction,
  setShowAddTransaction,
  addTransaction,
  deleteTransaction,
  isDark,
  currency,
}: {
  transactions: Transaction[];
  categories: ReturnType<typeof useFinanceState>['state']['categories'];
  accounts: Account[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allTags: string[];
  showAddTransaction: boolean;
  setShowAddTransaction: (show: boolean) => void;
  addTransaction: ReturnType<typeof useFinanceState>['addTransaction'];
  deleteTransaction: (id: string) => void;
  isDark: boolean;
  currency: CurrencyCode;
}) {
  const [newTransaction, setNewTransaction] = useState<{
    type: TransactionType;
    amount: string;
    description: string;
    categoryId: string;
    accountId: string;
    date: string;
    tags: string;
  }>({
    type: 'expense',
    amount: '',
    description: '',
    categoryId: '',
    accountId: accounts[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.categoryId || !newTransaction.accountId) return;

    addTransaction({
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      categoryId: newTransaction.categoryId,
      accountId: newTransaction.accountId,
      date: newTransaction.date,
      tags: newTransaction.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewTransaction({
      type: 'expense',
      amount: '',
      description: '',
      categoryId: '',
      accountId: accounts[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      tags: '',
    });
    setShowAddTransaction(false);
  };

  const filteredCategories = categories.filter((c) => c.type === newTransaction.type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={onSearchChange}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'}`}
          />
        </div>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filters.type || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as TransactionType || undefined }))}
          className={`px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.categoryId || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value || undefined }))}
          className={`px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <select
          value={filters.accountId || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, accountId: e.target.value || undefined }))}
          className={`px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}
        >
          <option value="">All Accounts</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.icon} {acc.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value || undefined }))}
          className={`px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}
        />

        <input
          type="date"
          value={filters.dateTo || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value || undefined }))}
          className={`px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}
        />

        {(filters.type || filters.categoryId || filters.accountId || filters.dateFrom || filters.dateTo) && (
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl hover:bg-rose-500/30 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {showAddTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-6">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewTransaction((prev) => ({ ...prev, type: 'expense', categoryId: '' }))}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition ${
                    newTransaction.type === 'expense'
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setNewTransaction((prev) => ({ ...prev, type: 'income', categoryId: '' }))}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition ${
                    newTransaction.type === 'income'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Income
                </button>
              </div>

              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />

              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />

              <select
                value={newTransaction.categoryId}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              >
                <option value="" className="bg-[#1a1a2e] text-white">Select Category</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#1a1a2e] text-white">
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={newTransaction.accountId}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, accountId: e.target.value }))}
                className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              >
                <option value="" className="bg-[#1a1a2e] text-white">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-[#1a1a2e] text-white">
                    {acc.icon} {acc.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />

              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={newTransaction.tags}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date</th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Description</th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Category</th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Account</th>
                <th className={`text-right py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Amount</th>
                <th className={`text-center py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const category = getCategoryById(categories, transaction.categoryId);
                const account = getAccountById(accounts, transaction.accountId);
                return (
                  <tr key={transaction.id} className={`border-b transition ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className={`py-4 px-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{formatDate(transaction.date)}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{transaction.description || 'No description'}</p>
                        {transaction.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {transaction.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`px-2 py-0.5 text-xs rounded-full ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span>{category?.icon}</span>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{category?.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span>{account?.icon}</span>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{account?.name}</span>
                      </div>
                    </td>
                    <td className={`py-4 px-6 text-right font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InsightsTab({
  insights,
  categories,
  transactions,
  isDark,
  currency,
}: {
  insights: ReturnType<typeof useFinanceState>['insights'];
  categories: ReturnType<typeof useFinanceState>['state']['categories'];
  transactions: Transaction[];
  isDark: boolean;
  currency: CurrencyCode;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Expense Breakdown</h3>
          <PieChart data={insights.topExpenseCategories} categories={categories} isDark={isDark} />
          <div className="mt-4 space-y-2">
            {insights.topExpenseCategories.map((item) => {
              const category = getCategoryById(categories, item.categoryId);
              return (
                <div key={item.categoryId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category?.color }} />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{category?.icon} {category?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(item.amount, currency)}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Financial Summary</h3>
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className="text-sm text-emerald-600 mb-1">Total Income</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(insights.totalIncome, currency)}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
              <p className="text-sm text-rose-600 mb-1">Total Expenses</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(insights.totalExpenses, currency)}</p>
            </div>
            <div className={`p-4 rounded-xl border ${insights.netSavings >= 0 ? (isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200') : (isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200')}`}>
              <p className={`text-sm mb-1 ${insights.netSavings >= 0 ? 'text-cyan-600' : 'text-amber-600'}`}>Net Savings</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(insights.netSavings, currency)}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-200'}`}>
              <p className="text-sm text-violet-600 mb-1">Savings Rate</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{insights.savingsRate.toFixed(1)}%</p>
              <div className={`mt-2 h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-violet-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, insights.savingsRate))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Trend</h3>
        <LineChart data={insights.monthlyTrend} isDark={isDark} currency={currency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl border p-6 text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className="text-4xl font-bold text-emerald-500">{transactions.filter((t) => t.type === 'income').length}</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Income Transactions</p>
        </div>
        <div className={`rounded-2xl border p-6 text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className="text-4xl font-bold text-rose-500">{transactions.filter((t) => t.type === 'expense').length}</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expense Transactions</p>
        </div>
        <div className={`rounded-2xl border p-6 text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className="text-4xl font-bold text-cyan-500">
            {formatCurrency(insights.totalExpenses / Math.max(1, transactions.filter((t) => t.type === 'expense').length), currency)}
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Expense</p>
        </div>
      </div>
    </div>
  );
}

function PieChart({
  data,
  categories,
  isDark,
}: {
  data: { categoryId: string; amount: number; percentage: number }[];
  categories: ReturnType<typeof useFinanceState>['state']['categories'];
  isDark: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 80;
    const innerRadius = 50;

    let startAngle = -Math.PI / 2;

    data.forEach((item) => {
      const category = getCategoryById(categories, item.categoryId);
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = category?.color || '#666';
      ctx.fill();

      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? '#0a0a0f' : '#ffffff';
    ctx.fill();
  }, [data, categories, isDark]);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500">
        No expense data
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: '200px', height: '200px' }}
      />
    </div>
  );
}

function LineChart({ data, isDark, currency }: { data: { month: string; income: number; expenses: number }[]; isDark: boolean; currency: CurrencyCode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expenses])) * 1.1;

    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)';
    const labelColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)';
    const legendColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
    const bgColor = isDark ? '#0a0a0f' : '#ffffff';

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      const value = maxValue - (maxValue / 4) * i;
      ctx.fillText(formatCurrency(value, currency).replace('.00', ''), padding.left - 8, y + 4);
    }

    const drawLine = (values: number[], color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      values.forEach((val, i) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * i;
        const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      values.forEach((val, i) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * i;
        const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = bgColor;
        ctx.fill();
      });
    };

    drawLine(data.map((d) => d.income), '#06b6d4');
    drawLine(data.map((d) => d.expenses), '#f43f5e');

    data.forEach((d, i) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      ctx.fillStyle = labelColor;
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(d.month.split(' ')[0], x, height - padding.bottom + 20);
    });

    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(width - 140, 8, 12, 12);
    ctx.fillStyle = legendColor;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('Income', width - 122, 18);

    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(width - 70, 8, 12, 12);
    ctx.fillStyle = legendColor;
    ctx.fillText('Expenses', width - 52, 18);
  }, [data, isDark, currency]);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500">
        No trend data
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64"
      style={{ width: '100%', height: '256px' }}
    />
  );
}

function SettingsTab({
  accounts,
  budgets,
  categories,
  budgetStatuses,
  showAddAccount,
  setShowAddAccount,
  showAddBudget,
  setShowAddBudget,
  addAccount,
  deleteAccount,
  addBudget,
  updateBudget,
  deleteBudget,
  reset,
  isDark,
  currency,
}: {
  accounts: Account[];
  budgets: Budget[];
  categories: ReturnType<typeof useFinanceState>['state']['categories'];
  budgetStatuses: ReturnType<typeof useFinanceState>['budgetStatuses'];
  showAddAccount: boolean;
  setShowAddAccount: (show: boolean) => void;
  showAddBudget: boolean;
  setShowAddBudget: (show: boolean) => void;
  addAccount: ReturnType<typeof useFinanceState>['addAccount'];
  deleteAccount: (id: string) => void;
  addBudget: ReturnType<typeof useFinanceState>['addBudget'];
  updateBudget: ReturnType<typeof useFinanceState>['updateBudget'];
  deleteBudget: (id: string) => void;
  reset: () => void;
  isDark: boolean;
  currency: CurrencyCode;
}) {
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'bank' as 'cash' | 'bank' | 'wallet',
    balance: '',
  });

  const [newBudget, setNewBudget] = useState({
    categoryId: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'yearly',
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name || !newAccount.balance) return;

    const icons = { cash: '💵', bank: '🏦', wallet: '📱' };
    const colors = { cash: '#10b981', bank: '#3b82f6', wallet: '#8b5cf6' };

    addAccount({
      name: newAccount.name,
      type: newAccount.type,
      balance: parseFloat(newAccount.balance),
      icon: icons[newAccount.type],
      color: colors[newAccount.type],
    });

    setNewAccount({ name: '', type: 'bank', balance: '' });
    setShowAddAccount(false);
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.categoryId || !newBudget.limit) return;

    addBudget({
      categoryId: newBudget.categoryId,
      limit: parseFloat(newBudget.limit),
      period: newBudget.period,
    });

    setNewBudget({ categoryId: '', limit: '', period: 'monthly' });
    setShowAddBudget(false);
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const existingBudgetCategories = budgets.map((b) => b.categoryId);
  const availableCategories = expenseCategories.filter((c) => !existingBudgetCategories.includes(c.id));

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Accounts</h3>
          <button
            onClick={() => setShowAddAccount(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`p-4 rounded-xl border transition ${isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{account.icon}</span>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{account.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteAccount(account.id)}
                  className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="mt-3 text-2xl font-bold text-emerald-500">{formatCurrency(account.balance, currency)}</p>
            </div>
          ))}
        </div>

        {showAddAccount && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-6">Add Account</h3>
              <form onSubmit={handleAddAccount} className="space-y-4">
                <input
                  type="text"
                  placeholder="Account Name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                />

                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount((prev) => ({ ...prev, type: e.target.value as 'cash' | 'bank' | 'wallet' }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="bank">🏦 Bank Account</option>
                  <option value="cash">💵 Cash</option>
                  <option value="wallet">📱 Digital Wallet</option>
                </select>

                <input
                  type="number"
                  step="0.01"
                  placeholder="Initial Balance"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount((prev) => ({ ...prev, balance: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAccount(false)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Budget Limits</h3>
          {availableCategories.length > 0 && (
            <button
              onClick={() => setShowAddBudget(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Budget
            </button>
          )}
        </div>

        <div className="space-y-4">
          {budgetStatuses.map(({ budget, spent, percentage, isOverBudget, isWarning }) => {
            const category = getCategoryById(categories, budget.categoryId);
            return (
              <div
                key={budget.id}
                className={`p-4 rounded-xl border ${
                  isOverBudget
                    ? (isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200')
                    : isWarning
                    ? (isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200')
                    : (isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category?.icon}</span>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{category?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{budget.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={budget.limit}
                      onChange={(e) => updateBudget(budget.id, { limit: parseFloat(e.target.value) || 0 })}
                      className={`w-24 px-3 py-1.5 rounded-lg text-right text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}
                    />
                    <button
                      onClick={() => deleteBudget(budget.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Spent: {formatCurrency(spent)}</span>
                  <span className={isOverBudget ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverBudget ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {isOverBudget && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Over budget by {formatCurrency(spent - budget.limit)}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {showAddBudget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-6">Add Budget</h3>
              <form onSubmit={handleAddBudget} className="space-y-4">
                <select
                  value={newBudget.categoryId}
                  onChange={(e) => setNewBudget((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                >
                  <option value="">Select Category</option>
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  placeholder="Budget Limit"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget((prev) => ({ ...prev, limit: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                />

                <select
                  value={newBudget.period}
                  onChange={(e) => setNewBudget((prev) => ({ ...prev, period: e.target.value as 'monthly' | 'yearly' }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBudget(false)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className={`rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Danger Zone</h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Reset all data to defaults. This will delete all your transactions, accounts, and budgets.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
              reset();
            }
          }}
          className={`px-6 py-2.5 border rounded-xl transition font-medium ${isDark ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}
