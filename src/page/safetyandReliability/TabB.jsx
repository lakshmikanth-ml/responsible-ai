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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

/* ------------------ OPTIONS ------------------ */
const OWNER_ROLES = [
    "Product Owner",
    "AI Product Manager",
    "Head of Data Science",
    "ML Engineering Lead",
    "MLOps / Platform Owner",
    "SRE / DevOps Lead",
    "Security Lead",
    "Compliance Officer",
];

const CADENCE = ["Weekly", "Monthly", "Quarterly"];
const AUDIENCE = [
    "IT & Ops",
    "IT & Ops + Compliance",
    "Business leadership",
    "Risk & Legal",
];

const COMPLIANCE_TOOLS = [
    "Vanta",
    "LogicGate",
    "ServiceNow",
    "Jira/Confluence",
    "None",
];

const DOMAIN_SAFETY = [
    "Decision defensibility",
    "Service availability",
    "Operational risk",
    "Customer harm prevention",
    "Equitable quality",
];

/* ------------------ VALIDATION ------------------ */
const schema = Yup.object({
    sloUptime: Yup.number().min(90).max(100).required(),
    sloLatencyP95: Yup.number().positive().required(),
    sloErrorRate: Yup.number().min(0).max(100).required(),
    sloAccuracyDrop: Yup.number().min(0).required(),
    rtoMinutes: Yup.number().positive().required(),
    rpoMinutes: Yup.number().positive().required(),
    benchmarksOwner: Yup.string().required(),
    measurementCadence: Yup.string().required(),
    reportingAudience: Yup.string().required(),
});

