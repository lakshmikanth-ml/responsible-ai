/*
  B. Coverage Tab – Inclusiveness
  ------------------------------
  • React + MUI v7
  • useFormik (controlled by parent)
  • Yup validation
  • Matches Coverage screenshot 1:1
  • Parent owns initialValues + persistence
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

    return (
        <Card sx={{ p: 3 }}>
            <Typography fontWeight={700} mb={1}>B. Coverage</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Declare which journeys, channels, languages, and accessibility requirements are in scope.
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>
                {/* Journey Coverage */}
                <Grid container spacing={2} mb={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
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
                            Inclusive flows from start to bind.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
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
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
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
                    </Grid>
                </Grid>

                {/* Standards */}
                <Grid container spacing={2} mb={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.wcagRequired}
                                    onChange={(e) => formik.setFieldValue('wcagRequired', e.target.checked)}
                                />
                            }
                            label="WCAG Compliance Required"
                        />
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
                    <Button variant="outlined" onClick={onLoadSample}>Load Sample</Button>
                    <Button variant="contained" type="submit">Save B</Button>
                </Box>
            </Box>
        </Card>
    );
}
