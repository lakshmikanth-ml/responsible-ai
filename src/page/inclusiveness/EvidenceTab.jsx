/*
  G. Evidence Tab – Inclusiveness
  ------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Evidence upload + review/approval workflow
  • Matches Evidence screenshot 1:1
*/

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Card,
    Typography,
    Button,
    Chip,
    Grid,
    TextField,
    MenuItem
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

    const setStatus = (index, status) => {
        formik.setFieldValue(`evidenceItems.${index}.status`, status);
    };

    return (
        <Card sx={{ p: 3 }}>
            <Typography fontWeight={700} mb={1}>G. Evidence</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Upload proof that inclusiveness controls exist and were validated.
            </Typography>

            {formik.values.evidenceItems.map((item, i) => (
                <Card key={item.key} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography fontWeight={600}>{item.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.description}</Typography>

                    <Grid container spacing={2} mt={1}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Owner"
                                value={item.owner}
                                onChange={(e) =>
                                    formik.setFieldValue(`evidenceItems.${i}.owner`, e.target.value)
                                }
                            >
                                <MenuItem value="head_product">Head of Product</MenuItem>
                                <MenuItem value="accessibility_lead">Accessibility Lead</MenuItem>
                                <MenuItem value="qa">QA Lead</MenuItem>
                                <MenuItem value="customer_experience">Customer Experience</MenuItem>
                                <MenuItem value="support_ops">Support Operations Lead</MenuItem>
                            </TextField>
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

                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', gap: 1,  }}>
                            <Chip
                                label={item.status === 'missing' ? 'Missing' : item.status === 'reviewed' ? 'Not reviewed' : 'Approved'}
                                color={item.status === 'approved' ? 'success' : item.status === 'reviewed' ? 'warning' : 'error'}
                                size="medium"
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button size="small" onClick={() => setStatus(i, 'reviewed')}>Mark Reviewed</Button>
                        <Button size="small" variant="contained" onClick={() => setStatus(i, 'approved')}>Approve</Button>
                        <Button size="small" color="error" onClick={() => setStatus(i, 'missing')}>Clear</Button>
                    </Box>
                </Card>
            ))}

            <Button variant="contained" onClick={formik.handleSubmit}>Save G</Button>
        </Card>
    );
}
