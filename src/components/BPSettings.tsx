import { useLanguage } from '../contexts/useLanguage';
import styles from './BPSettings.module.css';

interface BPSettingsProps {
  earnedBP: number;
  multiplier2x: boolean;
  multiplierVIP: boolean;
  onMultiplier2xChange: (active: boolean) => void;
  onMultiplierVIPChange: (active: boolean) => void;
  onSelectTasksClick: () => void;
  onInitialBPClick: () => void;
}

const BPSettings = ({ 
  earnedBP, 
  multiplier2x, 
  multiplierVIP, 
  onMultiplier2xChange, 
  onMultiplierVIPChange, 
  onSelectTasksClick,
  onInitialBPClick 
}: BPSettingsProps) => {
  const { t } = useLanguage();

  const multiplier = (multiplier2x ? 2 : 1) * (multiplierVIP ? 2 : 1);
  const displayBP = Math.round(earnedBP * multiplier);

  return (
    <div className={styles.bpSettings}>
      <h2 className={styles.bpSettingsTitle}>{t.settings.title}</h2>
      <div className={styles.bpSettingsContent}>
        <div className={styles.bpEarned}>
          <span className={styles.bpEarnedLabel}>{t.settings.earnedBP}:</span>
          <span className={styles.bpEarnedValue}>{displayBP}</span>
        </div>
        <div className={styles.multiplierButtons}>
          <button
            className={`${styles.multiplierButton} ${multiplier2x ? styles.multiplierButtonActive : ''}`}
            onClick={() => onMultiplier2xChange(!multiplier2x)}
            aria-label="2x multiplier"
          >
            {t.settings.multiplier2x}
          </button>
          <button
            className={`${styles.multiplierButton} ${multiplierVIP ? styles.multiplierButtonActive : ''}`}
            onClick={() => onMultiplierVIPChange(!multiplierVIP)}
            aria-label="VIP multiplier"
          >
            {t.settings.multiplierVIP}
          </button>
        </div>
        <div className={styles.actionButtons}>
          <button
            className={styles.initialBPButton}
            onClick={onInitialBPClick}
            aria-label="Set initial BP"
          >
            {t.settings.setInitialBP}
          </button>
          <button
            className={styles.selectTasksButton}
            onClick={onSelectTasksClick}
            aria-label="Select tasks"
          >
            {t.settings.selectTasks}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BPSettings;

