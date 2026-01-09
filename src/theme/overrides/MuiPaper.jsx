import { Padding } from "@mui/icons-material";

// src/theme/components/MuiPaper.js
export const MuiPaper = {
    styleOverrides: {
        root: ({ theme }) => ({
            backgroundImage: 'none',
            border:
                theme.palette.mode === 'dark'
                    ? `1px solid rgba(255,255,255,0.08)`
                    : `1px solid ${theme.palette.divider}`,

            // 🚫 remove background image globally

        }),
    },
};
