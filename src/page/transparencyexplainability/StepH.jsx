// MUI v7 + Formik + Yup
// H. Lifecycle Enforcement & Monitoring
// ALL-IN-ONE: Gates table + Guardian logs + Monitoring policy + Pagination

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
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    TablePagination,
    Paper,
    Drawer,
    TextField,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const GATES = [
    {
        gate: "Pre-Training Gate",
        status: "CONDITIONAL",
        color: "warning",
        reason:
            "Citations required but no DFA snapshot loaded. Recommended to ingest DFA before training.",
    },
    {
        gate: "Release Gate",
        status: "BLOCKED",
        color: "error",
        reason: "Explainability Owner is missing in section A.",
    },
    {
        gate: "Production Gate",
        status: "BLOCKED",
        color: "error",
        reason: "Production blocked because release gate is blocked.",
    },
];

const validationSchema = Yup.object({
    guardianLogs: Yup.string(),
});

export default function TabHLifecycleMonitoring() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (

        <Formik
            initialValues={{ guardianLogs: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                console.log("Guardian logs saved", values.guardianLogs);
            }}
        >
            {({ values, handleChange, setFieldValue }) => (
                <Form>
                    {/* HEADER */}
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        gap={2}
                        mb={2}
                    >
                        <Box>
                            <Typography variant="h6">
                                H. Lifecycle Enforcement & Monitoring
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Compute gates and monitor runtime explainability using Guardian telemetry. This is where Transparency stays alive in production.
                            </Typography>
                        </Box>


                    </Stack>
                    <Stack direction="row" spacing={1} mb={2}>
                        <Button
                            variant="outlined"
                            onClick={() => setDrawerOpen(true)}
                        >
                            Paste Guardian Logs
                        </Button>
                        <Button variant="outlined">Load Sample Guardian</Button>
                        <Button variant="contained">Apply Guardian → Risks</Button>
                    </Stack>





                    {/* GATES TABLE */}
                    <Box
                        sx={{
                            overflowX: "auto",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Gate</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Blocking logic</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {GATES.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                ).map((row, idx) => (
                                    <TableRow key={idx} hover>
                                        <TableCell>{row.gate}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                color={row.color}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{row.reason}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>

                    {/* <Divider sx={{ my: 3 }} /> */}

                    {/* KPI TILES */}
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2} mt={2}>
                        <Paper sx={{ p: 2, flex: 1 }}>
                            <Typography variant="subtitle2">
                                Guardian Signals (last ingested)
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
                            >
                                {values.guardianLogs || "No Guardian logs ingested."}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Used to create production risks and generate runtime evidence artifacts.
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 2, flex: 1 }}>
                            <Typography variant="subtitle2">Monitoring Policy</Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
                            >
                                {`{
  "missing_citation_rate_warn": 0.05,
  "missing_citation_rate_crit": 0.12,
  "unclear_expl_rate_warn": 0.06,
  "unclear_expl_rate_crit": 0.15,
  "fabricated_citation_incident": 0
}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                These thresholds drive alerts and incident creation.
                            </Typography>
                        </Paper>
                    </Stack>

                    {/* NOTE */}
                    <Box sx={{
                        // marginTop: "12px",
                        padding: "12px",
                        borderRadius: "14px",
                        background: "#f8fafc",
                        border: "1px solid lightgray",
                        borderLeft: "4px solid #184ea4"
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            This section is also where you generate the policy pack to push into Guardian: required explanation components per output type, citation format requirements, and escalation rules.
                        </Typography>
                    </Box>

                    {/* GUARDIAN DRAWER */}
                    <Drawer
                        anchor="right"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                    >
                        <Box sx={{ width: 420, p: 2 }}>
                            <Typography variant="h6" mb={2}>
                                Paste Guardian Logs
                            </Typography>
                            <TextField
                                multiline
                                rows={12}
                                fullWidth
                                name="guardianLogs"
                                value={values.guardianLogs}
                                onChange={handleChange}
                                placeholder="Paste Guardian logs here"
                            />
                            <Stack direction="row" spacing={1} mt={2}>
                                <Button
                                    variant="contained"
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    Save Logs
                                </Button>
                                <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
                            </Stack>
                        </Box>
                    </Drawer>
                </Form>
            )
            }
        </Formik >

    );
}
