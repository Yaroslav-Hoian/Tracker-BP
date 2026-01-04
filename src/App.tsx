import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BPSettings from './components/BPSettings';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import ShopSidebar from './components/ShopSidebar';
import InitialBPModal from './components/InitialBPModal';
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
            bpAwarded: task.bpAwarded !== undefined ? task.bpAwarded : false,
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to read tasks from localStorage:', error);
    }
    return initialTasks;
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showInitialBPModal, setShowInitialBPModal] = useState(false);
  const [multiplier2x, setMultiplier2x] = useState(false);
  const [multiplierVIP, setMultiplierVIP] = useState(false);
  const [initialBP, setInitialBP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('initialBP');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [spentBP, setSpentBP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('spentBP');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Check for daily reset at 7 AM Kyiv time
  useEffect(() => {
    const checkReset = () => {
      if (shouldReset()) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => ({
            ...task,
            currentCompletions: 0,
            completed: false,
            bpAwarded: false,
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

  // Save initialBP to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('initialBP', initialBP.toString());
    } catch (error) {
      console.warn('Failed to save initialBP:', error);
    }
  }, [initialBP]);

  // Save spentBP to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spentBP', spentBP.toString());
    } catch (error) {
      console.warn('Failed to save spentBP:', error);
    }
  }, [spentBP]);

  // Calculate earned BP - нараховується тільки один раз при досягненні 5+ виконань (або maxCompletions якщо менше 5)
  // Для одноразових місій (maxCompletions === 1) нараховується при відмітці як виконана
  const calculateEarnedBP = (): number => {
    return tasks.reduce((total, task) => {
      // Для одноразових місій - нараховуємо при відмітці як виконана
      if (task.maxCompletions === 1 && task.completed && task.bpAwarded) {
        return total + task.baseBP;
      }
      // Для завдань з maxCompletions >= 5: нараховуємо BP тільки один раз коли досягнуто 5+ виконань
      // Для завдань з maxCompletions < 5: нараховуємо BP коли досягнуто maxCompletions
      const threshold = task.maxCompletions >= 5 ? 5 : task.maxCompletions;
      
      if (task.currentCompletions >= threshold && task.bpAwarded) {
        return total + task.baseBP;
      }
      return total;
    }, 0);
  };

  const earnedBP = calculateEarnedBP();
  const totalBP = initialBP + earnedBP - spentBP;

  // Filter visible tasks
  const visibleTasks = tasks.filter((task) => task.visible);

  const handleToggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          // If task is at max completions, it should always be completed
          if (task.currentCompletions >= task.maxCompletions) {
            const newCompleted = true;
            // Для одноразових місій нараховуємо BP при відмітці як виконана
            const shouldAwardBP = task.maxCompletions === 1 && newCompleted && !task.bpAwarded;
            return { 
              ...task, 
              completed: newCompleted,
              bpAwarded: shouldAwardBP ? true : task.bpAwarded
            };
          }
          const newCompleted = !task.completed;
          // Для одноразових місій нараховуємо BP при відмітці як виконана
          const shouldAwardBP = task.maxCompletions === 1 && newCompleted && !task.bpAwarded;
          // Скидаємо bpAwarded якщо зняли відмітку
          const shouldResetAward = task.maxCompletions === 1 && !newCompleted && task.bpAwarded;
          return { 
            ...task, 
            completed: newCompleted,
            bpAwarded: shouldAwardBP ? true : (shouldResetAward ? false : task.bpAwarded)
          };
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
          // Визначаємо поріг для нарахування BP (5+ або maxCompletions якщо менше 5)
          const threshold = task.maxCompletions >= 5 ? 5 : task.maxCompletions;
          const shouldAwardBP = newCompletions >= threshold && !task.bpAwarded;
          
          return {
            ...task,
            currentCompletions: newCompletions,
            completed: isMaxReached ? true : task.completed,
            bpAwarded: shouldAwardBP ? true : task.bpAwarded,
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
          const threshold = task.maxCompletions >= 5 ? 5 : task.maxCompletions;
          // Скидаємо bpAwarded якщо виконання стало менше порогу
          const shouldResetAward = newCompletions < threshold && task.bpAwarded;
          
          return {
            ...task,
            currentCompletions: newCompletions,
            completed: newCompletions < task.maxCompletions ? false : task.completed,
            bpAwarded: shouldResetAward ? false : task.bpAwarded,
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
        <Header onShopClick={() => setShowShop(true)} />
        <main className="main-content">
          <div className="container">
            <BPSettings
              earnedBP={totalBP}
              multiplier2x={multiplier2x}
              multiplierVIP={multiplierVIP}
              onMultiplier2xChange={setMultiplier2x}
              onMultiplierVIPChange={setMultiplierVIP}
              onSelectTasksClick={() => setShowTaskModal(true)}
              onInitialBPClick={() => setShowInitialBPModal(true)}
            />
            <TaskList
              tasks={visibleTasks}
              multiplier2x={multiplier2x}
              multiplierVIP={multiplierVIP}
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
            multiplier2x={multiplier2x}
            multiplierVIP={multiplierVIP}
            onClose={() => setShowTaskModal(false)}
            onToggleVisibility={handleToggleVisibility}
          />
        )}
        <ShopSidebar
          earnedBP={totalBP}
          onPurchase={(_itemId: string, price: number) => {
            setSpentBP((prev) => prev + price);
          }}
          isOpen={showShop}
          onClose={() => setShowShop(false)}
        />
        {showInitialBPModal && (
          <InitialBPModal
            initialBP={initialBP}
            onSave={(bp: number) => {
              setInitialBP(bp);
              setShowInitialBPModal(false);
            }}
            onClose={() => setShowInitialBPModal(false)}
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
