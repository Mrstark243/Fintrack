import React, { useState } from 'react';
import { TrendingUp, ChevronDown, ShieldCheck, Eye, Moon, Sun } from 'lucide-react';
import useStore from '../../store/useStore';

/**
 * App header with logo, theme toggle, and role switcher.
 */
const Header = () => {
  const { role, setRole, theme, toggleTheme } = useStore();
  const [open, setOpen] = useState(false);

  const roles = ['Viewer', 'Admin'];

  return (
    <header
      style={{
        background: 'var(--header-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
            }}
          >
            <TrendingUp size={20} color="white" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            FinTrack
          </span>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 10,
              color: 'var(--text-secondary)',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Role Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpen((o) => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 10,
                border: '1.5px solid var(--border-color)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary)',
                transition: 'border-color 0.2s',
              }}
            >
              {role === 'Admin' ? (
                <ShieldCheck size={16} style={{ color: 'var(--color-primary)' }} />
              ) : (
                <Eye size={16} style={{ color: 'var(--text-muted)' }} />
              )}
              {role}
              <ChevronDown
                size={14}
                style={{
                  color: 'var(--text-muted)',
                  transform: open ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {open && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  boxShadow: 'var(--card-shadow)',
                  overflow: 'hidden',
                  minWidth: 160,
                  zIndex: 100,
                }}
              >
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: role === r ? 'var(--accent-cyan-bg)' : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: role === r ? 600 : 500,
                      color: role === r ? 'var(--color-primary)' : 'var(--text-primary)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (role !== r) e.currentTarget.style.background = 'var(--bg-card-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (role !== r) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {r === 'Admin' ? (
                      <ShieldCheck size={15} style={{ color: role === r ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                    ) : (
                      <Eye size={15} style={{ color: role === r ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                    )}
                    {r}
                    {r === 'Viewer' && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        Read only
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
