export const SURFACE_BORDER_COLOR = "pink.200";
export const SURFACE_BORDER_HOVER_COLOR = "pink.300";
export const SURFACE_BORDER_ACTIVE_COLOR = "pink.400";

export const formFieldStyles = {
  bg: "white",
  borderColor: SURFACE_BORDER_COLOR,
  fontSize: "16px",
  rounded: "md",
  _hover: {
    borderColor: SURFACE_BORDER_HOVER_COLOR,
  },
  _focusVisible: {
    borderColor: SURFACE_BORDER_ACTIVE_COLOR,
    boxShadow: "0 0 0 1px var(--chakra-colors-pink-400)",
  },
} as const;
