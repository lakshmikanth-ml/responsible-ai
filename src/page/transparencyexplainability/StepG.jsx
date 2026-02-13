import * as React from "react";
import {
    Grid,
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    MenuItem,
    Checkbox,
    IconButton,
    TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

/* ---------------- constants ---------------- */
const STAGES = ["pre_training", "release", "production"];
const STATUSES = ["missing", "present", "approved"];

/* ---------------- helpers ---------------- */
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

function KpiTile({ title, value, subtitle }) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {title}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default function TabGEvidenceAudit() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    return (
        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                <Formik
                    initialValues={{ evidence: [emptyEvidence(), emptyEvidence()] }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => console.log("Save G", values)}
                >
                    {({ values, errors, touched, handleChange, setFieldValue }) => {
                        const approvedCount = values.evidence.filter(
                            (e) => e.status === "approved"
                        ).length;

                        const runtimeCount = values.evidence.filter(
                            (e) => e.status === "approved" && e.stage === "production"
                        ).length;

                        const kpis = [
                            {
                                title: "Evidence Completeness",
                                value: `${approvedCount}/${values.evidence.length} approved`,
                                subtitle:
                                    "Release requires required evidence approved.",
                            },
                            {
                                title: "Runtime Samples",
                                value: `${runtimeCount} approved`,
                                subtitle:
                                    "Guardian-exported explained outputs (mandatory for high-risk use cases).",
                            },
                        ];

                        const start = page * rowsPerPage;
                        const end = start + rowsPerPage;
                        const pageRows = values.evidence.slice(start, end);

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
                                                        Evidence must be structured, approved, and runtime-backed.
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            {/* ACTIONS */}
                                            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<UploadFileIcon />}
                                                    onClick={() => {
                                                        push(emptyEvidence());
                                                        push(emptyEvidence());
                                                        push(emptyEvidence());
                                                    }}
                                                >
                                                    Load Required Evidence
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
                                                    onClick={() => {
                                                        values.evidence.forEach((e, i) => {
                                                            if (e.selected) {
                                                                setFieldValue(
                                                                    `evidence.${i}.status`,
                                                                    "approved"
                                                                );
                                                            }
                                                        });
                                                    }}
                                                >
                                                    Approve Selected
                                                </Button>
                                            </Stack>

                                            {/* KPI */}
                                            <Grid container spacing={2} mb={2}>
                                                {kpis.map((kpi, i) => (
                                                    <Grid key={i}
                                                        size={{ xs: 12, md: 6 }}
                                                    >
                                                        <KpiTile {...kpi} />
                                                    </Grid>
                                                ))}
                                            </Grid>

                                            {/* TABLE */}
                                            <Box sx={{ overflowX: "auto", border: "1px solid", borderColor: "divider" }}>
                                                <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell />
                                                            <TableCell>Artifact</TableCell>
                                                            <TableCell>Notes</TableCell>
                                                            <TableCell>Stage</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Owner</TableCell>
                                                            <TableCell>Timestamp</TableCell>
                                                            <TableCell />
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {pageRows.map((row, i) => {
                                                            const idx = start + i;
                                                            return (
                                                                <TableRow key={idx} hover>
                                                                    <TableCell>
                                                                        <Checkbox
                                                                            checked={row.selected}
                                                                            onChange={(e) =>
                                                                                setFieldValue(
                                                                                    `evidence.${idx}.selected`,
                                                                                    e.target.checked
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            name={`evidence.${idx}.artifactType`}
                                                                            value={row.artifactType}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                            error={
                                                                                touched.evidence?.[idx]?.artifactType &&
                                                                                Boolean(
                                                                                    errors.evidence?.[idx]?.artifactType
                                                                                )
                                                                            }
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            name={`evidence.${idx}.notes`}
                                                                            value={row.notes}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            select
                                                                            name={`evidence.${idx}.stage`}
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
                                                                            name={`evidence.${idx}.status`}
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
                                                                            name={`evidence.${idx}.owner`}
                                                                            value={row.owner}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                                                                            {row.timestamp}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <IconButton
                                                                            size="small"
                                                                            disabled={values.evidence.length === 1}
                                                                            onClick={() => remove(idx)}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>

                                            {/* PAGINATION */}
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

                                            {/* FOOTER */}
                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    p: 2,
                                                    borderRadius: 2,
                                                    background: "#f8fafc",
                                                    borderLeft: "4px solid #184ea4",
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary">
                                                    Minimum recommended evidence: DFA snapshot, evaluation report,
                                                    runtime samples, and release sign-off.
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </FieldArray>
                            </Form>
                        );
                    }}
                </Formik>
            </CardContent>
        </Card>
    );
}
