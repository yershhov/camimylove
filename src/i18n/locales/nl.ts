import type { TranslationSchema } from "./en";

const nlTranslation = {
  auth: {
    promptDate: "Wanneer kregen we iets met elkaar?",
    promptPetName: "Wat was de eerste koosnaam die we gebruikten?",
    invalidAnswers: "Die antwoorden zijn niet correct. Probeer het opnieuw.",
    submit: "Binnenkomen",
    submitting: "Controleren...",
  },
  common: {
    back: "Terug",
    backHome: "Terug naar home",
    retrySoon: "Probeer het over een paar seconden opnieuw.",
    verify: "Controleren...",
    actions: {
      cancel: "Annuleren",
      close: "Sluiten",
      delete: "Verwijderen",
      deleting: "Bezig met verwijderen...",
      edit: "Bewerken",
      save: "Opslaan",
      saving: "Bezig met opslaan...",
    },
  },
  gallery: {
    title: "Galerij",
    openUpload: "Uploadpagina openen",
    memoryAlt: "Herinnering {{id}}",
  },
  home: {
    cards: {
      gallery: "Galerij",
      randomMemories: "Willekeurige herinneringen",
      upload: "Herinneringen toevoegen",
      quiz: "Quiz voor 1e jubileum",
      legacy: "Herinneren hoe het was",
      settings: "Instellingen",
      logout: "Uitloggen",
    },
    loggingOut: "Uitloggen...",
    womensDayTitle: "Happy Women's Day, Baby!",
    womensDaySubtitle: "And Happy Monthiversary <3",
  },
  maintenance: {
    title: "Site tijdelijk in onderhoud.",
    placeholder: "Beheerderswachtwoord",
    invalidPassword: "Ongeldig wachtwoord.",
    connectionError: "Verbindingsfout. Probeer het opnieuw.",
    submit: "Ontgrendelen",
  },
  memories: {
    title: "Onze herinneringen",
    next: "Nog een herinnering tonen",
    loadError: "Fout, oepsie :(",
    deleteDialog: {
      title: "Deze herinnering verwijderen?",
      body:
        "Deze herinnering wordt permanent verwijderd en kan niet worden hersteld.",
      confirm:
        "Ik bevestig dat ik deze herinnering permanent wil verwijderen.",
      errorTitle: "Kan de herinnering niet verwijderen",
      errorFallback: "Probeer het zo opnieuw.",
    },
  },
  settings: {
    title: "Instellingen",
    languageLabel: "Taal",
    languageHelp:
      "De app gebruikt de eerste keer de taal van je browser en bewaart daarna je expliciete keuze.",
    languageSaved: "Taal bijgewerkt",
    exclusions:
      "Legacy- en quizpagina's blijven bewust alleen Italiaans, omdat ze bedoeld zijn voor een heel kleine vooraf geselecteerde gebruikersgroep.",
  },
  upload: {
    createTitle: "Een nieuwe herinnering toevoegen",
    editTitle: "Deze herinnering bewerken",
    dragAndDrop: "Sleep de foto hierheen of klik om hem te selecteren",
    supportedFormats: "Ondersteunde formaten: HEIC, JPG, JPEG, PNG",
    previewAlt: "Voorbeeld",
    dateOptional: "Datum (optioneel)",
    locationOptional: "Locatie (optioneel)",
    locationPlaceholder: "Bijv. Jesolo, Via Dante Alighieri",
    invalidMemoryTitle: "Ongeldige herinnering",
    invalidMemoryDescription: "Ongeldige herinnerings-id voor bewerken.",
    loadErrorTitle: "Laadfout",
    loadMemoryError: "Kan de herinnering niet laden",
    memoryNotFound: "Herinnering niet gevonden",
    heicErrorTitle: "HEIC-conversiefout",
    unsupportedFileTitle: "Niet-ondersteund formaat",
    heicErrorDescription:
      "Ik kon dit HEIC-bestand niet converteren :( Probeer het als JPG of PNG te exporteren en upload het opnieuw.",
    unsupportedFileDescription:
      "Upload een HEIC-, JPG-, JPEG- of PNG-bestand.",
    updateSuccessTitle: "Herinnering bijgewerkt",
    updateSuccessDescription: "Je wijzigingen zijn opgeslagen.",
    updateErrorTitle: "Bijwerken mislukt",
    saveErrorTitle: "Upload mislukt",
    saveSuccessTitle: "Herinnering opgeslagen",
  },
} satisfies TranslationSchema;

export default nlTranslation;
