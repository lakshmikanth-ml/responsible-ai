import { alpha } from "@mui/material";

export default function Divider(theme) {
    return {
        MuiDivider: {
            styleOverrides: {
                // root: {
                //     borderColor: "#1B3678", // 💡 your custom color here
                //     opacity: 1, // optional (default Divider has reduced opacity)
                // },

                root: {
                    borderColor:
                        theme.palette.mode === "dark"
                            ? alpha(theme.palette.grey[700], 0.3)
                            : `${theme.palette.grey[300]} !important`,
                },
            },
        },
    }
}