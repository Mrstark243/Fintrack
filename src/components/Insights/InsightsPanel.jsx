import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { TrendingUp, AlertTriangle, Lightbulb, Award } from 'lucide-react';
import useStore from '../../store/useStore';
import Card from '../UI/Card';

const InsightItem = ({ icon: Icon, color, bg, title, desc }) => (
  <div
    style={{
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      padding: '16px',
      borderRadius: 12,
      background: bg,
      marginBottom: 12,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: color, // Passed in variables now
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={18} color="var(--bg-card)" strokeWidth={2} />
    </div>
    <div>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</p>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  </div>
);

const InsightsPanel = () => {
  const transactions = useStore((s) => s.transactions);

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');

    // Highest spending category
    const catTotals = {};
    expenses.forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    // Monthly comparison (last 2 months)
    const monthTotals = {};
    expenses.forEach((t) => {
      const key = format(parseISO(t.date), 'MMM yyyy');
      monthTotals[key] = (monthTotals[key] || 0) + t.amount;
    });
    const months = Object.entries(monthTotals).sort(
      (a, b) => new Date(a[0]) - new Date(b[0])
    );
    const lastTwo = months.slice(-2);

    let monthInsight = null;
    if (lastTwo.length === 2) {
      const [prev, curr] = lastTwo;
      const diff = curr[1] - prev[1];
      const pct = Math.abs(((diff / prev[1]) * 100).toFixed(1));
      monthInsight = {
        more: diff > 0,
        pct,
        curr: curr[0],
        prev: prev[0],
      };
    }

    // Savings rate
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExp) / totalIncome) * 100).toFixed(1) : 0;

    return { topCat, monthInsight, savingsRate };
  }, [transactions]);

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
        Smart Insights
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        AI-powered analysis of your spending habits
      </p>

      {insights.topCat && (
        <InsightItem
          icon={AlertTriangle}
          color="var(--color-danger)"
          bg="var(--accent-red-bg)"
          title={`Top spending: ${insights.topCat[0]}`}
          desc={`You've spent ${fmt(insights.topCat[1])} on ${insights.topCat[0]}. This is your highest expense category.`}
        />
      )}

      {insights.monthInsight && (
        <InsightItem
          icon={TrendingUp}
          color={insights.monthInsight.more ? 'var(--color-danger)' : 'var(--color-success)'}
          bg={insights.monthInsight.more ? 'var(--accent-red-bg)' : 'var(--accent-green-bg)'}
          title={`Monthly spending ${insights.monthInsight.more ? 'increased' : 'decreased'}`}
          desc={`You spent ${insights.monthInsight.pct}% ${insights.monthInsight.more ? 'more' : 'less'} in ${insights.monthInsight.curr} compared to ${insights.monthInsight.prev}.`}
        />
      )}

      <InsightItem
        icon={Award}
        color="var(--color-primary)"
        bg="var(--accent-cyan-bg)"
        title={`Savings rate: ${insights.savingsRate}%`}
        desc={
          insights.savingsRate >= 20
            ? `Great job! You're saving ${insights.savingsRate}% of your income. Keep it up!`
            : `Your savings rate is ${insights.savingsRate}%. Aim for 20%+ for a strong financial cushion.`
        }
      />

      <InsightItem
        icon={Lightbulb}
        color="var(--color-primary)"
        bg="var(--accent-cyan-bg)"
        title="Tip: Set a spending limit"
        desc="Consider setting monthly budgets per category to avoid overspending. Track your recurring subscriptions regularly."
      />
    </Card>
  );
};

export default InsightsPanel;
