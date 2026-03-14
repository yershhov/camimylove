const enTranslation = {
  auth: {
    promptDate: "When did we start dating?",
    promptPetName: "The first pet name we used?",
    invalidAnswers: "Those answers are not correct. Try again.",
    submit: "Enter",
    submitting: "Checking...",
  },
  common: {
    back: "Back",
    backHome: "Back home",
    retrySoon: "Try again in a few seconds.",
    verify: "Checking...",
    actions: {
      cancel: "Cancel",
      close: "Close",
      delete: "Delete",
      deleting: "Deleting...",
      edit: "Edit",
      save: "Save",
      saving: "Saving...",
    },
  },
  gallery: {
    title: "Gallery",
    openUpload: "Open upload page",
    memoryAlt: "Memory {{id}}",
  },
  home: {
    cards: {
      gallery: "Gallery",
      randomMemories: "Random memories",
      upload: "Add memories",
      quiz: "1st anniversary quiz",
      legacy: "Remember how it was",
      settings: "Settings",
      logout: "Logout",
    },
    loggingOut: "Logging out...",
    womensDayTitle: "Happy Women's Day, Baby!",
    womensDaySubtitle: "And Happy Monthiversary <3",
  },
  maintenance: {
    title: "Site temporarily under maintenance.",
    placeholder: "Admin password",
    invalidPassword: "Invalid password.",
    connectionError: "Connection error. Try again.",
    submit: "Unlock",
  },
  memories: {
    title: "Our memories",
    next: "Show another memory",
    loadError: "Error, oopsie :(",
    deleteDialog: {
      title: "Delete this memory?",
      body: "This memory will be permanently deleted and cannot be recovered.",
      confirm: "I confirm that I want to permanently delete this memory.",
      errorTitle: "Unable to delete memory",
      errorFallback: "Try again in a moment.",
    },
  },
  settings: {
    title: "Settings",
    languageLabel: "Language",
    languageHelp:
      "The app uses your browser language the first time, then keeps your explicit choice.",
    languageSaved: "Language updated",
    exclusions:
      "Legacy and quiz pages intentionally remain Italian-only because they are reserved for a very small pre-selected user group.",
  },
  upload: {
    createTitle: "Add a new memory",
    editTitle: "Edit this memory",
    dragAndDrop: "Drag the photo here or click to select it",
    supportedFormats: "Supported formats: HEIC, JPG, JPEG, PNG",
    previewAlt: "Preview",
    dateOptional: "Date (optional)",
    locationOptional: "Location (optional)",
    locationPlaceholder: "E.g. Jesolo, Via Dante Alighieri",
    invalidMemoryTitle: "Invalid memory",
    invalidMemoryDescription: "Invalid memory id for editing.",
    loadErrorTitle: "Loading error",
    loadMemoryError: "Unable to load memory",
    memoryNotFound: "Memory not found",
    heicErrorTitle: "HEIC conversion error",
    unsupportedFileTitle: "Unsupported format",
    heicErrorDescription:
      "I couldn't convert this HEIC file :( Try exporting it as JPG or PNG and upload it again.",
    unsupportedFileDescription: "Upload a HEIC, JPG, JPEG, or PNG file.",
    updateSuccessTitle: "Memory updated",
    updateSuccessDescription: "Your changes have been saved.",
    updateErrorTitle: "Update failed",
    saveErrorTitle: "Upload failed",
    saveSuccessTitle: "Memory saved",
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type TranslationSchema = DeepStringify<typeof enTranslation>;

export default enTranslation;
