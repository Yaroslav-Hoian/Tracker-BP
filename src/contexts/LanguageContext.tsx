import { createContext, useState } from "react";
import type { ReactNode } from "react";

type Language = "ukrainian" | "russian";

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
    setInitialBP: string;
    initialBP: string;
    save: string;
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
  shop: {
    title: string;
    buy: string;
    notEnoughBP: string;
    purchased: string;
    openShop: string;
  };
}

const translations: Record<Language, Translations> = {
  ukrainian: {
    header: {
      title: "Трекер BP",
      themeToggle: "Тема",
      languageSelector: "Мова",
    },
    footer: {
      contact: "Контакти",
      feedback: "Зворотний зв'язок",
      feedbackText:
        "Ми завжди раді вашому зворотному зв'язку та пропозиціям щодо покращення трекера.",
      copyright: "© 2026 Tracker BP. Всі права захищені.",
    },
    settings: {
      title: "Зароблені BP",
      earnedBP: "Всього зароблено",
      multiplier2x: "2x",
      multiplierVIP: "VIP",
      selectTasks: "Вибрати завдання",
      setInitialBP: "Встановити початкові BP",
      initialBP: "Початкові BP",
      save: "Зберегти",
    },
    tasks: {
      title: "Список завдань",
      completed: "Виконано",
      description: "Опис",
      bpAward: "BP",
      markComplete: "Позначити виконаним",
      empty: "Немає завдань",
    },
    modal: {
      title: "Вибір завдань",
      description: "Оберіть завдання, які ви хочете бачити в списку:",
      close: "Закрити",
    },
    shop: {
      title: "Магазин",
      buy: "Купити",
      notEnoughBP: "Недостатньо BP",
      purchased: "Куплено",
      openShop: "Магазин",
    },
  },
  russian: {
    header: {
      title: "Трекер BP",
      themeToggle: "Тема",
      languageSelector: "Язык",
    },
    footer: {
      contact: "Контакты",
      feedback: "Обратная связь",
      feedbackText:
        "Мы всегда рады вашей обратной связи и предложениям по улучшению трекера.",
      copyright: "© 2026 Tracker BP. Все права защищены.",
    },
    settings: {
      title: "Заработанные BP",
      earnedBP: "Всего заработано",
      multiplier2x: "2x",
      multiplierVIP: "VIP",
      selectTasks: "Выбрать задания",
      setInitialBP: "Установить начальные BP",
      initialBP: "Начальные BP",
      save: "Сохранить",
    },
    tasks: {
      title: "Список заданий",
      completed: "Выполнено",
      description: "Описание",
      bpAward: "BP",
      markComplete: "Отметить выполненным",
      empty: "Нет заданий",
    },
    modal: {
      title: "Выбор заданий",
      description: "Выберите задания, которые вы хотите видеть в списке:",
      close: "Закрыть",
    },
    shop: {
      title: "Магазин",
      buy: "Купить",
      notEnoughBP: "Недостаточно BP",
      purchased: "Куплено",
      openShop: "Магазин",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "ukrainian";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
