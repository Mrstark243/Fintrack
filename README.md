# FinTrack 💸

A clean, production-quality **Finance Dashboard Web App** built with React, Tailwind CSS, Recharts, and Zustand.

---

## ✨ Features

### 📊 Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses with gradient visuals
- **Area Chart** — Monthly income vs. expenses trend over time
- **Donut Pie Chart** — Spending breakdown by category

### 💳 Transactions
- Searchable, filterable transaction list
- Filter by **type** (Income / Expense) and **category**
- Sort by **date** or **amount** (ascending / descending)
- Inline **row editing** (Admin only)
- Transaction **deletion** (Admin only)

### 🔐 Role-Based UI
- **Viewer** — read-only access, no mutations
- **Admin** — full CRUD: add, edit, delete transactions
- Role switcher in the header with visual indicators

### 🧠 Smart Insights
- Top spending category detection
- Month-over-month spending comparison
- Savings rate calculation with actionable advice
- Static financial tips

### 💾 Persistence
- State persisted to **localStorage** via Zustand `persist` middleware

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite](https://vite.dev) | Build tool & Dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Zustand](https://zustand-demo.pmnd.rs) | Lightweight state management |
| [Recharts](https://recharts.org) | Chart components |
| [Framer Motion](https://www.framer.com/motion/) | Smooth UI animations |
| [Lucide React](https://lucide.dev) | Icon library |
| [date-fns](https://date-fns.org) | Date formatting |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd fintrack

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── SummaryCards.jsx     # Metric overview cards
│   │   ├── BalanceChart.jsx     # Area chart (income vs expenses)
│   │   └── CategoryChart.jsx    # Donut pie chart (category breakdown)
│   ├── Transactions/
│   │   ├── TransactionFilters.jsx  # Search, filter, sort controls
│   │   ├── TransactionTable.jsx    # Responsive data table
│   │   └── AddTransactionModal.jsx # Admin-only add form (modal)
│   ├── Insights/
│   │   └── InsightsPanel.jsx    # Smart financial insights
│   └── UI/
│       ├── Card.jsx             # Reusable card container
│       └── Header.jsx           # Sticky header + role switcher
│
├── data/
│   └── mockData.js              # 20 realistic mock transactions
│
├── pages/
│   └── Home.jsx                 # Main page assembling all sections
│
├── store/
│   └── useStore.js              # Zustand global state + actions
│
├── App.jsx                      # Root component
├── main.jsx                     # React entry point
└── index.css                    # Tailwind + design system utilities
```

---

## 🧠 Key Decisions

### State Management with Zustand
Chose Zustand over Redux/Context for its minimal boilerplate while still supporting middleware (persist). State is cleanly separated into slices: `transactions`, `role`, and `filters`. Computed selectors (`getFilteredTransactions`, `getSummary`) keep components free of business logic.

### Role-Based Access Control
RBAC is handled purely in the Zustand store — mutation actions (`addTransaction`, `deleteTransaction`, `editTransaction`) silently no-op if the current role is not `Admin`. UI elements (Add button, Edit/Delete icons) are conditionally rendered based on `role === 'Admin'`.

### Design System via Tailwind + Custom Utilities
Rather than scattering one-off styles, shared patterns (`.card`, `.btn-primary`, `.badge-income`) are defined as `@layer utilities` in `index.css`, keeping component JSX clean and consistent.

### Recharts for Data Visualization
Recharts was chosen for its React-native API and excellent responsive container support. Custom tooltips provide a polished, on-brand look without additional dependencies.

### localStorage Persistence
Zustand's `persist` middleware with `partialize` ensures only `transactions` and `role` are stored — filters are session-only, which is the intuitive UX expectation.

---

## 📄 License

MIT
