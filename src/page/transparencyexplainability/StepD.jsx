import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    TextField,
    MenuItem,
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

const KPIS = [
    {
        title: "Explainability Coverage Score",
        value: "0%",
        desc: "How many mandatory outputs have all required components present.",
    },
    {
        title: "Citation Integrity Score",
        value: "0%",
        desc: "Spot-check confidence that citations point to correct sources.",
    },
    {
        title: "Explanation Clarity Score",
        value: "0%",
        desc: "Readability for business users (SME rubric or automated score).",
    },
    {
        title: "Fabricated Citations",
        value: "0",
        desc: "Must be 0 for release.",
    },
];

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

    return (
        <>
            {/* Header */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
            >
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        D. Explainability Methods & Validation (Evaluation)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                        Run baseline (pre-training) and post-training validation. Failures automatically create risks and can block release.
                    </Typography>
                </Box>


            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
                <Button variant="outlined">Load Sample Eval</Button>
                <Button variant="contained">Run Evaluation (Simulated)</Button>
                <Button variant="outlined">Add Eval Case</Button>
            </Stack>

            {/* <Divider sx={{ my: 2 }} /> */}

            <Grid container spacing={2} mt={2}>
                {KPIS.map((kpi) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={kpi.title}>
                        <Card
                            variant="outlined"
                            sx={{
                                p: 2,
                                height: "100%",
                            }}
                        >
                            <Typography variant="caption" color="text.secondary">
                                {kpi.title}
                            </Typography>
                            <Typography variant="h5" mt={0.5}>
                                {kpi.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {kpi.desc}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* Evaluation Table */}
            <Box mt={2}
                sx={{
                    overflowX: "auto",

                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                }}

            >
                <Table stickyHeader
                    sx={{
                        minWidth: 800,
                        "& th, & td": {
                            borderRight: "1px solid",
                            borderColor: "divider",
                        },
                        "& th:last-of-type, & td:last-of-type": {
                            borderRight: 0,
                        },
                    }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Case ID</TableCell>
                            <TableCell>Prompt / Scenario</TableCell>
                            <TableCell>Expected Components</TableCell>
                            <TableCell>Citation OK</TableCell>
                            <TableCell>Clarity OK</TableCell>
                            <TableCell>Fabricated?</TableCell>
                            <TableCell >Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedRows.map((row) => {
                            const isEdit = editRowId === row.id;

                            return (
                                <TableRow key={row.id} hover>
                                    {/* Case ID */}
                                    <TableCell>
                                        {isEdit ? (
                                            <TextField
                                                size="small"
                                                value={row.caseId}
                                                onChange={(e) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id ? { ...r, caseId: e.target.value } : r
                                                        )
                                                    )
                                                }
                                            />
                                        ) : (
                                            row.caseId
                                        )}
                                    </TableCell>

                                    {/* Scenario */}
                                    <TableCell>
                                        {isEdit ? (
                                            <TextField
                                                size="small"
                                                fullWidth
                                                multiline
                                                minRows={2}
                                                value={row.scenario}
                                                onChange={(e) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id ? { ...r, scenario: e.target.value } : r
                                                        )
                                                    )
                                                }
                                            />
                                        ) : (
                                            row.scenario
                                        )}
                                    </TableCell>

                                    {/* Components */}
                                    <TableCell>
                                        {COMPONENTS.map((c) => (
                                            <Chip
                                                key={c}
                                                label={c}
                                                size="small"
                                                clickable={isEdit}
                                                color={row.components.includes(c) ? "primary" : "default"}
                                                variant={row.components.includes(c) ? "filled" : "outlined"}
                                                onClick={
                                                    isEdit
                                                        ? () =>
                                                            setRows((prev) =>
                                                                prev.map((r) =>
                                                                    r.id === row.id
                                                                        ? {
                                                                            ...r,
                                                                            components: r.components.includes(c)
                                                                                ? r.components.filter((x) => x !== c)
                                                                                : [...r.components, c],
                                                                        }
                                                                        : r
                                                                )
                                                            )
                                                        : undefined
                                                }
                                                sx={{ mr: 0.5, mb: 0.5 }}
                                            />
                                        ))}
                                    </TableCell>

                                    {/* Citation OK */}
                                    <TableCell>
                                        {isEdit ? (
                                            <Autocomplete
                                                size="small"
                                                value={row.citationOk}
                                                options={["yes", "no"]}
                                                onChange={(_, v) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id ? { ...r, citationOk: v } : r
                                                        )
                                                    )
                                                }
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        ) : (
                                            row.citationOk
                                        )}
                                    </TableCell>

                                    {/* Clarity OK */}
                                    <TableCell>
                                        {isEdit ? (
                                            <Autocomplete
                                                size="small"
                                                value={row.clarityOk}
                                                options={["yes", "no"]}
                                                onChange={(_, v) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id ? { ...r, clarityOk: v } : r
                                                        )
                                                    )
                                                }
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        ) : (
                                            row.clarityOk
                                        )}
                                    </TableCell>

                                    {/* Fabricated */}
                                    <TableCell>
                                        {isEdit ? (
                                            <Autocomplete
                                                size="small"
                                                value={row.fabricated}
                                                options={["yes", "no"]}
                                                onChange={(_, v) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id ? { ...r, fabricated: v } : r
                                                        )
                                                    )
                                                }
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        ) : (
                                            row.fabricated
                                        )}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        {isEdit ? (
                                            <Stack direction="row" spacing={0.5}
                                                justifyContent="flex-start">
                                                <Tooltip title="Save">
                                                    <IconButton size="small" onClick={() => setEditRowId(null)}>
                                                        <SaveIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Cancel">
                                                    <IconButton size="small" onClick={() => setEditRowId(null)}>
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        ) : (
                                            <Stack direction="row" spacing={0.5}
                                                justifyContent="flex-start">
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => setEditRowId(row.id)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
            />

            <Box sx={{

                padding: "12px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid lightgray",
                borderLeft: "4px solid #184ea4"
            }}>
                <Typography variant="body2" color="black" display="block">
                    Evaluation results automatically generate risks in section E and may block Release in section H.                </Typography>
            </Box>
        </>

    );
}
