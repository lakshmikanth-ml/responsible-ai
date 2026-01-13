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
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={600}>Ingest DFA JSON
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Paste DFA output JSON (from the Data Foundation Analyzer app) and ingest to populate readiness fields.
                                </Typography>
                            </Typography>
                            <Chip
                                label={dfaIngested ? "INGESTED" : "MISSING"}
                                color={dfaIngested ? "success" : "warning"}
                                size="small"
                            />
                        </Stack>

                        <Grid container spacing={2} mt={1}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={OWNER_ROLES}
                                    value={ownerRole}
                                    onChange={(_, v) => setOwnerRole(v)}
                                    isOptionEqualToValue={(o, v) => o === v}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            label="Training Readiness Owner"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={["Missing", "Partial", "Ready"]}
                                    value={readiness}
                                    disabled={!dfaIngested}
                                    onChange={(_, v) => {
                                        if (!v) return;
                                        setReadiness(v);
                                        setReadinessAuto(false);
                                    }}
                                    isOptionEqualToValue={(o, v) => o === v}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            label="Training Readiness Interpretation"
                                            helperText={
                                                !dfaIngested
                                                    ? "Ingest DFA to compute readiness"
                                                    : readinessAuto
                                                        ? "Auto-computed from DFA"
                                                        : "Manually overridden"
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}
                                sx={{
                                    border: "1px solid rgba(0, 0, 0, 0.14)",
                                    padding: "9px 10px",
                                    borderRadius: "4px",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"


                                >
                                    <Typography sx={{
                                        alignItems: "center",
                                        display: "flex",
                                    }}>DFA Ingested</Typography>
                                    <Switch checked={dfaIngested} disabled />
                                </Stack>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    multiline
                                    minRows={8}
                                    fullWidth
                                    label="DFA JSON Paste Box"
                                    value={dfaJson}
                                    onChange={(e) => {
                                        setDfaJson(e.target.value);
                                        setDfaIngested(false);
                                        setSummary(null);
                                        setReadiness("Missing");
                                        setReadinessAuto(true);
                                    }}
                                />

                                <Stack direction="row" spacing={1} mt={1}>
                                    <Button variant="contained" onClick={ingestDfa}>Ingest DFA JSON</Button>
                                    <Button variant="outlined" onClick={loadSample}>Load DFA Sample</Button>
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography fontWeight={600}>DFA Readiness Summary</Typography>

                                <Table size="small" sx={{
                                    mt: 2,
                                    borderColor: "#ccc", borderRadius: 8,
                                }} border={1}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Signal</TableCell>
                                            <TableCell>Value</TableCell>
                                            <TableCell>Implication</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {summary ? (
                                            [
                                                ["Dataset", summary.dataset],
                                                ["Contains PII", summary.containsPII],
                                                ["Consent / Approval", summary.consent],
                                                ["Data Lineage", summary.lineage],
                                                ["Access Controls", summary.access],
                                                ["Quality Score", summary.qualityScore],
                                                ["Missing Fields (%)", summary.missingPct],
                                                ["Anomaly Rate (%)", summary.anomalyRate],
                                            ].map(([label, value]) => (
                                                <TableRow key={label}>
                                                    <TableCell>{label}</TableCell>
                                                    <TableCell>{value}</TableCell>
                                                    <TableCell>—</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">No DFA ingested yet.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

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
