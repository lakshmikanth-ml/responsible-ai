export const MuiTypography = {
    styleOverrides: {
        paragraph: ({ theme }) => ({
            marginBottom: theme.spacing(2),
            color: theme.palette.text.primary,
        }),
        gutterBottom: ({ theme }) => ({
            marginBottom: theme.spacing(1),
        }),
        h1: ({ theme }) => ({
            color:
                theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
        }),
        h2: ({ theme }) => ({
            color:
                theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
        }),
        h3: ({ theme }) => ({
            color: theme.palette.text.primary,
        }),
        h4: ({ theme }) => ({
            color: theme.palette.text.primary,
        }),
        h5: ({ theme }) => ({
            color: theme.palette.text.secondary,
        }),
        h6: ({ theme }) => ({
            // color: theme.palette.text.primary,
             color:
                theme.palette.mode === "dark"
                    ? "#F7F7F7" 
                    : "rgb(26, 26, 26)",
        }),
        body1: ({ theme }) => ({
            color: theme.palette.text.secondary,
        }),
        body2: ({ theme }) => ({
           
              color:
                theme.palette.mode === "dark"
                    ? "#F7F7F7" 
                    : "rgb(26, 26, 26)",
        }),
        subtitle1: ({ theme }) => ({
            color: theme.palette.text.primary,
        }),
        subtitle2: ({ theme }) => ({
            color: theme.palette.text.secondary,
        }),
        caption: ({ theme }) => ({
            color: theme.palette.text.secondary,
        }),
        overline: ({ theme }) => ({
            color: theme.palette.text.disabled,
            textTransform: "uppercase",
        }),
        button: ({ theme }) => ({
            color: theme.palette.text.primary,
            textTransform: "uppercase",
        }),
    },
};
