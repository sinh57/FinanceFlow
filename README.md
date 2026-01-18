# FinanceFlow - Personal Finance Dashboard

A modern, feature-rich personal finance management application built with Next.js 15, React 19, and TypeScript. Track your income, expenses, budgets, and financial insights with a beautiful, responsive UI.

## Features

- **Dashboard Overview** - Get a quick snapshot of your total balance, monthly income/expenses, and savings rate
- **Transaction Management** - Add, view, filter, and delete transactions with categories and tags
- **Budget Tracking** - Set monthly budgets for different categories and track spending
- **Financial Insights** - Visualize spending patterns with charts and analytics
- **Multi-Currency Support** - Switch between INR, USD, EUR, GBP, JPY, AUD, and CAD
- **Dark/Light Theme** - Toggle between dark and light modes
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Local Storage** - All data persists in browser storage

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks with localStorage persistence
- **Charts**: Custom Canvas-based visualizations

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finance-dashboard.git
cd finance-dashboard
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   └── FinanceDashboard.tsx  # Main dashboard component
├── hooks/               # Custom React hooks
│   └── useFinanceState.ts    # Finance state management
└── lib/
    └── finance/         # Finance utilities
        ├── types.ts     # TypeScript interfaces
        ├── utils.ts     # Helper functions
        ├── data.ts      # Default data & storage
        └── insights.ts  # Analytics calculations
```

## Screenshots

### Dashboard Overview
The main dashboard shows key financial metrics, recent transactions, and budget status at a glance.

### Transaction Management
Filter and search through transactions, add new ones with categories and tags.

### Financial Insights
Visualize your spending patterns with interactive charts and detailed breakdowns.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
