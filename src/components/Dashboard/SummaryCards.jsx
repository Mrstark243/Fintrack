import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { motion, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import useStore from '../../store/useStore';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const CountUp = ({ value }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    // Quick, smooth easeout scaling up from 0 to actual value over 1.2s
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(val) {
        node.textContent = fmt(val);
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={nodeRef}>{fmt(0)}</span>;
};

const SummaryCard = ({ label, value, icon: Icon, gradient, change, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    style={{
      borderRadius: 20,
      padding: '28px 24px',
      background: gradient,
      color: '#fff',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
      minWidth: 220,
    }}
  >
    {/* Background decoration */}
    <div
      style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: -30,
        right: 20,
        width: 70,
        height: 70,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
      }}
    />

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, opacity: 0.85, marginBottom: 8 }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>
          <CountUp value={value} />
        </p>
        {change !== undefined && (
          <p style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>{change}</p>
        )}
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={22} strokeWidth={2} />
      </div>
    </div>
  </motion.div>
);

const SummaryCards = () => {
  const getSummary = useStore((s) => s.getSummary);
  const { totalIncome, totalExpenses, balance } = getSummary();

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <SummaryCard
        label="Total Balance"
        value={balance}
        icon={Wallet}
        gradient="var(--grad-primary)"
        change="Overall net position"
        delay={0}
      />
      <SummaryCard
        label="Total Income"
        value={totalIncome}
        icon={ArrowUpRight}
        gradient="var(--grad-success)"
        change="All time income"
        delay={0.1}
      />
      <SummaryCard
        label="Total Expenses"
        value={totalExpenses}
        icon={ArrowDownRight}
        gradient="var(--grad-danger)"
        change="All time spending"
        delay={0.2}
      />
    </div>
  );
};

export default SummaryCards;
