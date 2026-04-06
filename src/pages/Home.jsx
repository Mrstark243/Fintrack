import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Receipt } from 'lucide-react';
import SummaryCards from '../components/Dashboard/SummaryCards';
import BalanceChart from '../components/Dashboard/BalanceChart';
import CategoryChart from '../components/Dashboard/CategoryChart';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionTable from '../components/Transactions/TransactionTable';
import InsightsPanel from '../components/Insights/InsightsPanel';
import AddTransactionModal from '../components/Transactions/AddTransactionModal';
import Card from '../components/UI/Card';
import useStore from '../store/useStore';

const Section = ({ title, subtitle, children, action, delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    style={{ marginBottom: 32 }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </motion.section>
);

const Home = () => {
  const role = useStore((s) => s.role);
  const getFilteredTransactions = useStore((s) => s.getFilteredTransactions);
  const [showModal, setShowModal] = useState(false);
  const isAdmin = role === 'Admin';
  const count = getFilteredTransactions().length;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Welcome back 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '6px 0 0' }}>
          Here's your financial overview — role:{' '}
          <strong style={{ color: isAdmin ? 'var(--color-cyan)' : 'var(--text-muted)' }}>{role}</strong>
        </p>
      </motion.div>

      {/* Summary Cards */}
      <Section title="Overview" subtitle="Your financial snapshot at a glance" delay={0.1}>
        <SummaryCards />
      </Section>

      {/* Charts Row */}
      <Section title="Analytics" subtitle="Visual breakdown of your finances" delay={0.2}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          <BalanceChart />
          <CategoryChart />
        </div>
      </Section>

      {/* Insights */}
      <Section title="Insights" subtitle="Smart analysis of your spending patterns" delay={0.3}>
        <InsightsPanel />
      </Section>

      {/* Transactions */}
      <Section
        title="Transactions"
        subtitle={`${count} transaction${count !== 1 ? 's' : ''} found`}
        action={
          isAdmin && (
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={16} /> Add New
            </button>
          )
        }
      >
        <Card padding={false}>
          <div style={{ padding: '20px 20px 0' }}>
            <TransactionFilters />
          </div>
          <TransactionTable />
        </Card>
      </Section>

      {/* Admin Add Modal */}
      <AnimatePresence>
        {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Home;
