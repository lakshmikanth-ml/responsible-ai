/*
  Objective Tab (A) – Inclusiveness (CONTROLLED)
  --------------------------------------------
  • React + MUI v7
  • useFormik
  • Yup validation
  • ❗ Parent (index) OWNS state
  • This component receives initialValues + onSave
*/

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Switch,
    FormControlLabel,
    Button,
    Divider
} from "@mui/material";

const validationSchema = Yup.object({
    primaryPurpose: Yup.string().required("Primary Purpose is required"),
    jurisdiction: Yup.string().required("Jurisdiction / Market is required"),
    owner: Yup.string().required("Inclusiveness Owner is required"),
    audience: Yup.string().required("Deployment Audience is required"),
    criticalUserGroups: Yup.array()
        .min(3, "Select at least 3 critical user groups"),
    failureDefinition: Yup.string().required("Failure definition is required"),
    minimumStandard: Yup.string().required("Minimum inclusion standard is required"),
});




/**
 * @param {object} props
 * @param {object} props.initialValues   // passed from index
 * @param {(values) => void} props.onSave
 */
export default function ObjectiveTab({ initialValues, onSave, onLoadSample }) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            onSave(values); // 🔑 persist to index
        },
    });




    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={700} mb={1}>A. Objective & Inclusion Intent</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Define why inclusiveness is required, who is accountable, which groups must be supported, and what failure looks like.
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            size="small"
                            select fullWidth
                            label="Primary Purpose"
                            {...formik.getFieldProps('primaryPurpose')}
                            error={formik.touched.primaryPurpose && Boolean(formik.errors.primaryPurpose)}
                            helperText={formik.touched.primaryPurpose && formik.errors.primaryPurpose}
                        >
                            <MenuItem value="customer_facing">Customer-facing decision support</MenuItem>
                            <MenuItem value="internal_assist">Internal agent assistance</MenuItem>
                            <MenuItem value="risk_scoring">Risk scoring / triage</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            size="small"
                            select fullWidth
                            label="Jurisdiction / Market"
                            {...formik.getFieldProps('jurisdiction')}
                            error={formik.touched.jurisdiction && Boolean(formik.errors.jurisdiction)}
                            helperText={formik.touched.jurisdiction && formik.errors.jurisdiction}
                        >
                            <MenuItem value="us">US</MenuItem>
                            <MenuItem value="eu">EU</MenuItem>
                            <MenuItem value="india">India</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            size="small"
                            select fullWidth
                            label="Inclusiveness Owner (Accountable Role)"
                            {...formik.getFieldProps('owner')}
                            error={formik.touched.owner && Boolean(formik.errors.owner)}
                            helperText={formik.touched.owner && formik.errors.owner}
                        >
                            <MenuItem value="product">Head of Product</MenuItem>
                            <MenuItem value="design">Design Lead</MenuItem>
                            <MenuItem value="qa">QA Lead</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            size="small"
                            select fullWidth
                            label="Deployment Audience"
                            {...formik.getFieldProps('audience')}
                            error={formik.touched.audience && Boolean(formik.errors.audience)}
                            helperText={formik.touched.audience && formik.errors.audience}
                        >
                            <MenuItem value="consumers">Consumers</MenuItem>
                            <MenuItem value="agents">Internal agents</MenuItem>
                            <MenuItem value="partners">Partners</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            size="small"
                            select fullWidth
                            SelectProps={{ multiple: true }}
                            label="Critical User Groups (Required coverage)"
                            {...formik.getFieldProps('criticalUserGroups')}
                            error={formik.touched.criticalUserGroups && Boolean(formik.errors.criticalUserGroups)}
                            helperText={formik.touched.criticalUserGroups && formik.errors.criticalUserGroups}
                        >
                            <MenuItem value="older_adults">Older adults (low digital literacy)</MenuItem>
                            <MenuItem value="non_native">Non-native language speakers</MenuItem>
                            <MenuItem value="rural">Rural / low connectivity users</MenuItem>
                            <MenuItem value="vision">Users with visual impairments</MenuItem>
                            <MenuItem value="hearing">Users with hearing impairments</MenuItem>
                            <MenuItem value="motor">Users with motor impairments</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.languageLocalization}
                                    onChange={(e) => formik.setFieldValue('languageLocalization', e.target.checked)}
                                />
                            }
                            label="Language Localization Required"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.assistiveUx}
                                    onChange={(e) => formik.setFieldValue('assistiveUx', e.target.checked)}
                                />
                            }
                            label="Assistive UX Required"
                        />
                    </Grid>

                    <Divider flexItem sx={{ my: 2 }} />

                    <Grid size={{ xs: 12, md: 12 }}>
                        <TextField
                            size="small"
                            fullWidth multiline minRows={4}
                            label="What is Unacceptable (Failure Definition)"
                            {...formik.getFieldProps('failureDefinition')}
                            error={formik.touched.failureDefinition && Boolean(formik.errors.failureDefinition)}
                            helperText={formik.touched.failureDefinition && formik.errors.failureDefinition}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                        <TextField
                            size="small"
                            select fullWidth
                            label="Minimum Inclusion Standard (Contract Summary)"
                            {...formik.getFieldProps('minimumStandard')}
                            error={formik.touched.minimumStandard && Boolean(formik.errors.minimumStandard)}
                            helperText={formik.touched.minimumStandard && formik.errors.minimumStandard}
                        >
                            <MenuItem value="wcag_aa">WCAG 2.1 AA</MenuItem>
                            <MenuItem value="wcag_aaa">WCAG 2.1 AAA</MenuItem>
                            <MenuItem value="internal">Internal Accessibility Standard</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    <Button variant="outlined" onClick={onLoadSample}>Load Sample</Button>
                    <Button variant="contained" type="submit">Save A</Button>
                </Box>
            </Box>
        </Paper>
    );
}
