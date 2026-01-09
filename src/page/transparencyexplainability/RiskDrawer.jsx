import { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    Stack,
    Button,
    TextField,
    MenuItem,
    Divider, IconButton, Autocomplete, Grid,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";


const schema = Yup.object({
    issue: Yup.string().required("Issue is required"),
    desc: Yup.string().required("Description is required"),
    severity: Yup.string().required(),
    stage: Yup.string().required(),
    status: Yup.string().required(),
});

export default function RiskDrawer({ open, risk, onClose, showIcons = true, }) {
    if (!risk) return null;

    const [drawerSize, setDrawerSize] = useState("half");

    // local flag: only show icons when drawerSize is 'default'
    const showIconsLocal = showIcons && drawerSize === "default";

    const toggleHalfFull = (e) => {
        e.stopPropagation();
        setDrawerSize((prev) => (prev === "full" ? "half" : "full"));
    };
    // smoother width values and transition
    const paperSx = {
        p: 2,
        // height: "100vh",
        top: 0,
        // overflow: "auto",
        transition: "width 240ms ease",
        width:
            drawerSize === "full"
                ? "100%"
                : drawerSize === "half"
                    ? { xs: "100%", sm: "50%", md: "50%" }
                    : { xs: "100%", sm: "640px", md: "640px" },
    };


    useEffect(() => {
        setDrawerSize(drawerSize);
    }, [drawerSize]);
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}

            sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
            PaperProps={{ sx: paperSx }}
            ModalProps={{ keepMounted: true }}
        >

            <Box sx={{ display: "flex", alignItems: "center", mb: 1, justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="subtitle1" sx={{ flex: 1 }}>
                        Risk Detail
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Edit details; link to an action; set severity and stage impact.
                    </Typography>
                </Box>

                {/* {showToggle && ( */}

                {/* )} */}
                <Box>
                    <IconButton size="small" onClick={toggleHalfFull}>
                        {drawerSize === "full" ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>


            {/* ===== BODY (scrollable) ===== */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
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
                            <Grid container spacing={2} >
                                {/* Risk ID */}
                                <Grid size={{ xs: 12, sm: 6, }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Risk ID" value={values.id} disabled />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, }}>
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
                                <Grid size={{ xs: 12, sm: 6, }}>
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
                                <Grid size={{ xs: 12, sm: 6, }}>
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
                                <Grid size={{ xs: 12, }}>
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
                                <Grid size={{ xs: 12, }}>
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
                                <Grid size={{ xs: 12, sm: 6, }}>
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
                                <Grid size={{ xs: 12, sm: 6, }}>
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
            </Box>

            {/* ===== FOOTER (sticky actions) ===== */}
            <Box
                sx={{
                    px: 2,
                    // borderTop: "1px solid",
                    // borderColor: "divider",
                    position: "sticky",
                    bottom: -10,
                    bgcolor: "background.paper",
                }}
            >
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
        </Drawer>
    );
}
