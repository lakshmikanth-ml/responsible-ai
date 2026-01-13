import {
    Box,
    Card,
    TableContainer,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    TextField,
    Autocomplete,
    Divider,
    Chip,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { useState } from "react";

/**
 * Tab E - Gaps & Risks
 * --------------------------------------------------
 * - Auto-generated risk register
 * - Editable owner / status / due date / notes
 * - Partial / Complete state
 * - Audit trail included
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
    "Claims Ops SME",
    "Underwriting SME",
    "Customer Support Lead",
];

const STATUSES = ["Open", "In Progress", "Closed"];

const INITIAL_RISKS = [
    {
        id: "SR-RISK-003",
        title: "Training readiness not validated (DFA not ingested)",
        description:
            "Data readiness affects stability (missing fields/anomalies) and safe behavior in edge cases.",
        severity: "Critical",
        owner: "SRE / DevOps Lead",
        status: "Open",
        due: "",
        notes: "",
    },
    {
        id: "SR-RISK-005",
        title: "Pre-deployment robustness testing incomplete",
        description:
            "Without stress/edge testing, system may fail under peak broker/claim volume or unusual inputs.",
        severity: "Critical",
        owner: "SRE / DevOps Lead",
        status: "Open",
        due: "",
        notes: "",
    },
    {
        id: "SR-RISK-006",
        title: "Failover/fallback protocols not approved",
        description:
            "If primary service fails, system must degrade safely (fallback model, cached responses, or human escalation).",
        severity: "Critical",
        owner: "SRE / DevOps Lead",
        status: "Open",
        due: "",
        notes: "",
    },
];

export default function TabEGapsRisks() {
    const [risks, setRisks] = useState(INITIAL_RISKS);

    // Audit
    const [actor, setActor] = useState(null);
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);

    const allClosed = risks.every((r) => r.status === "Closed");

    const updateRisk = (id, field, value) => {
        setRisks((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        );
    };

    const refreshRisks = () => setRisks(INITIAL_RISKS);

    const closeNonCritical = () => {
        setRisks((prev) =>
            prev.map((r) =>
                r.severity !== "Critical" ? { ...r, status: "Closed" } : r
            )
        );
    };

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
                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            E. Gaps & Risks
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Auto-generated risk register with severity, owner, and status.
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems={"baseline"} spacing={1}>
                        <Button variant="outlined" onClick={refreshRisks}>
                            Load Sample
                        </Button>
                        <Button variant="outlined" disabled={!allClosed}>
                            Save E
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* RISK REGISTER */}
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={600}>
                                Risk Register (Auto-Generated)
                                <Typography variant="body2" display="block" color="text.secondary" gutterBottom>

                                    Generated from missing controls across tabs + runtime signals. Update owner/status/due date.
                                </Typography>
                            </Typography>
                            <Chip
                                label={allClosed ? "COMPLETE" : "PARTIAL"}
                                color={allClosed ? "success" : "warning"}
                                size="small"
                            />
                        </Stack>

                        <Stack direction="row" spacing={1} mt={1}>
                            <Button size="small" variant="outlined" onClick={refreshRisks}>
                                Refresh Risks
                            </Button>
                            <Button size="small" variant="outlined" onClick={closeNonCritical}>
                                Close all non-critical (demo)
                            </Button>
                        </Stack>

                        <TableContainer
                            sx={{
                                mt: 2,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                overflowX: "auto",
                            }}
                        >
                            <Table
                                size="small"
                                sx={{
                                    mt: 2, borderColor: "#ccc", borderRadius: "8px",
                                    borderCollapse: "separate", borderSpacing: "0 8px"
                                }}

                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Risk</TableCell>
                                        <TableCell>Severity</TableCell>
                                        <TableCell>Owner</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Due date</TableCell>
                                        <TableCell>Notes</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {risks.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell sx={{ fontFamily: "monospace", whiteSpace: "nowrap" }}>
                                                {r.id}
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 260 }}>
                                                <b>{r.title}</b>
                                                <Typography variant="caption" display="block">
                                                    {r.description}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip label={r.severity} color="error" size="small" />
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 200 }}>
                                                <Autocomplete
                                                    size="small"
                                                    options={OWNER_ROLES}
                                                    value={r.owner}
                                                    onChange={(_, v) => updateRisk(r.id, "owner", v)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} size="small" />
                                                    )}
                                                />
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 160 }}>
                                                <Autocomplete
                                                    size="small"
                                                    options={STATUSES}
                                                    value={r.status}
                                                    onChange={(_, v) => updateRisk(r.id, "status", v)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} size="small" />
                                                    )}
                                                />
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 150 }}>
                                                <TextField
                                                    type="date"
                                                    size="small"
                                                    fullWidth
                                                    value={r.due}
                                                    onChange={(e) => updateRisk(r.id, "due", e.target.value)}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 200 }}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    placeholder="Short note"
                                                    value={r.notes}
                                                    onChange={(e) =>
                                                        updateRisk(r.id, "notes", e.target.value)
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                        <Box mt={2} color="text.secondary"
                            sx={{
                                border: "1px solid #dbe6ff",
                                background: "linear-gradient(180deg, #f5f8ff 0%, #f2f6ff 100%)",
                                borderRadius: "14px",
                                padding: "12px",
                                color: "#0b2a70"
                            }}
                        >
                            Critical risks block gates. Close risks by completing controls,
                            approving evidence, and configuring monitoring.
                        </Box>
                    </CardContent>
                </Card>

                {/* AUDIT */}
                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={600}>Audit Trail Notes</Typography>
                            <Button size="small" onClick={addNote} disabled={!canAdd}>
                                Add Note
                            </Button>
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

                        <Table size="small" mt={2}
                            sx={{
                                mt: 2, borderColor: "#ccc", borderRadius: "8px",
                                border: "1px solid #ccc", borderSpacing: "0 8px"
                            }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Entry</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {notes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">
                                            No audit notes yet.
                                        </TableCell>
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
