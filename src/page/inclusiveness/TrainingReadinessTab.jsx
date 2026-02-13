/*
  C. Training Readiness (DFA Ingestion)
  -----------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Yup validation
  • Matches Training Readiness screenshot 1:1
  • DFA JSON ingestion + derived signal table
*/

import { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Grid,
    Card,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    MenuItem,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    TableContainer,
    Paper,
    Stack,
    Divider,
} from "@mui/material";

/* ================= INITIAL VALUES ================= */
export const TRAINING_READINESS_INITIAL_VALUES = {
    dfaJson: "",
    dfaOwner: "",
    signals: [
        {
            key: "provenance_confidence",
            label: "Provenance confidence",
            value: "—",
            status: "missing",
            interpretation:
                "Higher confidence reduces risk of hidden gaps affecting underserved users.",
        },
        {
            key: "language_coverage",
            label: "Language coverage",
            value: "—",
            status: "missing",
            interpretation:
                "If English-only but localization is required, inclusiveness risk increases.",
        },
        {
            key: "readability",
            label: "Readability / plain-language readiness",
            value: "—",
            status: "missing",
            interpretation:
                "Low readability increases failure for low digital literacy and non-native speakers.",
        },
        {
            key: "representation_notes",
            label: "Representation notes",
            value: "—",
            status: "missing",
            interpretation:
                "If underserved communities are missing, targeted stakeholder engagement is mandatory.",
        },
        {
            key: "data_stability",
            label: "Data stability",
            value: "—",
            status: "missing",
            interpretation:
                "Unstable sources may change outputs unexpectedly, harming user trust and accessibility flows.",
        },
        {
            key: "pii_risk",
            label: "PII risk flag",
            value: "—",
            status: "missing",
            interpretation:
                "High PII risk requires privacy controls; for inclusiveness, ensure consent and clarity for users.",
        },
    ],
};

