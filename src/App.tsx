import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BPSettings from './components/BPSettings';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import type { Task } from './types/Task';
import { initialTasks } from './data/tasks';
import { shouldReset, markResetDone } from './utils/resetUtils';
import './App.css';

function AppContent() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('tasks');
      if (saved) {
        const parsedTasks = JSON.parse(saved);
        // Validate that parsed data is an array
        if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
          // Ensure all tasks have visible property
          return parsedTasks.map((task: Task) => ({
            ...task,
            visible: task.visible !== undefined ? task.visible : true,
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to read tasks from localStorage:', error);
    }
    return initialTasks;
  });

  const [showTaskModal, setShowTaskModal] = useState(false);

  // Check for daily reset at 7 AM Kyiv time
  useEffect(() => {
    const checkReset = () => {
      if (shouldReset()) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => ({
            ...task,
            currentCompletions: 0,
            completed: false,
          }))
        );
        markResetDone();
      }
    };

    // Check immediately on mount
    checkReset();

    // Check every minute
    const interval = setInterval(checkReset, 60000);

    return () => clearInterval(interval);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  // Calculate earned BP
  const calculateEarnedBP = (): number => {
    return tasks.reduce((total, task) => {
      if (task.completed || task.currentCompletions > 0) {
        const bpPerCompletion = task.baseBP;
        const completions = task.completed ? task.maxCompletions : task.currentCompletions;
        return total + (bpPerCompletion * completions);
      }
      return total;
    }, 0);
  };

  const earnedBP = calculateEarnedBP();

  // Filter visible tasks
  const visibleTasks = tasks.filter((task) => task.visible);

  const handleToggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          // If task is at max completions, it should always be completed
          if (task.currentCompletions >= task.maxCompletions) {
            return { ...task, completed: true };
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const handleIncrement = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const newCompletions = Math.min(
            task.currentCompletions + 1,
            task.maxCompletions
          );
          const isMaxReached = newCompletions >= task.maxCompletions;
          return {
            ...task,
            currentCompletions: newCompletions,
            completed: isMaxReached ? true : task.completed,
          };
        }
        return task;
      })
    );
  };

  const handleDecrement = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const newCompletions = Math.max(task.currentCompletions - 1, 0);
          return {
            ...task,
            currentCompletions: newCompletions,
            completed: newCompletions < task.maxCompletions ? false : task.completed,
          };
        }
        return task;
      })
    );
  };

  const handleToggleVisibility = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return { ...task, visible: !task.visible };
        }
        return task;
      })
    );
  };

  return (
    <LanguageProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <BPSettings
              earnedBP={earnedBP}
              onSelectTasksClick={() => setShowTaskModal(true)}
            />
            <TaskList
              tasks={visibleTasks}
              onToggleComplete={handleToggleComplete}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          </div>
        </main>
        <Footer />
        {showTaskModal && (
          <TaskModal
            tasks={tasks}
            onClose={() => setShowTaskModal(false)}
            onToggleVisibility={handleToggleVisibility}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
