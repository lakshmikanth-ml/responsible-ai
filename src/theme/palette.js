import { alpha } from "@mui/material/styles";

// GREY shades + gradients for cards
const GREY = {
  0: "#FFFFFF",
  100: "#ECEFF1",
  200: "#F1F4F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#ababab",
  600: "#637381",
  700: "#757575",
  800: "#1A1A1A", // Card paper
  900: "#0d0d0d", // Base background
  950: "#000",
  1000: "#607D8B",
  1100: "#F0F6FE",
  1200: "#1B2124",
  1300: "#111417",
  1400: "#01579B",
  1500: "#2A2A2A"
};

const PINK = {
  50: "#F9F2FF",
  100: "#d8b4fe",
  150: "#f4e9ff90",
};

const PURPLE = {
  50: "#eee1ffff",
  100: "#4C1C7F"
}

// Section-specific gradient themes
const PRIMARY = {
  lighter: "#367be2",
  light: "#1d62c9",
  main: "#174FA2",// "#174ea2", // Primary button purple
  dark: "#134186",
  darker: "#0d2b59",
  contrastText: "#FFFFFF"
};

const SECONDARY = {
  lighter: "#80b0ff",
  light: "#4d91ff",
  main: "#0190FE", //"#4592cf", "#0190FE"
  dark: "#0190fe",
  darker: "#0173cb",
  contrastText: "#FFFFFF",
};

const INFO = {
  lighter: "#CAFDF5",
  light: "#61F3F3",
  main: "#00B8DB",
  dark: "#006C9C",
  darker: "#003768",
  contrastText: "#FFFFFF",
};

const SUCCESS = {
  lighter: "#D3FCD2",
  light: "#77ED8B",
  main: "#22C55E",
  dark: "#118D57",
  darker: "#065E49",
  contrastText: "#ffffff",
};

const WARNING = {
  lighter: "#FFF5CC",
  light: "#FFD666",
  main: "#FFAB00",
  dark: "#B76E00",
  darker: "#7A4100",
  contrastText: GREY[800],
};

const ERROR = {
  lighter: "#FFE9D5",
  light: "#FFAC82",
  main: "#ff3031",
  dark: "#B71D18",
  darker: "#7A0916",
  contrastText: "#FFFFFF",
};

const COMMON = {
  common: {
    black: "#000000",
    white: "#FFFFFF",
  },
  pink: PINK,
  purple: PURPLE,
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[700], 0.2),
  action: {
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};


// Main theme function
const palette = (mode) => {
  const light = {
    ...COMMON,
    mode: "light",
    text: {
      primary: GREY[800],
      secondary: GREY[700],
      disabled: GREY[1000],
    },
    background: {
      paper: GREY[0],
      default: GREY[100],
      neutral: GREY[200],
    },
    action: {
      ...COMMON.action,
      active: GREY[600],
      disabled: alpha(GREY[1000], 0.6),
    },
    divider: alpha(GREY[700], 0.2),
  };

  const dark = {
    ...COMMON,
    mode: "dark",
    text: {
      primary: "#F7F7F7",
      // secondary: "#9CA3AF",
      secondary: "#f8f8f8",
      disabled: "#6B7280",
    },

    background: {
      paper: "#1a1a1a", //GREY[700]",
      default: GREY[800],
      neutral: alpha(GREY[500], 0.12),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
    divider: alpha(GREY[500], 0.15),

  };

  return mode === "light" ? light : dark;
};

export { palette };