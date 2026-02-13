import React, { useState } from "react";
import {
    Chip,
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Switch,
    FormControlLabel,
    TextField,
    MenuItem,
    Button,
    Stack,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TableContainer,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

/* ------------------ Validation ------------------ */
const validationSchema = Yup.object({
    monitoringToggles: Yup.object({
        accessibilityAlerts: Yup.boolean(),
        languageComprehension: Yup.boolean(),
        underservedFeedbackPriority: Yup.boolean(),
    }),
    reviewCadence: Yup.string().required("Review cadence is required"),
    escalationOwnerRole: Yup.string().required(
        "Escalation owner role is required"
    ),
});

/* ------------------ Component ------------------ */
export default function GatesMonitoringTab({
    initialValues,
    onSave,
    onLoadSample,
}) {
    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => onSave(values),
    });

    const { values, errors, touched, handleChange, setFieldValue } = formik;

    const [actionItems, setActionItems] = useState([]);
    const [policyPreviewData, setPolicyPreviewData] = useState({});
    const [coveragePercent, setCoveragePercent] = useState(0);
    const [evidenceApproved, setEvidenceApproved] = useState(0);
    const [criticalRisks, setCriticalRisks] = useState(0);

    const priorityColor = (priority) => {
        if (!priority) return 'default';
        const p = String(priority).toLowerCase();
        if (p.includes('high')) return 'error';
        if (p.includes('med')) return 'warning';
        return 'default';
    };

    const formatJsonPreview = (obj) => {
        try { return JSON.stringify(obj, null, 2); } catch (e) { return String(obj); }
    };

    const handleLoadSampleLocal = () => {
        if (onLoadSample) onLoadSample();
        const sampleItems = [
            { priority: 'High', action: 'Investigate repeated violation for endpoint X', owner: 'ML Ops' },
            { priority: 'Medium', action: 'Review SME feedback on locale en-GB', owner: 'Product' },
        ];
        setActionItems(sampleItems);
        setPolicyPreviewData({ preview: 'Gates monitoring policy', version: '0.1' });
        const signals = values.runtimeSignals || [];
        const violations = signals.filter(s => s.violations && s.violations > 0).length;
        setCoveragePercent(signals.length ? Math.round(((signals.length - violations) / signals.length) * 100) : 0);
        setEvidenceApproved(signals.filter(s => s.smeFeedback).length);
        setCriticalRisks(violations);
    };

    const handleGenerate = () => {
        const signals = values.runtimeSignals || [];
        const violations = signals.filter(s => s.violations && s.violations > 0).length;
        const pct = signals.length ? Math.round(((signals.length - violations) / signals.length) * 100) : 0;
        setCoveragePercent(pct);
        setEvidenceApproved(signals.filter(s => s.smeFeedback).length);
        setCriticalRisks(violations);

        const items = [];
        signals.forEach((s, idx) => {
            if (s.violations && s.violations > 0) {
                items.push({ id: `signal-${idx}`, priority: 'High', action: `Investigate violations: ${s.endpoint || s.project}`, owner: s.smeFeedback || 'TBD', status: 'open' });
            }
        });
        setActionItems(items);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                H. Gates & Monitoring
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Define runtime monitoring for inclusiveness and accessibility, and
                                show how Guardian runtime signals feed this pillar. Guardian Health
                                is derived from violations and feedback trends.
                            </Typography>

                            {/* ---------------- Monitoring Toggles ---------------- */}
                            <Grid container spacing={2} mb={3} display={"flex"}>
                                <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", flexDirection: "column" }}>
                                    <Card sx={{ flex: 1 }} variant="outlined">
                                        <CardContent>
                                            <Typography fontWeight={500}>
                                                Accessibility Alerts Enabled
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Alert on repeated “cannot complete journey” or UI issues.
                                            </Typography>
                                            <br />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={
                                                            values.monitoringToggles.accessibilityAlerts
                                                        }
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                "monitoringToggles.accessibilityAlerts",
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                }
                                                label=""
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", flexDirection: "column" }}>
                                    <Card sx={{ flex: 1 }} variant="outlined">
                                        <CardContent>
                                            <Typography fontWeight={500}>
                                                Language Comprehension Monitoring
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Track confusion signals and low satisfaction by locale.
                                            </Typography>
                                            <br />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={
                                                            values.monitoringToggles.languageComprehension
                                                        }
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                "monitoringToggles.languageComprehension",
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                }
                                                label=""
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", flexDirection: "column" }}>
                                    <Card sx={{ flex: 1 }} variant="outlined">
                                        <CardContent>
                                            <Typography fontWeight={500}>
                                                Underserved Feedback Priority
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Escalate issues affecting selected critical groups first.
                                            </Typography>
                                            <br />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={
                                                            values.monitoringToggles.underservedFeedbackPriority
                                                        }
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                "monitoringToggles.underservedFeedbackPriority",
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                }
                                                label=""
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* ---------------- Governance Controls ---------------- */}
                            <Grid container spacing={2} mb={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        size="small"
                                        select
                                        fullWidth
                                        label="Review Cadence"
                                        name="reviewCadence"
                                        value={values.reviewCadence}
                                        onChange={handleChange}
                                        error={touched.reviewCadence && Boolean(errors.reviewCadence)}
                                        helperText={touched.reviewCadence && errors.reviewCadence}
                                    >
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
                                        <MenuItem value="quarterly">Quarterly</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        size="small"
                                        select
                                        fullWidth
                                        label="Escalation Route (Owner Role)"
                                        name="escalationOwnerRole"
                                        value={values.escalationOwnerRole}
                                        onChange={handleChange}
                                        error={
                                            touched.escalationOwnerRole &&
                                            Boolean(errors.escalationOwnerRole)
                                        }
                                        helperText={
                                            touched.escalationOwnerRole &&
                                            errors.escalationOwnerRole
                                        }
                                    >
                                        <MenuItem value="head_product">Head of Product</MenuItem>
                                        <MenuItem value="accessibility_lead">
                                            Accessibility Lead
                                        </MenuItem>
                                        <MenuItem value="qa_lead">QA Lead</MenuItem>
                                        <MenuItem value="engineering_manager">
                                            Engineering Manager
                                        </MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>

                            {/* ---------------- Runtime Signals ---------------- */}
                            <Divider sx={{ my: 2 }} />

                            <Typography fontWeight={600} mb={1}>
                                Guardian Runtime Signals (Reference)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Guardian captures runtime events. This table clarifies what feeds
                                monitoring and Guardian Health.
                            </Typography>

                            <Stack direction="row" spacing={1} mb={2}>
                                <Button variant="outlined" onClick={onLoadSample}>
                                    Load Guardian Sample
                                </Button>
                                <Button variant="outlined">Recompute Guardian Health</Button>
                            </Stack>

                            <TableContainer component={Paper}>
                                <Table >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Timestamp</TableCell>
                                            <TableCell>Project</TableCell>
                                            <TableCell>Model Version</TableCell>
                                            <TableCell>Endpoint</TableCell>
                                            <TableCell>User Input</TableCell>
                                            <TableCell>Model Output</TableCell>
                                            <TableCell>Violations</TableCell>
                                            <TableCell>Rules Triggered</TableCell>
                                            <TableCell>SME Feedback</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {values.runtimeSignals.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={10} align="center">
                                                    No runtime signals loaded.
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {values.runtimeSignals.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.timestamp}</TableCell>
                                                <TableCell>{row.project}</TableCell>
                                                <TableCell>{row.modelVersion}</TableCell>
                                                <TableCell>{row.endpoint}</TableCell>
                                                <TableCell>{row.userInput}</TableCell>
                                                <TableCell>{row.modelOutput}</TableCell>
                                                <TableCell>{row.violations}</TableCell>
                                                <TableCell>{row.rulesTriggered}</TableCell>
                                                <TableCell>{row.smeFeedback}</TableCell>
                                                <TableCell>{row.actions}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* ---------------- Gate Logic ---------------- */}
                            <Paper
                                sx={
                                    {
                                        mt: 3,
                                        p: 2
                                    }
                                }
                                borderRadius={2}
                                variant="outlined"

                            >
                                <Typography variant="body2">
                                    <strong>Gate logic:</strong> Production requires Release gate PASS
                                    + monitoring toggles configured + escalation owner set.
                                </Typography>
                            </Paper>

                            {/* ---------------- Save ---------------- */}
                            <Box mt={3}>
                                <Button variant="contained" type="submit">
                                    Save H
                                </Button>
                            </Box>
                        </Grid>

                        {/* RIGHT COLUMN - SIDEBAR */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={2}>
                                {/* Quick Actions */}
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography fontWeight={600} mb={2}>Quick Actions</Typography>
                                    <Stack spacing={1}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleLoadSampleLocal}
                                        >
                                            Load Sample
                                        </Button>
                                        <Button variant="contained" size="small" onClick={handleGenerate}>
                                            Generate
                                        </Button>
                                    </Stack>
                                </Card>

                                {/* Action Items */}
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography fontWeight={600} mb={2}>Action Items</Typography>
                                    <TableContainer sx={{ mb: 2 }} component={Paper}>

                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Priority</TableCell>
                                                    <TableCell>Action</TableCell>
                                                    <TableCell>Owner</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {actionItems.map((row, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>
                                                            <Chip
                                                                label={row.priority}
                                                                color={priorityColor(row.priority)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{row.action}</TableCell>
                                                        <TableCell>{row.owner}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>

                                {/* Policy Pack Preview */}
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography fontWeight={600} mb={2}>Policy Pack Preview</Typography>
                                    <Box
                                        sx={{
                                            bgcolor: '#0f172a',
                                            color: '#e5e7eb',
                                            p: 2,
                                            borderRadius: '12px',
                                            fontFamily: 'monospace',
                                            whiteSpace: 'pre-wrap',
                                            fontSize: '0.75rem',
                                            maxHeight: '200px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        {formatJsonPreview(policyPreviewData)}
                                    </Box>
                                </Card>

                                {/* Status Summary */}
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography fontWeight={600} mb={2}>Status Summary</Typography>
                                    <Typography variant="body2">
                                        <b>Coverage:</b> {coveragePercent}%
                                        <br />
                                        <b>Evidence Approved:</b> {evidenceApproved}/6
                                        <br />
                                        <b>Critical Risks:</b> {criticalRisks}
                                        <br />
                                        <br />Use "Generate" after updating form.
                                    </Typography>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
}
