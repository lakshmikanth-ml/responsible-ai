/*
  B. Coverage Tab – Inclusiveness
  ------------------------------
  • React + MUI v7
  • useFormik (controlled by parent)
  • Yup validation
  • Matches Coverage screenshot 1:1
  • Parent owns initialValues + persistence
*/

import { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Grid,
    Card,
    Typography, Stack,
    Switch,
    FormControlLabel,
    TextField,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Chip,
    TableContainer,
    Paper
} from "@mui/material";

const validationSchema = Yup.object({
    targetStandard: Yup.string().required("Target standard is required"),
    validationTools: Yup.array().min(1, "Select at least one validation tool"),
});

/**
 * @param {object} props
 * @param {object} props.initialValues
 * @param {(values) => void} props.onSave
 * @param {() => void} props.onLoadSample
 */
export default function CoverageTab({ initialValues, onSave, onLoadSample }) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => onSave(values),
    });

    // Sidebar / summary state
    const [actionItems, setActionItems] = useState([]);
    const [policyPreviewData, setPolicyPreviewData] = useState({});
    const [coveragePercent, setCoveragePercent] = useState(0);
    const [evidenceApproved, setEvidenceApproved] = useState(0);
    const [criticalRisks, setCriticalRisks] = useState(0);

    const priorityColor = (priority) => {
        if (priority === 'High') return 'error';
        if (priority === 'Medium') return 'warning';
        return 'default';
    };

    const formatJsonPreview = (obj) => JSON.stringify(obj, null, 2);

    const handleLoadSampleLocal = () => {
        if (onLoadSample) onLoadSample();
        // sample sidebar items and preview
        setActionItems([
            { id: '1', priority: 'High', action: 'Complete Axe accessibility audit', owner: 'Accessibility Lead' },
            { id: '2', priority: 'High', action: 'Conduct diverse user testing', owner: 'Design Lead' },
            { id: '3', priority: 'Medium', action: 'Implement keyboard navigation', owner: 'Engineering' },
        ]);
        setPolicyPreviewData({ Version: '1.0', Standard: 'WCAG 2.1 AA', Notes: 'Quarterly audits, 3+ groups' });
        setCoveragePercent(75);
        setEvidenceApproved(3);
        setCriticalRisks(1);
    };

    const handleGenerate = () => {
        // recompute coverage from checklist
        const rows = formik.values.checklist || [];
        let score = 0;
        rows.forEach((r) => {
            if (r.status === 'complete') score += 1;
            else if (r.status === 'partial') score += 0.5;
        });
        const pct = rows.length ? Math.round((score / rows.length) * 100) : 0;
        setCoveragePercent(pct);
        // generate action items from checklist
        const items = [];
        rows.forEach((r, idx) => {
            if (r.status !== 'complete') {
                const priority = r.status === 'miss' ? 'High' : 'Medium';
                items.push({ id: `checklist-${idx}`, priority, action: `Fix coverage: ${r.label || r.item || 'item'}`, owner: r.owner || 'TBD', status: r.status });
            }
        });
        setActionItems(items);
    };

    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* LEFT: form */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography fontWeight={700} mb={1}>B. Coverage</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Declare which journeys, channels, languages, and accessibility requirements are in scope. Coverage drives your coverage % chip and gate checks.
                    </Typography>

                    <Box component="form" onSubmit={formik.handleSubmit}>
                        {/* Journey Coverage */}
                        <Grid container spacing={2} mb={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.quoteJourney}
                                                onChange={(e) => formik.setFieldValue('quoteJourney', e.target.checked)}
                                            />
                                        }
                                        label="Quote Journey Coverage"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Inclusive flows from start to bind (where applicable).
                                    </Typography>
                                </Box>

                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.claimsJourney}
                                                onChange={(e) => formik.setFieldValue('claimsJourney', e.target.checked)}
                                            />
                                        }
                                        label="Claims Journey Coverage"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        FNOL, status, documentation, escalations.
                                    </Typography>
                                </Box>

                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.customerSupport}
                                                onChange={(e) => formik.setFieldValue('customerSupport', e.target.checked)}
                                            />
                                        }
                                        label="Customer Support Coverage"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        CSR assistance, chat/voice templates.
                                    </Typography>

                                </Box>

                            </Grid>
                        </Grid>

                        {/* Standards */}
                        <Grid container spacing={2} mb={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.wcagRequired}
                                                onChange={(e) => formik.setFieldValue('wcagRequired', e.target.checked)}
                                            />
                                        }
                                        label="WCAG Compliance Required"
                                    />

                                    <Typography variant="caption" color="text.secondary">
                                        Target WCAG level for UI and outputs.
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    select
                                    fullWidth
                                    label="Target Standard"
                                    {...formik.getFieldProps('targetStandard')}
                                    error={formik.touched.targetStandard && Boolean(formik.errors.targetStandard)}
                                    helperText={formik.touched.targetStandard && formik.errors.targetStandard}
                                >
                                    <MenuItem value="wcag_aa">WCAG 2.1 AA</MenuItem>
                                    <MenuItem value="wcag_aaa">WCAG 2.1 AAA</MenuItem>
                                    <MenuItem value="internal">Internal Standard</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    size="small"
                                    select
                                    fullWidth
                                    SelectProps={{ multiple: true }}
                                    label="Validation Tools"
                                    {...formik.getFieldProps('validationTools')}
                                    error={formik.touched.validationTools && Boolean(formik.errors.validationTools)}
                                    helperText={formik.touched.validationTools && formik.errors.validationTools}
                                >
                                    <MenuItem value="axe">Axe</MenuItem>
                                    <MenuItem value="lighthouse">Lighthouse</MenuItem>
                                    <MenuItem value="manual">Manual Audit</MenuItem>
                                    <MenuItem value="keyboard">Keyboard-only Journey</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        {/* Coverage Checklist */}
                        <Typography fontWeight={600} mb={1}>Coverage Checklist</Typography>
                        <TableContainer sx={{ mb: 2 }} component={Paper}>
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>COVERAGE ITEM</TableCell>
                                        <TableCell>STATUS</TableCell>
                                        <TableCell>OWNER ROLE</TableCell>
                                        <TableCell>NOTES</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formik.values.checklist.map((row, i) => (
                                        <TableRow key={row.key}>
                                            <TableCell>{row.label}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    select
                                                    size="small"
                                                    value={row.status}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(`checklist.${i}.status`, e.target.value)
                                                    }
                                                >
                                                    <MenuItem value="miss">Miss</MenuItem>
                                                    <MenuItem value="partial">Partial</MenuItem>
                                                    <MenuItem value="complete">Complete</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    select
                                                    size="small"
                                                    value={row.owner}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(`checklist.${i}.owner`, e.target.value)
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
                                                    size="small"
                                                    value={row.notes}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(`checklist.${i}.notes`, e.target.value)
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </TableContainer>
                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" onClick={handleLoadSampleLocal}>Load Sample</Button>
                            <Button variant="contained" type="submit">Save B</Button>
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
