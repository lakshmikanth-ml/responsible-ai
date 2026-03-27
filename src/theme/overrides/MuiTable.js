import { alpha } from "@mui/material/styles";

export const MuiTable = {
    styleOverrides: {
        root: ({ theme }) => {
            const isDark = theme.palette.mode === "dark";

            return {
                // Ensure consistent cell sizing
                '& td, & th': {
                    minWidth: '100px',
                },
                // Table container styling
                // '& .MuiTableContainer-root': {
                //     backgroundColor: theme.palette.background.paper,
                //     borderRadius: '8px',
                //     border: `1px solid #FFFFFF`,
                //     overflow: 'hidden',
                // },

                // All rows have SAME background
                '& .MuiTableRow-root': {
                    backgroundColor: 'transparent',

                    // No zebra striping
                    '&:nth-of-type(even)': {
                        backgroundColor: 'transparent',
                    },

                    // Subtle hover only
                    '&:hover': {
                        backgroundColor: isDark
                            ? alpha(theme.palette.common.white, 0.04)
                            : theme.palette.action.hover,
                    },
                },

                // Table cells
                '& .MuiTableCell-root': {
                    padding: '8px',
                    color: theme.palette.text.primary,
                    borderBottom: `0.5px solid ${ theme.palette.divider}`,
                },

                // Table header cells
                '& .MuiTableCell-head': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                     color:isDark ? "" : theme.palette.text.darkGrey,
                    backgroundColor: isDark
                        ? alpha(theme.palette.common.white, 0.05)
                        : theme.palette.background.tableHeader,
                    borderBottom: `1px solid ${isDark
                        ? alpha(theme.palette.common.white, 0.12)
                        : theme.palette.divider
                        }`,
                },

                // Sticky header fix
                '& .MuiTableCell-stickyHeader': {
                    backgroundImage: 'none',
                    backgroundColor: isDark
                        ? theme.palette.background.paper
                        : theme.palette.background.neutral,
                },

                // Pagination separation
                '& .MuiTablePagination-root': {
                     borderTop: `1px solid ${ theme.palette.divider }`,
                },
            };
        },
    },
};


export const MuiTableContainer = {
  styleOverrides: {
    root: ({ theme }) => ({
    //   backgroundColor: theme.palette.background.paper,
      borderRadius: '3px',   // <-- your radius
      border: theme.palette.mode === 'dark' 
      ? "" :'1px solid #EAEAEA',
    }),
  },
};

export const MuiTableRow = {
  styleOverrides: {
    root: ({ theme }) => {
      const isDark = theme.palette.mode === "dark";

      return {
        backgroundColor: 'transparent',
        '&:nth-of-type(even)': {
          backgroundColor: 'transparent',
        },
        '&:hover': {
          backgroundColor: isDark
            ? alpha(theme.palette.common.white, 0.04)
            : theme.palette.action.hover,
        },
      };
    },
  },
};

export const MuiTableCell = {
  styleOverrides: {
    root: ({ theme }) => {
      const isDark = theme.palette.mode === "dark";

      return {
        padding: '14px 12px',
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${isDark
          ? alpha(theme.palette.common.white, 0.08)
          : theme.palette.divider
          }`,
      };
    },
    head: ({ theme }) => {
      const isDark = theme.palette.mode === "dark";

      return {
        fontSize: 14,
        fontWeight: theme.typography.fontWeightMedium,
        color: isDark ? theme.palette.text.primary : theme.palette.text.darkGrey,
        backgroundColor: isDark
          ? alpha(theme.palette.common.white, 0.05)
          : theme.palette.background.tableHeader,
        borderBottom: `1px solid ${isDark
          ? alpha(theme.palette.common.white, 0.12)
          : theme.palette.divider
          }`,
      };
    },
    stickyHeader: ({ theme }) => {
      const isDark = theme.palette.mode === "dark";

      return {
        backgroundImage: 'none',
        backgroundColor: isDark
          ? theme.palette.background.paper
          : theme.palette.background.tableHeader,
      };
    },
  },
};

export const MuiTablePagination = {
  styleOverrides: {
    root: ({ theme }) => {
      const isDark = theme.palette.mode === "dark";

      return {
        // borderTop: `1px solid ${isDark
        //   ? alpha(theme.palette.common.white, 0.08)
        //   : theme.palette.divider
        //   }`,
        '& .MuiTablePagination-toolbar': {
          minHeight: 52,
          paddingLeft: 12,
          paddingRight: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        },
        '& .MuiTablePagination-spacer': {
          flex: '1 1 auto',
        },
        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
          margin: 0,
          lineHeight: 1.2,
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiTablePagination-select': {
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiTablePagination-actions': {
          marginLeft: 4,
          display: 'flex',
          alignItems: 'center',
        },
      };
    },
    toolbar: {
      minHeight: 52,
      paddingLeft: 12,
      paddingRight: 12,
    },
    selectLabel: {
      margin: 0,
    },
    displayedRows: {
      margin: 0,
    },
  },
};
