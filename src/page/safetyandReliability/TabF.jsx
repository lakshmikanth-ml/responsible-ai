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
        title: "Ingest DFA JSON and review readiness summary",
        description:
            "Paste DFA JSON or load DFA sample in Tab C.",
        severity: "Critical",
        owner: "SRE / DevOps Lead",
        status: "Open",
        due: "",
        notes: "",


    },
    {
        id: "SR-RISK-005",
        title: "Run stress tests and edge-case validation suite",
        description:
            "Complete Tab D checks; attach report in Evidence (Tab G).",
        severity: "Critical",
        owner: "SRE / DevOps Lead",
        status: "Open",
        due: "",
        notes: "",

    },
    {
        id: "SR-RISK-006",
        title: "Approve failover / fallback protocol",
        description:
            "Upload + approve protocols(ev3) and test failover drills.",
        severity: "Critical",
        owner: "SRE / DevOps Lead",
        status: "Open",
        due: "",
        notes: "",

    },
];

export default function TabFGapsRisks() {
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

                            F. Mitigation

                        </Typography>
                        <Typography variant="body2" >
                            Action plan to close safety and reliability risks (owners + due dates).
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems={"baseline"} spacing={1}>
                        <Button variant="outlined" onClick={refreshRisks}>
                            Load Sample
                        </Button>
                        <Button variant="outlined" >
                            Save F
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* RISK REGISTER */}
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6" >
                                Risk Register (Auto-Generated)
                                <Typography variant="body2"
                                 display="block"  gutterBottom>

                                    Generated from missing controls across tabs + runtime signals. Update owner/status/due date.
                                </Typography>
                            </Typography>
                            <Chip
                                label={allClosed ? "COMPLETE" : "PARTIAL"}
                                size="small"
                                sx={(theme) => ({
                                    bgcolor: allClosed 
                                        ? (theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)')
                                        : (theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(251, 146, 60, 0.08)'),
                                    border: '1px solid',
                                    borderColor: allClosed 
                                        ? (theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)')
                                        : (theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.3)'),
                                    color: allClosed ? '#4caf50' : '#f97316',
                                    fontWeight: 600,
                                })}
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
                               
                            }}
                        >
                            <Table>
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
 <Chip 
                                                    label={r.severity} 
                                                    size="small"
                                                    sx={(theme) => ({
                                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                                                        border: '1px solid',
                                                        borderColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)',
                                                        color: '#f44336',
                                                        fontWeight: 600,
                                                    })}
                                                />                                            </TableCell>

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
                                border: '1px solid',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(171, 171, 171, 0.15)' 
                                    : '#888f9e',
                                background: (theme) => theme.palette.mode === 'dark' 
                                    ? 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)' 
                                    : 'linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
                                borderRadius: '14px',
                                padding: '12px',
                                color: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.9)' 
                                    : '#0b2a70'
                            }}
                        >
                            Mitigation drives release readiness. Gates improve only when risks/actions are actually closed and evidence is approved.
                        </Box>
                    </CardContent>
                </Card>

                {/* AUDIT */}
                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6">Audit Trail Notes</Typography>
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

<TableContainer sx={{mt:2}}>
                        <Table 
                           >
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
                        </TableContainer>
                    </CardContent>
                </Card>
            </CardContent >
        </Card >
    );
}
