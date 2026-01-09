// ----------------------------------------------------------------------

import { BorderBottom } from "@mui/icons-material";

export default function Dialog(theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: ({ ownerState }) => ({
          // boxShadow: theme.customShadows.dialog,
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.mode === "dark" ? '#000' : "#fff",
          ...(!ownerState.fullScreen && {
            margin: theme.spacing(2),
            backgroundColor: theme.palette.mode === "dark" ? '#000' : "#fff",
          }),
        }),
        paperFullScreen: {
          borderRadius: 0,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2, 2),
        },
        dividers: {
          borderTop: 0,
          borderBottomStyle: "dashed",
          paddingBottom: theme.spacing(3),
        },
      },
    },
    MuiDialogActions: {
      defaultProps: {
        disableSpacing: true,
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
          "& > :not(:first-of-type)": {
            marginLeft: theme.spacing(1.5),
          },
        },
      },
    },
  };
}
