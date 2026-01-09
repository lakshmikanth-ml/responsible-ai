import { alpha } from "@mui/material/styles";

export const MuiTable = {
    styleOverrides: {
        root: ({ theme }) => {
            const isDark = theme.palette.mode === "dark";

            return {
                // Ensure consistent cell sizing
                '& td, & th': {
                    minWidth: '150px',
                },

                // Table container styling
                '& .MuiTableContainer-root': {
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid #FFFFFF`,
                    overflow: 'hidden',
                },

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
                    padding: '14px 12px',
                    color: theme.palette.text.primary,
                    borderBottom: `1px solid ${isDark
                        ? alpha(theme.palette.common.white, 0.08)
                        : theme.palette.divider
                        }`,
                },

                // Table header cells
                '& .MuiTableCell-head': {
                    fontSize: 14,
                    fontWeight: theme.typography.fontWeightMedium,
                    color: theme.palette.text.primary,
                    backgroundColor: isDark
                        ? alpha(theme.palette.common.white, 0.05)
                        : theme.palette.background.neutral,
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
                    borderTop: `1px solid ${isDark
                        ? alpha(theme.palette.common.white, 0.08)
                        : theme.palette.divider
                        }`,
                },
            };
        },
    },
};
