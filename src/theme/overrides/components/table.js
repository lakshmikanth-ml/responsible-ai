// import { alpha } from "@mui/material/styles";

// export default function Table(theme) {
//   const isDark = theme.palette.mode === "dark";

//   return {
//     MuiTableContainer: {
//       styleOverrides: {
//         root: {
//           backgroundColor: theme.palette.background.paper,
//           borderRadius: theme.shape.borderRadius,
//           border: `1px solid ${theme.palette.divider}`,
//           overflow: "hidden",
//         },
//       },
//     },

//     MuiTableRow: {
//       styleOverrides: {
//         root: {
//           // ✅ SAME BACKGROUND FOR ALL ROWS
//           backgroundColor: "transparent",

//           // ❌ NO STRIPING
//           '&:nth-of-type(even)': {
//             backgroundColor: "transparent",
//           },

//           // ✅ SUBTLE HOVER ONLY
//           '&:hover': {
//             backgroundColor: isDark
//               ? alpha(theme.palette.common.white, 0.04)
//               : theme.palette.action.hover,
//           },
//         },
//       },
//     },

//     MuiTableCell: {
//       styleOverrides: {
//         root: {
//           padding: "14px 12px",
//           color: theme.palette.text.primary,

//           // ✅ ROW SEPARATION VIA BORDER ONLY
//           borderBottom: `1px solid ${isDark
//               ? alpha(theme.palette.common.white, 0.08)
//               : theme.palette.divider
//             }`,
//         },

//         head: {
//           fontSize: 14,
//           fontWeight: theme.typography.fontWeightMedium,
//           color: theme.palette.text.primary,

//           // ✅ HEADER SLIGHTLY DISTINCT (NOT BRIGHT)
//           backgroundColor: isDark
//             ? alpha(theme.palette.common.white, 0.05)
//             : theme.palette.background.neutral,

//           borderBottom: `1px solid ${isDark
//               ? alpha(theme.palette.common.white, 0.12)
//               : theme.palette.divider
//             }`,
//         },

//         stickyHeader: {
//           backgroundImage: "none",
//           backgroundColor: isDark
//             ? theme.palette.background.paper
//             : theme.palette.background.neutral,
//         },
//       },
//     },

//     MuiTablePagination: {
//       styleOverrides: {
//         root: {
//           borderTop: `1px solid ${isDark
//               ? alpha(theme.palette.common.white, 0.08)
//               : theme.palette.divider
//             }`,
//         },
//         toolbar: {
//           height: 56,
//         },
//       },
//     },
//   };
// }

import { alpha } from "@mui/material/styles";

export default function Table(theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          // ✅ SAME BACKGROUND FOR ALL ROWS
          backgroundColor: "transparent",

          // ❌ NO STRIPING
          '&:nth-of-type(even)': {
            backgroundColor: "transparent",
          },

          // ✅ SUBTLE HOVER ONLY
          '&:hover': {
            backgroundColor: isDark
              ? alpha(theme.palette.common.white, 0.04)
              : theme.palette.action.hover,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "14px 12px",
          color: theme.palette.text.primary,

          // ✅ ROW SEPARATION VIA BORDER ONLY
          borderBottom: `1px solid ${isDark
              ? alpha(theme.palette.common.white, 0.08)
              : theme.palette.divider
            }`,
        },

        head: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette.text.primary,

          // ✅ HEADER SLIGHTLY DISTINCT (NOT BRIGHT)
          backgroundColor: isDark
            ? alpha(theme.palette.common.white, 0.05)
            : theme.palette.background.neutral,

          borderBottom: `1px solid ${isDark
              ? alpha(theme.palette.common.white, 0.12)
              : theme.palette.divider
            }`,
        },

        stickyHeader: {
          backgroundImage: "none",
          backgroundColor: isDark
            ? theme.palette.background.paper
            : theme.palette.background.neutral,
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${isDark
              ? alpha(theme.palette.common.white, 0.08)
              : theme.palette.divider
            }`,
        },
        toolbar: {
          height: 56,
        },
      },
    },
  };
}
