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
    Divider,Autocomplete 
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
        <Card sx={{ p: 2 }}>
            <Grid container spacing={3}>
                {/* LEFT: form */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant='h6'
                     fontWeight={700} >D. Evaluation</Typography>
                    <Typography variant="body2" 
                     mb={2}>
                        Prove inclusiveness before release through accessibility tests and diverse user usability testing.
                    </Typography>

                    <Box component="form" onSubmit={formik.handleSubmit}>
                        {/* Evaluation Toggles */}
                        <Grid container spacing={2} mb={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ 
                                    border: '1px solid',
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(171, 171, 171, 0.15)' 
                                        : 'rgba(117, 117, 117, 0.2)',
                                    borderRadius: 1, 
                                    p: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.axeCompleted}
                                                onChange={(e) => formik.setFieldValue('axeCompleted', e.target.checked)}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'rgb(26, 26, 26)' }}>
                                                Axe / Lighthouse Scan Completed
                                            </Typography>
                                        }
                                    />
                                    <Typography variant="caption">
                                        Automated accessibility validation executed.
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ 
                                    border: '1px solid',
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(171, 171, 171, 0.15)' 
                                        : 'rgba(117, 117, 117, 0.2)',
                                    borderRadius: 1, 
                                    p: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.manualAuditCompleted}
                                                onChange={(e) => formik.setFieldValue('manualAuditCompleted', e.target.checked)}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'rgb(26, 26, 26)' }}>
                                                Manual Accessibility Audit Completed
                                            </Typography>
                                        }
                                    />
                                    <Typography variant="caption" >
                                        Screen reader and keyboard-only journey validated.
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ 
                                    border: '1px solid',
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(171, 171, 171, 0.15)' 
                                        : 'rgba(117, 117, 117, 0.2)',
                                    borderRadius: 1, 
                                    p: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.diverseUserTestingCompleted}
                                                onChange={(e) => formik.setFieldValue('diverseUserTestingCompleted', e.target.checked)}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'rgb(26, 26, 26)' }}>
                                                Diverse User Testing Completed
                                            </Typography>
                                        }
                                    />
                                    <Typography variant="caption" >
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
                        <Typography variant='h6' mb={1}>User Testing Sessions</Typography>
                        <TableContainer sx={{ mb: 2 }} >
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
                                                <Autocomplete
                                                    size="small"
                                                    options={[
                                                        { value: 'miss', label: 'Miss' },
                                                        { value: 'partial', label: 'Partial' },
                                                        { value: 'pass', label: 'Pass' },
                                                    ]}
                                                    getOptionLabel={(option) => option.label}
                                                    value={row.result ? 
                                                        [
                                                            { value: 'miss', label: 'Miss' },
                                                            { value: 'partial', label: 'Partial' },
                                                            { value: 'pass', label: 'Pass' },
                                                        ].find(option => option.value === row.result) || null
                                                        : null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        formik.setFieldValue(`userTestingSessions.${i}.result`, newValue ? newValue.value : '');
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    height: '40px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Autocomplete
                                                    size="small"
                                                    options={[
                                                        { value: 'product', label: 'Product' },
                                                        { value: 'customer', label: 'Customer Experience' },
                                                        { value: 'qa', label: 'QA Lead' },
                                                    ]}
                                                    getOptionLabel={(option) => option.label}
                                                    value={row.owner ? 
                                                        [
                                                            { value: 'product', label: 'Product' },
                                                            { value: 'customer', label: 'Customer Experience' },
                                                            { value: 'qa', label: 'QA Lead' },
                                                        ].find(option => option.value === row.owner) || null
                                                        : null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        formik.setFieldValue(`userTestingSessions.${i}.owner`, newValue ? newValue.value : '');
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    height: '40px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
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
                            <Typography variant='h6' sx={{mb:2}}>Action Items</Typography>
                            <TableContainer  >

                                <Table >
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
                        <Card variant="outlined"
                         sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>Status Summary</Typography>
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
