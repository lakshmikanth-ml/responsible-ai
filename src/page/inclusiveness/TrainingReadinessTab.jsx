/*
  C. Training Readiness (DFA Ingestion)
  -----------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Yup validation
  • Matches Training Readiness screenshot 1:1
  • DFA JSON ingestion + derived signal table
*/

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Grid,
    Card,
    Typography,
    TextField,
    MenuItem,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    TableContainer,
    Paper
} from "@mui/material";

/* ================= INITIAL VALUES ================= */
export const TRAINING_READINESS_INITIAL_VALUES = {
    dfaJson: "",
    dfaOwner: "",
    signals: [
        {
            key: "provenance_confidence",
            label: "Provenance confidence",
            value: "—",
            status: "missing",
            interpretation:
                "Higher confidence reduces risk of hidden gaps affecting underserved users.",
        },
        {
            key: "language_coverage",
            label: "Language coverage",
            value: "—",
            status: "missing",
            interpretation:
                "If English-only but localization is required, inclusiveness risk increases.",
        },
        {
            key: "readability",
            label: "Readability / plain-language readiness",
            value: "—",
            status: "missing",
            interpretation:
                "Low readability increases failure for low digital literacy and non-native speakers.",
        },
        {
            key: "representation_notes",
            label: "Representation notes",
            value: "—",
            status: "missing",
            interpretation:
                "If underserved communities are missing, targeted stakeholder engagement is mandatory.",
        },
        {
            key: "data_stability",
            label: "Data stability",
            value: "—",
            status: "missing",
            interpretation:
                "Unstable sources may change outputs unexpectedly, harming user trust and accessibility flows.",
        },
        {
            key: "pii_risk",
            label: "PII risk flag",
            value: "—",
            status: "missing",
            interpretation:
                "High PII risk requires privacy controls; for inclusiveness, ensure consent and clarity for users.",
        },
    ],
};

const validationSchema = Yup.object({
    dfaJson: Yup.string().required("DFA JSON is required"),
    dfaOwner: Yup.string().required("DFA Owner is required"),
});

/**
 * @param {object} props
 * @param {object} props.initialValues
 * @param {(values) => void} props.onSave
 * @param {() => void} props.onLoadSample
 */
export default function TrainingReadinessTab({
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
            <Typography fontWeight={700} mb={1}>
                C. Training Readiness (DFA Ingestion)
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                This pillar ingests DFA JSON to populate training readiness signals that affect inclusiveness risk.
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} mb={2}>
                    {/* DFA JSON */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={6}
                            label="Paste DFA JSON"
                            placeholder="Paste DFA JSON here (from DFA app export)..."
                            {...formik.getFieldProps('dfaJson')}
                            error={formik.touched.dfaJson && Boolean(formik.errors.dfaJson)}
                            helperText={formik.touched.dfaJson && formik.errors.dfaJson}
                        />
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Button variant="outlined" onClick={onLoadSample}>
                                Load DFA Sample
                            </Button>
                            <Button variant="contained" type="submit">
                                Ingest DFA JSON
                            </Button>
                        </Box>
                    </Grid>

                    {/* DFA Owner */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            select
                            fullWidth
                            label="DFA Owner (Accountable Role)"
                            {...formik.getFieldProps('dfaOwner')}
                            error={formik.touched.dfaOwner && Boolean(formik.errors.dfaOwner)}
                            helperText={formik.touched.dfaOwner && formik.errors.dfaOwner}
                        >
                            <MenuItem value="product">Product</MenuItem>
                            <MenuItem value="data">Data Science</MenuItem>
                            <MenuItem value="ml">ML Engineering</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                {/* DFA Signals Table */}
                <Typography fontWeight={600} mb={1}>DFA Signals</Typography>
                <TableContainer sx={{ mb: 2 }} component={Paper}>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>DFA SIGNAL</TableCell>
                                <TableCell>VALUE</TableCell>
                                <TableCell>STATUS</TableCell>
                                <TableCell>INTERPRETATION (FOR INCLUSIVENESS)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formik?.values?.signals?.map((row) => (
                                <TableRow key={row.key}>
                                    <TableCell>{row.label}</TableCell>
                                    <TableCell>{row.value}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            color={row.status === 'missing' ? 'error' : 'success'}
                                            label={row.status === 'missing' ? 'Missing' : 'Available'}
                                        />
                                    </TableCell>
                                    <TableCell>{row.interpretation}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" onClick={onLoadSample}>
                        Load DFA Sample
                    </Button>
                    <Button variant="contained" type="submit">
                        Save C
                    </Button>
                </Box>
            </Box>
        </Card>
    );
}
