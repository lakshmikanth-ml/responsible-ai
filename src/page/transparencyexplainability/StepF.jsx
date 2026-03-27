// MUI v7 + Formik + Yup
// ALL-IN-ONE: Sticky header + horizontal scroll + TOP pagination + Re-check + rules

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
    IconButton,
    Chip,
    TablePagination,TableContainer
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

/* ------------------ helpers ------------------ */
const emptyAction = () => ({
    actionId: `ACT_${Math.random().toString(16).slice(2, 8)}_${Math.random()
        .toString(16)
        .slice(2, 8)}`,
    linkedRisk: "",
    description: "",
    owner: "",
    due: "",
    recheck: "guardian", // pending by default
    status: "open",
});

const validationSchema = Yup.object({
    actions: Yup.array().of(
        Yup.object({
            description: Yup.string().required("Action is required"),
            owner: Yup.string().required("Owner is required"),
            due: Yup.string().required("Due date is required"),
            status: Yup.string().test(
                "recheck-done",
                "Re-check must be satisfied before closing",
                function (value) {
                    if (value !== "done") return true;
                    return this.parent.recheck === "evaluation";
                }
            ),
        })
    ),
});

/* ------------------ component ------------------ */
export default function TabFMitigation() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    return (
        <Card variant="outlined" sx={{ mt: 0 }}>
            <CardContent>

                <Formik
                    initialValues={{ actions: [emptyAction()] }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log("Save F", values);
                    }}
                >
                    {({ values, errors, touched, handleChange, setFieldValue }) => (
                        <Form>
                            <FieldArray name="actions">
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
                                                    F. Mitigation & Re-evaluation
                                                </Typography>
                                                <Typography variant="body2">
                                                    Actions linked to risks. Actions are not “Done” until
                                                    re-check passes and evidence is attached.
                                                </Typography>
                                            </Box>




                                        </Stack>
                                        <Stack direction={{ xs: "column", sm: "row" }}
                                            spacing={2} mb={2} mt={2}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={() => push(emptyAction())}
                                            >
                                                Add Action
                                            </Button>
                                            <Button
                                                variant="outlined"

                                                type="submit"
                                            >
                                                Save F
                                            </Button>
                                            <Button
                                                variant="contained"

                                                type="submit"
                                            >
                                                Enforce Re-check Rules
                                            </Button>

                                        </Stack>

                                        {/* <Divider sx={{ mb: 2 }} /> */}

                                        {/* TOP PAGINATION */}


                                        {/* STICKY + SCROLL TABLE */}
                                        <TableContainer 
                    variant="outlined" 
                 
                >
                    <Table 
                       
                    >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell width={140}>Action ID</TableCell>
                                                        <TableCell width={170}>Linked Risk</TableCell>
                                                        <TableCell>Action</TableCell>
                                                        <TableCell width={120}>Owner</TableCell>
                                                        <TableCell width={130}>Due</TableCell>
                                                        <TableCell width={160}>Re-check</TableCell>
                                                        <TableCell width={120}>Status</TableCell>
                                                        <TableCell width={70} >Action</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {values.actions
                                                        .slice(
                                                            page * rowsPerPage,
                                                            page * rowsPerPage + rowsPerPage
                                                        )
                                                        .map((row, index) => {
                                                            const rowErrors = errors.actions?.[index] || {};
                                                            const rowTouched = touched.actions?.[index] || {};

                                                            return (
                                                                <TableRow key={row.actionId} hover>
                                                                    <TableCell>
                                                                        <Typography
                                                                            variant="caption"
                                                                            sx={{ fontFamily: "monospace" }}
                                                                        >
                                                                            {row.actionId}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            name={`actions.${index}.linkedRisk`}
                                                                            value={row.linkedRisk}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            name={`actions.${index}.description`}
                                                                            value={row.description}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                            error={
                                                                                rowTouched.description &&
                                                                                Boolean(rowErrors.description)
                                                                            }
                                                                            helperText={
                                                                                rowTouched.description &&
                                                                                rowErrors.description
                                                                            }
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            name={`actions.${index}.owner`}
                                                                            value={row.owner}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                            error={
                                                                                rowTouched.owner &&
                                                                                Boolean(rowErrors.owner)
                                                                            }
                                                                            helperText={
                                                                                rowTouched.owner && rowErrors.owner
                                                                            }
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <TextField
                                                                            type="date"
                                                                            name={`actions.${index}.due`}
                                                                            value={row.due}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                            error={
                                                                                rowTouched.due &&
                                                                                Boolean(rowErrors.due)
                                                                            }
                                                                            helperText={
                                                                                rowTouched.due && rowErrors.due
                                                                            }
                                                                        />
                                                                    </TableCell>

                                                                    {/* RE-CHECK */}
                                                                    <TableCell>
                                                                        <Button
                                                                            size="small"
                                                                            variant={
                                                                                row.recheck === "evaluation"
                                                                                    ? "contained"
                                                                                    : "outlined"
                                                                            }
                                                                            color={
                                                                                row.recheck === "evaluation"
                                                                                    ? "success"
                                                                                    : "primary"
                                                                            }
                                                                            startIcon={
                                                                                row.recheck === "evaluation" ? (
                                                                                    <CheckCircleIcon />
                                                                                ) : null
                                                                            }
                                                                            onClick={() =>
                                                                                setFieldValue(
                                                                                    `actions.${index}.recheck`,
                                                                                    "evaluation"
                                                                                )
                                                                            }
                                                                        >
                                                                            {row.recheck === "evaluation"
                                                                                ? "Re-check done"
                                                                                : "Run Re-check"}
                                                                        </Button>

                                                                        {row.recheck !== "evaluation" && (
                                                                            <Typography
                                                                                variant="caption"
                                                                                color="warning.main"
                                                                                display="block"
                                                                            >
                                                                                Pending
                                                                            </Typography>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* STATUS */}
                                                                    <TableCell>
                                                                        <TextField
                                                                            select
                                                                            name={`actions.${index}.status`}
                                                                            value={row.status}
                                                                            onChange={handleChange}
                                                                            size="small"
                                                                            fullWidth
                                                                        >
                                                                            <MenuItem value="open">Open</MenuItem>
                                                                            <MenuItem
                                                                                value="done"
                                                                                disabled={
                                                                                    row.recheck !== "evaluation"
                                                                                }
                                                                            >
                                                                                Done
                                                                            </MenuItem>
                                                                        </TextField>
                                                                    </TableCell>

                                                                    <TableCell align="center">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            disabled={values.actions.length === 1}
                                                                            onClick={() => remove(index)}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                </TableBody>
                                            </Table>
                                 </TableContainer>
                                        
                                        <Stack direction="row" justifyContent="flex-end" mb={1}>
                                            <TablePagination
                                                component="div"
                                                count={values.actions.length}
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
                                        {/* <Stack direction="row" mt={2}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={() => push(emptyAction())}
                                            >
                                                Add Action
                                            </Button>
                                        </Stack> */}
                                    </>
                                )}
                            </FieldArray>

                            {/* FOOTER NOTE */}
                            <Box sx={{
                                marginTop: "12px",
                                padding: "12px",
                                borderRadius: "14px",
                                background: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.neutral : "#f8fafc",
                                border: "1px solid lightgray",
                                borderLeft: "4px solid #184ea4"
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Re-check options:
                                </Typography>
                                <Stack direction="row" spacing={1} mt={1}>
                                    <Chip label="Evaluation" size="small" />
                                    <Chip label="Guardian runtime" size="small" />
                                    <Chip label="DFA refresh" size="small" />
                                </Stack>
                                <Typography variant="caption" color="text.secondary" mt={1}>
                                    An action cannot be closed if its required re-check is not
                                    satisfied.
                                </Typography>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>

    );
}
