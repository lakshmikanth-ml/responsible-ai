import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Autocomplete,
    Switch,
    Divider,
    Chip,
} from "@mui/material";
import { useState } from "react";

/**
 * Tab C - Training Readiness (DFA)
 * --------------------------------------------------
 * - MUI v7 layout
 * - DFA JSON paste + ingest
 * - Readiness summary table
 * - Autocomplete based inputs
 * - Audit trail (all-in-one)
 */

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
];

export default function TabCTrainingReadiness() {
    /* ------------------ State ------------------ */
    const [ownerRole, setOwnerRole] = useState("Head of Data Science");
    const [readiness, setReadiness] = useState("Missing");
    const [readinessAuto, setReadinessAuto] = useState(true); // auto vs manual
    const [dfaIngested, setDfaIngested] = useState(false);
    const [dfaJson, setDfaJson] = useState("");
    const [summary, setSummary] = useState(null);

    // Audit
    const [actor, setActor] = useState(null);
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);

    /* ------------------ DFA INGEST ------------------ */
    const ingestDfa = () => {
        try {
            const parsed = JSON.parse(dfaJson);

            const nextSummary = {
                dataset: parsed.datasetName || "—",
                containsPII: parsed.containsPII ? "YES" : "NO",
                consent: parsed.consentStatus || "unknown",
                lineage: parsed.dataLineage || "unknown",
                access: parsed.accessControls || "unknown",
                qualityScore: parsed.qualityScore ?? 0,
                missingPct: parsed.missingFieldsPct ?? 0,
                anomalyRate: parsed.anomalyRatePct ?? 0,
            };

            setSummary(nextSummary);
            setDfaIngested(true);
            setReadinessAuto(true);

            // auto compute readiness once per ingest
            if (nextSummary.qualityScore >= 80 && nextSummary.missingPct <= 5) {
                setReadiness("Ready");
            } else {
                setReadiness("Partial");
            }
        } catch {
            alert("Invalid DFA JSON");
        }
    };

    const loadSample = () => {
        setDfaJson(
            JSON.stringify(
                {
                    datasetName: "claims_training_v3",
                    containsPII: false,
                    consentStatus: "approved",
                    dataLineage: "verified",
                    accessControls: "role-based",
                    qualityScore: 82,
                    missingFieldsPct: 2,
                    anomalyRatePct: 1,
                },
                null,
                2
            )
        );

        // reset state until ingest is clicked
        setDfaIngested(false);
        setSummary(null);
        setReadiness("Missing");
        setReadinessAuto(true);
    };

    /* Helper to determine status color */
    const getStatusColor = (label, value) => {
        if (label === "Contains PII") return value === "NO" ? "success" : "warning";
        if (label === "Consent / Approval") return value === "approved" ? "success" : "warning";
        if (label === "Data Lineage") return value === "verified" ? "success" : "warning";
        if (label === "Access Controls") return value === "role-based" ? "success" : "warning";
        if (label === "Quality Score") {
            if (value >= 80) return "success";
            if (value >= 50) return "warning";
            return "error";
        }
        if (label === "Missing Fields (%)" || label === "Anomaly Rate (%)") {
            if (value <= 5) return "success";
            if (value <= 15) return "warning";
            return "error";
        }
        return "default";
    };

    const renderStatusChip = (label, value) => {
        const color = getStatusColor(label, value);
        return (
            <Chip
                label={String(value)}
                color={color}
                size="small"
                variant="outlined"
            />
        );
    };

    /* ------------------ AUDIT ------------------ */
    const canAdd = Boolean(actor && note.trim());
    const addNote = () => {
        if (!canAdd) return;
        setNotes((p) => [...p, { ts: new Date().toISOString(), actor, note }]);
        setActor(null);
        setNote("");
    };

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                {/* ================= HEADER ================= */}
                <Stack direction="row" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            C. Training Readiness (DFA)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ingest DFA JSON and validate training data readiness.
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems={"baseline"} spacing={1}>
                        <Button variant="outlined" onClick={loadSample}>Load Sample</Button>
                        <Button variant="contained">Save C</Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* ================= INGEST ================= */}
                <Box className="block" sx={{ mt: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                    {/* Block Title */}
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                Ingest DFA JSON
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Paste DFA output JSON (from the Data Foundation Analyzer app) and ingest to populate readiness fields.
                            </Typography>
                        </Box>
                        <Chip
                            label={dfaIngested ? "INGESTED" : "MISSING"}
                            color={dfaIngested ? "success" : "warning"}
                            size="small"
                        />
                    </Box>

                    {/* Fields Row */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                Training Readiness Owner
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                value={ownerRole}
                                onChange={(e) => setOwnerRole(e.target.value)}
                            >
                                {OWNER_ROLES.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                Training Readiness Interpretation
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                disabled={!dfaIngested}
                                value={readiness}
                                onChange={(e) => {
                                    setReadiness(e.target.value);
                                    setReadinessAuto(false);
                                }}
                            >
                                {["Missing", "Partial", "Ready"].map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
                                <Box>
                                    <Typography fontWeight={600} variant="body2">DFA Ingested</Typography>
                                    <Typography variant="caption" color="text.secondary">Must be true to pass Pre-Training Gate.</Typography>
                                </Box>
                                <Switch checked={dfaIngested} disabled />
                            </Stack>
                        </Grid>
                    </Grid>

                    <Box sx={{ height: '10px' }} />

                    {/* Split Layout: Paste Box + Summary Table */}
                    <Grid container spacing={2}>
                        {/* Left: JSON Paste Box */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                    DFA JSON Paste Box
                                </Typography>
                                <TextField
                                    multiline
                                    minRows={10}
                                    fullWidth
                                    placeholder='Paste DFA JSON here (e.g., {"datasetName":"...","qualityScore":82,...})'
                                    value={dfaJson}
                                    onChange={(e) => {
                                        setDfaJson(e.target.value);
                                        setDfaIngested(false);
                                        setSummary(null);
                                        setReadiness("Missing");
                                        setReadinessAuto(true);
                                    }}
                                />
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Button variant="contained" onClick={ingestDfa}>Ingest DFA JSON</Button>
                                    <Button variant="outlined" onClick={loadSample}>Load DFA Sample</Button>
                                </Stack>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    In real deployment: this would be fetched from DFA via API. Demo uses paste + sample.
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Right: Summary Table */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                                    DFA Readiness Summary
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                    Populated after ingest.
                                </Typography>

                                <Box sx={{ overflowX: 'auto', width: '100%' }}>
                                    <Table size="small" sx={{ border: '1px solid #ccc', minWidth: 400 }}>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell fontWeight={600}>Signal</TableCell>
                                                <TableCell fontWeight={600}>Value</TableCell>
                                                <TableCell fontWeight={600}>Implication</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {summary ? (
                                                [
                                                    ["Dataset", summary.dataset, "Used to establish traceability for training inputs."],
                                                    ["Contains PII", summary.containsPII, "PII requires stronger controls; affects safety in failure modes."],
                                                    ["Consent / Approval", summary.consent, "Training on unapproved data is a release blocker."],
                                                    ["Data Lineage", summary.lineage, "Unknown lineage increases audit risk and instability under edge cases."],
                                                    ["Access Controls", summary.access, "Weak controls elevate operational and safety risk."],
                                                    ["Quality Score", summary.qualityScore, "Low quality can cause unpredictable outputs; impacts reliability."],
                                                    ["Missing Fields (%)", summary.missingPct, "Missing data often triggers failure modes under real usage."],
                                                    ["Anomaly Rate (%)", summary.anomalyRate, "Higher anomalies require robust fallback and edge-case testing."],
                                                ].map(([label, value, implication]) => (
                                                    <TableRow key={label}>
                                                        <TableCell>{label}</TableCell>
                                                        <TableCell>{renderStatusChip(label, value)}</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem' }}>{implication}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                [
                                                    ["Dataset", "—", "Used to establish traceability for training inputs."],
                                                    ["Contains PII", "NO", "PII requires stronger controls; affects safety in failure modes."],
                                                    ["Consent / Approval", "unknown", "Training on unapproved data is a release blocker."],
                                                    ["Data Lineage", "unknown", "Unknown lineage increases audit risk and instability under edge cases."],
                                                    ["Access Controls", "unknown", "Weak controls elevate operational and safety risk."],
                                                    ["Quality Score", "0", "Low quality can cause unpredictable outputs; impacts reliability."],
                                                    ["Missing Fields (%)", "0", "Missing data often triggers failure modes under real usage."],
                                                    ["Anomaly Rate (%)", "0", "Higher anomalies require robust fallback and edge-case testing."],
                                                ].map(([label, value, implication]) => (
                                                    <TableRow key={label}>
                                                        <TableCell>{label}</TableCell>
                                                        <TableCell>{renderStatusChip(label, value)}</TableCell>
                                                        <TableCell sx={{ fontSize: '0.85rem' }}>{implication}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </Box>

                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                                    Gate logic uses DFA ingestion + key readiness indicators to compute Pre-Training gate status.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* ================= AUDIT ================= */}
                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={600}>Audit Trail Notes</Typography>
                            <Button size="small" onClick={addNote} disabled={!canAdd}>Add Note</Button>
                        </Stack>

                        <Grid container spacing={2} mt={1}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={OWNER_ROLES}
                                    value={actor}
                                    onChange={(_, v) => setActor(v)}
                                    renderInput={(p) => (
                                        <TextField {...p} size="small" label="Actor Role" />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Table size="small" sx={{ mt: 2, borderColor: "#ccc", borderRadius: "8px" }} border={1}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Entry</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {notes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">No audit notes yet.</TableCell>
                                    </TableRow>
                                ) : (
                                    notes.map((n, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{n.ts}</TableCell>
                                            <TableCell>
                                                <b>{n.actor}</b>
                                                <div>{n.note}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </CardContent >
        </Card >
    );
}
