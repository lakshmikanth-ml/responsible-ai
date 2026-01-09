import {
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    Chip,
} from "@mui/material";

/* Status badge */
function StatusChip({ status }) {
    const map = {
        PASS: "success",
        CONDITIONAL: "warning",
        BLOCKED: "error",
    };

    return (
        <Chip
            label={status}
            color={map[status]}
            size="small"
            sx={{ fontWeight: 700 }}
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
        grid: { xs: 12, sm: 6, md: 4 },
    },
    {
        id: "release",
        title: "Release Gate",
        status: "BLOCKED",
        description: "Explainability Owner is missing in section A.",
        grid: { xs: 12, sm: 6, md: 4 },
    },
    {
        id: "production",
        title: "Production Gate",
        status: "BLOCKED",
        description: "Production blocked because release gate is blocked.",
        grid: { xs: 12, sm: 6, md: 4 },
    },
    {
        id: "guardian",
        title: "Guardian Health",
        value: "—",
        description: "Derived from runtime signals ingested in section H.",
        grid: { xs: 12 },
    },
];

export default function KpiGateRow() {
    return (
        <Grid container spacing={2} alignItems="stretch">
            {GATES.map((gate) => (
                <Grid key={gate.id} size={gate.grid} display="flex">
                    <Card sx={{ flex: 1 }}>
                        <CardContent
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography variant="subtitle1" color="text.secondary">
                                {gate.title}
                            </Typography>

                            {gate.status && (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    mt={1}
                                    mb={1}
                                >
                                    <StatusChip status={gate.status} />
                                </Stack>
                            )}

                            {gate.value && (
                                <Typography variant="h6" mt={1}>
                                    {gate.value}
                                </Typography>
                            )}

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                                sx={{ mt: "auto" }}
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
