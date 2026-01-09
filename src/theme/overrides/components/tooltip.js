// ----------------------------------------------------------------------

export default function Tooltip(theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[isLight ? 500 : 600],
        },
        arrow: {
          color: theme.palette.grey[isLight ? 500 : 600],
        },
      },
    },
  };
}
