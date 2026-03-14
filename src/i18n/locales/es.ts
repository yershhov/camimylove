import type { TranslationSchema } from "./en";

const esTranslation = {
  auth: {
    promptDate: "¿Cuándo empezamos a salir?",
    promptPetName: "¿Cuál fue el primer apodo cariñoso que usamos?",
    invalidAnswers: "Esas respuestas no son correctas. Inténtalo de nuevo.",
    submit: "Entrar",
    submitting: "Comprobando...",
  },
  common: {
    back: "Atrás",
    backHome: "Volver al inicio",
    retrySoon: "Vuelve a intentarlo en unos segundos.",
    verify: "Comprobando...",
    actions: {
      cancel: "Cancelar",
      close: "Cerrar",
      delete: "Eliminar",
      deleting: "Eliminando...",
      edit: "Editar",
      save: "Guardar",
      saving: "Guardando...",
    },
  },
  gallery: {
    title: "Galería",
    openUpload: "Abrir la página de subida",
    memoryAlt: "Recuerdo {{id}}",
  },
  home: {
    cards: {
      gallery: "Galería",
      randomMemories: "Recuerdos aleatorios",
      upload: "Añadir recuerdos",
      quiz: "Quiz del 1.er aniversario",
      legacy: "Recordar cómo era",
      settings: "Configuración",
      logout: "Cerrar sesión",
    },
    loggingOut: "Cerrando sesión...",
    womensDayTitle: "Happy Women's Day, Baby!",
    womensDaySubtitle: "And Happy Monthiversary <3",
  },
  maintenance: {
    title: "Sitio temporalmente en mantenimiento.",
    placeholder: "Contraseña de administrador",
    invalidPassword: "Contraseña no válida.",
    connectionError: "Error de conexión. Inténtalo de nuevo.",
    submit: "Desbloquear",
  },
  memories: {
    title: "Nuestros recuerdos",
    next: "Ver otro recuerdo",
    loadError: "Error, oopsie :(",
    deleteDialog: {
      title: "¿Eliminar este recuerdo?",
      body:
        "Este recuerdo se eliminará de forma permanente y no podrá recuperarse.",
      confirm: "Confirmo que quiero eliminar este recuerdo permanentemente.",
      errorTitle: "No se puede eliminar el recuerdo",
      errorFallback: "Vuelve a intentarlo en un momento.",
    },
  },
  settings: {
    title: "Configuración",
    languageLabel: "Idioma",
    languageHelp:
      "La app usa el idioma del navegador la primera vez y luego conserva tu elección explícita.",
    languageSaved: "Idioma actualizado",
    exclusions:
      "Las páginas legacy y quiz siguen intencionalmente solo en italiano porque están reservadas para un grupo muy pequeño de usuarios preseleccionados.",
  },
  upload: {
    createTitle: "Añadir un nuevo recuerdo",
    editTitle: "Editar este recuerdo",
    dragAndDrop: "Arrastra la foto aquí o haz clic para seleccionarla",
    supportedFormats: "Formatos compatibles: HEIC, JPG, JPEG, PNG",
    previewAlt: "Vista previa",
    dateOptional: "Fecha (opcional)",
    locationOptional: "Ubicación (opcional)",
    locationPlaceholder: "P. ej. Jesolo, Via Dante Alighieri",
    invalidMemoryTitle: "Recuerdo no válido",
    invalidMemoryDescription: "ID de recuerdo no válido para editar.",
    loadErrorTitle: "Error de carga",
    loadMemoryError: "No se puede cargar el recuerdo",
    memoryNotFound: "Recuerdo no encontrado",
    heicErrorTitle: "Error de conversión HEIC",
    unsupportedFileTitle: "Formato no compatible",
    heicErrorDescription:
      "No he podido convertir este archivo HEIC :( Intenta exportarlo como JPG o PNG y súbelo de nuevo.",
    unsupportedFileDescription:
      "Sube un archivo HEIC, JPG, JPEG o PNG.",
    updateSuccessTitle: "Recuerdo actualizado",
    updateSuccessDescription: "Tus cambios se han guardado.",
    updateErrorTitle: "Actualización fallida",
    saveErrorTitle: "Subida fallida",
    saveSuccessTitle: "Recuerdo guardado",
  },
} satisfies TranslationSchema;

export default esTranslation;
