import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ukrainian' | 'russian';

interface Translations {
  header: {
    title: string;
    themeToggle: string;
    languageSelector: string;
  };
    footer: {
      contact: string;
      feedback: string;
      feedbackText: string;
      copyright: string;
    };
  settings: {
    title: string;
    earnedBP: string;
    multiplier2x: string;
    multiplierVIP: string;
    selectTasks: string;
  };
    tasks: {
      title: string;
      completed: string;
      description: string;
      bpAward: string;
      markComplete: string;
      empty: string;
    };
    modal: {
      title: string;
      description: string;
      close: string;
    };
}

const translations: Record<Language, Translations> = {
  ukrainian: {
    header: {
      title: 'Трекер BP',
      themeToggle: 'Тема',
      languageSelector: 'Мова',
    },
    footer: {
      contact: 'Контакти',
      feedback: 'Зворотний зв\'язок',
      feedbackText: 'Ми завжди раді вашому зворотному зв\'язку та пропозиціям щодо покращення трекера.',
      copyright: '© 2024 Tracker BP. Всі права захищені.',
    },
    settings: {
      title: 'Зароблені BP',
      earnedBP: 'Всього зароблено',
      multiplier2x: '2x',
      multiplierVIP: 'VIP',
      selectTasks: 'Вибрати завдання',
    },
    tasks: {
      title: 'Список завдань',
      completed: 'Виконано',
      description: 'Опис',
      bpAward: 'BP',
      markComplete: 'Позначити виконаним',
      empty: 'Немає завдань',
    },
    modal: {
      title: 'Вибір завдань',
      description: 'Оберіть завдання, які ви хочете бачити в списку:',
      close: 'Закрити',
    },
  },
  russian: {
    header: {
      title: 'Трекер BP',
      themeToggle: 'Тема',
      languageSelector: 'Язык',
    },
    footer: {
      contact: 'Контакты',
      feedback: 'Обратная связь',
      feedbackText: 'Мы всегда рады вашей обратной связи и предложениям по улучшению трекера.',
      copyright: '© 2024 Tracker BP. Все права защищены.',
    },
    settings: {
      title: 'Заработанные BP',
      earnedBP: 'Всего заработано',
      multiplier2x: '2x',
      multiplierVIP: 'VIP',
      selectTasks: 'Выбрать задания',
    },
    tasks: {
      title: 'Список заданий',
      completed: 'Выполнено',
      description: 'Описание',
      bpAward: 'BP',
      markComplete: 'Отметить выполненным',
      empty: 'Нет заданий',
    },
    modal: {
      title: 'Выбор заданий',
      description: 'Выберите задания, которые вы хотите видеть в списке:',
      close: 'Закрыть',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ukrainian';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

