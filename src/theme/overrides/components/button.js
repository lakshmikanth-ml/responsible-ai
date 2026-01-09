import { alpha } from "@mui/material/styles";
import { buttonClasses } from "@mui/material/Button";

// ----------------------------------------------------------------------

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"];

// ----------------------------------------------------------------------

export default function Button(theme) {
  const isLight = theme.palette.mode === "light";

  const rootStyles = (ownerState) => {
    const inheritColor = ownerState.color === "inherit";

    const containedVariant = ownerState.variant === "contained";

    const outlinedVariant = ownerState.variant === "outlined";

    const textVariant = ownerState.variant === "text";

    const softVariant = ownerState.variant === "soft";

    const smallSize = ownerState.size === "small";

    const mediumSize = ownerState.size === "medium";

    const largeSize = ownerState.size === "large";

    const defaultStyle = {
      fontWeight: "500",
      textTransform: "uppercase",
      fontSize: "0.76rem",
      lineHeight: 0,

      "& .MuiButton-loadingIndicator": {
        color: isLight ? theme.palette.grey[600] : "#fff",
      },
      ...(inheritColor && {
        // CONTAINED
        ...(containedVariant && {
          color: theme.palette.common.white,
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          // "&:hover": {
          //   backgroundColor: "#341ce7ff",
          // },
        }),
        // OUTLINED
        ...(outlinedVariant && {
          borderColor: "none",
          background: isLight ? theme.palette.grey[300] : theme.palette.grey[700],

          "&:hover": {
            backgroundColor: theme.palette.grey[400],
            border: 'none'
          },
        }),
        // TEXT
        ...(textVariant && {
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette.text.primary,
          backgroundColor: isLight
            ? theme.palette.grey[400]
            : alpha(theme.palette.grey[500], 0.18),
          "&:hover": {
            backgroundColor: alpha(theme.palette.grey[500], 0.24),
          },
        }),
      }),
      ...(outlinedVariant && {
        "&:hover": {
          borderColor: "currentColor",
          boxShadow: "0 0 0 0.5px currentColor",
        },
      }),
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        // CONTAINED
        ...(containedVariant && {
          background: theme.palette[color].main,
          "&:hover": {
            // boxShadow: theme.customShadows[color],
            background: alpha(theme.palette[color].main, 0.8),
          },
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette[color][isLight ? "dark" : "light"],
          backgroundColor: alpha(theme.palette[color].main, 0.16),
          "&:hover": {
            backgroundColor: alpha(theme.palette[color].main, 0.32),
          },
        }),
      }),
    }));

    const disabledState = {
      [`&.${buttonClasses.disabled}`]: {
        // SOFT
        ...(softVariant && {
          backgroundColor: theme.palette.action.disabledBackground,
        }),

        ...(containedVariant && {
          color: alpha(theme.palette.grey[600], 0.6),
          background: theme.palette.action.disabledBackground,
          // opacity: 0.1
        }),
        border: `1px solid ${theme.palette.divider}`
      },
      [`&.${buttonClasses.loadingIndicator}`]: {
        color: alpha(theme.palette.grey[900], 1),


      }
    };

    const size = {
      ...(smallSize && {
        height: 30,
        fontSize: 12,
        paddingLeft: 8,
        paddingRight: 8,
        ...(textVariant && {
          paddingLeft: 4,
          paddingRight: 4,
        }),
      }),
      ...(mediumSize && {
        height: 38,
        paddingLeft: 12,
        paddingRight: 12,
        ...(textVariant && {
          paddingLeft: 8,
          paddingRight: 8,
        }),
      }),
      ...(largeSize && {
        height: 48,
        fontSize: 15,
        paddingLeft: 16,
        paddingRight: 16,
        ...(textVariant && {
          paddingLeft: 10,
          paddingRight: 10,
        }),
      }),
    };

    return [defaultStyle, ...colorStyle, disabledState, size];
  };

  return {
    MuiButton: {
      defaultProps: {
        color: "inherit",
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ ownerState }) => rootStyles(ownerState),
      },
    },
  };
}
