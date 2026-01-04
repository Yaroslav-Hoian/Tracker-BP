// Utility functions for daily reset at 7 AM Kyiv time

export const getKyivTime = (): { hours: number; date: string } => {
  // Get current time in Kyiv timezone
  const now = new Date();
  const kyivTimeString = now.toLocaleString('en-US', {
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  // Parse the string to get hours and date
  const [datePart, timePart] = kyivTimeString.split(', ');
  const [hour] = timePart.split(':');
  
  return {
    hours: parseInt(hour, 10),
    date: datePart,
  };
};

export const shouldReset = (): boolean => {
  try {
    const lastReset = localStorage.getItem('lastResetDate');
    if (!lastReset) return false; // Don't reset on first load
    
    const kyivTime = getKyivTime();
    
    // Check if it's a new day and past 7 AM
    const isNewDay = kyivTime.date !== lastReset;
    const isPast7AM = kyivTime.hours >= 7;
    
    return isNewDay && isPast7AM;
  } catch (error) {
    console.warn('Failed to check reset time:', error);
    return false;
  }
};

export const markResetDone = (): void => {
  try {
    const kyivTime = getKyivTime();
    localStorage.setItem('lastResetDate', kyivTime.date);
  } catch (error) {
    console.warn('Failed to mark reset done:', error);
  }
};
