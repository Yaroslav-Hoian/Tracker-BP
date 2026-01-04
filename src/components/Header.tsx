import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './Header.module.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.headerTitle}>{t.header.title}</h1>
        <div className={styles.headerControls}>
          <div className={styles.controlGroup}>
            <label htmlFor="theme-toggle" className={styles.controlLabel}>
              {t.header.themeToggle}:
            </label>
            <button
              id="theme-toggle"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="language-select" className={styles.controlLabel}>
              {t.header.languageSelector}:
            </label>
            <select
              id="language-select"
              className={styles.languageSelect}
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ukrainian' | 'russian')}
            >
              <option value="ukrainian">Українська</option>
              <option value="russian">Русский</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

