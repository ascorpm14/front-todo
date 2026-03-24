import { useState } from 'react';
import { useApp } from './contexts/AppContext';
import UserSelector from './components/UserSelector';
import ThemeToggle from './components/ThemeToggle';
import TaskList from './components/TaskList';
import StatsDashboard from './components/StatsDashboard';
import './styles/main.css';

function App() {
  const { currentUser, setCurrentUser } = useApp();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserSelected = (user) => {
    setCurrentUser(user);
  };

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!currentUser) {
    return <UserSelector onUserSelected={handleUserSelected} />;
  }

  return (
    <div className="container">
      {/* Section Tâches (30%) */}
      <div className="tasks-section">
        <TaskList currentUser={currentUser} refreshTrigger={refreshKey} />
      </div>

      {/* Section Statistiques (70%) */}
      <div className="stats-section">
        <StatsDashboard currentUser={currentUser} refreshTrigger={refreshKey} />
      </div>

      {/* Footer */}
      <footer className="footer">
        <div>
          <strong>User:</strong> <span style={{
            color: currentUser.couleur === 'rouge' ? '#ff6b6b' : '#5fa8d3',
            fontWeight: 'bold'
          }}>
            {currentUser.pseudo}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentUser(null)}
            style={{
              padding: '8px 16px',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Changer de user
          </button>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  );
}

export default App;
