import { useState, useMemo } from "react";
import {
    TablePagination,
    Box,
    Card,
    Typography,
    Stack,
    Button,
    Grid,
    Chip,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    MenuItem,
    IconButton,
    Tooltip, CardContent,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RiskDrawer from "./RiskDrawer";

const INITIAL_RISKS = [
    {
        id: "RISK_d3e370_93586f",
        title: "Citation integrity below threshold",
        desc: "Citation integrity score is 0%, below threshold 95%.",
        severity: "Critical",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
    {
        id: "RISK_352fac_93586f",
        title: "Explainability coverage below threshold",
        desc: "Explainability coverage score is 0%, below threshold 90%.",
        severity: "Critical",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
    {
        id: "RISK_6972fd_93586f",
        title: "Explanation clarity below threshold",
        desc: "Clarity score is 0%, below threshold 85%.",
        severity: "Warning",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
];

export default function TabERisks() {
    const [risks, setRisks] = useState(INITIAL_RISKS);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRisk, setSelectedRisk] = useState(null);

    const pagedRows = risks.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    /* ================= KPI LOGIC ================= */

    const kpis = useMemo(() => {
        const criticalOpen = risks.filter(
            (r) => r.severity === "Critical" && r.status === "open"
        ).length;

        const warningsOpen = risks.filter(
            (r) => r.severity === "Warning" && r.status === "open"
        ).length;

        const sources = [...new Set(risks.map((r) => r.source))].join(", ");

        return [
            {
                title: "Critical Open Risks",
                value: criticalOpen,
                desc: "Any critical open risk blocks Release.",
                error: criticalOpen > 0,
            },
            {
                title: "Warnings Open",
                value: warningsOpen,
                desc: "Warnings may set gate to Conditional.",
            },
            {
                title: "Risk Sources",
                value: sources || "—",
                desc: "DFA / Evaluation / Guardian / SME",
                mono: true,
            },
        ];
    }, [risks]);

    const updateRisk = (id, key, value) =>
        setRisks((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [key]: value } : r))
        );

    return (


        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            E. Gaps, Risks & Failure Modes (Risk Register)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Single source of truth for explainability risks. Risks originate from
                            DFA, Evaluation, Guardian, or SME feedback.
                        </Typography>
                    </Box>
                    <Stack direction={{ xs: "column" }} rowGap={1} mt={2}>
                        <Button variant="outlined">Add Risk</Button>
                        <Button variant="outlined">Bulk Import Risks</Button>
                        <Button variant="contained">Save E</Button>
                    </Stack>
                </Stack>



                {/* KPI TILES */}
                <Grid container spacing={2} mt={2} mb={2}>
                    {kpis.map((kpi) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kpi.title}>
                            <Card variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {kpi.title}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={kpi.error ? "error.main" : "text.primary"}
                                    sx={kpi.mono ? { fontFamily: "monospace", fontSize: 14 } : undefined}
                                >
                                    {kpi.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {kpi.desc}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* TABLE */}
                <Box sx={{ overflowX: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                    <Table stickyHeader sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Risk ID</TableCell>
                                <TableCell>Issue</TableCell>
                                <TableCell>Severity</TableCell>
                                <TableCell>Stage Impact</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Link</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pagedRows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ fontFamily: "monospace" }}>{row.id}</TableCell>

                                    <TableCell>
                                        <strong>{row.title}</strong>
                                        <br />
                                        <small>{row.desc}</small>
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={row.severity}
                                            color={row.severity === "Critical" ? "error" : "warning"}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Chip size="small" label={row.stage} variant="outlined" />
                                    </TableCell>

                                    <TableCell>
                                        <Chip size="small" label={row.source} color="info" />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            select
                                            size="small"
                                            value={row.status}
                                            onChange={(e) =>
                                                updateRisk(row.id, "status", e.target.value)
                                            }
                                        >
                                            <MenuItem value="open">open</MenuItem>
                                            <MenuItem value="done">done</MenuItem>
                                        </TextField>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Tooltip title="View Risk">
                                            <IconButton
                                                size="small"
                                                onClick={() => setSelectedRisk(row)}
                                            >
                                                <OpenInNewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={risks.length}
                        page={page}
                        onPageChange={(_, p) => setPage(p)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </Box>

                {/* CALLOUT */}
                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid lightgray",
                        borderLeft: "4px solid #184ea4",
                        background: "#f8fafc",
                    }}
                >
                    <Typography variant="body2">
                        Each Critical risk must have a mitigation action in Section F and
                        evidence in Section G. Closing a critical risk requires re-check in
                        Section D or runtime confirmation in Section H.
                    </Typography>
                </Box>

                {/* DRAWER */}
                <RiskDrawer
                    open={!!selectedRisk}
                    risk={selectedRisk}
                    onClose={() => setSelectedRisk(null)}
                />
            </CardContent>
        </Card>
    );
}
