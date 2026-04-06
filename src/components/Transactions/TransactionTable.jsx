import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import useStore from '../../store/useStore';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const CATEGORY_ICONS = {
  'Salary': '💼',
  'Food & Dining': '🍽️',
  'Transport': '🚗',
  'Shopping': '🛍️',
  'Subscriptions': '📺',
  'Healthcare': '🏥',
  'Entertainment': '🎭',
  'Utilities': '💡',
  'Freelance': '💻',
  'Investment': '📈',
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: 14,
  color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border-color)',
  verticalAlign: 'middle',
};

const thStyle = {
  padding: '12px 16px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  textAlign: 'left',
  background: 'var(--bg-elevated)',
  borderBottom: '1px solid var(--border-color)',
};

const iconBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 6,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s',
};

const EditRow = ({ transaction, onDone }) => {
  const editTransaction = useStore((s) => s.editTransaction);
  const [form, setForm] = useState({ ...transaction });

  const save = () => {
    editTransaction(form.id, {
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      type: form.type,
    });
    onDone();
  };

  return (
    <tr style={{ background: 'var(--row-hover-bg)' }}>
      <td style={tdStyle}>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="input-field"
          style={{ padding: '6px 10px', fontSize: 13 }}
        />
      </td>
      <td style={tdStyle}>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field"
          style={{ padding: '6px 10px', fontSize: 13 }}
        />
      </td>
      <td style={tdStyle}>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="input-field"
          style={{ padding: '6px 10px', fontSize: 13 }}
        />
      </td>
      <td style={tdStyle}>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="select-field"
          style={{ padding: '6px 10px', fontSize: 13 }}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </td>
      <td style={{ ...tdStyle, display: 'flex', gap: 6 }}>
        <button onClick={save} style={{ ...iconBtn, color: 'var(--color-success)' }} title="Save">
          <Check size={16} />
        </button>
        <button onClick={onDone} style={{ ...iconBtn, color: 'var(--text-muted)' }} title="Cancel">
          <X size={16} />
        </button>
      </td>
    </tr>
  );
};

const TransactionTable = () => {
  const getFilteredTransactions = useStore((s) => s.getFilteredTransactions);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const role = useStore((s) => s.role);
  const [editingId, setEditingId] = useState(null);

  const transactions = getFilteredTransactions();
  const isAdmin = role === 'Admin';

  if (transactions.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>No transactions found</p>
        <p style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }} className="scrollbar-thin">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Category</th>
            {isAdmin && <th style={thStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) =>
            editingId === t.id ? (
              <EditRow key={t.id} transaction={t} onDone={() => setEditingId(null)} />
            ) : (
              <tr
                key={t.id}
                style={{ transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--row-hover-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={tdStyle}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {format(parseISO(t.date), 'MMM d, yyyy')}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'var(--bg-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {CATEGORY_ICONS[t.category] || '💳'}
                    </span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                        {t.description}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{t.category}</p>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: t.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)',
                    }}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {fmt(t.amount)}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span className={t.type === 'income' ? 'badge-income' : 'badge-expense'}>
                    {t.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.category}</span>
                </td>
                {isAdmin && (
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => setEditingId(t.id)}
                        style={{ ...iconBtn, color: 'var(--color-primary)' }}
                        title="Edit"
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--row-hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        style={{ ...iconBtn, color: 'var(--color-danger)' }}
                        title="Delete"
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-red-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
