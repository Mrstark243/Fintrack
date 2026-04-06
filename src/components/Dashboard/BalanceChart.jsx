import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import useStore from '../../store/useStore';
import Card from '../UI/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ fontSize: 13, color: p.name === 'Income' ? 'var(--color-success)' : 'var(--color-danger)', margin: 0, marginTop: 4 }}>
          {p.name}:{' '}
          <strong>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.value)}
          </strong>
        </p>
      ))}
    </div>
  );
};

const BalanceChart = () => {
  const transactions = useStore((s) => s.transactions);

  const data = useMemo(() => {
    // Group by month, calculate running income vs expense per month
    const months = {};
    transactions.forEach((t) => {
      const key = format(parseISO(t.date), 'MMM yyyy');
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
      if (t.type === 'income') months[key].income += t.amount;
      else months[key].expenses += t.amount;
    });

    return Object.values(months)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .map((m) => ({
        ...m,
        balance: +(m.income - m.expenses).toFixed(2),
        income: +m.income.toFixed(2),
        expenses: +m.expenses.toFixed(2),
      }));
  }, [transactions]);

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
        Balance Over Time
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        Monthly income vs spending comparison
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="var(--color-success)"
            strokeWidth={3}
            fill="url(#colorInc)"
            dot={{ r: 4, fill: 'var(--color-success)', strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: 'var(--border-color)', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="var(--color-danger)"
            strokeWidth={3}
            fill="url(#colorExp)"
            dot={{ r: 4, fill: 'var(--color-danger)', strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: 'var(--border-color)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BalanceChart;
