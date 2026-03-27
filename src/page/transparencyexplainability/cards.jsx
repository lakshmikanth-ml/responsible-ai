import {
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    Chip,
    Box,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

/* Status badge */
function StatusChip({ status }) {
    const toneMap = {
        PASS: {
            lightBg: "#dcfce7",
            lightBorder: "#86efac",
            lightText: "#166534",
            darkBg: alpha("#22c55e", 0.18),
            darkBorder: alpha("#86efac", 0.3),
            darkText: "#bbf7d0",
        },
        CONDITIONAL: {
            lightBg: "#fff7ed",
            lightBorder: "#fdba74",
            lightText: "#b45309",
            darkBg: alpha("#f59e0b", 0.18),
            darkBorder: alpha("#fcd34d", 0.3),
            darkText: "#fde68a",
        },
        BLOCKED: {
            lightBg: "#fef2f2",
            lightBorder: "#fca5a5",
            lightText: "#b91c1c",
            darkBg: alpha("#ef4444", 0.18),
            darkBorder: alpha("#fca5a5", 0.28),
            darkText: "#fecaca",
        },
    };
    const tone = toneMap[status];

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                fontWeight: 700,
                height: 24,
                letterSpacing: 0.2,
                bgcolor: (theme) => theme.palette.mode === "dark" ? tone.darkBg : tone.lightBg,
                border: "1px solid",
                borderColor: (theme) => theme.palette.mode === "dark" ? tone.darkBorder : tone.lightBorder,
                color: (theme) => theme.palette.mode === "dark" ? tone.darkText : tone.lightText,
                "& .MuiChip-label": {
                    px: 1,
                },
            }}
        />
    );
}

function GateAccent({ status }) {
    const colorMap = {
        PASS: "#22c55e",
        CONDITIONAL: "#f59e0b",
        BLOCKED: "#ef4444",
        DEFAULT: "#94a3b8",
    };

    return (
        <Box
            sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: colorMap[status] || colorMap.DEFAULT,
                boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                        ? `0 0 0 4px ${alpha("#ffffff", 0.05)}`
                        : `0 0 0 4px ${alpha("#0f172a", 0.05)}`,
            }}
        />
    );
}

const GATES = [
    {
        id: "pre",
        title: "Pre-Training Gate",
        status: "CONDITIONAL",
        description:
            "Citations required but no DFA snapshot loaded. Recommended to ingest DFA before training.",
        grid: { xs: 12, sm: 6, md: 4, lg: 3 },
    },
    {
        id: "release",
        title: "Release Gate",
        status: "BLOCKED",
        description: "Explainability Owner is missing in section A.",
        grid: { xs: 12, sm: 6, md: 4, lg: 3 },
    },
    {
        id: "production",
        title: "Production Gate",
        status: "BLOCKED",
        description: "Production blocked because release gate is blocked.",
        grid: { xs: 12, sm: 6, md: 4, lg: 3 },
    },
    {
        id: "guardian",
        title: "Guardian Health",
        value: "-",
        description: "Derived from runtime signals ingested in section H.",
        grid: { xs: 12, sm: 6, md: 4, lg: 3 },
    },
];

export default function KpiGateRow() {
    return (
        <Grid container spacing={2} alignItems="stretch" mt={2}>
            {GATES.map((gate) => (
                <Grid key={gate.id} size={gate.grid} display="flex">
                    <Card
                        variant="outlined"
                        sx={{
                            flex: 1,
                            height: "100%",
                            borderRadius: 3,
                            borderColor: (theme) =>
                                theme.palette.mode === "dark"
                                    ? alpha("#ffffff", 0.1)
                                    : alpha("#0f172a", 0.08),
                            background: (theme) =>
                                theme.palette.mode === "dark"
                                    ? `linear-gradient(180deg, ${alpha("#ffffff", 0.04)} 0%, ${alpha("#ffffff", 0.02)} 100%)`
                                    : "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                            boxShadow: (theme) =>
                                theme.palette.mode === "dark"
                                    ? `0 8px 24px ${alpha("#000000", 0.22)}`
                                    : `0 10px 24px ${alpha("#0f172a", 0.05)}`,
                        }}
                    >
                        <CardContent
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.25,
                            }}
                        >
                            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
 <Stack direction="row" spacing={1.25} alignItems="center">
                     {/* <GateAccent status={gate.status} /> */}
                                    <Typography 
                                    variant="subtitle2"
                                      sx={{ fontWeight: 600 }}>
                                        {gate.title}
                                    </Typography>
                                </Stack>

                                {gate.status && <StatusChip status={gate.status} />}
                            </Stack>

                            {gate.value && (
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        letterSpacing: -0.4,
                                        color: (theme) => theme.palette.text.primary,
                                    }}
                                >
                                    {gate.value}
                                </Typography>
                            )}

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: "auto", lineHeight: 1.6, display: "block" }}
                            >
                                {gate.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
