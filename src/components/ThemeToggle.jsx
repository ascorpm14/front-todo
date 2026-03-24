import { useApp } from '../contexts/AppContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      style={styles.button}
      title={`Passer au mode ${theme === 'white' ? 'sombre' : 'clair'}`}
    >
      {theme === 'white' ? '🌙' : '☀️'}
    </button>
  );
};

const styles = {
  button: {
    background: 'transparent',
    border: '2px solid var(--accent-primary)',
    color: 'var(--text-primary)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default ThemeToggle;
