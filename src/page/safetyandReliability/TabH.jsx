import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    TextField,
    Autocomplete,
    Divider,
    Chip,
    Switch,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
} from "@mui/material";
import { useState } from "react";
import AuditTrail from "./AuditNotes";

const OWNER_ROLES = [
    "Product Owner",
    "AI Product Manager",
    "Head of Data Science",
    "ML Engineering Lead",
    "MLOps / Platform Owner",
    "SRE / DevOps Lead",
    "Security Lead",
    "Compliance Officer",
    "Model Risk Owner",
    "Claims Ops SME",
    "Underwriting SME",
    "Customer Support Lead",
];

const REVIEW_CADENCE = ["Daily", "Weekly", "Monthly"];

export default function TabHGatesMonitoring() {
    const [monitoringEnabled, setMonitoringEnabled] = useState(true);
    const [primaryOwner, setPrimaryOwner] = useState("SRE / DevOps Lead");
    const [secondaryOwner, setSecondaryOwner] = useState("AI Product Manager");
    const [reviewCadence, setReviewCadence] = useState("Weekly");

    const [thresholds, setThresholds] = useState({
        uptime24h: "99.5",
        p95LatencyMs: "1500",
        errorRatePct: "1.5",
        violationRatePct: "0.5",
        driftScore: "0.35",
    });

    const [signals, setSignals] = useState([]);

    const updateThreshold = (k, v) =>
        setThresholds((p) => ({ ...p, [k]: v }));

    const loadSampleSignals = () => {
        setSignals([
            {
                ts: "2026-01-13T09:15:00Z",
                project: "Claims AI",
                model: "v1.2",
                endpoint: "/predict",
                input: "Claim approval",
                output: "Approved",
                violations: "Latency",
                rules: "P95 > threshold",
                feedback: "Investigate",
                actions: "Alert sent",
            },
        ]);
    };

    const clearSignals = () => setSignals([]);

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            H. Gates & Monitoring
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Connect runtime signals (Guardian) to monitoring thresholds and escalation.
                        </Typography>
                    </Box>
                    <Stack direction="row" alignItems={"baseline"} spacing={1}>
                        <Button variant="outlined">Load Sample</Button>
                        <Button variant="contained" disabled={!monitoringEnabled}>
                            Save H
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* MONITORING THRESHOLDS */}
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={600}>
                                Monitoring Thresholds & Alert Routing
                                <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
                                    These values become enforcement thresholds in Guardian policy pack and drive Production Gate.
                                </Typography>

                            </Typography>
                            <Chip
                                label={monitoringEnabled ? "PARTIAL" : "BLOCKED"}
                                color={monitoringEnabled ? "warning" : "error"}
                                size="small"
                            />
                        </Stack>

                        <Grid container spacing={2} mt={1}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        p: 2,
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between">
                                        <Box>
                                            <Typography fontWeight={500}>Monitoring Enabled</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                If disabled, production gate will remain blocked.
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={monitoringEnabled}
                                            onChange={(e) => setMonitoringEnabled(e.target.checked)}
                                        />
                                    </Stack>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={OWNER_ROLES}
                                    value={primaryOwner}
                                    onChange={(_, v) => setPrimaryOwner(v)}
                                    renderInput={(p) => (
                                        <TextField {...p} label="Primary Alert Owner" size="small" />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={OWNER_ROLES}
                                    value={secondaryOwner}
                                    onChange={(_, v) => setSecondaryOwner(v)}
                                    renderInput={(p) => (
                                        <TextField {...p} label="Secondary Escalation" size="small" />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} mt={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={REVIEW_CADENCE}
                                    value={reviewCadence}
                                    onChange={(_, v) => setReviewCadence(v)}
                                    renderInput={(p) => (
                                        <TextField {...p} label="Review Cadence" size="small" />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    label="Uptime threshold (24h, %)"
                                    value={thresholds.uptime24h}
                                    onChange={(e) => updateThreshold("uptime24h", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    label="Latency P95 threshold (ms)"
                                    value={thresholds.p95LatencyMs}
                                    onChange={(e) => updateThreshold("p95LatencyMs", e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} mt={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    label="Error rate threshold (%)"
                                    value={thresholds.errorRatePct}
                                    onChange={(e) => updateThreshold("errorRatePct", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    label="Violation rate threshold (%)"
                                    value={thresholds.violationRatePct}
                                    onChange={(e) => updateThreshold("violationRatePct", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    label="Drift score threshold"
                                    value={thresholds.driftScore}
                                    onChange={(e) => updateThreshold("driftScore", e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Box mt={2} color="text.secondary"
                            sx={{
                                border: "1px solid #dbe6ff",
                                background: "linear-gradient(180deg, #f5f8ff 0%, #f2f6ff 100%)",
                                borderRadius: "14px",
                                padding: "12px",
                                color: "#0b2a70"
                            }}

                        >
                            Guardian signals feed this tab. Guardian Health card is computed from recent violations + actions.
                        </Box>
                    </CardContent>
                </Card>

                {/* GUARDIAN SIGNALS */}
                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography fontWeight={600}>Guardian Runtime Signals (Ingest)</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Runtime events table (from Guardian). In demo, load sample or paste JSON array.
                        </Typography>

                        <Stack direction="row" spacing={1} mt={1}>
                            <Button variant="contained" onClick={loadSampleSignals}>
                                Load Guardian Sample
                            </Button>
                            <Button variant="outlined" onClick={clearSignals}>
                                Clear Signals
                            </Button>
                        </Stack>

                        <Grid container spacing={2} mt={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    multiline
                                    minRows={4}
                                    fullWidth
                                    label="Paste Guardian Signals JSON"
                                    placeholder="Paste Guardian signals JSON array here (optional)"
                                />
                                <Stack direction="row" spacing={1} mt={1}>
                                    <Button variant="outlined">Ingest Guardian JSON</Button>
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                    Schema fields: Timestamp, Project, Model Version, Endpoint, User Input, Model Output, Violations, Rules Triggered, SME Feedback, Actions.
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography fontWeight={600}>Health Rollup (Last 24h)</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Computed summary from Guardian signals.
                                        </Typography>
                                        <Box mt={1} color="text.secondary">
                                            {signals.length === 0
                                                ? "No runtime signals loaded yet."
                                                : "Signals detected – review thresholds."}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <TableContainer sx={{
                            mt: 2,
                            border: "1px solid #ccc", borderRadius: 2
                        }}>
                            <Table size="small" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Project</TableCell>
                                        <TableCell>Model</TableCell>
                                        <TableCell>Endpoint</TableCell>
                                        <TableCell>User Input</TableCell>
                                        <TableCell>Model Output</TableCell>
                                        <TableCell>Violations</TableCell>
                                        <TableCell>Rules</TableCell>
                                        <TableCell>SME Feedback</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {signals.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center">
                                                No signals loaded. Click "Load Guardian Sample".
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        signals.map((s, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{s.ts}</TableCell>
                                                <TableCell>{s.project}</TableCell>
                                                <TableCell>{s.model}</TableCell>
                                                <TableCell>{s.endpoint}</TableCell>
                                                <TableCell>{s.input}</TableCell>
                                                <TableCell>{s.output}</TableCell>
                                                <TableCell>{s.violations}</TableCell>
                                                <TableCell>{s.rules}</TableCell>
                                                <TableCell>{s.feedback}</TableCell>
                                                <TableCell>{s.actions}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* AUDIT TRAIL */}
                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography fontWeight={600}>Audit Trail Notes</Typography>
                        <Grid container spacing={2} mt={1}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={OWNER_ROLES}
                                    renderInput={(p) => (
                                        <TextField {...p} label="Actor Role" size="small" />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Note"
                                    placeholder="e.g., Updated latency threshold after UAT peak test results."
                                />
                            </Grid>
                        </Grid>
                        <TableContainer sx={{
                            mt: 2,
                            border: "1px solid #ccc", borderRadius: 2
                        }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Entry</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">
                                            No audit notes yet.
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </CardContent>

        </Card>
    );
}