export default function TrainingReadinessTab() {
    const formik = useFormik({
        initialValues: TRAINING_READINESS_INITIAL_VALUES,
        validationSchema: Yup.object({
            dfaJson: Yup.string(),
            dfaOwner: Yup.string(),
        }),
        onSubmit: (values) => {
            // attempt to parse DFA JSON and set signals if structure matches
            try {
                if (values.dfaJson) {
                    const parsed = JSON.parse(values.dfaJson);
                    // naive mapping: if parsed.signals exists, replace signals
                    if (Array.isArray(parsed.signals)) {
                        formik.setFieldValue('signals', parsed.signals);
                    }
                }
            } catch (e) {
                // ignore parse errors for now
            }
        },
    });

    const [actionItems, setActionItems] = useState([]);
    const [policyPreviewData, setPolicyPreviewData] = useState({});
    const [coveragePercent, setCoveragePercent] = useState(0);
    const [evidenceApproved, setEvidenceApproved] = useState(0);
    const [criticalRisks, setCriticalRisks] = useState(0);

    function priorityColor(priority) {
        if (!priority) return 'default';
        const p = priority.toLowerCase();
        if (p.includes('high')) return 'error';
        if (p.includes('med')) return 'warning';
        return 'default';
    }

    function formatJsonPreview(obj) {
        try {
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return String(obj);
        }
    }

    function handleLoadSampleLocal() {
        const sampleSignals = TRAINING_READINESS_INITIAL_VALUES.signals.map((s, i) => ({
            ...s,
            value: i % 2 === 0 ? 'Available' : '—',
            status: i % 2 === 0 ? 'available' : 'missing',
        }));
        const sampleDfa = { signals: sampleSignals };
        formik.setFieldValue('dfaJson', JSON.stringify(sampleDfa, null, 2));
        formik.setFieldValue('signals', sampleSignals);
        setActionItems([
            { priority: 'High', action: 'Add localization for Spanish', owner: 'Product' },
            { priority: 'Medium', action: 'Improve readability of prompts', owner: 'UX' },
        ]);
        setPolicyPreviewData({ policy: 'inclusiveness-policy', version: '0.1' });
        setCoveragePercent(67);
        setEvidenceApproved(4);
        setCriticalRisks(1);
    }

    function handleGenerate() {
        // simple recompute: coverage = percent of signals with status !== 'missing'
        const signals = formik.values.signals || [];
        const available = signals.filter((s) => s.status && s.status !== 'missing').length;
        const pct = signals.length ? Math.round((available / signals.length) * 100) : 0;
        setCoveragePercent(pct);
        setEvidenceApproved(Math.min(signals.length, available));
        setCriticalRisks(signals.filter((s) => s.status === 'missing').length);
        // generate action items from missing signals
        const items = [];
        signals.forEach((s, idx) => {
            if (!s.status || s.status === 'missing') {
                const priority = 'High';
                items.push({ id: `signal-${idx}`, priority, action: `Address signal: ${s.label || s.key}`, owner: 'TBD', status: s.status || 'missing' });
            }
        });
        setActionItems(items);
    }


    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* LEFT: form + table */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography fontWeight={700} mb={1}>
                        C. Training Readiness (DFA Ingestion)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        This pillar page ingests DFA JSON (from the separate DFA app) to populate training readiness signals that affect inclusiveness risk (language coverage, readability, data provenance, and representation notes).
                    </Typography>

                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} mb={2}>
                            {/* DFA JSON */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={6}
                                    label="Paste DFA JSON"
                                    placeholder="Paste DFA JSON here (from DFA app export)..."
                                    {...formik.getFieldProps('dfaJson')}
                                    error={formik.touched.dfaJson && Boolean(formik.errors.dfaJson)}
                                    helperText={formik.touched.dfaJson && formik.errors.dfaJson}
                                />
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Button variant="outlined" onClick={handleLoadSampleLocal}>
                                        Load DFA Sample
                                    </Button>
                                    <Button variant="contained" type="submit">
                                        Ingest DFA JSON
                                    </Button>
                                </Box>
                                <Typography variant="body2" color="text.secondary" mt={1} gutterBottom>
                                    Ingestion populates the table to the right and influences Pre-Training Gate.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ mt: 0, p: 1, bgcolor: '#f5f5f5', background: 'linear-gradient(180deg, #f5f8ff 0%, #f2f6ff 100%)', color: '#0b2a70', borderRadius: 2 }}>
                                    <Typography fontWeight={600} mb={1}>What PMs should look for in DFA:</Typography>
                                    <List dense>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Language coverage flags (English only vs multilingual needs)" />
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Representation notes (underserved communities missing)" />
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Readability / plain-language readiness" />
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Data provenance confidence" />
                                        </ListItem>
                                    </List>
                                </Box>
                            </Grid>
                            {/* DFA Owner */}
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    select
                                    fullWidth
                                    label="DFA Owner (Accountable Role)"
                                    {...formik.getFieldProps('dfaOwner')}
                                    error={formik.touched.dfaOwner && Boolean(formik.errors.dfaOwner)}
                                    helperText={formik.touched.dfaOwner && formik.errors.dfaOwner}
                                >
                                    <MenuItem value="product">Product</MenuItem>
                                    <MenuItem value="data">Data Science</MenuItem>
                                    <MenuItem value="ml">ML Engineering</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        {/* DFA Signals Table */}
                        <Typography fontWeight={600} mb={1}>DFA Signals</Typography>
                        <TableContainer sx={{ mb: 2 }} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>DFA SIGNAL</TableCell>
                                        <TableCell>VALUE</TableCell>
                                        <TableCell>STATUS</TableCell>
                                        <TableCell>INTERPRETATION (FOR INCLUSIVENESS)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formik?.values?.signals?.map((row) => (
                                        <TableRow key={row.key}>
                                            <TableCell>{row.label}</TableCell>
                                            <TableCell>{row.value}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    color={row.status === 'missing' ? 'error' : 'success'}
                                                    label={row.status === 'missing' ? 'Missing' : 'Available'}
                                                />
                                            </TableCell>
                                            <TableCell>{row.interpretation}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" type="submit">Save C</Button>
                        </Box>
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
        </Card>
    );
}
