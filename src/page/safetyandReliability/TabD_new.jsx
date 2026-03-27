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
                        <Typography variant="body2" >
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
                <Box className="block" sx={{ mt: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                    {/* Block Title */}
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                Pre-Deployment Testing
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Validate stability under load, failures, edge inputs, and realistic workflows.
                            </Typography>
                        </Box>
                        <Chip
                            label={completed ? "COMPLETE" : "MISSING"}
                            color={completed ? "success" : "warning"}
                            size="small"
                        />
                    </Box>

                    {/* Toggle Row 1: Testing Completions */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
                                <Box>
                                    <Typography fontWeight={600} variant="body2">Stress / Load Testing Completed</Typography>
                                    <Typography variant="caption" color="text.secondary">Simulate peak volume (claims storms, broker rush).</Typography>
                                </Box>
                                <Switch checked={stressTested} onChange={(e) => setStressTested(e.target.checked)} />
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
                                <Box>
                                    <Typography fontWeight={600} variant="body2">Chaos / Failure Testing Completed</Typography>
                                    <Typography variant="caption" color="text.secondary">Inject failures (timeouts, downstream outage) to validate resilience.</Typography>
                                </Box>
                                <Switch checked={chaosTested} onChange={(e) => setChaosTested(e.target.checked)} />
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
                                <Box>
                                    <Typography fontWeight={600} variant="body2">Edge Case Suite Executed</Typography>
                                    <Typography variant="caption" color="text.secondary">Unusual inputs, missing fields, outliers, adversarial prompts.</Typography>
                                </Box>
                                <Switch checked={edgeCaseSuite} onChange={(e) => setEdgeCaseSuite(e.target.checked)} />
                            </Stack>
                        </Grid>
                    </Grid>

                    <Box sx={{ height: '10px' }} />

                    {/* Toggle Row 2: UAT + Metrics */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
                                <Box>
                                    <Typography fontWeight={600} variant="body2">UAT Sign-off Completed</Typography>
                                    <Typography variant="caption" color="text.secondary">Business acceptance confirms behavior under realistic usage.</Typography>
                                </Box>
                                <Switch checked={uatDone} onChange={(e) => setUatDone(e.target.checked)} />
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Load Target (RPS)</Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    type="number"
                                    value={loadTargetRPS}
                                    onChange={(e) => setLoadTargetRPS(Number(e.target.value))}
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Peak Concurrent Users</Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    type="number"
                                    value={peakUsers}
                                    onChange={(e) => setPeakUsers(Number(e.target.value))}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ height: '10px' }} />

                    {/* Dropdown Row: Tools + Owner + Location */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Testing Tools</Typography>
                                <TextField
                                    select
                                    size="small"
                                    fullWidth
                                    value={tools}
                                    onChange={(e) => setTools(e.target.value)}
                                >
                                    {TEST_TOOLS.map((tool) => (
                                        <option key={tool} value={tool}>{tool}</option>
                                    ))}
                                </TextField>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Testing Owner</Typography>
                                <TextField
                                    select
                                    size="small"
                                    fullWidth
                                    value={ownerRole}
                                    onChange={(e) => setOwnerRole(e.target.value)}
                                >
                                    {OWNER_ROLES.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </TextField>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Documentation Location</Typography>
                                <TextField
                                    select
                                    size="small"
                                    fullWidth
                                    value={docLocation}
                                    onChange={(e) => setDocLocation(e.target.value)}
                                >
                                    {DOC_LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </TextField>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Checklist Generation Section */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Button variant="outlined" onClick={generateChecklist}>
                                    Generate Recommended Test Checklist
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Generates a practical checklist based on the chosen use case and risk impact.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f5f5f5' }}>
                                {checklist.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Click "Generate Recommended Test Checklist" to view suggested tests for this deployment.
                                    </Typography>
                                ) : (
                                    checklist.map((c, i) => (
                                        <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>• {c}</Typography>
                                    ))
                                )}
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
