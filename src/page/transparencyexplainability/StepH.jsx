import { useState } from "react";
import {
    Grid,
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DownloadIcon from "@mui/icons-material/Download";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const SAMPLE_GATES = [
    {
        gate: "Pre-Training Gate",
        status: "BLOCKED",
        color: "error",
        reason: "DFA indicates citation sources are not ready (conflicts/OCR/outdated). Fix before training.",
    },
    {
        gate: "Release Gate",
        status: "BLOCKED",
        color: "error",
        reason: "2 critical release risk(s) open. Resolve before release.",
    },
    {
        gate: "Production Gate",
        status: "BLOCKED",
        color: "error",
        reason: "Production blocked because release gate is blocked.",
    },
];

const SAMPLE_GUARDIAN = `{
  "count": 4,
  "missing_citation": 2,
  "missing_citation_rate": 0.5,
  "unclear_explanations": 2,
  "unclear_rate": 0.5,
  "fabricated_citations": 0,
  "why_questions": 2,
  "overrides": 1,
  "health": "critical"
}`;

const MONITOR_POLICY = `{
  "missing_citation_rate_warn": 0.05,
  "missing_citation_rate_crit": 0.12,
  "unclear_expl_rate_warn": 0.06,
  "unclear_expl_rate_crit": 0.15,
  "fabricated_citation_incident": 0
}`;

export default function TabHLifecycleMonitoring() {
    const [gates, setGates] = useState(SAMPLE_GATES);
    const [guardianSummary, setGuardianSummary] = useState(SAMPLE_GUARDIAN);
    const [pasteOpen, setPasteOpen] = useState(false);
    const [pasteValue, setPasteValue] = useState("");

    const handleLoadSample = () => {
        setGates(SAMPLE_GATES);
        setGuardianSummary(SAMPLE_GUARDIAN);
        setPasteValue(SAMPLE_GUARDIAN);
    };

    const handleApplyGuardian = () => {
        // Simple simulated logic: if guardian health critical, keep blocked; otherwise set release to CONDITIONAL
        if (guardianSummary.toLowerCase().includes("critical")) {
            setGates(SAMPLE_GATES);
        } else {
            setGates((prev) =>
                prev.map((g) =>
                    g.gate === "Release Gate"
                        ? { ...g, status: "CONDITIONAL", color: "warning", reason: "Guardian signals stable; monitor closely." }
                        : g
                )
            );
        }
    };

    const handlePasteApply = () => {
        setGuardianSummary(pasteValue || "No Guardian logs ingested.");
        setPasteOpen(false);
    };

    return (
        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                    alignItems={{ xs: "flex-start", md: "center" }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            H. Lifecycle Enforcement &amp; Monitoring
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Compute gates and monitor runtime explainability using Guardian telemetry. This is where Transparency stays alive in production.
                        </Typography>
                    </Box>

                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} mt={2} spacing={1}>
                    <Button variant="outlined" startIcon={<ContentPasteIcon />} onClick={() => setPasteOpen(true)}>
                        Paste Guardian Logs
                    </Button>
                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleLoadSample}>
                        Load Sample Guardian
                    </Button>
                    <Button variant="contained" startIcon={<PlayCircleOutlineIcon />} onClick={handleApplyGuardian}>
                        Apply Guardian → Risks
                    </Button>
                </Stack>
                <Box
                    sx={{
                        overflowX: "auto",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        mt: 2,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    }}
                >
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Gate</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Blocking logic</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gates.map((row) => (
                                <TableRow key={row.gate} hover>
                                    <TableCell>{row.gate}</TableCell>
                                    <TableCell>
                                        <Chip label={row.status} color={row.color} size="small" />
                                    </TableCell>
                                    <TableCell>{row.reason}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                            <Typography variant="subtitle2">Guardian Signals (last ingested)</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "monospace",
                                    whiteSpace: "pre-wrap",
                                    mt: 1,
                                    p: 1,
                                    bgcolor: "#f8fafc",
                                    borderRadius: 1.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    fontSize: 12,
                                }}
                            >
                                {guardianSummary || "No Guardian logs ingested."}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Used to create production risks and generate runtime evidence artifacts.
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                            <Typography variant="subtitle2">Monitoring Policy</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "monospace",
                                    whiteSpace: "pre-wrap",
                                    mt: 1,
                                    p: 1,
                                    bgcolor: "#f8fafc",
                                    borderRadius: 1.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    fontSize: 12,
                                }}
                            >
                                {MONITOR_POLICY}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                These thresholds drive alerts and incident creation.
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

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
                    <Typography variant="body2">
                        This section is also where you generate the policy pack to push into Guardian: required explanation components per output type, citation format requirements, and escalation rules.
                    </Typography>
                </Box>
            </CardContent>

            <Dialog open={pasteOpen} onClose={() => setPasteOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Paste Guardian Logs</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        multiline
                        minRows={12}
                        value={pasteValue}
                        onChange={(e) => setPasteValue(e.target.value)}
                        placeholder="Paste Guardian logs JSON"
                        InputProps={{ sx: { fontFamily: "monospace" } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPasteOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handlePasteApply}>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
