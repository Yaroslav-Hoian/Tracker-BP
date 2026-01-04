import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/useLanguage';
import type { ShopItem } from '../types/ShopItem';
import { shopItems } from '../data/shopItems';
import styles from './ShopSidebar.module.css';

interface ShopSidebarProps {
  earnedBP: number;
  onPurchase: (itemId: string, price: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ShopSidebar = ({ earnedBP, onPurchase, isOpen, onClose }: ShopSidebarProps) => {
  const { t, language } = useLanguage();
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('purchasedItems');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  
  // Зберігаємо час покупки для кожного товару
  const [purchaseTimes, setPurchaseTimes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('purchaseTimes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('purchasedItems', JSON.stringify([...purchasedItems]));
    } catch (error) {
      console.warn('Failed to save purchased items:', error);
    }
  }, [purchasedItems]);

  useEffect(() => {
    try {
      localStorage.setItem('purchaseTimes', JSON.stringify(purchaseTimes));
    } catch (error) {
      console.warn('Failed to save purchase times:', error);
    }
  }, [purchaseTimes]);

  // Перевіряємо чи пройшло 5 хвилин з моменту покупки
  const isItemAvailable = (itemId: string): boolean => {
    if (!purchasedItems.has(itemId)) return true;
    const purchaseTime = purchaseTimes[itemId];
    if (!purchaseTime) return false;
    const fiveMinutes = 5 * 60 * 1000; // 5 хвилин в мілісекундах
    return Date.now() - purchaseTime >= fiveMinutes;
  };

  // Отримуємо час доступності товару
  const getTimeUntilAvailable = (itemId: string): number => {
    if (!purchasedItems.has(itemId)) return 0;
    const purchaseTime = purchaseTimes[itemId];
    if (!purchaseTime) return 0;
    const fiveMinutes = 5 * 60 * 1000;
    const elapsed = Date.now() - purchaseTime;
    const remaining = fiveMinutes - elapsed;
    return Math.max(0, Math.ceil(remaining / 1000)); // повертаємо секунди
  };

  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  // Оновлюємо таймери кожну секунду
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: Record<string, number> = {};
      shopItems.forEach((item) => {
        if (purchasedItems.has(item.id)) {
          newTimeRemaining[item.id] = getTimeUntilAvailable(item.id);
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [purchasedItems, purchaseTimes]);

  const handlePurchase = (item: ShopItem) => {
    if (earnedBP >= item.price && isItemAvailable(item.id)) {
      onPurchase(item.id, item.price);
      setPurchasedItems((prev) => new Set([...prev, item.id]));
      setPurchaseTimes((prev) => ({ ...prev, [item.id]: Date.now() }));
    }
  };

  const getItemName = (item: ShopItem) => {
    return language === 'ukrainian' ? item.name : item.nameRu;
  };

  const getItemDescription = (item: ShopItem) => {
    return language === 'ukrainian' ? item.description : item.descriptionRu;
  };

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>{t.shop.title}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className={styles.sidebarContent}>
          {shopItems.map((item) => {
            const isPurchased = purchasedItems.has(item.id);
            const isAvailable = isItemAvailable(item.id);
            const canAfford = earnedBP >= item.price;
            const timeLeft = timeRemaining[item.id] || 0;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            return (
              <div key={item.id} className={styles.shopItem}>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{getItemName(item)}</h3>
                  <p className={styles.itemDescription}>{getItemDescription(item)}</p>
                  <div className={styles.itemPrice}>{item.price} BP</div>
                </div>
                {isPurchased && !isAvailable && (
                  <div className={styles.timer}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </div>
                )}
                <button
                  className={`${styles.buyButton} ${
                    isPurchased && !isAvailable ? styles.buyButtonPurchased : ''
                  } ${!canAfford && !isPurchased ? styles.buyButtonDisabled : ''}`}
                  onClick={() => handlePurchase(item)}
                  disabled={(!isAvailable && isPurchased) || !canAfford}
                >
                  {isPurchased && !isAvailable 
                    ? `${minutes}:${seconds.toString().padStart(2, '0')}` 
                    : isPurchased && isAvailable 
                    ? t.shop.buy 
                    : t.shop.buy}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ShopSidebar;

