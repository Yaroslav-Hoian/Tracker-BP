import { useEffect } from 'react';
import type { Task } from '../types/Task';
import { useLanguage } from '../contexts/useLanguage';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  tasks: Task[];
  multiplier2x: boolean;
  multiplierVIP: boolean;
  onClose: () => void;
  onToggleVisibility: (id: string) => void;
}

const TaskModal = ({ tasks, multiplier2x, multiplierVIP, onClose, onToggleVisibility }: TaskModalProps) => {
  const { t } = useLanguage();
  
  const multiplier = (multiplier2x ? 2 : 1) * (multiplierVIP ? 2 : 1);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t.modal.title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>{t.modal.description}</p>
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <label className={styles.taskLabel}>
                  <input
                    type="checkbox"
                    checked={task.visible}
                    onChange={() => onToggleVisibility(task.id)}
                    className={styles.taskCheckbox}
                  />
                  <span className={styles.taskTitle}>{task.title}</span>
                  <span className={styles.taskBP}>{Math.round(task.baseBP * multiplier)} BP</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.saveButton} onClick={onClose}>
            {t.modal.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

