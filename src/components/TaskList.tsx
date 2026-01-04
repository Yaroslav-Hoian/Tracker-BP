import type { Task } from '../types/Task';
import { useLanguage } from '../contexts/LanguageContext';
import TaskItem from './TaskItem';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

const TaskList = ({
  tasks,
  onToggleComplete,
  onIncrement,
  onDecrement,
}: TaskListProps) => {
  const { t } = useLanguage();

  return (
    <div className={styles.taskList}>
      <h2 className={styles.taskListTitle}>{t.tasks.title}</h2>
      {tasks.length === 0 ? (
        <p className={styles.taskListEmpty}>{t.tasks.empty}</p>
      ) : (
        <div className={styles.taskListItems}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              calculatedBP={task.baseBP}
              onToggleComplete={onToggleComplete}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;

