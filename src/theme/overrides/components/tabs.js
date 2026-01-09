import { alpha } from '@mui/material';
import { tabClasses } from '@mui/material/Tab';

// ----------------------------------------------------------------------

export default function Tabs(theme) {
  return {
    MuiTabs: {
      defaultProps: {
        textColor: 'inherit',
        variant: 'scrollable',
        allowScrollButtonsMobile: true,
      },
      styleOverrides: {
        root: {
          minHeight: 34,
        },
        indicator: {
          backgroundColor: theme.palette.text.primary,
        },
        scrollButtons: {
          width: 40,
          // borderRadius: '50%',
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
        iconPosition: 'start',
      },
      styleOverrides: {
        root: {
          padding: "8px 12px",
          opacity: 1,
          minWidth: 48,
          minHeight: 34,
          fontWeight: theme.typography.fontWeightSemiBold,
          borderRadius: '4px',
          '&:not(:last-of-type)': {
            marginRight: theme.spacing(1),
            [theme.breakpoints.up('sm')]: {
              marginRight: theme.spacing(1),
            },
          },
          [`&.${tabClasses.selected}`]: {
            // padding: "8px 16px",
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: '#FFFFFF',
          },
          [`&:not(.${tabClasses.selected})`]: {
            // padding: "8px 8px",
            color: theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[6100],
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark" ? "#262626" : alpha(theme.palette.grey[700], 0.1),
            }
          },

        },
      },
    },
  };
}