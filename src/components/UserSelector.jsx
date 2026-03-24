import { useState } from 'react';
import { getOrCreateUser } from '../utils/api';
import { useApp } from '../contexts/AppContext';

const UserSelector = ({ onUserSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectUser = async (pseudo) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOrCreateUser(pseudo);
      onUserSelected(response.data);
    } catch (err) {
      setError('Erreur lors de la sélection du user');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.card}>
        <h1 style={styles.title}>Gestionnaire de Tâches</h1>
        <p style={styles.subtitle}>Sélectionnez votre pseudo</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.buttonGroup}>
          <button
            style={styles.tojoBtn}
            onClick={() => handleSelectUser('Tojo')}
            disabled={isLoading}
          >
            🔴 Tojo
          </button>
          <button
            style={styles.mendrikaBtn}
            onClick={() => handleSelectUser('Mendrika')}
            disabled={isLoading}
          >
            🔵 Mendrika
          </button>
        </div>
        
        {isLoading && <p style={styles.loading}>Chargement...</p>}
      </div>
    </div>
  );
};

const styles = {
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  card: {
    background: 'var(--bg-secondary)',
    padding: '48px',
    borderRadius: '16px',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: 'var(--shadow)',
    animation: 'fadeIn 0.5s ease-out',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: 'var(--text-primary)',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    marginBottom: '32px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  tojoBtn: {
    flex: 1,
    padding: '12px 24px',
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  mendrikaBtn: {
    flex: 1,
    padding: '12px 24px',
    background: '#5fa8d3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  error: {
    color: '#ff6b6b',
    marginBottom: '16px',
    padding: '8px',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '4px',
  },
  loading: {
    color: 'var(--text-secondary)',
    marginTop: '16px',
  },
};

export default UserSelector;
