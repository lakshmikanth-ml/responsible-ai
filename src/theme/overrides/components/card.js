// ----------------------------------------------------------------------

export default function Card(theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          // boxShadow: theme.customShadows.card,
          // border:
          //   theme.palette.mode === "light"
          //     ? `1px solid #edededff`
          //     : "1px solid #1D1D58",
          borderRadius: theme.shape.borderRadius * 0.5,
          zIndex: 0, // Fix Safari overflow: hidden with border radius,
          background: theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.grey[800],
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: "h6" },
        subheaderTypographyProps: {
          variant: "body2",
          marginTop: theme.spacing(0.5),
        },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(0),
        },
      },
    },
  };
}
