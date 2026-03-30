import { Card,CardContent,Box,Typography,Chip } from "@mui/material";


export const STATUS_CONFIG = {
    PASS: {
        label: "PASS",
        light: { bg: 'rgba(34, 197, 94, 0.08)', border: 'rgba(34, 197, 94, 0.3)', color: '#16a34a' },
        dark: { bg: 'rgba(34, 197, 94, 0.16)', border: 'rgba(34, 197, 94, 0.4)', color: '#4ade80' },
    },
    BLOCKED: {
        label: "BLOCKED",
        light: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.3)', color: '#dc2626' },
        dark: { bg: 'rgba(239, 68, 68, 0.16)', border: 'rgba(239, 68, 68, 0.4)', color: '#f87171' },
    },
    DEGRADED: {
        label: "DEGRADED",
        light: { bg: 'rgba(251, 146, 60, 0.08)', border: 'rgba(251, 146, 60, 0.3)', color: '#f97316' },
        dark: { bg: 'rgba(251, 146, 60, 0.16)', border: 'rgba(251, 146, 60, 0.4)', color: '#fdba74' },
    },
     
     CONDITIONAL: {
    label: "CONDITIONAL",
    light: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", color: "#2563eb" },
    dark: { bg: "rgba(59,130,246,0.16)", border: "rgba(59,130,246,0.4)", color: "#60a5fa" },
  },
};

const DEFAULT_STATUS = {
  label: "UNKNOWN",
  light: {
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.3)",
    color: "#64748b",
  },
  dark: {
    bg: "rgba(148,163,184,0.16)",
    border: "rgba(148,163,184,0.4)",
    color: "#cbd5f5",
  },
};

/* ---------------- Card Component ---------------- */
export function GateCard({ title, status, description }) {
    const config = STATUS_CONFIG[status] || DEFAULT_STATUS ;
    
    
    
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                height: "100%",
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                        ? `0 4px 20px ${config.dark.border.replace('0.4', '0.3')}` 
                        : `0 4px 20px ${config.light.border.replace('0.3', '0.15')}`,
                    borderColor: (theme) => theme.palette.mode === 'dark' 
                        ? config.dark.border 
                        : config.light.border,
                },
                bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? config.dark.bg 
                    : config.light.bg,
                borderColor: (theme) => theme.palette.mode === 'dark' 
                    ? config.dark.border 
                    : config.light.border,
                borderLeft: '4px solid',
                borderLeftColor: (theme) => theme.palette.mode === 'dark' 
                    ? config.dark.color 
                    : config.light.color,
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                >
                    <Typography 
                        fontWeight={700}
                        sx={{ 
                            fontSize: '1rem',
                            color: (theme) => theme.palette.mode === 'dark' 
                                ? theme.palette.text.primary 
                                : 'inherit',
                        }}
                    >
                        {title}
                    </Typography>
                    <Chip
                        label={config.label}
                        variant="outlined"
                        size="small"
                        sx={{
                            fontWeight: 700,
                            bgcolor: (theme) => theme.palette.mode === 'dark' 
                                ? config.dark.bg 
                                : config.light.bg,
                            borderColor: (theme) => theme.palette.mode === 'dark' 
                                ? config.dark.border 
                                : config.light.border,
                            color: (theme) => theme.palette.mode === 'dark' 
                                ? config.dark.color 
                                : config.light.color,
                            '&:hover': {
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? config.dark.bg 
                                    : config.light.bg,
                                opacity: 0.8,
                            },
                        }}
                    />
                </Box>

                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                        lineHeight: 1.5,
                        fontSize: '0.875rem',
                    }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}
