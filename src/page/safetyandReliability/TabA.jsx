import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Stack,
    Chip,
    TextField,
    MenuItem,
    Switch,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import AuditTrail from "./AuditNotes";

/* ------------------ Validation ------------------ */
const validationSchema = Yup.object({
    primaryUseCase: Yup.string().required(),
    deploymentTier: Yup.string().required(),
    operationalMode: Yup.string().required(),
    intendedUsers: Yup.string().required(),
    riskImpact: Yup.string().required(),
    unacceptableOutcome: Yup.string().required(),
    safetyOwnerRole: Yup.string().required(),
    reliabilityOwnerRole: Yup.string().required(),
    clientStakeholder: Yup.string().required(),
});

export default function ObjectiveTabA() {
    const [notes, setNotes] = useState([]);
    const [noteActor, setNoteActor] = useState("");
    const [noteText, setNoteText] = useState("");
    const [oversightEnabled, setOversightEnabled] = useState(true);
    const [ownersAssigned, setOwnersAssigned] = useState(false);


    const handleGenerate = () => {
        const result = [];


        if (!oversightEnabled) {
            result.push("Human oversight is disabled");
        }
        if (!ownersAssigned) {
            result.push("Incident owners are not assigned");
        }


        alert(
            result.length === 0
                ? "No risks detected"
                : `Generated Risks:\n\n${result.join("\n")}`
        );
    };

    const formik = useFormik({
        initialValues: {
            primaryUseCase: "claims_triage",
            deploymentTier: "prod",
            operationalMode: "human_in_loop",
            intendedUsers: "claims_ops",
            riskImpact: "high",
            unacceptableOutcome: "unsafe_output",
            safetyOwnerRole: "SRE / DevOps Lead",
            reliabilityOwnerRole: "MLOps / Platform Owner",
            clientStakeholder: "IT & Ops",
        },
        validationSchema,
        onSubmit: (values) => {
            console.log("SAVE TAB A:", values);
        },
    });

    const addNote = () => {
        if (!noteActor || !noteText) return;
        setNotes([
            ...notes,
            {
                ts: new Date().toLocaleString(),
                text: `${noteActor}: ${noteText}`,
            },
        ]);
        setNoteText("");
    };




    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>

                {/* ================= Header ================= */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            A. Objective
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Define safety intent, failure definition, and accountable owners.
                        </Typography>
                    </Box>
                    <Stack direction="row" alignItems={"baseline"} spacing={1} mt={2} >
                        <Button variant="outlined">Load Sample</Button>
                        <Button variant="contained" onClick={formik.handleSubmit}>
                            Save A
                        </Button>
                    </Stack>


                </Stack>




                <Grid container spacing={2} mt={2}>
                    {/* ================= LEFT COLUMN ================= */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        {/* ---- Safety & Reliability Intent ---- */}
                        <Card variant="outlined">
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>
                                        <Typography fontWeight={600}>
                                            Safety & Reliability Intent
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Define why safety/reliability is required, what failure looks like, and who is accountable.
                                        </Typography>
                                    </Box>
                                    <Chip label="COMPLETE" color="success" size="small" />
                                </Stack>

                                <Grid container spacing={2} mt={1}>
                                    {renderSelect(formik, "primaryUseCase", "Primary Use Case", [
                                        { v: "claims_triage", l: "Claims triage recommendations" },
                                        { v: "underwriting_assist", l: "Underwriting assist" },
                                        { v: "policy_qna", l: "Policy Q&A assistant" },
                                    ])}

                                    {renderSelect(formik, "deploymentTier", "Deployment Tier", [
                                        { v: "poc", l: "PoC / Sandbox" },
                                        { v: "uat", l: "UAT / Staging" },
                                        { v: "prod", l: "Production" },
                                    ])}

                                    {renderSelect(formik, "operationalMode", "Operational Mode", [
                                        { v: "human_in_loop", l: "Human-in-the-loop" },
                                        { v: "human_on_loop", l: "Human-on-the-loop" },
                                        { v: "fully_automated", l: "Fully automated" },
                                    ])}

                                    {renderSelect(formik, "intendedUsers", "Intended Users", [
                                        { v: "claims_ops", l: "Claims Operations" },
                                        { v: "underwriters", l: "Underwriters" },
                                        { v: "agents", l: "Agents" },
                                    ])}

                                    {renderSelect(formik, "riskImpact", "Risk Impact Level", [
                                        { v: "low", l: "Low" },
                                        { v: "medium", l: "Medium" },
                                        { v: "high", l: "High" },
                                    ])}

                                    {renderSelect(
                                        formik,
                                        "unacceptableOutcome",
                                        "Unacceptable Outcome",
                                        [
                                            { v: "unsafe_output", l: "Unsafe recommendation" },
                                            { v: "latency_spike", l: "Latency spike" },
                                            { v: "silent_degradation", l: "Silent degradation" },
                                        ]
                                    )}

                                    {renderSelect(
                                        formik,
                                        "safetyOwnerRole",
                                        "Safety Owner",
                                        OWNER_ROLES
                                    )}

                                    {renderSelect(
                                        formik,
                                        "reliabilityOwnerRole",
                                        "Reliability Owner",
                                        OWNER_ROLES
                                    )}

                                    {renderSelect(
                                        formik,
                                        "clientStakeholder",
                                        "Client Stakeholder",
                                        [
                                            { v: "IT & Ops", l: "IT & Ops" },
                                            { v: "Compliance", l: "Compliance" },
                                            { v: "Risk & Legal", l: "Risk & Legal" },
                                        ]
                                    )}
                                </Grid>

                                <Typography variant="caption" color="text.secondary" mt={2}>


                                    This section defines the “Safety & Reliability
                                    Contract” for the model version.
                                    It is used in gates and in the Guardian policy pack.
                                </Typography>
                            </CardContent>
                        </Card>




                    </Grid>


                    {/* ================= RIGHT COLUMN: Quick Checks ================= */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                {/* Block Title */}
                                <Box sx={{ mb: 2.5 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        Quick Checks
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Fast validation for PMs before progressing.
                                    </Typography>
                                </Box>

                                {/* Toggle 1: Human Oversight */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2, p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                                            Human oversight is enabled
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Recommended for insurance decision workflows.
                                        </Typography>
                                    </Box>
                                    <Switch
                                        checked={oversightEnabled}
                                        onChange={(e) => setOversightEnabled(e.target.checked)}
                                        disabled
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>

                                {/* Spacer */}
                                <Box sx={{ height: 10 }} />

                                {/* Toggle 2: Incident Owners */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2, p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                                            Incident escalation owners assigned
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Safety owner + Reliability owner are set.
                                        </Typography>
                                    </Box>
                                    <Switch
                                        checked={ownersAssigned}
                                        onChange={(e) => setOwnersAssigned(e.target.checked)}
                                        disabled
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>

                                {/* Muted Callout */}
                                <Card variant="outlined" sx={{ bgcolor: '#fafafa', border: 'none', mb: 2 }}>
                                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                            These switches are read-only indicators; set values using dropdowns.
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Divider */}
                                <Divider sx={{ my: 2 }} />

                                {/* Generate Button */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleGenerate}
                                    sx={{ mb: 1.5, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Generate Risks &amp; Actions
                                </Button>

                                {/* Muted Callout */}
                                <Card variant="outlined" sx={{ bgcolor: '#fafafa', border: 'none' }}>
                                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                            Generates a risk register and mitigation plan based on missing items across tabs.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <AuditTrail notes={notes} setNotes={setNotes} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

/* ------------------ Helpers ------------------ */
const OWNER_ROLES = [
    { v: "Product Owner", l: "Product Owner" },
    { v: "AI Product Manager", l: "AI Product Manager" },
    { v: "MLOps / Platform Owner", l: "MLOps / Platform Owner" },
    { v: "SRE / DevOps Lead", l: "SRE / DevOps Lead" },
];

function renderSelect(formik, name, label, options) {
    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                size="small"
                select
                fullWidth
                label={label}
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
            >
                {options.map((o) => (
                    <MenuItem key={o.v} value={o.v}>
                        {o.l}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    );
}
