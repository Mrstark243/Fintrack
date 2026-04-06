import React, { useEffect } from 'react';
import Header from './components/UI/Header';
import Home from './pages/Home';
import useStore from './store/useStore';

/**
 * Root application component.
 * Renders the sticky header and the main Home page.
 */
const App = () => {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', transition: 'background 0.3s' }}>
      <Header />
      <main>
        <Home />
      </main>
    </div>
  );
};

export default App;
