import type { TranslationSchema } from "./en";

const itTranslation = {
  auth: {
    promptDate: "Quando ci siamo messi insieme?",
    promptPetName: 'Il primo "pet name" che abbiamo usato?',
    invalidAnswers: "Le risposte non sono corrette. Riprova.",
    submit: "Entra",
    submitting: "Verifica...",
  },
  common: {
    back: "Indietro",
    backHome: "Torna alla home",
    retrySoon: "Riprova tra qualche secondo.",
    verify: "Verifica...",
    actions: {
      cancel: "Annulla",
      close: "Chiudi",
      delete: "Elimina",
      deleting: "Eliminazione...",
      edit: "Modifica",
      save: "Salva",
      saving: "Salvataggio...",
    },
  },
  gallery: {
    title: "Galleria",
    openUpload: "Apri pagina upload",
    memoryAlt: "Ricordo {{id}}",
  },
  home: {
    cards: {
      gallery: "Galleria",
      randomMemories: "Ricordi casuali",
      upload: "Aggiungi ricordi",
      quiz: "Quiz 1# anniversario",
      legacy: "Ricordati com'era",
      settings: "Impostazioni",
      logout: "Logout",
    },
    loggingOut: "Logging out...",
    womensDayTitle: "Happy Women's Day, Baby!",
    womensDaySubtitle: "And Happy Monthiversary <3",
  },
  maintenance: {
    title: "Sito temporaneamente in manutenzione.",
    placeholder: "Admin password",
    invalidPassword: "Password non valida.",
    connectionError: "Errore di connessione. Riprova.",
    submit: "Accedi",
  },
  memories: {
    title: "Nostri ricordi",
    next: "Vedi un altro ricordo",
    loadError: "Errore, oopsie :(",
    deleteDialog: {
      title: "Eliminare questo ricordo?",
      body:
        "Questo ricordo verra' eliminato definitivamente e non potra' essere recuperato.",
      confirm: "Confermo di voler eliminare definitivamente questo ricordo.",
      errorTitle: "Impossibile eliminare il ricordo",
      errorFallback: "Riprova tra qualche istante.",
    },
  },
  settings: {
    title: "Impostazioni",
    languageLabel: "Lingua",
    languageHelp:
      "L'app usa la lingua del browser al primo accesso, poi conserva la scelta esplicita.",
    languageSaved: "Lingua aggiornata",
    exclusions:
      "Le pagine legacy e quiz restano intenzionalmente solo in italiano per un gruppo molto ristretto di utenti preselezionati.",
  },
  upload: {
    createTitle: "Aggiungi un nuovo ricordo",
    editTitle: "Modifica questo ricordo",
    dragAndDrop: "Trascina qui la foto o clicca per selezionare",
    supportedFormats: "Formati supportati: HEIC, JPG, JPEG, PNG",
    previewAlt: "Preview",
    dateOptional: "Data (opzionale)",
    locationOptional: "Posizione (opzionale)",
    locationPlaceholder: "Es. Jesolo, Via Dante Alighieri",
    invalidMemoryTitle: "Ricordo non valido",
    invalidMemoryDescription: "Id ricordo non valido per la modifica.",
    loadErrorTitle: "Errore caricamento",
    loadMemoryError: "Impossibile caricare il ricordo",
    memoryNotFound: "Ricordo non trovato",
    heicErrorTitle: "Errore conversione HEIC",
    unsupportedFileTitle: "Formato non supportato",
    heicErrorDescription:
      "Non sono riuscito a convertire questo file HEIC :( Prova a esportarlo come JPG o PNG e caricarlo di nuovo.",
    unsupportedFileDescription: "Carica un file HEIC, JPG, JPEG o PNG.",
    updateSuccessTitle: "Ricordo aggiornato",
    updateSuccessDescription: "Le modifiche sono state salvate.",
    updateErrorTitle: "Aggiornamento fallito",
    saveErrorTitle: "Upload fallito",
    saveSuccessTitle: "Ricordo salvato",
  },
} satisfies TranslationSchema;

export default itTranslation;
