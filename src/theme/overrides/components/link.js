// ----------------------------------------------------------------------

export default function Link(theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          color: theme.palette.mode === "dark" ? '#91beff' : '#237dff',
          "&:hover": {
            color: theme.palette.mode === "dark" ? '#91beff !important' : '#237dff !important',
          }
        }
      }
    },
  };
}
