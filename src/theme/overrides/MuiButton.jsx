// theme.js
export const MuiButton = {
    styleOverrides: {
        outlined: {
            borderRadius: "8px",
        },
        contained: {
            background:
                "linear-gradient(93.68deg, #174FA2 0.89%, #3A86FF 101.44%)",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "none",

            "&:hover": {
                background:
                    "linear-gradient(93.68deg, #174FA2 0.89%, #3A86FF 101.44%)",
                boxShadow: "none",
            },

            "&:active": {
                boxShadow: "none",
            },
        },
    },
};
