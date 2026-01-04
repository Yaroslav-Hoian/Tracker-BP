import { useLanguage } from '../contexts/LanguageContext';
import styles from './BPSettings.module.css';

interface BPSettingsProps {
  earnedBP: number;
  onSelectTasksClick: () => void;
}

const BPSettings = ({ earnedBP, onSelectTasksClick }: BPSettingsProps) => {
  const { t } = useLanguage();

  return (
    <div className={styles.bpSettings}>
      <h2 className={styles.bpSettingsTitle}>{t.settings.title}</h2>
      <div className={styles.bpSettingsContent}>
        <div className={styles.bpEarned}>
          <span className={styles.bpEarnedLabel}>{t.settings.earnedBP}:</span>
          <span className={styles.bpEarnedValue}>{earnedBP}</span>
        </div>
        <button
          className={styles.selectTasksButton}
          onClick={onSelectTasksClick}
          aria-label="Select tasks"
        >
          {t.settings.selectTasks}
        </button>
      </div>
    </div>
  );
};

export default BPSettings;

