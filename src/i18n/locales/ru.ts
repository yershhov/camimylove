import type { TranslationSchema } from "./en";

const ruTranslation = {
  auth: {
    promptDate: "Когда мы начали встречаться?",
    promptPetName: "Какое первое ласковое прозвище мы использовали?",
    invalidAnswers: "Эти ответы неверны. Попробуй ещё раз.",
    submit: "Войти",
    submitting: "Проверка...",
  },
  common: {
    back: "Назад",
    backHome: "Назад на главную",
    retrySoon: "Попробуй снова через несколько секунд.",
    verify: "Проверка...",
    actions: {
      cancel: "Отмена",
      close: "Закрыть",
      delete: "Удалить",
      deleting: "Удаление...",
      edit: "Изменить",
      save: "Сохранить",
      saving: "Сохранение...",
    },
  },
  gallery: {
    title: "Галерея",
    openUpload: "Открыть страницу загрузки",
    memoryAlt: "Воспоминание {{id}}",
  },
  home: {
    cards: {
      gallery: "Галерея",
      randomMemories: "Случайные воспоминания",
      upload: "Добавить воспоминания",
      quiz: "Квиз к 1-й годовщине",
      legacy: "Вспомнить, как это было",
      settings: "Настройки",
      logout: "Выйти",
    },
    loggingOut: "Выход...",
    womensDayTitle: "Happy Women's Day, Baby!",
    womensDaySubtitle: "And Happy Monthiversary <3",
  },
  maintenance: {
    title: "Сайт временно на техническом обслуживании.",
    placeholder: "Пароль администратора",
    invalidPassword: "Неверный пароль.",
    connectionError: "Ошибка соединения. Попробуй ещё раз.",
    submit: "Разблокировать",
  },
  memories: {
    title: "Наши воспоминания",
    next: "Показать другое воспоминание",
    loadError: "Ошибка, ой :(",
    deleteDialog: {
      title: "Удалить это воспоминание?",
      body:
        "Это воспоминание будет удалено навсегда и не сможет быть восстановлено.",
      confirm: "Подтверждаю, что хочу удалить это воспоминание навсегда.",
      errorTitle: "Не удалось удалить воспоминание",
      errorFallback: "Попробуй ещё раз через минуту.",
    },
  },
  settings: {
    title: "Настройки",
    languageLabel: "Язык",
    languageHelp:
      "При первом открытии приложение использует язык браузера, а затем сохраняет твой явный выбор.",
    languageSaved: "Язык обновлён",
    exclusions:
      "Страницы legacy и quiz намеренно остаются только на итальянском, потому что они предназначены для очень маленькой заранее выбранной группы пользователей.",
  },
  upload: {
    createTitle: "Добавить новое воспоминание",
    editTitle: "Изменить это воспоминание",
    dragAndDrop: "Перетащи фото сюда или нажми, чтобы выбрать его",
    supportedFormats: "Поддерживаемые форматы: HEIC, JPG, JPEG, PNG",
    previewAlt: "Предпросмотр",
    dateOptional: "Дата (необязательно)",
    locationOptional: "Место (необязательно)",
    locationPlaceholder: "Например, Jesolo, Via Dante Alighieri",
    invalidMemoryTitle: "Недопустимое воспоминание",
    invalidMemoryDescription: "Недопустимый ID воспоминания для редактирования.",
    loadErrorTitle: "Ошибка загрузки",
    loadMemoryError: "Не удалось загрузить воспоминание",
    memoryNotFound: "Воспоминание не найдено",
    heicErrorTitle: "Ошибка преобразования HEIC",
    unsupportedFileTitle: "Неподдерживаемый формат",
    heicErrorDescription:
      "Не удалось преобразовать этот файл HEIC :( Попробуй экспортировать его как JPG или PNG и загрузить снова.",
    unsupportedFileDescription:
      "Загрузи файл HEIC, JPG, JPEG или PNG.",
    updateSuccessTitle: "Воспоминание обновлено",
    updateSuccessDescription: "Твои изменения сохранены.",
    updateErrorTitle: "Не удалось обновить",
    saveErrorTitle: "Не удалось загрузить",
    saveSuccessTitle: "Воспоминание сохранено",
  },
} satisfies TranslationSchema;

export default ruTranslation;