/* ================================================= */
export default function TabBCoverage() {
    const [notes, setNotes] = useState([]);
    const [actor, setActor] = useState(null);
    const [noteText, setNoteText] = useState("");

    const [standards, setStandards] = useState({
        iso27001: true,
        iso9001: true,
        soc2: true,
        localReg: true,
    });

    const formik = useFormik({
        initialValues: {
            sloUptime: 99.9,
            sloLatencyP95: 1200,
            sloErrorRate: 1.0,
            sloAccuracyDrop: 3.0,
            rtoMinutes: 60,
            rpoMinutes: 15,
            benchmarksOwner: "MLOps / Platform Owner",
            measurementCadence: "Monthly",
            reportingAudience: "IT & Ops + Compliance",
            complianceTool: "Vanta",
            domainSafety: "Decision defensibility",
        },
        validationSchema: schema,
        onSubmit: (values) => {
            console.log("SAVE TAB B", { ...values, standards });
        },
    });

    /* ------------------ AUDIT ------------------ */
    const canAddNote = actor && noteText.trim();

    const addNote = () => {
        if (!canAddNote) return;
        setNotes((p) => [
            ...p,
            {
                ts: new Date().toISOString(),
                actor,
                text: noteText,
            },
        ]);
        setActor(null);
        setNoteText("");
    };

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>

                {/* ================= HEADER ================= */}
                <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            B. Coverage
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Define reliability benchmarks (SLO/SLA), standards alignment, and cadence.
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems={"baseline"} spacing={1}>
                        <Button variant="outlined">Load Sample</Button>
                        <Button variant="contained" onClick={formik.handleSubmit}>
                            Save B
                        </Button>
                    </Stack>
                </Stack>



                {/* ================= BENCHMARKS ================= */}
                <Card variant="outlined" >
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={600}>
                                Reliability Benchmarks (SLO/SLA)
                            </Typography>
                            <Chip label="COMPLETE" color="success" size="small" />
                        </Stack>

                        <Grid container spacing={2} mt={1}>
                            {numField(formik, "sloUptime", "Uptime SLO (%)")}
                            {numField(formik, "sloLatencyP95", "Latency P95 (ms)")}
                            {numField(formik, "sloErrorRate", "Error Rate Budget (%)")}
                            {numField(formik, "sloAccuracyDrop", "Quality Degradation (%)")}
                            {numField(formik, "rtoMinutes", "RTO (minutes)")}
                            {numField(formik, "rpoMinutes", "RPO (minutes)")}

                            {selectField(formik, "benchmarksOwner", "Benchmarks Owner", OWNER_ROLES)}
                            {selectField(formik, "measurementCadence", "Measurement Cadence", CADENCE)}
                            {selectField(formik, "reportingAudience", "Reporting Audience", AUDIENCE)}
                        </Grid>
                    </CardContent>
                </Card>

                {/* ================= STANDARDS ================= */}
                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} mb={0.5}>
                            Safety Standards Alignment
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                            Select applicable standards and domain safety considerations.
                        </Typography>

                        <Grid container spacing={2} mb={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" p={1.5} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Box>
                                        <Typography fontWeight={600} variant="body2">ISO 27001 (security controls)</Typography>
                                        <Typography variant="caption" color="text.secondary">Common requirement for enterprise insurers.</Typography>
                                    </Box>
                                    <Switch checked={standards.iso27001} onChange={(e) => setStandards({ ...standards, iso27001: e.target.checked })} />
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" p={1.5} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Box>
                                        <Typography fontWeight={600} variant="body2">ISO 9001 (quality management)</Typography>
                                        <Typography variant="caption" color="text.secondary">Supports process rigor and QA culture.</Typography>
                                    </Box>
                                    <Switch checked={standards.iso9001} onChange={(e) => setStandards({ ...standards, iso9001: e.target.checked })} />
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" p={1.5} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Box>
                                        <Typography fontWeight={600} variant="body2">SOC 2 alignment</Typography>
                                        <Typography variant="caption" color="text.secondary">Often requested for vendor risk assessments.</Typography>
                                    </Box>
                                    <Switch checked={standards.soc2} onChange={(e) => setStandards({ ...standards, soc2: e.target.checked })} />
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" p={1.5} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Box>
                                        <Typography fontWeight={600} variant="body2">Local insurance safety regulations</Typography>
                                        <Typography variant="caption" color="text.secondary">Jurisdiction-specific practices; impacts audits.</Typography>
                                    </Box>
                                    <Switch checked={standards.localReg} onChange={(e) => setStandards({ ...standards, localReg: e.target.checked })} />
                                </Stack>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            {selectField(formik, "complianceTool", "Compliance Tracking Tool", COMPLIANCE_TOOLS)}
                            {selectField(formik, "domainSafety", "Domain Safety Focus", DOMAIN_SAFETY)}
                        </Grid>

                        <Box sx={{
                            mt: 2, p: 1.5,

                            bgcolor: '#f5f5f5',
                            background: "linear-gradient(180deg, #f5f8ff 0%, #f2f6ff 100%)",
                            color: " #0b2a70",
                            borderRadius: 2,
                        }}>
                            <Typography variant="caption"
                                sx={{
                                    color: "#0b2a70;",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    borderRadius: 1,
                                }}>
                                Reliability benchmarks + standards alignment drive monitoring thresholds and alert routes in Tab H, and influence release readiness gates.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* ================= AUDIT ================= */}
                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">


                            <Typography fontWeight={600}>Audit Trail Notes</Typography>

                            <Button size="small" onClick={addNote} disabled={!canAddNote}>
                                Add Note
                            </Button>
                        </Stack>

                        <Grid container spacing={2} mt={1}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={OWNER_ROLES}
                                    value={actor}
                                    onChange={(_, v) => setActor(v)}
                                    renderInput={(p) => <TextField {...p} label="Actor Role" size="small" />}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Note"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
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
                                                <div>{n.text}</div>
                                            </TableCell>
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

/* ------------------ HELPERS ------------------ */
const numField = (f, name, label) => (
    <Grid size={{ xs: 12, md: 4 }}>
        <TextField
            size="small"
            fullWidth
            type="number"
            label={label}
            name={name}
            value={f.values[name]}
            onChange={f.handleChange}
            error={Boolean(f.errors[name])}
            helperText={f.errors[name]}
        />
    </Grid>
);

const selectField = (f, name, label, options) => (
    <Grid size={{ xs: 12, md: 4 }} key={name}>
        <Autocomplete
            fullWidth
            size="small"
            options={options}
            value={f.values[name] || null}
            onChange={(_, value) => f.setFieldValue(name, value || "")}
            onBlur={() => f.setFieldTouched(name, true)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={Boolean(f.touched[name] && f.errors[name])}
                    helperText={f.touched[name] && f.errors[name]}
                />
            )}
        />
    </Grid>
);

const toggle = (label, checked, onChange) => (
    <Grid size={{ xs: 12, md: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography>{label}</Typography>
            <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
        </Stack>
    </Grid>
);
