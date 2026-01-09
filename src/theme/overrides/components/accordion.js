import { typographyClasses } from "@mui/material/Typography";
import { accordionClasses } from "@mui/material/Accordion";
import { accordionSummaryClasses } from "@mui/material/AccordionSummary";
import { BorderBottom } from "@mui/icons-material";

// ----------------------------------------------------------------------

export default function Accordion(theme) {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.grey[800],
          border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.purple[50]}`,
          // boxShadow: '0 0 2px 0 rgba(145 158 171 / 20%),0 12px 24px -4px rgba(145 158 171 / 12%)',
          boxShadow: theme.palette.mode === "dark" ? theme.customShadows.accordion : theme.customShadows.z2,
          [`&.${accordionClasses.expanded}`]: {
            // border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[100]}`,
            boxShadow: theme.palette.mode === "dark" ? theme.customShadows.accordion : theme.customShadows.z2,

            borderRadius: theme.shape.borderRadius,
            marginBottom: '8px !important',
            marginTop: '8px !important'
          },
          [`&.${accordionClasses.disabled}`]: {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[100]}`,
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(1),
          height: '48px !important',
          [`&.${accordionSummaryClasses.disabled}`]: {
            opacity: 1,
            color: theme.palette.action.disabled,
            [`& .${typographyClasses.root}`]: {
              color: "inherit",
            },
          },
        },
        expandIconWrapper: {
          color: "inherit",
        },

      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          paddingBottom: theme.spacing(1),
        }
      }
    }
  };
}
