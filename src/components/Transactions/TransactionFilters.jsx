import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';

const TransactionFilters = () => {
  const { filters, updateFilters, resetFilters } = useStore();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
        <Search
          size={15}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="input-field"
          style={{ paddingLeft: 36 }}
        />
      </div>

      {/* Type Filter */}
      <select
        value={filters.type}
        onChange={(e) => updateFilters({ type: e.target.value })}
        className="select-field"
        style={{ flex: '0 0 auto' }}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) => updateFilters({ category: e.target.value })}
        className="select-field"
        style={{ flex: '0 0 auto' }}
      >
        <option value="all">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('-');
          updateFilters({ sortBy, sortOrder });
        }}
        className="select-field"
        style={{ flex: '0 0 auto' }}
      >
        <option value="date-desc">Date: Newest</option>
        <option value="date-asc">Date: Oldest</option>
        <option value="amount-desc">Amount: High–Low</option>
        <option value="amount-asc">Amount: Low–High</option>
      </select>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="btn-secondary"
        style={{ flex: '0 0 auto' }}
        title="Reset filters"
      >
        Reset
      </button>
    </div>
  );
};

export default TransactionFilters;
