/*
  E. Gaps & Risks Tab – Inclusiveness
  ---------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Risks are GENERATED (derived) but persisted
  • Matches Gaps & Risks screenshot 1:1
*/

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Card,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    MenuItem,
    TextField,
    TableContainer,
    Paper
} from "@mui/material";

/* ================= INITIAL VALUES ================= */
export const GAPS_RISKS_INITIAL_VALUES = {
    risks: [],
};

/* ================= SAMPLE ================= */


const validationSchema = Yup.object({}); // risks are derived, no manual validation

export default function GapsRisksTab({
    initialValues,
    onSave,
    onGenerateRisks,
    onClearRisks,
}) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => onSave(values),
    });

    return (
        <Card sx={{ p: 3 }}>
            <Typography fontWeight={700} mb={1}>E. Gaps & Risks</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Risks are generated from missing items across A–D, missing evidence approvals, and monitoring gaps.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant="outlined" onClick={onGenerateRisks}>Generate Risks</Button>
                <Button variant="outlined" color="error" onClick={onClearRisks}>Clear Risks</Button>
            </Box>

            {/* Risks Table */}
            <TableContainer sx={{ mb: 2 }} component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>SEVERITY</TableCell>
                            <TableCell>RISK</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell>OWNER</TableCell>
                            <TableCell>RECOMMENDED ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formik.values.risks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No risks generated yet.
                                </TableCell>
                            </TableRow>
                        )}

                        {formik.values.risks.map((row, i) => (
                            <TableRow key={row.key}>
                                <TableCell>
                                    <TextField
                                        select size="small"
                                        value={row.severity}
                                        onChange={(e) =>
                                            formik.setFieldValue(`risks.${i}.severity`, e.target.value)
                                        }
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </TextField>
                                </TableCell>
                                <TableCell>{row.risk}</TableCell>
                                <TableCell>
                                    <TextField
                                        select size="small"
                                        value={row.status}
                                        onChange={(e) =>
                                            formik.setFieldValue(`risks.${i}.status`, e.target.value)
                                        }
                                    >
                                        <MenuItem value="open">Open</MenuItem>
                                        <MenuItem value="mitigated">Mitigated</MenuItem>
                                    </TextField>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        select size="small"
                                        value={row.owner}
                                        onChange={(e) =>
                                            formik.setFieldValue(`risks.${i}.owner`, e.target.value)
                                        }
                                    >
                                        <MenuItem value="product">Product</MenuItem>
                                        <MenuItem value="design">Design</MenuItem>
                                        <MenuItem value="ml">ML Engineering</MenuItem>
                                        <MenuItem value="qa">QA</MenuItem>
                                    </TextField>
                                </TableCell>
                                <TableCell>{row.recommendedAction}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Button variant="contained" onClick={formik.handleSubmit}>Save E</Button>
        </Card>
    );
}
