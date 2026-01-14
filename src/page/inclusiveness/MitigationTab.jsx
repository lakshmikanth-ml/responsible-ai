/*
  F. Mitigation Tab – Inclusiveness
  --------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Converts Risks → Mitigation tasks
  • Matches Mitigation screenshot 1:1
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
    TextField,
    MenuItem,
    TableContainer,
    Paper
} from "@mui/material";

/* ================= INITIAL VALUES ================= */
export const MITIGATION_INITIAL_VALUES = {
    mitigations: [],
    auditTrailNotes: "",
};

/* ================= SAMPLE ================= */
export const MITIGATION_SAMPLE = {
    mitigations: [
        {
            key: "language_simplification",
            mitigation: "Simplify customer-facing language and error messages",
            priority: "high",
            owner: "design",
            dueDate: "2026-02-15",
            status: "open",
        },
        {
            key: "localization_support",
            mitigation: "Add multilingual support for Hindi and Kannada",
            priority: "medium",
            owner: "product",
            dueDate: "2026-03-01",
            status: "open",
        },
        {
            key: "keyboard_validation",
            mitigation: "Re-test keyboard-only navigation across critical journeys",
            priority: "high",
            owner: "qa",
            dueDate: "2026-01-30",
            status: "complete",
        },
    ],
    auditTrailNotes:
        "Enabled high-contrast mode, improved keyboard focus states, and updated content guidelines based on evaluation feedback.",
};

const validationSchema = Yup.object({
    auditTrailNotes: Yup.string().required("Audit trail notes are required"),
});

export default function MitigationTab({
    initialValues,
    onSave,
    onGenerateFromRisks,
    onAddMitigation,
}) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => onSave(values),
    });

    return (
        <Card sx={{ p: 3 }}>
            <Typography fontWeight={700} mb={1}>F. Mitigation</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Convert risks into mitigation tasks. Gate logic expects critical mitigations to be marked as "Complete".
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant="outlined" onClick={onGenerateFromRisks}>Generate from Risks</Button>
                <Button variant="outlined" onClick={onAddMitigation}>Add Mitigation</Button>
            </Box>

            {/* Mitigation Table */}
            <TableContainer sx={{ mb: 2 }} component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>MITIGATION</TableCell>
                            <TableCell>PRIORITY</TableCell>
                            <TableCell>OWNER</TableCell>
                            <TableCell>DUE</TableCell>
                            <TableCell>STATUS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formik.values.mitigations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No mitigations added.</TableCell>
                            </TableRow>
                        )}

                        {formik.values.mitigations.map((row, i) => (
                            <TableRow key={row.key}>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        value={row.mitigation}
                                        onChange={(e) =>
                                            formik.setFieldValue(`mitigations.${i}.mitigation`, e.target.value)
                                        }
                                    ></TextField>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        select size="small"
                                        value={row.priority}
                                        onChange={(e) =>
                                            formik.setFieldValue(`mitigations.${i}.priority`, e.target.value)
                                        }
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </TextField>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        select size="small"
                                        value={row.owner}
                                        onChange={(e) =>
                                            formik.setFieldValue(`mitigations.${i}.owner`, e.target.value)
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
                                        type="date" size="small"
                                        value={row.dueDate}
                                        onChange={(e) =>
                                            formik.setFieldValue(`mitigations.${i}.dueDate`, e.target.value)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        select size="small"
                                        value={row.status}
                                        onChange={(e) =>
                                            formik.setFieldValue(`mitigations.${i}.status`, e.target.value)
                                        }
                                    >
                                        <MenuItem value="open">Open</MenuItem>
                                        <MenuItem value="in_progress">In Progress</MenuItem>
                                        <MenuItem value="complete">Complete</MenuItem>
                                    </TextField>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Audit Trail */}
            <Typography fontWeight={600} mb={1}>Audit Trail Notes</Typography>
            <TextField
                fullWidth
                multiline
                minRows={4}
                placeholder="Example: Enabled high-contrast mode, added keyboard-only flow tests, and introduced Spanish output option."
                {...formik.getFieldProps('auditTrailNotes')}
                error={formik.touched.auditTrailNotes && Boolean(formik.errors.auditTrailNotes)}
                helperText={formik.touched.auditTrailNotes && formik.errors.auditTrailNotes}
                sx={{ mb: 2 }}
            />

            <Button variant="contained" onClick={formik.handleSubmit}>Save F</Button>
        </Card>
    );
}
