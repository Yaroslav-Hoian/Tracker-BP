import { useLanguage } from '../contexts/useLanguage';
import styles from './Footer.module.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>{t.footer.contact}</h3>
          <p className={styles.footerText}>
            Email: <a href="mailto:feedback@tracker-bp.com">feedback@tracker-bp.com</a>
          </p>
          <p className={styles.footerText}>
            Discord: <a href="https://discord.gg/tracker-bp" target="_blank" rel="noopener noreferrer">Tracker BP Server</a>
          </p>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>{t.footer.feedback}</h3>
          <p className={styles.footerText}>
            {t.footer.feedbackText}
          </p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>{t.footer.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;

