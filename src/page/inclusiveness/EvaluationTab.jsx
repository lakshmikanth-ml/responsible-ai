/*
  D. Evaluation Tab – Inclusiveness
  -------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Yup validation
  • Matches Evaluation screenshot 1:1
*/

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
} from "@mui/material";

/* ================= INITIAL VALUES ================= */
;

const validationSchema = Yup.object({
    testingCadence: Yup.string().required("Testing cadence is required"),
    evaluationOutcome: Yup.string().required("Evaluation outcome is required"),
});

export default function EvaluationTab({
    initialValues,
    onSave,
    onLoadSample,
}) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => onSave(values),
    });

    return (
        <Card sx={{ p: 3 }}>
            <Typography fontWeight={700} mb={1}>D. Evaluation</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Prove inclusiveness before release through accessibility tests and diverse user usability testing.
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>
                {/* Evaluation Toggles */}
                <Grid container spacing={2} mb={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.axeCompleted}
                                    onChange={(e) =>
                                        formik.setFieldValue('axeCompleted', e.target.checked)
                                    }
                                />
                            }
                            label="Axe / Lighthouse Scan Completed"
                        />
                        <Typography variant="caption" color="text.secondary">
                            Automated accessibility validation executed.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.manualAuditCompleted}
                                    onChange={(e) =>
                                        formik.setFieldValue('manualAuditCompleted', e.target.checked)
                                    }
                                />
                            }
                            label="Manual Accessibility Audit Completed"
                        />
                        <Typography variant="caption" color="text.secondary">
                            Screen reader and keyboard-only journey validated.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.diverseUserTestingCompleted}
                                    onChange={(e) =>
                                        formik.setFieldValue('diverseUserTestingCompleted', e.target.checked)
                                    }
                                />
                            }
                            label="Diverse User Testing Completed"
                        />
                        <Typography variant="caption" color="text.secondary">
                            At least 3 user groups tested on real journeys.
                        </Typography>
                    </Grid>
                </Grid>

                {/* Evaluation Selects */}
                <Grid container spacing={2} mb={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select
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
                    <Table  >
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
                                            onChange={(e) =>
                                                formik.setFieldValue(`userTestingSessions.${i}.result`, e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                formik.setFieldValue(`userTestingSessions.${i}.owner`, e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                formik.setFieldValue(`userTestingSessions.${i}.notes`, e.target.value)
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
                    <Button variant="outlined" onClick={onLoadSample}>Load Sample</Button>
                    <Button variant="contained" type="submit">Save D</Button>
                </Box>
            </Box>
        </Card>
    );
}
