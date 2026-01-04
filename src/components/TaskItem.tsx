import { useState } from 'react';
import type { Task } from '../types/Task';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task;
  calculatedBP: number;
  onToggleComplete: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

const TaskItem = ({
  task,
  calculatedBP,
  onToggleComplete,
  onIncrement,
  onDecrement,
}: TaskItemProps) => {
  const { t } = useLanguage();
  const [showDescription, setShowDescription] = useState(false);

  const handleTaskClick = () => {
    setShowDescription(!showDescription);
  };

  const isMaxReached = task.currentCompletions >= task.maxCompletions;

  return (
    <div className={`${styles.taskItem} ${task.completed ? styles.taskItemCompleted : ''}`}>
      <div className={styles.taskHeader} onClick={handleTaskClick}>
        <div className={styles.taskMain}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            onClick={(e) => e.stopPropagation()}
            disabled={isMaxReached}
            className={styles.taskCheckbox}
            aria-label={t.tasks.markComplete}
          />
          <h3 className={`${styles.taskTitle} ${task.completed ? styles.taskTitleCompleted : ''}`}>{task.title}</h3>
          {task.maxCompletions > 1 && (
            <div className={styles.taskCounter}>
              <button
                className={styles.counterButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement(task.id);
                }}
                disabled={task.currentCompletions === 0}
                aria-label="Decrease counter"
              >
                −
              </button>
              <span className={styles.counterValue}>
                {task.currentCompletions} / {task.maxCompletions}
              </span>
              <button
                className={styles.counterButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement(task.id);
                }}
                disabled={isMaxReached || task.completed}
                aria-label="Increase counter"
              >
                +
              </button>
            </div>
          )}
        </div>
        <div className={styles.taskBp}>
          <span className={styles.bpValue}>{calculatedBP}</span>
          <span className={styles.bpLabel}>{t.tasks.bpAward}</span>
        </div>
      </div>
      {showDescription && (
        <div className={styles.taskDescription}>
          <p>{task.description}</p>
        </div>
      )}
    </div>
  );
};

export default TaskItem;

