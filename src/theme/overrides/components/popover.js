import { listClasses } from "@mui/material/List";
//
import { paper } from "../../css";

// ----------------------------------------------------------------------

export default function Popover(theme) {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          ...paper({ theme, dropdown: true }),
          // background: theme.palette.mode === "light" ? theme.palette.secondary.light : theme.palette.grey[1700],
          [`& .${listClasses.root}`]: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
    },
  };
}
