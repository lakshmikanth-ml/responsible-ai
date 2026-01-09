// ==============================|| OVERRIDES - ICON BUTTON ||============================== //

import { alpha } from "@mui/material";

export default function IconButton(theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          // borderRadius: 4,
          "&:hover": {
            background: theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.grey[700], 0.2)
          }
        },
        sizeLarge: {
          width: theme.spacing(5.5),
          height: theme.spacing(5.5),
          fontSize: '1.25rem'
        },
        sizeMedium: {
          width: theme.spacing(4.1),
          height: theme.spacing(4.1),
          fontSize: '1rem',
          padding: '6px'
        },
        sizeSmall: {
          width: theme.spacing(3.75),
          height: theme.spacing(3.75),
          fontSize: '0.75rem'
        }
      }
    }
  };
}
