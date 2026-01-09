// MUI v7 + Formik + Yup
// ALL-IN-ONE: G. Evidence & Audit Trail
// Same design + functionality converted from HTML
// Includes: KPI tiles, selectable rows, approve selected, pagination, validation

import * as React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    MenuItem,
    Checkbox,
    IconButton,
    Chip,
    TablePagination,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

/* ------------------ constants ------------------ */
const STAGES = ["pre_training", "release", "production"];
const STATUSES = ["missing", "present", "approved"];

/* ------------------ helpers ------------------ */
const emptyEvidence = () => ({
    selected: false,
    artifactType: "",
    notes: "",
    stage: "release",
    status: "present",
    owner: "",
    timestamp: new Date().toISOString(),
});

const validationSchema = Yup.object({
    evidence: Yup.array().of(
        Yup.object({
            artifactType: Yup.string().required("Artifact type required"),
            owner: Yup.string().required("Owner required"),
            status: Yup.string().oneOf(STATUSES),
        })
    ),
});

/* ------------------ component ------------------ */
export default function TabGEvidenceAudit() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    return (

                <Formik
                    initialValues={{ evidence: [emptyEvidence(), emptyEvidence()] }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log("Save G", values);
                    }}
                >
                    {({ values, errors, touched, handleChange, setFieldValue }) => {
                        const approvedCount = values.evidence.filter(
                            (e) => e.status === "approved"
                        ).length;

                        const runtimeCount = values.evidence.filter(
                            (e) => e.status === "approved" && e.stage === "production"
                        ).length;

                        return (
                            <Form>
                                <FieldArray name="evidence">
                                    {({ push, remove }) => (
                                        <>
                                            {/* HEADER */}
                                            <Stack
                                                direction={{ xs: "column", md: "row" }}
                                                justifyContent="space-between"
                                                gap={2}
                                                mb={2}
                                            >
                                                <Box>
                                                    <Typography variant="h6">
                                                        G. Evidence & Audit Trail
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Evidence must be structured, approved, and runtime-backed
                                                        (Guardian samples). Uploading is not enough — approval is
                                                        required.
                                                    </Typography>
                                                </Box>


                                            </Stack>
                                            <Stack direction="row" spacing={1} mb={2}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<UploadFileIcon />}
                                                    onClick={() =>
                                                        push(
                                                            ...[
                                                                emptyEvidence(),
                                                                emptyEvidence(),
                                                                emptyEvidence(),
                                                            ]
                                                        )
                                                    }
                                                >
                                                    Load Required Evidence Set
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => push(emptyEvidence())}
                                                >
                                                    Add Evidence
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<DoneAllIcon />}
                                                    onClick={() =>
                                                        values.evidence.forEach((e, i) => {
                                                            if (e.selected) {
                                                                setFieldValue(
                                                                    `evidence.${i}.status`,
                                                                    "approved"
                                                                );
                                                            }
                                                        })
                                                    }
                                                >
                                                    Approve Selected
                                                </Button>
                                            </Stack>
                                            {/* KPI TILES */}
                                            <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
                                                <Paper sx={{ p: 2, flex: 1 }}>
                                                    <Typography variant="subtitle2">
                                                        Evidence Completeness
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {approvedCount}/{values.evidence.length} approved
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Release requires required evidence approved.
                                                    </Typography>
                                                </Paper>

                                                <Paper sx={{ p: 2, flex: 1 }}>
                                                    <Typography variant="subtitle2">
                                                        Runtime Samples
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {runtimeCount} approved
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Guardian-exported explained outputs.
                                                    </Typography>
                                                </Paper>
                                            </Stack>



                                            {/* TABLE */}
                                            <Box
                                                sx={{
                                                    overflowX: "auto",
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    borderRadius: 1,
                                                }}
                                            >
                                                <Table stickyHeader size="small" sx={{ minWidth: 1100 }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell width={36} />
                                                            <TableCell width={220}>Artifact Type</TableCell>
                                                            <TableCell>Notes</TableCell>
                                                            <TableCell width={120}>Stage</TableCell>
                                                            <TableCell width={140}>Status</TableCell>
                                                            <TableCell width={140}>Owner</TableCell>
                                                            <TableCell width={180}>Timestamp</TableCell>
                                                            <TableCell width={70} >Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {values.evidence
                                                            .slice(
                                                                page * rowsPerPage,
                                                                page * rowsPerPage + rowsPerPage
                                                            )
                                                            .map((row, index) => (
                                                                <TableRow key={index} hover>
                                                                    <TableCell>
                                                                        <Checkbox
                                                                            checked={row.selected}
                                                                            onChange={(e) =>
                                                                                setFieldValue(
                                                                                    `evidence.${index}.selected`,
                                                                                    e.target.checked
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            name={`evidence.${index}.artifactType`}
                                                                            value={row.artifactType}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                            error={
                                                                                touched.evidence?.[index]?.artifactType &&
                                                                                Boolean(
                                                                                    errors.evidence?.[index]?.artifactType
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            name={`evidence.${index}.notes`}
                                                                            value={row.notes}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            select
                                                                            name={`evidence.${index}.stage`}
                                                                            value={row.stage}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                        >
                                                                            {STAGES.map((s) => (
                                                                                <MenuItem key={s} value={s}>
                                                                                    {s}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </TextField>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            select
                                                                            name={`evidence.${index}.status`}
                                                                            value={row.status}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                        >
                                                                            {STATUSES.map((s) => (
                                                                                <MenuItem key={s} value={s}>
                                                                                    {s}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </TextField>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            name={`evidence.${index}.owner`}
                                                                            value={row.owner}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <Typography
                                                                            variant="caption"
                                                                            sx={{ fontFamily: "monospace" }}
                                                                        >
                                                                            {row.timestamp}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell >
                                                                        <IconButton
                                                                            size="small"

                                                                            disabled={values.evidence.length === 1}
                                                                            onClick={() => remove(index)}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                            {/* TOP PAGINATION */}
                                            <Stack direction="row" justifyContent="flex-end" mb={1}>
                                                <TablePagination
                                                    component="div"
                                                    count={values.evidence.length}
                                                    page={page}
                                                    onPageChange={(_, p) => setPage(p)}
                                                    rowsPerPage={rowsPerPage}
                                                    onRowsPerPageChange={(e) => {
                                                        setRowsPerPage(parseInt(e.target.value, 10));
                                                        setPage(0);
                                                    }}
                                                    rowsPerPageOptions={[5, 10, 20]}
                                                />
                                            </Stack>
                                            {/* FOOTER NOTE */}
                                            <Box sx={{
                                                marginTop: "12px",
                                                padding: "12px",
                                                borderRadius: "14px",
                                                background: "#f8fafc",
                                                border: "1px solid lightgray",
                                                borderLeft: "4px solid #184ea4"
                                            }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Minimum recommended evidence for this pillar:

                                                    DFA snapshot, evaluation report, runtime samples, and
                                                    release sign-off.
                                                </Typography>

                                            </Box>
                                        </>
                                    )}
                                </FieldArray>
                            </Form>
                        );
                    }}
                </Formik>
            
    );
}
