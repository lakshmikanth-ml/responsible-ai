import { useState, useMemo } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    TextField,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const COMPONENTS = ["citations", "reasoning", "confidence"];

export default function TabDEvaluation() {
    const [rows, setRows] = useState([
        {
            id: 1,
            caseId: "CASE-001",
            scenario: "Explain why this claim was prioritized.",
            citationOk: "no",
            clarityOk: "no",
            fabricated: "no",
            components: ["citations", "reasoning"],
        },
    ]);

    const [editRowId, setEditRowId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const paginatedRows = rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    /* ================= KPI LOGIC ================= */

    const kpis = useMemo(() => {
        const total = rows.length || 1;

        const coverage =
            (rows.filter((r) => r.components.length > 0).length / total) * 100;

        const citationScore =
            (rows.filter((r) => r.citationOk === "yes").length / total) * 100;

        const clarityScore =
            (rows.filter((r) => r.clarityOk === "yes").length / total) * 100;

        const fabricatedCount = rows.filter(
            (r) => r.fabricated === "yes"
        ).length;

        return [
            {
                title: "Explainability Coverage Score",
                value: `${Math.round(coverage)}%`,
                desc: "Mandatory outputs with required components present.",
            },
            {
                title: "Citation Integrity Score",
                value: `${Math.round(citationScore)}%`,
                desc: "Confidence that citations map to correct sources.",
            },
            {
                title: "Explanation Clarity Score",
                value: `${Math.round(clarityScore)}%`,
                desc: "Readable for business users (SME rubric).",
            },
            {
                title: "Fabricated Citations",
                value: fabricatedCount,
                desc: "Must be 0 for release.",
                error: fabricatedCount > 0,
            },
        ];
    }, [rows]);

    const updateRow = (id, key, value) =>
        setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [key]: value } : r))
        );

    return (

        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            D. Explainability Methods & Validation (Evaluation)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Run baseline and post-training validation. Failures generate risks
                            and may block release.
                        </Typography>
                    </Box>
                    <Stack direction={{ xs: "column" }} rowGap={1} mt={2}>
                        <Button variant="outlined">Load Sample Eval</Button>
                        <Button variant="contained">Run Evaluation (Simulated)</Button>
                        <Button variant="outlined">Add Eval Case</Button>
                    </Stack>
                </Stack>



                {/* KPI CARDS */}
                <Grid container spacing={2} mt={2}>
                    {kpis.map((kpi) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={kpi.title}>
                            <Card variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {kpi.title}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={kpi.error ? "error.main" : "text.primary"}
                                >
                                    {kpi.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {kpi.desc}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* TABLE */}
                <Box
                    mt={2}
                    sx={{
                        overflowX: "auto",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                    }}
                >
                    <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Case ID</TableCell>
                                <TableCell>Prompt / Scenario</TableCell>
                                <TableCell>Expected Components</TableCell>
                                <TableCell>Citation OK</TableCell>
                                <TableCell>Clarity OK</TableCell>
                                <TableCell>Fabricated?</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paginatedRows.map((row) => {
                                const isEdit = editRowId === row.id;

                                return (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            {isEdit ? (
                                                <TextField
                                                    size="small"
                                                    value={row.caseId}
                                                    onChange={(e) =>
                                                        updateRow(row.id, "caseId", e.target.value)
                                                    }
                                                />
                                            ) : (
                                                row.caseId
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {isEdit ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    multiline
                                                    minRows={2}
                                                    value={row.scenario}
                                                    onChange={(e) =>
                                                        updateRow(row.id, "scenario", e.target.value)
                                                    }
                                                />
                                            ) : (
                                                row.scenario
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {COMPONENTS.map((c) => (
                                                <Chip
                                                    key={c}
                                                    label={c}
                                                    size="small"
                                                    clickable={isEdit}
                                                    color={
                                                        row.components.includes(c)
                                                            ? "primary"
                                                            : "default"
                                                    }
                                                    variant={
                                                        row.components.includes(c)
                                                            ? "filled"
                                                            : "outlined"
                                                    }
                                                    onClick={
                                                        isEdit
                                                            ? () =>
                                                                updateRow(
                                                                    row.id,
                                                                    "components",
                                                                    row.components.includes(c)
                                                                        ? row.components.filter((x) => x !== c)
                                                                        : [...row.components, c]
                                                                )
                                                            : undefined
                                                    }
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </TableCell>

                                        {["citationOk", "clarityOk", "fabricated"].map((field) => (
                                            <TableCell key={field}>
                                                {isEdit ? (
                                                    <Autocomplete
                                                        size="small"
                                                        value={row[field]}
                                                        options={["yes", "no"]}
                                                        onChange={(_, v) =>
                                                            updateRow(row.id, field, v)
                                                        }
                                                        renderInput={(p) => <TextField {...p} />}
                                                    />
                                                ) : (
                                                    <Chip
                                                        size="small"
                                                        label={row[field]}
                                                        color={
                                                            field === "fabricated" && row[field] === "yes"
                                                                ? "error"
                                                                : row[field] === "yes"
                                                                    ? "success"
                                                                    : "default"
                                                        }
                                                    />
                                                )}
                                            </TableCell>
                                        ))}

                                        <TableCell>
                                            {isEdit ? (
                                                <>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setEditRowId(null)}
                                                    >
                                                        <SaveIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setEditRowId(null)}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setEditRowId(row.id)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            setRows((p) =>
                                                                p.filter((r) => r.id !== row.id)
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>

                <TablePagination
                    component="div"
                    count={rows.length}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                />

                {/* CALLOUT */}
                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid lightgray",
                        borderLeft: "4px solid #184ea4",
                        background: "#f8fafc",
                    }}
                >
                    <Typography variant="body2">
                        Evaluation results automatically generate risks in Section E and may
                        block Release in Section H.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
