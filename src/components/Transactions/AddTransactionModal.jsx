import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';

const AddTransactionModal = ({ onClose }) => {
  const addTransaction = useStore((s) => s.addTransaction);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    addTransaction({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  const field = (label, key, type = 'text', extra = {}) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="input-field"
        {...extra}
      />
      {errors[key] && (
        <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors[key]}</p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          background: 'var(--bg-card)', borderRadius: 24,
          padding: 32, width: '100%', maxWidth: 460,
          boxShadow: 'var(--card-shadow-hover)',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Add Transaction</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-elevated)', border: 'none', borderRadius: 10,
              width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {field('Description', 'description', 'text', { placeholder: 'e.g. Coffee at Starbucks' })}
          {field('Amount ($)', 'amount', 'number', { placeholder: '0.00', min: 0, step: 0.01 })}
          {field('Date', 'date', 'date')}

          {/* Type toggle */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Type
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['income', 'expense'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  style={{
                    flex: 1, padding: '9px 0', borderRadius: 10, border: 'none',
                    fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: form.type === t
                      ? t === 'income' ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)'
                      : 'var(--bg-card-hover)',
                    color: form.type === t
                      ? t === 'income' ? 'var(--color-success)' : 'var(--color-danger)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="select-field"
              style={{ width: '100%' }}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 15 }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Plus size={18} /> Add Transaction
            </span>
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddTransactionModal;
