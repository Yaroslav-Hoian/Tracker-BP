import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/useLanguage';
import styles from './InitialBPModal.module.css';

interface InitialBPModalProps {
  initialBP: number;
  onSave: (bp: number) => void;
  onClose: () => void;
}

const InitialBPModal = ({ initialBP, onSave, onClose }: InitialBPModalProps) => {
  const { t } = useLanguage();
  const [bpValue, setBpValue] = useState(initialBP.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const handleSave = () => {
    const bp = parseInt(bpValue, 10);
    if (!isNaN(bp) && bp >= 0) {
      onSave(bp);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t.settings.setInitialBP}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <label className={styles.inputLabel}>
            {t.settings.initialBP}:
            <input
              ref={inputRef}
              type="number"
              min="0"
              value={bpValue}
              onChange={(e) => setBpValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.input}
              placeholder="0"
            />
          </label>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.saveButton} onClick={handleSave}>
            {t.settings.save}
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            {t.modal.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialBPModal;

