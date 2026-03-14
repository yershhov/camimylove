import type { TranslationSchema } from "./en";

const frTranslation = {
  auth: {
    promptDate: "Quand avons-nous commencé à sortir ensemble ?",
    promptPetName: "Quel a été le premier petit surnom que nous avons utilisé ?",
    invalidAnswers: "Ces réponses ne sont pas correctes. Réessaie.",
    submit: "Entrer",
    submitting: "Vérification...",
  },
  common: {
    back: "Retour",
    backHome: "Retour à l'accueil",
    retrySoon: "Réessaie dans quelques secondes.",
    verify: "Vérification...",
    actions: {
      cancel: "Annuler",
      close: "Fermer",
      delete: "Supprimer",
      deleting: "Suppression...",
      edit: "Modifier",
      save: "Enregistrer",
      saving: "Enregistrement...",
    },
  },
  gallery: {
    title: "Galerie",
    openUpload: "Ouvrir la page d'ajout",
    memoryAlt: "Souvenir {{id}}",
  },
  home: {
    cards: {
      gallery: "Galerie",
      randomMemories: "Souvenirs aléatoires",
      upload: "Ajouter des souvenirs",
      quiz: "Quiz du 1er anniversaire",
      legacy: "Se souvenir de comment c'était",
      settings: "Paramètres",
      logout: "Se déconnecter",
    },
    loggingOut: "Déconnexion...",
    womensDayTitle: "Happy Women's Day, Baby!",
    womensDaySubtitle: "And Happy Monthiversary <3",
  },
  maintenance: {
    title: "Site temporairement en maintenance.",
    placeholder: "Mot de passe administrateur",
    invalidPassword: "Mot de passe invalide.",
    connectionError: "Erreur de connexion. Réessaie.",
    submit: "Déverrouiller",
  },
  memories: {
    title: "Nos souvenirs",
    next: "Voir un autre souvenir",
    loadError: "Erreur, oupsie :(",
    deleteDialog: {
      title: "Supprimer ce souvenir ?",
      body:
        "Ce souvenir sera supprimé définitivement et ne pourra pas être récupéré.",
      confirm: "Je confirme que je veux supprimer définitivement ce souvenir.",
      errorTitle: "Impossible de supprimer le souvenir",
      errorFallback: "Réessaie dans un instant.",
    },
  },
  settings: {
    title: "Paramètres",
    languageLabel: "Langue",
    languageHelp:
      "L'app utilise la langue du navigateur la première fois, puis conserve ton choix explicite.",
    languageSaved: "Langue mise à jour",
    exclusions:
      "Les pages legacy et quiz restent volontairement uniquement en italien car elles sont réservées à un très petit groupe d'utilisateurs présélectionnés.",
  },
  upload: {
    createTitle: "Ajouter un nouveau souvenir",
    editTitle: "Modifier ce souvenir",
    dragAndDrop: "Glisse la photo ici ou clique pour la sélectionner",
    supportedFormats: "Formats pris en charge : HEIC, JPG, JPEG, PNG",
    previewAlt: "Aperçu",
    dateOptional: "Date (optionnelle)",
    locationOptional: "Lieu (optionnel)",
    locationPlaceholder: "Ex. Jesolo, Via Dante Alighieri",
    invalidMemoryTitle: "Souvenir invalide",
    invalidMemoryDescription: "ID de souvenir invalide pour la modification.",
    loadErrorTitle: "Erreur de chargement",
    loadMemoryError: "Impossible de charger le souvenir",
    memoryNotFound: "Souvenir introuvable",
    heicErrorTitle: "Erreur de conversion HEIC",
    unsupportedFileTitle: "Format non pris en charge",
    heicErrorDescription:
      "Je n'ai pas réussi à convertir ce fichier HEIC :( Essaie de l'exporter en JPG ou PNG et téléverse-le à nouveau.",
    unsupportedFileDescription:
      "Téléverse un fichier HEIC, JPG, JPEG ou PNG.",
    updateSuccessTitle: "Souvenir mis à jour",
    updateSuccessDescription: "Tes modifications ont été enregistrées.",
    updateErrorTitle: "Échec de la mise à jour",
    saveErrorTitle: "Échec du téléversement",
    saveSuccessTitle: "Souvenir enregistré",
  },
} satisfies TranslationSchema;

export default frTranslation;
