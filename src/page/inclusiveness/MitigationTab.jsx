/*
  F. Mitigation Tab – Inclusiveness
  --------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Converts Risks → Mitigation tasks
  • Matches Mitigation screenshot 1:1
*/

import { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Card,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    MenuItem,
    TableContainer,
    Paper
    , Grid, Stack, Chip, Divider
} from "@mui/material";

/* ================= INITIAL VALUES ================= */
export const MITIGATION_INITIAL_VALUES = {
    mitigations: [],
    auditTrailNotes: "Enabled WCAG 2.1 AA scope for customer quote flows. Added Spanish plain-language templates to reduce comprehension barriers. Scheduled stakeholder workshops for underserved communities and set quarterly accessibility review cadence.",
};

/* ================= SAMPLE ================= */
export const MITIGATION_SAMPLE = {
    mitigations: [
        {
            key: "language_simplification",
            mitigation: "Simplify customer-facing language and error messages",
            priority: "high",
            owner: "design",
            dueDate: "2026-02-15",
            status: "open",
        },
        {
            key: "localization_support",
            mitigation: "Add multilingual support for Hindi and Kannada",
            priority: "medium",
            owner: "product",
            dueDate: "2026-03-01",
            status: "open",
        },
        {
            key: "keyboard_validation",
            mitigation: "Re-test keyboard-only navigation across critical journeys",
            priority: "high",
            owner: "qa",
            dueDate: "2026-01-30",
            status: "complete",
        },
    ],
    auditTrailNotes:
        "Enabled WCAG 2.1 AA scope for customer quote flows. Added Spanish plain-language templates to reduce comprehension barriers. Scheduled stakeholder workshops for underserved communities and set quarterly accessibility review cadence.",
};

const validationSchema = Yup.object({
    auditTrailNotes: Yup.string().required("Audit trail notes are required"),
});

export default function MitigationTab({
    initialValues,
    onSave,
    onGenerateFromRisks,
    onAddMitigation,
}) {
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
        formik.setFieldValue('mitigations', MITIGATION_SAMPLE.mitigations);
        formik.setFieldValue('auditTrailNotes', MITIGATION_SAMPLE.auditTrailNotes);
        setActionItems(MITIGATION_SAMPLE.mitigations.filter(m => m.status !== 'complete').map((m, i) => ({ id: `sample-${i}`, priority: m.priority === 'high' ? 'High' : 'Medium', action: m.mitigation, owner: m.owner })));
        setPolicyPreviewData({ preview: 'Mitigation policy pack', version: '0.1' });
        const done = MITIGATION_SAMPLE.mitigations.filter(m => m.status === 'complete').length;
        setCoveragePercent(Math.round((done / MITIGATION_SAMPLE.mitigations.length) * 100));
        setEvidenceApproved(done);
        setCriticalRisks(MITIGATION_SAMPLE.mitigations.filter(m => m.priority === 'high' && m.status !== 'complete').length);
    };

    const handleGenerate = () => {
        const items = formik.values.mitigations || [];
        const completed = items.filter(i => i.status === 'complete').length;
        const pct = items.length ? Math.round((completed / items.length) * 100) : 0;
        setCoveragePercent(pct);
        setEvidenceApproved(completed);
        setCriticalRisks(items.filter(i => i.priority === 'high' && i.status !== 'complete').length);

        const actions = items.filter(i => i.status !== 'complete').map((i, idx) => ({ id: `mit-${idx}`, priority: i.priority === 'high' ? 'High' : 'Medium', action: i.mitigation, owner: i.owner || 'TBD' }));
        setActionItems(actions);
    };

    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography fontWeight={700} mb={1}>F. Mitigation</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Convert risks into mitigation tasks. Gate logic expects critical mitigations to be marked as "Complete".
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button variant="outlined" onClick={onGenerateFromRisks}>Generate from Risks</Button>
                        <Button variant="outlined" onClick={onAddMitigation}>Add Mitigation</Button>
                    </Box>

                    {/* Mitigation Table */}
                    <TableContainer sx={{ mb: 2 }} component={Paper}>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell>MITIGATION</TableCell>
                                    <TableCell>PRIORITY</TableCell>
                                    <TableCell>OWNER</TableCell>
                                    <TableCell>DUE</TableCell>
                                    <TableCell>STATUS</TableCell>
                                    <TableCell>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formik.values.mitigations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No mitigations added.</TableCell>
                                    </TableRow>
                                )}

                                {formik.values.mitigations.map((row, i) => (
                                    <TableRow key={row.key}>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={row.mitigation}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`mitigations.${i}.mitigation`, e.target.value)
                                                }
                                            ></TextField>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                select size="small"
                                                value={row.priority}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`mitigations.${i}.priority`, e.target.value)
                                                }
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                select size="small"
                                                value={row.owner}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`mitigations.${i}.owner`, e.target.value)
                                                }
                                            >
                                                <MenuItem value="product">Product</MenuItem>
                                                <MenuItem value="design">Design</MenuItem>
                                                <MenuItem value="qa">QA</MenuItem>
                                                <MenuItem value="engineering">Engineering</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                type="date" size="small"
                                                value={row.dueDate}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`mitigations.${i}.dueDate`, e.target.value)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                select size="small"
                                                value={row.status}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`mitigations.${i}.status`, e.target.value)
                                                }
                                            >
                                                <MenuItem value="open">Open</MenuItem>
                                                <MenuItem value="in_progress">In Progress</MenuItem>
                                                <MenuItem value="complete">Complete</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Button size="small"
                                                    variant='outlined'
                                                    color="error"
                                                    onClick={() => {
                                                        const updated = formik.values.mitigations.filter((_, idx) => idx !== i);
                                                        formik.setFieldValue('mitigations', updated);
                                                    }}>Remove</Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Audit Trail */}
                    <Typography fontWeight={600} mb={1}>Audit Trail Notes</Typography>
                    <Typography variant="caption" color="text.secondary" mb={1}>
                        Short, PM-friendly record of key decisions (what we changed and why). This is used in audits and internal reviews.
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Example: Enabled high-contrast mode, added keyboard-only flow tests, and introduced Spanish output option."
                        {...formik.getFieldProps('auditTrailNotes')}
                        error={formik.touched.auditTrailNotes && Boolean(formik.errors.auditTrailNotes)}
                        helperText={formik.touched.auditTrailNotes && formik.errors.auditTrailNotes}
                        sx={{ mb: 2 }}
                    />

                    <Button variant="contained" onClick={formik.handleSubmit}>Save F</Button>
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
