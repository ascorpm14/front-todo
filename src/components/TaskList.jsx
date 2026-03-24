import { useState, useEffect } from 'react';
import { getAllTasks, createTask, completeTask, deleteTask } from '../utils/api';

const TaskList = ({ currentUser, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskImportance, setNewTaskImportance] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await getAllTasks();
      setTasks(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask({
        titre: newTaskTitle,
        importance: parseInt(newTaskImportance),
        userId: currentUser._id,
      });
      setNewTaskTitle('');
      setNewTaskImportance(3);
      loadTasks();
    } catch (err) {
      setError('Erreur lors de la création de la tâche');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId, currentUser._id);
      loadTasks();
    } catch (err) {
      setError('Erreur lors de la complétion de la tâche');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Tâches</h2>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleAddTask} style={styles.form}>
        <input
          type="text"
          placeholder="Nouvelle tâche..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={styles.input}
        />
        <select
          value={newTaskImportance}
          onChange={(e) => setNewTaskImportance(e.target.value)}
          style={styles.select}
        >
          {[1, 2, 3, 4, 5].map(i => (
            <option key={i} value={i}>{i === 1 ? '🟢' : i === 5 ? '🔴' : '🟡'} {i}</option>
          ))}
        </select>
        <button type="submit" style={styles.addBtn}>➕ Ajouter</button>
      </form>

      {isLoading ? (
        <p style={styles.loading}>Chargement...</p>
      ) : tasks.length === 0 ? (
        <p style={styles.empty}>Aucune tâche</p>
      ) : (
        <div style={styles.taskList}>
          {tasks.map(task => (
            <div
              key={task._id}
              style={{
                ...styles.taskItem,
                borderLeftColor: task.userId?.couleur === 'rouge' ? '#ff6b6b' : '#5fa8d3',
                opacity: task.status === 'completed' ? 0.6 : 1,
              }}
            >
              <div style={styles.taskHeader}>
                <h4 style={styles.taskTitle}>{task.titre}</h4>
                <div style={styles.importanceIcon}>
                  {task.importance === 1 ? '🟢' : task.importance === 5 ? '🔴' : '🟡'}
                </div>
              </div>

              <p style={styles.taskUser}>by {task.userId?.pseudo || 'Unknown'}</p>

              {task.status === 'completed' && (
                <p style={styles.completed}>✅ Complété par {task.completedBy?.pseudo}</p>
              )}

              <div style={styles.taskActions}>
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleCompleteTask(task._id)}
                    style={styles.checkBtn}
                  >
                    ✓ Cocher
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={styles.deleteBtn}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
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
  form: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  select: {
    padding: '10px 8px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
  },
  addBtn: {
    padding: '10px 16px',
    background: 'var(--accent-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  taskItem: {
    background: 'var(--bg-primary)',
    padding: '12px',
    borderRadius: '8px',
    borderLeft: '4px solid',
    animation: 'fadeIn 0.3s ease-out',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  taskTitle: {
    margin: 0,
    color: 'var(--text-primary)',
  },
  importanceIcon: {
    fontSize: '16px',
  },
  taskUser: {
    margin: '4px 0',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  completed: {
    margin: '4px 0',
    fontSize: '12px',
    color: '#4caf50',
  },
  taskActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  checkBtn: {
    padding: '6px 10px',
    background: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 10px',
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  error: {
    color: '#ff6b6b',
    padding: '8px',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '4px',
  },
  loading: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    padding: '24px',
  },
};

export default TaskList;
