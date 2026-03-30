import { Chip } from "@mui/material";

export const StatusChip = ({ label, value }) => {

  const safeLabel = typeof label === "string" ? label : "";

  const getStyle = (theme) => {

    const isDark = theme.palette.mode === "dark";

  const styleMap = {
  "High Risk": {
    bg: isDark ? "rgba(211,47,47,0.20)" : "rgba(211,47,47,0.08)",
    border: isDark ? "#ef5350" : "#ef9a9a",
    text: isDark ? "#ffcdd2" : "#b71c1c",
  },

  "Blocks Training": {
    bg: isDark ? "rgba(251,192,45,0.18)" : "rgba(251,192,45,0.10)",
    border: isDark ? "#fdd835" : "#fbc02d",
    text: isDark ? "#fff59d" : "#8d6e00",
  },

  "Completeness": {
    bg: isDark ? "rgba(255,167,38,0.18)" : "rgba(255,167,38,0.10)",
    border: isDark ? "#ffa726" : "#fb8c00",
    text: isDark ? "#ffcc80" : "#e65100",
  },

  "Last saved": {
    bg: isDark ? "rgba(156,39,176,0.20)" : "rgba(156,39,176,0.08)",
    border: isDark ? "#ba68c8" : "#ab47bc",
    text: isDark ? "#e1bee7" : "#6a1b9a",
  },

  "Version": {
    bg: isDark ? "rgba(63,81,181,0.20)" : "rgba(63,81,181,0.08)",
    border: isDark ? "#7986cb" : "#5c6bc0",
    text: isDark ? "#c5cae9" : "#283593",
  },
};

    if (safeLabel.includes("Completeness")) return styleMap["Completeness"];
    if (safeLabel.includes("Last saved")) return styleMap["Last saved"];
    if (safeLabel.includes("Version")) return styleMap["Version"];

    return styleMap[safeLabel] || {};
  };

  return (
    <Chip
      label={value !== undefined ? `${safeLabel}: ${value}` : safeLabel}
      variant="outlined"
      size="small"
      sx={(theme) => {
        const style = getStyle(theme);

        return {
          fontWeight: 600,
          backgroundColor: style.bg,
          borderColor: style.border,
          color: style.text,
        };
      }}
    />
  );
};


/* -------- Chips Data -------- */

export const chips = [
  { label: "High Risk", value: 0 },
  { label: "Blocks Training", value: 0 },
  { label: "Completeness", value: "22%" },
  { label: "Last saved", value: "-" },
  { label: "Version", value: "v1" },
];