/*
  G. Evidence Tab – Inclusiveness
  ------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Evidence upload + review/approval workflow
  • Matches Evidence screenshot 1:1
*/

import { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Paper,
    Box,
    Card,
    Typography,
    Button,
    Chip,
    Grid,
    TextField,
    MenuItem
    , Stack, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Divider, Autocomplete
} from "@mui/material";

/* ================= INITIAL VALUES ================= */
export const EVIDENCE_INITIAL_VALUES = {
    evidenceItems: [
        {
            key: "stakeholder_engagement",
            label: "Stakeholder engagement plan",
            description: "Workshops, interviews, focus groups; include underserved representation.",
            owner: "",
            file: null,
            status: "missing", // missing | reviewed | approved
        },
        {
            key: "accessibility_checklist",
            label: "Accessibility compliance checklist",
            description: "WCAG target + checklist for key journeys.",
            owner: "",
            file: null,
            status: "missing",
        },
        {
            key: "axe_report",
            label: "Axe / Lighthouse report",
            description: "Automated scan output (screenshots or export).",
            owner: "",
            file: null,
            status: "missing",
        },
        {
            key: "manual_audit",
            label: "Manual accessibility audit notes",
            description: "Screen reader + keyboard-only findings and fixes.",
            owner: "",
            file: null,
            status: "missing",
        },
        {
            key: "diverse_testing",
            label: "Diverse user testing report",
            description: "Sessions + issues + resolution log (min 3 groups).",
            owner: "",
            file: null,
            status: "missing",
        },
        {
            key: "feedback_tracker",
            label: "Feedback channel & tracker",
            description: "Forms/surveys + monthly analysis + prioritization.",
            owner: "",
            file: null,
            status: "missing",
        },
    ],
};

/* ================= SAMPLE ================= */
export const EVIDENCE_SAMPLE = {
    evidenceItems: [
        {
            key: "stakeholder_engagement",
            label: "Stakeholder engagement plan",
            description: "Workshops, interviews, focus groups; include underserved representation.",
            owner: "head_product",
            file: { name: "stakeholder_plan.pdf" },
            status: "approved",
        },
        {
            key: "accessibility_checklist",
            label: "Accessibility compliance checklist",
            description: "WCAG target + checklist for key journeys.",
            owner: "accessibility_lead",
            file: { name: "wcag_checklist.xlsx" },
            status: "approved",
        },
        {
            key: "axe_report",
            label: "Axe / Lighthouse report",
            description: "Automated scan output (screenshots or export).",
            owner: "qa",
            file: { name: "axe_report.json" },
            status: "reviewed",
        },
        {
            key: "manual_audit",
            label: "Manual accessibility audit notes",
            description: "Screen reader + keyboard-only findings and fixes.",
            owner: "qa",
            file: { name: "manual_audit.docx" },
            status: "reviewed",
        },
        {
            key: "diverse_testing",
            label: "Diverse user testing report",
            description: "Sessions + issues + resolution log (min 3 groups).",
            owner: "customer_experience",
            file: { name: "user_testing.pdf" },
            status: "approved",
        },
        {
            key: "feedback_tracker",
            label: "Feedback channel & tracker",
            description: "Forms/surveys + monthly analysis + prioritization.",
            owner: "support_ops",
            file: { name: "feedback_tracker.csv" },
            status: "reviewed",
        },
    ],
};

const validationSchema = Yup.object({}); // approval is workflow-driven

