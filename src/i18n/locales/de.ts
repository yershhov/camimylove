import type { TranslationSchema } from "./en";

const deTranslation = {
  auth: {
    promptDate: "Wann sind wir zusammengekommen?",
    promptPetName: "Welchen ersten Kosenamen haben wir benutzt?",
    invalidAnswers: "Diese Antworten sind nicht korrekt. Versuch es noch einmal.",
    submit: "Betreten",
    submitting: "Prüfen...",
  },
  common: {
    back: "Zurück",
    backHome: "Zur Startseite",
    retrySoon: "Versuch es in ein paar Sekunden erneut.",
    verify: "Prüfen...",
    actions: {
      cancel: "Abbrechen",
      close: "Schließen",
      delete: "Löschen",
      deleting: "Wird gelöscht...",
      edit: "Bearbeiten",
      save: "Speichern",
      saving: "Wird gespeichert...",
    },
  },
  gallery: {
    title: "Galerie",
    openUpload: "Upload-Seite öffnen",
    memoryAlt: "Erinnerung {{id}}",
  },
  home: {
    cards: {
      gallery: "Galerie",
      randomMemories: "Zufällige Erinnerungen",
      upload: "Erinnerungen hinzufügen",
      quiz: "Quiz zum 1. Jahrestag",
      legacy: "Erinnern, wie es war",
      settings: "Einstellungen",
      logout: "Abmelden",
    },
    loggingOut: "Abmeldung...",
    womensDayTitle: "Happy Women's Day, Baby!",
    womensDaySubtitle: "And Happy Monthiversary <3",
  },
  maintenance: {
    title: "Die Website wird vorübergehend gewartet.",
    placeholder: "Admin-Passwort",
    invalidPassword: "Ungültiges Passwort.",
    connectionError: "Verbindungsfehler. Versuch es erneut.",
    submit: "Entsperren",
  },
  memories: {
    title: "Unsere Erinnerungen",
    next: "Eine andere Erinnerung anzeigen",
    loadError: "Fehler, upsie :(",
    deleteDialog: {
      title: "Diese Erinnerung löschen?",
      body:
        "Diese Erinnerung wird dauerhaft gelöscht und kann nicht wiederhergestellt werden.",
      confirm:
        "Ich bestätige, dass ich diese Erinnerung dauerhaft löschen möchte.",
      errorTitle: "Erinnerung konnte nicht gelöscht werden",
      errorFallback: "Versuch es gleich noch einmal.",
    },
  },
  settings: {
    title: "Einstellungen",
    languageLabel: "Sprache",
    languageHelp:
      "Die App verwendet beim ersten Mal die Browsersprache und behält danach deine explizite Auswahl.",
    languageSaved: "Sprache aktualisiert",
    exclusions:
      "Legacy- und Quiz-Seiten bleiben absichtlich nur auf Italienisch, da sie für eine sehr kleine, vorab ausgewählte Benutzergruppe reserviert sind.",
  },
  upload: {
    createTitle: "Eine neue Erinnerung hinzufügen",
    editTitle: "Diese Erinnerung bearbeiten",
    dragAndDrop: "Ziehe das Foto hierher oder klicke, um es auszuwählen",
    supportedFormats: "Unterstützte Formate: HEIC, JPG, JPEG, PNG",
    previewAlt: "Vorschau",
    dateOptional: "Datum (optional)",
    locationOptional: "Ort (optional)",
    locationPlaceholder: "Z. B. Jesolo, Via Dante Alighieri",
    invalidMemoryTitle: "Ungültige Erinnerung",
    invalidMemoryDescription: "Ungültige Erinnerungs-ID zum Bearbeiten.",
    loadErrorTitle: "Ladefehler",
    loadMemoryError: "Erinnerung konnte nicht geladen werden",
    memoryNotFound: "Erinnerung nicht gefunden",
    heicErrorTitle: "HEIC-Konvertierungsfehler",
    unsupportedFileTitle: "Nicht unterstütztes Format",
    heicErrorDescription:
      "Diese HEIC-Datei konnte ich nicht konvertieren :( Versuche, sie als JPG oder PNG zu exportieren und erneut hochzuladen.",
    unsupportedFileDescription:
      "Lade eine HEIC-, JPG-, JPEG- oder PNG-Datei hoch.",
    updateSuccessTitle: "Erinnerung aktualisiert",
    updateSuccessDescription: "Deine Änderungen wurden gespeichert.",
    updateErrorTitle: "Aktualisierung fehlgeschlagen",
    saveErrorTitle: "Upload fehlgeschlagen",
    saveSuccessTitle: "Erinnerung gespeichert",
  },
} satisfies TranslationSchema;

export default deTranslation;
