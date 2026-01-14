import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Stack,
    Button,
    TextField,
    Autocomplete,
    Grid,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import SideDrawer from "../../components/SideDrawer";


const schema = Yup.object({
    issue: Yup.string().required("Issue is required"),
    desc: Yup.string().required("Description is required"),
    severity: Yup.string().required(),
    stage: Yup.string().required(),
    status: Yup.string().required(),
});

export default function RiskDrawer({ open, risk, onClose, showIcons = true, }) {
    if (!risk) return null;

    return (
        <SideDrawer
            open={open}
            onClose={onClose}
            title="Risk Detail"
            subtitle="Edit details; link to an action; set severity and stage impact."
            allowResize={showIcons}
        >
            <Formik
                initialValues={{
                    id: risk.id,
                    source: risk.source,
                    severity: risk.severity,
                    stage: risk.stage,
                    issue: risk.title,
                    desc: risk.desc,
                    status: risk.status,
                    linkedAction: risk.linkedAction || "",
                }}
                validationSchema={schema}
                onSubmit={(values) => {
                    console.log("SAVE", values);
                    onClose();
                }}
            >
                {({ values, setFieldValue, errors, touched }) => (
                    <Form id="risk-form">
                        <Grid container spacing={2}>
                            {/* Risk ID */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Risk ID"
                                    value={values.id}
                                    disabled
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                {/* Source */}
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={["DFA", "Evaluation", "Guardian", "SME"]}
                                    value={values.source}
                                    onChange={(_, v) => setFieldValue("source", v)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Source" />
                                    )}
                                />
                            </Grid>
                            {/* Severity */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={["critical", "warning", "info"]}
                                    value={values.severity || ""}
                                    onChange={(_, v) => setFieldValue("severity", v || "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Severity"
                                            error={touched.severity && !!errors.severity}
                                            helperText={touched.severity && errors.severity}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* Stage Impact */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={["pre_training", "release", "production"]}
                                    value={values.stage}
                                    onChange={(_, v) => setFieldValue("stage", v)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Stage Impact"
                                            error={touched.stage && !!errors.stage}
                                            helperText={touched.stage && errors.stage}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* Issue */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Issue"
                                    name="issue"
                                    value={values.issue}
                                    onChange={(e) => setFieldValue("issue", e.target.value)}
                                    error={touched.issue && !!errors.issue}
                                    helperText={touched.issue && errors.issue}
                                />
                            </Grid>
                            {/* Description */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Description"
                                    name="desc"
                                    multiline
                                    minRows={3}
                                    value={values.desc}
                                    onChange={(e) => setFieldValue("desc", e.target.value)}
                                    error={touched.desc && !!errors.desc}
                                    helperText={touched.desc && errors.desc}
                                />
                            </Grid>
                            {/* Status */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={["open", "done"]}
                                    value={values.status}
                                    onChange={(_, v) => setFieldValue("status", v)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Status"
                                            error={touched.status && !!errors.status}
                                            helperText={touched.status && errors.status}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={["None", "done"]}
                                    value={values.linkedAction || null}
                                    onChange={(_, v) => setFieldValue("linkedAction", v)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Linked Action"
                                            error={touched.linkedAction && !!errors.linkedAction}
                                            helperText={touched.linkedAction && errors.linkedAction}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>

            <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={1} justifyContent={"end"}>
                    <Button variant="contained" type="submit" form="risk-form">
                        Save
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Close
                    </Button>
                    <Button color="error" variant="outlined">
                        Delete Risk
                    </Button>
                </Stack>
            </Box>
        </SideDrawer>
    );
}