export default function EvidenceTab({ initialValues, onSave }) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => onSave(values),
    });

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
        formik.setFieldValue('evidenceItems', EVIDENCE_SAMPLE.evidenceItems);
        setActionItems([
            { priority: 'High', action: 'Upload missing accessibility checklist', owner: 'Accessibility Lead' },
            { priority: 'Medium', action: 'Review Axe report findings', owner: 'QA' },
        ]);
        setPolicyPreviewData({ preview: 'Evidence policy pack', version: '0.1' });
        const approved = EVIDENCE_SAMPLE.evidenceItems.filter(i => i.status === 'approved').length;
        setCoveragePercent(Math.round((approved / EVIDENCE_SAMPLE.evidenceItems.length) * 100));
        setEvidenceApproved(approved);
        setCriticalRisks(EVIDENCE_SAMPLE.evidenceItems.filter(i => i.status === 'missing').length);
    };

    const handleGenerate = () => {
        const items = formik.values.evidenceItems || [];
        const approved = items.filter(i => i.status === 'approved').length;
        const pct = items.length ? Math.round((approved / items.length) * 100) : 0;
        setCoveragePercent(pct);
        setEvidenceApproved(approved);
        setCriticalRisks(items.filter(i => i.status === 'missing').length);

        const actions = [];
        items.forEach((it, idx) => {
            if (it.status !== 'approved') {
                const priority = it.status === 'missing' ? 'High' : 'Medium';
                actions.push({ id: `evidence-${idx}`, priority, action: `Provide evidence: ${it.label}`, owner: it.owner || 'TBD', status: it.status });
            }
        });
        setActionItems(actions);
    };

    const setStatus = (index, status) => {
        formik.setFieldValue(`evidenceItems.${index}.status`, status);
    };

    return (
        <Card sx={{ p: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant='h6' fontWeight={700}
                     >G. Evidence</Typography>
                    <Typography variant="body2" 
                     mb={2}>
                        Upload proof that inclusiveness controls exist and were validated. In demo, files are stored as metadata in localStorage. Mark evidence items as Reviewed/Approved to affect gates.                    </Typography>

                    {formik.values.evidenceItems.map((item, i) => (
                        <Card key={item.key} variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Typography variant='h6'>{item.label}</Typography>
                            <Typography variant="caption" >{item.description}</Typography>

                            <Grid container spacing={2} mt={1}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Autocomplete
                                        size="small"
                                        options={[
                                            { value: 'head_product', label: 'Head of Product' },
                                            { value: 'accessibility_lead', label: 'Accessibility Lead' },
                                            { value: 'qa', label: 'QA Lead' },
                                            { value: 'customer_experience', label: 'Customer Experience' },
                                            { value: 'support_ops', label: 'Support Operations Lead' },
                                        ]}
                                        getOptionLabel={(option) => option.label}
                                        value={item.owner ? 
                                            [
                                                { value: 'head_product', label: 'Head of Product' },
                                                { value: 'accessibility_lead', label: 'Accessibility Lead' },
                                                { value: 'qa', label: 'QA Lead' },
                                                { value: 'customer_experience', label: 'Customer Experience' },
                                                { value: 'support_ops', label: 'Support Operations Lead' },
                                            ].find(option => option.value === item.owner) || null
                                            : null
                                        }
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue(`evidenceItems.${i}.owner`, newValue ? newValue.value : '');
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                label="Owner"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Button variant="outlined" component="label" fullWidth>
                                        Choose File
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) =>
                                                formik.setFieldValue(`evidenceItems.${i}.file`, e.target.files[0])
                                            }
                                        />
                                    </Button>
                                    <Typography variant="caption">
                                        {item.file ? item.file.name : "No file chosen"}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', gap: 1, }}>
                                    <Chip
                                        label={item.status === 'missing' ? 'Missing' : item.status === 'reviewed' ? 'Not reviewed' : 'Approved'}
                                        size="medium"
                                        sx={(theme) => {
                                            if (item.status === 'approved') {
                                                return {
                                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
                                                    color: '#4caf50',
                                                    fontWeight: 600,
                                                };
                                            } else if (item.status === 'reviewed') {
                                                return {
                                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(251, 146, 60, 0.08)',
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.3)',
                                                    color: '#f97316',
                                                    fontWeight: 600,
                                                };
                                            } else {
                                                return {
                                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)',
                                                    color: '#f44336',
                                                    fontWeight: 600,
                                                };
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button size="small" variant='outlined' onClick={() => setStatus(i, 'reviewed')}>Mark Reviewed</Button>
                                <Button size="small" variant="contained" onClick={() => setStatus(i, 'approved')}>Approve</Button>
                                <Button size="small" variant='outlined' color="error" onClick={() => setStatus(i, 'missing')}>Clear</Button>
                            </Box>
                        </Card>
                    ))}

                    <Button variant="contained" onClick={formik.handleSubmit}>Save G</Button>
                </Grid>

                {/* RIGHT COLUMN - SIDEBAR */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={2}>
                        {/* Quick Actions */}
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant='h6' mb={2}>Quick Actions</Typography>
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
                            <Typography variant='h6' mb={2}>Action Items</Typography>
                            <TableContainer  >

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Priority</TableCell>
                                            <TableCell>Action</TableCell>
                                            <TableCell>Owner</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {actionItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">No data found</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            actionItems.map((row, i) => (
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
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>


                        {/* Policy Pack Preview */}
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant='h6' mb={2}>Policy Pack Preview</Typography>
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
                            <Typography variant='h6' mb={2}>Status Summary</Typography>
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
