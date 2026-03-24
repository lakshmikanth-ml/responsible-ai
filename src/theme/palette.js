import { alpha } from "@mui/material/styles";

/* ---------------- GREY SCALE ---------------- */
const GREY = {
  0: "#FFFFFF",
  100: "#F4F7FA",
  200: "#E6EDF5",
  300: "#D4DEE9",
  400: "#AAB7C6",
  500: "#7B8794",
  600: "#5A6674",
  700: "#3E4A57",
  800: "#1C1C1C",
  900: "#0D0F12",
};

/* ---------------- PRIMARY BRAND ---------------- */
const PRIMARY = {
  lighter: "#E8F1FC",
  light: "#4F7FC4",
  main: "#174FA2",   // your brand color
  dark: "#123F82",
  darker: "#0F336A",
  contrastText: "#FFFFFF",
};

const SECONDARY = {
  lighter: "#EAF2FF",
  light: "#6D9BE0",
  main: "#3A86FF",
  dark: "#2C5BB0",
  contrastText: "#FFFFFF",
};

/* ---------------- STATUS COLORS ---------------- */
const SUCCESS = { main: "#22C55E", contrastText: "#fff" };
const WARNING = { main: "#F59E0B", contrastText: "#fff" };
const ERROR = { main: "#EF4444", contrastText: "#fff" };
const INFO = { main: "#0EA5E9", contrastText: "#fff" };

/* ---------------- COMMON ---------------- */
const COMMON = {

  primary: PRIMARY,
  secondary: SECONDARY,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  info: INFO,
  grey: GREY,
};

/* =====================================================
   🌞 LIGHT MODE (brand-tinted enterprise white)
===================================================== */
const light = {
  ...COMMON,
  mode: "light",

  text: {
    primary: "#0B1F33",
    secondary: "#5A6674",
    disabled: "#8A97A6",
    darkGrey:"#757575",
  },

  background: {

    tableHeader: '#F8F8F8',
    /* subtle blue-white page */
    default: "#F3F7FC",

    /* cards */
    paper: "#FFFFFF",

    /* panels / tables */
    neutral: "#F8F8F8",

    /* header */
    navbar: "#FFFFFF",
  },

  divider: "#EAEAEA",

  action: {
    hover: alpha("#174FA2", 0.06),
    selected: alpha("#174FA2", 0.10),
  },
};

/* =====================================================
   🌙 DARK MODE (brand-tinted deep blue)
===================================================== */
const dark = {
  ...COMMON,
  mode: "dark",
  primary: COMMON.secondary,

  text: {
    primary: "#F1F5FA",
    secondary: "#9FB2C7",
    disabled: "#6B7A8C",
    darkGrey:"#757575",
  },

  background: {
     tableHeader: '#F8F8F8',
    /* deep brand-tinted body */
    default: "#0F1A2B",

    /* cards slightly lighter */
    paper: "#142235",

    /* tables/panels */
    neutral: "#1A2A40",

    /* navbar */
    navbar: "#101F33",
  },

  divider: "#2A2A2A",

  action: {
    hover: alpha("#4F7FC4", 0.10),
    selected: alpha("#4F7FC4", 0.18),
  },
};

/* ===================================================== */
const palette = (mode) => (mode === "light" ? light : dark);

export { palette };