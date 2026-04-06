import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';

const useStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      transactions: mockTransactions,
      theme: 'light', // 'light' | 'dark'
      role: 'Viewer', // 'Viewer' | 'Admin'
      filters: {
        search: '',
        type: 'all', // 'all' | 'income' | 'expense'
        category: 'all',
        sortBy: 'date', // 'date' | 'amount'
        sortOrder: 'desc', // 'asc' | 'desc'
      },

      // --- Theme Actions ---
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // --- Role Actions ---
      setRole: (role) => set({ role }),

      // --- Filter Actions ---
      updateFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: () =>
        set({
          filters: {
            search: '',
            type: 'all',
            category: 'all',
            sortBy: 'date',
            sortOrder: 'desc',
          },
        }),

      // --- Transaction Actions (Admin only) ---
      addTransaction: (transaction) => {
        if (get().role !== 'Admin') return;
        set((state) => ({
          transactions: [
            { ...transaction, id: Date.now().toString() },
            ...state.transactions,
          ],
        }));
      },

      editTransaction: (id, updates) => {
        if (get().role !== 'Admin') return;
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        if (get().role !== 'Admin') return;
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      // --- Computed Selectors ---
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        let filtered = [...transactions];

        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.description.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }

        if (filters.type !== 'all') {
          filtered = filtered.filter((t) => t.type === filters.type);
        }

        if (filters.category !== 'all') {
          filtered = filtered.filter((t) => t.category === filters.category);
        }

        filtered.sort((a, b) => {
          let valA, valB;
          if (filters.sortBy === 'date') {
            valA = new Date(a.date).getTime();
            valB = new Date(b.date).getTime();
          } else {
            valA = a.amount;
            valB = b.amount;
          }
          return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        return filtered;
      },

      getSummary: () => {
        const { transactions } = get();
        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
        };
      },
    }),
    {
      name: 'fintrack-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
    }
  )
);

export default useStore;
