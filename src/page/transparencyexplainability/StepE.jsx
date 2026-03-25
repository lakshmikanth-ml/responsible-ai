import { useState, useMemo, useEffect } from "react";
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
    Tooltip,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RiskDrawer from "./RiskDrawer";

const STORAGE_KEY = "transparency_stepE";

const SAMPLE_RISKS = [
    {
        id: "RISK_a96f25_4c1aba",
        title: "Missing citations spike (critical)",
        desc: "Missing citation rate is 0.5. Explanations are not defensible for mandatory outputs.",
        severity: "Critical",
        stage: "production",
        source: "Guardian",
        status: "open",
    },
    {
        id: "RISK_d05102_4c1aba",
        title: "Unclear explanations spike (critical)",
        desc: "Unclear explanation rate is 0.5. Users cannot understand outputs; requires template/prompt fixes.",
        severity: "Critical",
        stage: "production",
        source: "Guardian",
        status: "open",
    },
    {
        id: "RISK_729c84_47940c",
        title: "Citation integrity below threshold",
        desc: "Citation integrity score is 50%, below threshold 95%.",
        severity: "Critical",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
    {
        id: "RISK_8142d1_47940c",
        title: "Explainability coverage below threshold",
        desc: "Explainability coverage score is 25%, below threshold 90%.",
        severity: "Critical",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
    {
        id: "RISK_6f9de5_47940c",
        title: "Explanation clarity below threshold",
        desc: "Clarity score is 50%, below threshold 85%.",
        severity: "Warning",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
    {
        id: "RISK_1b65b8_4cf99a",
        title: "Manual risk added",
        desc: "Describe the gap and impact.",
        severity: "Warning",
        stage: "release",
        source: "SME",
        status: "open",
    },
    {
        id: "RISK_a62c97_55f154",
        title: "Manual risk added",
        desc: "Describe the gap and impact.",
        severity: "Warning",
        stage: "release",
        source: "SME",
        status: "open",
    },
    {
        id: "RISK_94e755_55f4f7",
        title: "Manual risk added",
        desc: "Describe the gap and impact.",
        severity: "Warning",
        stage: "release",
        source: "SME",
        status: "open",
    },
];

export default function TabERisks() {
    const [risks, setRisks] = useState(SAMPLE_RISKS);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [selectedRisk, setSelectedRisk] = useState(null);
    const [importOpen, setImportOpen] = useState(false);
    const [importText, setImportText] = useState(JSON.stringify(SAMPLE_RISKS, null, 2));

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setRisks(JSON.parse(saved));
            }
        } catch (err) {
            console.error("Failed to load Step E data", err);
        }
    }, []);

    const pagedRows = risks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const kpis = useMemo(() => {
        const criticalOpen = risks.filter((r) => r.severity === "Critical" && r.status === "open").length;
        const warningsOpen = risks.filter((r) => r.severity === "Warning" && r.status === "open").length;
        const sources = [...new Set(risks.map((r) => r.source))].join(", ");

        return [
            { title: "Critical Open Risks", value: criticalOpen, desc: "Any critical open risk blocks Release.", error: criticalOpen > 0 },
            { title: "Warnings Open", value: warningsOpen, desc: "Warnings may set gate to Conditional." },
            { title: "Risk Sources", value: sources || "—", desc: "DFA / Evaluation / Guardian / SME", mono: true },
        ];
    }, [risks]);

    const updateRisk = (id, key, value) =>
        setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

    const handleAddRisk = () => {
        setRisks((prev) => [
            ...prev,
            {
                id: `RISK_${Math.random().toString(16).slice(2, 8)}_${Math.random().toString(16).slice(2, 8)}`,
                title: "Manual risk added",
                desc: "Describe the gap and impact.",
                severity: "Warning",
                stage: "release",
                source: "SME",
                status: "open",
            },
        ]);
    };

    const handleSave = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(risks));
        } catch (err) {
            console.error("Failed to save Step E data", err);
        }
    };

    const handleImport = () => {
        try {
            const parsed = JSON.parse(importText);
            if (Array.isArray(parsed)) {
                setRisks(parsed);
                setImportOpen(false);
            } else {
                alert("Import JSON must be an array of risks.");
            }
        } catch (err) {
            alert("Invalid JSON. Please check and try again.");
        }
    };

    return (
        <Card variant="outlined" sx={{ mt: 0 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                    alignItems={{ xs: "flex-start", md: "center" }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            E. Gaps, Risks &amp; Failure Modes (Risk Register)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                            Single source of truth for explainability risks. Risks can originate from DFA, Evaluation, Guardian, or SME feedback.
                        </Typography>
                    </Box>

                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRisk}>
                        Add Risk
                    </Button>
                    <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => setImportOpen(true)}>
                        Bulk Import Risks
                    </Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                        Save E
                    </Button>
                </Stack>

                <Grid container spacing={2} mt={2} mb={3}>
                    {kpis.map((kpi) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kpi.title}>
                            <Card
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    borderColor: kpi.error ? "error.light" : "divider",
                                    background: kpi.error ? "linear-gradient(120deg, #ffebee 0%, #fff5f5 100%)" : "transparent",
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    {kpi.title}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={kpi.error ? "error.main" : "text.primary"}
                                    sx={kpi.mono ? { fontFamily: "monospace", fontSize: 14 } : { fontWeight: 700, mt: 0.5 }}
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

                <Box
                    sx={{
                        overflowX: "auto",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    }}
                >
                    <Table stickyHeader sx={{ minWidth: 1000 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 160 }}>Risk ID</TableCell>
                                <TableCell>Issue</TableCell>
                                <TableCell sx={{ width: 120 }}>Severity</TableCell>
                                <TableCell sx={{ width: 140 }}>Stage Impact</TableCell>
                                <TableCell sx={{ width: 120 }}>Source</TableCell>
                                <TableCell sx={{ width: 120 }}>Status</TableCell>
                                <TableCell sx={{ width: 80 }} align="center">
                                    Link
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pagedRows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ fontFamily: "monospace" }}>{row.id}</TableCell>

                                    <TableCell>
                                        <Typography variant="subtitle2">{row.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {row.desc}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={row.severity}
                                            color={row.severity === "Critical" ? "error" : "warning"}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Chip size="small" label={row.stage} variant="outlined" sx={{ fontWeight: 600 }} />
                                    </TableCell>

                                    <TableCell>
                                        <Chip size="small" label={row.source} color="info" sx={{ fontWeight: 600 }} />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            select
                                            size="small"
                                            value={row.status}
                                            onChange={(e) => updateRisk(row.id, "status", e.target.value)}
                                        >
                                            <MenuItem value="open">open</MenuItem>
                                            <MenuItem value="done">done</MenuItem>
                                        </TextField>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Tooltip title="View Risk">
                                            <IconButton size="small" onClick={() => setSelectedRisk(row)}>
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
                        rowsPerPageOptions={[5, 8, 15]}
                    />
                </Box>

                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderLeft: "4px solid #184ea4",
                        background: "#f8fafc",
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                    }}
                >
                    <InfoOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.25 }} />
                    <Typography variant="body2">
                        Each Critical risk must have a mitigation action in section F and evidence in section G. Closing a critical risk requires re-check in section D (or runtime confirmation in H).
                    </Typography>
                </Box>

                <RiskDrawer open={!!selectedRisk} risk={selectedRisk} onClose={() => setSelectedRisk(null)} />
            </CardContent>

            <Dialog open={importOpen} onClose={() => setImportOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Bulk Import Risks (JSON array)</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        multiline
                        minRows={12}
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        InputProps={{ sx: { fontFamily: "monospace" } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImportOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleImport}>
                        Import
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
