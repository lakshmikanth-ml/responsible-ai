
export default function Typography(theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
          color:
            theme.palette.mode === "dark"
              ? theme.palette.text.primary
              : theme.palette.text.primary,
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
        h1: {
          color:
            theme.palette.mode === "dark"
              ? theme.palette.primary.light
              : theme.palette.primary.main,
        },
        h2: {
          color:
            theme.palette.mode === "dark"
              ? theme.palette.primary.light
              : theme.palette.primary.main,
        },
        h3: {
          color: theme.palette.text.primary,
        },
        h4: {
          color: theme.palette.text.primary,
        },
        h5: {
          color:
            theme.palette.mode === "dark"
              ? theme.palette.text.secondary
              : theme.palette.text.secondary,
        },
        h6: {
          color: theme.palette.text.primary,
        },
        body1: {
          color: theme.palette.text.secondary,
        },
        body2: {
          color: theme.palette.text.secondary,
        },
        subtitle1: {
          color: theme.palette.text.primary,
        },
        subtitle2: {
          color: theme.palette.text.secondary,
        },
        caption: {
          color: theme.palette.text.secondary,
        },
        overline: {
          color:
            theme.palette.mode === "dark"
              ? theme.palette.text.disabled
              : theme.palette.text.disabled,
          textTransform: "uppercase",
        },
        button: {
          color: theme.palette.text.primary,
          textTransform: "uppercase",
        },
      },
    },
  };
}
