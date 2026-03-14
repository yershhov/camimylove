import type { TranslationSchema } from "./en";

const ukTranslation = {
  auth: {
    promptDate: "Коли ми почали зустрічатися?",
    promptPetName: "Яке перше лагідне прізвисько ми використовували?",
    invalidAnswers: "Ці відповіді неправильні. Спробуй ще раз.",
    submit: "Увійти",
    submitting: "Перевірка...",
  },
  common: {
    back: "Назад",
    backHome: "Назад на головну",
    retrySoon: "Спробуй ще раз за кілька секунд.",
    verify: "Перевірка...",
    actions: {
      cancel: "Скасувати",
      close: "Закрити",
      delete: "Видалити",
      deleting: "Видалення...",
      edit: "Редагувати",
      save: "Зберегти",
      saving: "Збереження...",
    },
  },
  gallery: {
    title: "Галерея",
    openUpload: "Відкрити сторінку завантаження",
    memoryAlt: "Спогад {{id}}",
  },
  home: {
    cards: {
      gallery: "Галерея",
      randomMemories: "Випадкові спогади",
      upload: "Додати спогади",
      quiz: "Вікторина до 1-ї річниці",
      legacy: "Згадати, як це було",
      settings: "Налаштування",
      logout: "Вийти",
    },
    loggingOut: "Вихід...",
    womensDayTitle: "Happy Women's Day, Baby!",
    womensDaySubtitle: "And Happy Monthiversary <3",
  },
  maintenance: {
    title: "Сайт тимчасово на технічному обслуговуванні.",
    placeholder: "Пароль адміністратора",
    invalidPassword: "Неправильний пароль.",
    connectionError: "Помилка з'єднання. Спробуй ще раз.",
    submit: "Розблокувати",
  },
  memories: {
    title: "Наші спогади",
    next: "Показати інший спогад",
    loadError: "Помилка, ой :(",
    deleteDialog: {
      title: "Видалити цей спогад?",
      body: "Цей спогад буде видалено назавжди, і його не можна буде відновити.",
      confirm: "Підтверджую, що хочу назавжди видалити цей спогад.",
      errorTitle: "Не вдалося видалити спогад",
      errorFallback: "Спробуй ще раз за мить.",
    },
  },
  settings: {
    title: "Налаштування",
    languageLabel: "Мова",
    languageHelp:
      "Уперше застосунок використовує мову браузера, а потім зберігає твій явний вибір.",
    languageSaved: "Мову оновлено",
    exclusions:
      "Сторінки legacy і quiz навмисно залишаються лише італійською, бо вони призначені для дуже маленької попередньо відібраної групи користувачів.",
  },
  upload: {
    createTitle: "Додати новий спогад",
    editTitle: "Редагувати цей спогад",
    dragAndDrop: "Перетягни фото сюди або натисни, щоб вибрати його",
    supportedFormats: "Підтримувані формати: HEIC, JPG, JPEG, PNG",
    previewAlt: "Попередній перегляд",
    dateOptional: "Дата (необов'язково)",
    locationOptional: "Місце (необов'язково)",
    locationPlaceholder: "Наприклад, Jesolo, Via Dante Alighieri",
    invalidMemoryTitle: "Некоректний спогад",
    invalidMemoryDescription: "Некоректний ID спогаду для редагування.",
    loadErrorTitle: "Помилка завантаження",
    loadMemoryError: "Не вдалося завантажити спогад",
    memoryNotFound: "Спогад не знайдено",
    heicErrorTitle: "Помилка перетворення HEIC",
    unsupportedFileTitle: "Непідтримуваний формат",
    heicErrorDescription:
      "Не вдалося перетворити цей файл HEIC :( Спробуй експортувати його як JPG або PNG і завантажити знову.",
    unsupportedFileDescription:
      "Завантаж файл HEIC, JPG, JPEG або PNG.",
    updateSuccessTitle: "Спогад оновлено",
    updateSuccessDescription: "Твої зміни збережено.",
    updateErrorTitle: "Не вдалося оновити",
    saveErrorTitle: "Не вдалося завантажити",
    saveSuccessTitle: "Спогад збережено",
  },
} satisfies TranslationSchema;

export default ukTranslation;
