import { alpha } from "@mui/material/styles";
// ----------------------------------------------------------------------

export default function Paper(theme) {
  const isLight = theme.palette.mode === "light";
  return {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          border:
            theme.palette.mode === 'dark'
              ? `1px solid rgba(255,255,255,0.08)`
              : 'none',
        }),
      },
    },
  };
}
