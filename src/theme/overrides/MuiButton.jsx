// theme.js
export const MuiButton = {
    styleOverrides: {
        outlined: {
            borderRadius: "8px",
        },
        contained: {
            background:
                "linear-gradient(to right, rgb(1, 144, 254), rgb(52, 166, 254))",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "none",

            "&:hover": {
                background:
                    "linear-gradient(to right, rgb(1, 144, 254), rgb(52, 166, 254))",
                boxShadow: "none",
            },

            "&:active": {
                boxShadow: "none",
            },
        },
    },
};
