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
    errors: {
      connection: "Connection error. Try again.",
      loadingTitle: "Loading error",
    },
    feedback: {
      changesSaved: "Your changes have been saved.",
      memorySaved: "Memory saved",
      memoryUpdated: "Memory updated",
      saveFailed: "Upload failed",
      updateFailed: "Update failed",
    },
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
    loadMemoryError: "Unable to load memory",
    memoryNotFound: "Memory not found",
    heicErrorTitle: "HEIC conversion error",
    unsupportedFileTitle: "Unsupported format",
    heicErrorDescription:
      "I couldn't convert this HEIC file :( Try exporting it as JPG or PNG and upload it again.",
    unsupportedFileDescription: "Upload a HEIC, JPG, JPEG, or PNG file.",
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type TranslationSchema = DeepStringify<typeof enTranslation>;

export default enTranslation;
