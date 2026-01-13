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
    Switch,
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
 * Tab D - Evaluation
 * --------------------------------------------------
 * - Pre-deployment testing checklist
 * - Manual toggle completion
 * - MUI v7 compatible layout
 * - Audit trail included
 */

const TEST_TOOLS = ["JMeter", "LoadRunner", "k6", "Chaos Mesh", "Gremlin", "Other"];

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

const DOC_LOCATIONS = ["Evidence Vault", "Confluence", "SharePoint", "ServiceNow"];

export default function TabDEvaluation() {
    /* ------------------ State ------------------ */
    const [stressTested, setStressTested] = useState(false);
    const [chaosTested, setChaosTested] = useState(false);
    const [edgeCaseSuite, setEdgeCaseSuite] = useState(false);
    const [uatDone, setUatDone] = useState(false);

    const [loadTargetRPS, setLoadTargetRPS] = useState(500);
    const [peakUsers, setPeakUsers] = useState(25000);
    const [tools, setTools] = useState("JMeter");
    const [ownerRole, setOwnerRole] = useState("SRE / DevOps Lead");
    const [docLocation, setDocLocation] = useState("Evidence Vault");

    const [checklist, setChecklist] = useState([]);

    // Audit
    const [actor, setActor] = useState(null);
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);

    /* ------------------ Derived ------------------ */
    const completed = stressTested && chaosTested && edgeCaseSuite && uatDone;

    /* ------------------ Actions ------------------ */
    const generateChecklist = () => {
        const list = [];
        if (!stressTested) list.push("Run peak load test at target RPS");
        if (!chaosTested) list.push("Inject downstream failures and timeouts");
        if (!edgeCaseSuite) list.push("Execute adversarial and malformed input tests");
        if (!uatDone) list.push("Obtain UAT business sign-off");
        setChecklist(list);
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
                {/* ================= HEADER ================= */}
                <Stack direction="row" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" fontWeight={700}>D. Evaluation</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pre-deployment testing: stress, chaos, edge cases, and UAT.
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems={"baseline"} spacing={1}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setStressTested(false);
                                setChaosTested(false);
                                setEdgeCaseSuite(false);
                                setUatDone(false);
                                setLoadTargetRPS(500);
                                setPeakUsers(25000);
                                setTools("JMeter");
                                setOwnerRole("SRE / DevOps Lead");
                                setDocLocation("Evidence Vault");
                                setChecklist([]);
                            }}
                        >
                            Load Sample
                        </Button>
                        <Button variant="outlined" disabled={!completed}>Save D</Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* ================= PRE-DEPLOYMENT ================= */}
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={600}>Pre-Deployment Testing
                                <Typography variant="body2" color="text.secondary"
                                    sx={{ ml: 0 }} gutterBottom>

                                    Validate stability under load, failures, edge inputs, and realistic workflows.
                                </Typography>



                            </Typography>
                            <Chip
                                label={completed ? "COMPLETE" : "MISSING"}
                                color={completed ? "success" : "warning"}
                                size="small"
                            />
                        </Stack>

                        <Grid container spacing={2} mt={1}>
                            {toggle(
                                "Stress / Load Testing Completed",
                                "Simulate peak volume (claims storms, broker rush).",
                                stressTested,
                                setStressTested
                            )}
                            {toggle(
                                "Chaos / Failure Testing Completed",
                                "Inject failures such as timeouts or downstream outages.",
                                chaosTested,
                                setChaosTested
                            )}
                            {toggle(
                                "Edge Case Suite Executed",
                                "Unusual inputs, missing fields, outliers, adversarial prompts.",
                                edgeCaseSuite,
                                setEdgeCaseSuite
                            )}
                            {toggle(
                                "UAT Sign-off Completed",
                                "Business acceptance under realistic workflows.",
                                uatDone,
                                setUatDone
                            )}

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Load Target (RPS)"
                                    type="number"
                                    value={loadTargetRPS}
                                    onChange={(e) => setLoadTargetRPS(Number(e.target.value))}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Peak Concurrent Users"
                                    type="number"
                                    value={peakUsers}
                                    onChange={(e) => setPeakUsers(Number(e.target.value))}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={TEST_TOOLS}
                                    value={tools}
                                    onChange={(_, v) => setTools(v)}
                                    renderInput={(params) => (
                                        <TextField {...params} size="small" label="Testing Tools" />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={OWNER_ROLES}
                                    value={ownerRole}
                                    onChange={(_, v) => setOwnerRole(v)}
                                    renderInput={(params) => (
                                        <TextField {...params} size="small" label="Testing Owner" />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={DOC_LOCATIONS}
                                    value={docLocation}
                                    onChange={(_, v) => setDocLocation(v)}
                                    renderInput={(params) => (
                                        <TextField {...params} size="small" label="Documentation Location" />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Button variant="outlined" onClick={generateChecklist}>
                                    Generate Recommended Test Checklist
                                </Button>
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                    Generates a checklist based on missing evaluation items.
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{
                                    p: 2, border: "1px solid #ccc",
                                    borderColor: "divider", borderRadius: 2,
                                    backgroundColor: "#f9f9f9",
                                }}>
                                    {checklist.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">
                                            Click “Generate Recommended Test Checklist” to view suggested tests.
                                        </Typography>
                                    ) : (
                                        checklist.map((c, i) => (
                                            <Typography key={i} variant="body2">• {c}</Typography>
                                        ))
                                    )}
                                </Box>
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
                                    renderInput={(p) => <TextField {...p} size="small" label="Actor Role" />}
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
                                            <TableCell><b>{n.actor}</b><div>{n.note}</div></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}

const toggle = (label, description, checked, onChange) => (
    <Grid size={{ xs: 12, md: 4 }}>
        <Box
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                height: "100%",
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography fontWeight={500}>{label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {description}
                    </Typography>
                </Box>
                <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
            </Stack>
        </Box>
    </Grid>
);
