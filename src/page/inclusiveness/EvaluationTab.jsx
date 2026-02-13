/*
  D. Evaluation Tab – Inclusiveness
  -------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Yup validation
  • Two-column layout with right-side sidebar
*/

import { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import {

    Box,
    Grid,
    Card,
    Typography,
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
    TableContainer,
    Paper,
    Stack,
    Chip,
    Divider,
} from "@mui/material";

const validationSchema = Yup.object({
    testingCadence: Yup.string().required("Testing cadence is required"),
    evaluationOutcome: Yup.string().required("Evaluation outcome is required"),
});

export default function EvaluationTab({ initialValues, onSave, onLoadSample }) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => onSave(values),
    });

    // Sidebar state
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
        setActionItems([
            { priority: 'High', action: 'Fix accessibility issues from Axe report', owner: 'QA' },
            { priority: 'Medium', action: 'Re-run diverse user test for non-native speakers', owner: 'Design' },
        ]);
        setPolicyPreviewData({ preview: 'Evaluation policy pack', version: '0.1' });
        setCoveragePercent(75);
        setEvidenceApproved(3);
        setCriticalRisks(1);
    };

    const handleGenerate = () => {
        const sessions = formik.values.userTestingSessions || [];
        const passed = sessions.filter(s => s.result && s.result !== 'miss').length;
        const pct = sessions.length ? Math.round((passed / sessions.length) * 100) : 0;
        setCoveragePercent(pct);
        setEvidenceApproved(passed);
        setCriticalRisks(sessions.filter(s => s.result === 'miss').length);
        // generate action items from user testing sessions
        const items = [];
        sessions.forEach((s, idx) => {
            if (s.result && s.result !== 'pass') {
                const priority = s.result === 'miss' ? 'High' : 'Medium';
                items.push({ id: `session-${idx}`, priority, action: `Address testing issue: ${s.scenario || s.userGroup || 'session'}`, owner: s.owner || 'TBD', status: s.result });
            }
        });
        setActionItems(items);
    };


    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* LEFT: form */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography fontWeight={700} mb={1}>D. Evaluation</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Prove inclusiveness before release through accessibility tests and diverse user usability testing.
                    </Typography>

                    <Box component="form" onSubmit={formik.handleSubmit}>
                        {/* Evaluation Toggles */}
                        <Grid container spacing={2} mb={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.axeCompleted}
                                                onChange={(e) => formik.setFieldValue('axeCompleted', e.target.checked)}
                                            />
                                        }
                                        label="Axe / Lighthouse Scan Completed"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Automated accessibility validation executed.
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.manualAuditCompleted}
                                                onChange={(e) => formik.setFieldValue('manualAuditCompleted', e.target.checked)}
                                            />
                                        }
                                        label="Manual Accessibility Audit Completed"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Screen reader and keyboard-only journey validated.
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.diverseUserTestingCompleted}
                                                onChange={(e) => formik.setFieldValue('diverseUserTestingCompleted', e.target.checked)}
                                            />
                                        }
                                        label="Diverse User Testing Completed"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        At least 3 user groups tested on real journeys.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Evaluation Selects */}
                        <Grid container spacing={2} mb={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    size='small'
                                    fullWidth
                                    label="Testing Cadence"
                                    {...formik.getFieldProps('testingCadence')}
                                    error={formik.touched.testingCadence && Boolean(formik.errors.testingCadence)}
                                    helperText={formik.touched.testingCadence && formik.errors.testingCadence}
                                >
                                    <MenuItem value="ad_hoc">Ad-hoc</MenuItem>
                                    <MenuItem value="per_release">Per Release</MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="quarterly">Quarterly</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    size='small'
                                    select
                                    fullWidth
                                    label="Evaluation Outcome"
                                    {...formik.getFieldProps('evaluationOutcome')}
                                    error={formik.touched.evaluationOutcome && Boolean(formik.errors.evaluationOutcome)}
                                    helperText={formik.touched.evaluationOutcome && formik.errors.evaluationOutcome}
                                >
                                    <MenuItem value="pass">Pass</MenuItem>
                                    <MenuItem value="conditional">Conditional Pass</MenuItem>
                                    <MenuItem value="fail">Fail</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        {/* User Testing Sessions */}
                        <Typography fontWeight={600} mb={1}>User Testing Sessions</Typography>
                        <TableContainer sx={{ mb: 2 }} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>USER GROUP</TableCell>
                                        <TableCell>SCENARIO</TableCell>
                                        <TableCell>RESULT</TableCell>
                                        <TableCell>OWNER ROLE</TableCell>
                                        <TableCell>NOTES</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formik.values.userTestingSessions.map((row, i) => (
                                        <TableRow key={row.key}>
                                            <TableCell>{row.userGroup}</TableCell>
                                            <TableCell>{row.scenario}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    select size="small"
                                                    value={row.result}
                                                    onChange={(e) => formik.setFieldValue(`userTestingSessions.${i}.result`, e.target.value)}
                                                >
                                                    <MenuItem value="miss">Miss</MenuItem>
                                                    <MenuItem value="partial">Partial</MenuItem>
                                                    <MenuItem value="pass">Pass</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    select size="small"
                                                    value={row.owner}
                                                    onChange={(e) => formik.setFieldValue(`userTestingSessions.${i}.owner`, e.target.value)}
                                                >
                                                    <MenuItem value="product">Product</MenuItem>
                                                    <MenuItem value="customer">Customer Experience</MenuItem>
                                                    <MenuItem value="qa">QA Lead</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    placeholder="Observed issues"
                                                    value={row.notes}
                                                    onChange={(e) => formik.setFieldValue(`userTestingSessions.${i}.notes`, e.target.value)}
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
                            <Button variant="contained" type="submit">Save D</Button>
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
