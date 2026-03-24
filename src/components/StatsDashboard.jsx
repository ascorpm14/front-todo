import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  RadialLinearScale,
  Legend,
  Tooltip,
} from 'chart.js';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { getUserStats, getChartData, getUsers } from '../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  RadialLinearScale,
  Legend,
  Tooltip
);

const StatsDashboard = ({ currentUser, refreshTrigger }) => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadUsers();
  }, [currentUser, refreshTrigger]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const res = await getUserStats(currentUser._id);
      setStats(res.data);

      const chartRes = await getChartData(currentUser._id);
      setChartData(chartRes.data);
    } catch (err) {
      console.error('Erreur stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Erreur users:', err);
    }
  };

  const getRival = () => {
    return users.find(u => u._id !== currentUser._id);
  };

  const rival = getRival();
  const leadDifference = stats ? stats.tachesCompletes - (rival?.tachesCompletes || 0) : 0;

  const barChartData = chartData ? {
    labels: chartData.labels,
    datasets: [
      {
        label: `${currentUser.pseudo} (${currentUser.couleur})`,
        data: chartData.completed,
        backgroundColor: currentUser.couleur === 'rouge' ? '#ff6b6b' : '#5fa8d3',
        borderRadius: 8,
      },
    ],
  } : null;

  const lineChartData = chartData ? {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Importance moyenne',
        data: chartData.importance,
        borderColor: '#00d9ff',
        backgroundColor: 'rgba(0, 217, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Statistiques</h2>

      {isLoading ? (
        <p style={styles.loading}>Chargement...</p>
      ) : !stats ? (
        <p>Erreur lors du chargement</p>
      ) : (
        <>
          {/* SECTION COMPÉTITION */}
          <div style={styles.competitionCard}>
            <h3 style={styles.competitionTitle}>🏆 Compétition</h3>
            <div style={styles.scoreBoard}>
              <div style={styles.scoreBox}>
                <p style={styles.scoreLabel}>{currentUser.pseudo}</p>
                <p style={{ ...styles.scoreNumber, color: currentUser.couleur === 'rouge' ? '#ff6b6b' : '#5fa8d3' }}>
                  {stats.tachesCompletes}
                </p>
              </div>
              <div style={styles.vs}>vs</div>
              <div style={styles.scoreBox}>
                <p style={styles.scoreLabel}>{rival?.pseudo || 'N/A'}</p>
                <p style={{ ...styles.scoreNumber, color: rival?.couleur === 'rouge' ? '#ff6b6b' : '#5fa8d3' }}>
                  {rival?.tachesCompletes || 0}
                </p>
              </div>
            </div>
            <p style={styles.competitionMessage}>
              {leadDifference > 0
                ? `🔥 ${currentUser.pseudo} menace ${rival?.pseudo} avec ${Math.abs(leadDifference)} tâche(s) d'avance!`
                : leadDifference < 0
                ? `⚡ ${rival?.pseudo} mène avec ${Math.abs(leadDifference)} tâche(s)!`
                : `⚖️ Égalité parfaite entre ${currentUser.pseudo} et ${rival?.pseudo}!`}
            </p>
          </div>

          {/* STATISTIQUES GLOBALES */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total tâches</p>
              <p style={styles.statValue}>{stats.totalTaches}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Complétées cette semaine</p>
              <p style={styles.statValue}>{stats.completedThisWeek}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Importance moy.</p>
              <p style={styles.statValue}>{stats.moyenneImportance.toFixed(1)}</p>
            </div>
          </div>

          {/* GRAPHIQUES */}
          {barChartData && (
            <div style={styles.chartContainer}>
              <h4 style={styles.chartTitle}>Tâches complétées par jour</h4>
              <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          )}

          {lineChartData && (
            <div style={styles.chartContainer}>
              <h4 style={styles.chartTitle}>Importance moyenne (7 jours)</h4>
              <Line data={lineChartData} options={{ responsive: true }} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    color: 'var(--text-primary)',
    fontSize: '20px',
    marginBottom: '8px',
  },
  competitionCard: {
    background: 'var(--bg-primary)',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid var(--accent-primary)',
  },
  competitionTitle: {
    color: 'var(--accent-primary)',
    margin: '0 0 12px 0',
  },
  scoreBoard: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  scoreBox: {
    flex: 1,
    textAlign: 'center',
    padding: '12px',
    background: 'var(--bg-tertiary)',
    borderRadius: '8px',
  },
  scoreLabel: {
    margin: '0 0 4px 0',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  scoreNumber: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
  },
  vs: {
    color: 'var(--text-secondary)',
    fontWeight: 'bold',
  },
  competitionMessage: {
    margin: '12px 0 0 0',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  statCard: {
    background: 'var(--bg-primary)',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid var(--border-color)',
  },
  statLabel: {
    margin: '0 0 4px 0',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  statValue: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--accent-primary)',
  },
  chartContainer: {
    background: 'var(--bg-primary)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  chartTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  loading: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
};

export default StatsDashboard;
