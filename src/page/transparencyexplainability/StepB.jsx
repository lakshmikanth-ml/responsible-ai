import { useState, useEffect } from "react";
import {
    IconButton, Tooltip,
    Autocomplete,
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
    Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

export default function TabBCoverage() {
    const [rows, setRows] = useState([
        {
            id: 1,
            outputType: "claim_priority",
            audience: "Operations",
            depth: "medium",
            mandatory: "yes",
            components: ["citations", "reasoning"],
            justification: "Audit + dispute risk",
        },
    ]);

    const [editRowId, setEditRowId] = useState(null);
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
                        B. Scope & Explainability Coverage Matrix
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                        Transparency equivalent of impacted groups. Define mandatory outputs and required explanation components.
                        Missing coverage blocks training.
                    </Typography>
                </Box>


            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
                <Button variant="outlined">Add Output</Button>
                <Button variant="outlined">Load Sample</Button>
                <Button variant="contained">Save B</Button>
            </Stack>

            {/* <Divider sx={{ my: 2 }} /> */}

            {/* Grid 4 */}
            <Grid container spacing={2} mt={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Autocomplete
                        size="small"
                        fullWidth
                        options={[
                            {
                                label: "Low (internal advisory)",
                                value: "low",
                            },
                            {
                                label: "Medium (internal decisions)",
                                value: "medium",
                            },
                            {
                                label: "High (customer / regulator)",
                                value: "high",
                            },
                        ]}
                        defaultValue={{
                            label: "Medium (internal decisions)",
                            value: "medium",
                        }}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField {...params} label="Default Explanation Depth" />
                        )}
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TextField
                        size="small"
                        fullWidth
                        label="Allowed Evidence Sources (summary)"
                        placeholder="Approved KB only, curated policies, guidelines"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Autocomplete
                        size="small"
                        fullWidth
                        options={[
                            {
                                label: "Citations required for mandatory outputs",
                                value: "required",
                            },
                            {
                                label: "Citations optional (not recommended)",
                                value: "optional",
                            },
                            {
                                label: "Citations restricted (PII or sensitive)",
                                value: "restricted",
                            },
                        ]}
                        defaultValue={{
                            label: "Citations required for mandatory outputs",
                            value: "required",
                        }}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField {...params} label="Citation Policy" />
                        )}
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Autocomplete
                        size="small"
                        fullWidth
                        options={[
                            {
                                label: "Business-readable reasoning required",
                                value: "required",
                            },
                            {
                                label: "Reasoning optional",
                                value: "optional",
                            },
                        ]}
                        defaultValue={{
                            label: "Business-readable reasoning required",
                            value: "required",
                        }}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField {...params} label="Reasoning Policy" />
                        )}
                    />
                </Grid>
            </Grid>

            {/* <Divider sx={{ my: 3 }} /> */}

            {/* KPI Tiles */}





            {/* Coverage Table */}
            <Box sx={{
                overflowX: "auto",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: 2,

            }} mt={2}>
                <Table
                    stickyHeader
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
                            <TableCell>Output Type</TableCell>
                            <TableCell>Audience</TableCell>
                            <TableCell>Depth</TableCell>
                            <TableCell>Mandatory</TableCell>
                            <TableCell>Required Components</TableCell>
                            <TableCell>Justification</TableCell>
                            <TableCell >Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row) => {
                            const isEdit = editRowId === row.id;

                            return (
                                <TableRow key={row.id}>
                                    {/* Output Type */}
                                    <TableCell>
                                        {isEdit ? (
                                            <TextField
                                                size="small"
                                                value={row.outputType}
                                                onChange={(e) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id
                                                                ? { ...r, outputType: e.target.value }
                                                                : r
                                                        )
                                                    )
                                                }
                                            />
                                        ) : (
                                            row.outputType
                                        )}
                                    </TableCell>

                                    {/* Audience */}
                                    <TableCell>
                                        {isEdit ? (
                                            <TextField
                                                select
                                                size="small"
                                                value={row.audience}
                                                onChange={(e) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id
                                                                ? { ...r, audience: e.target.value }
                                                                : r
                                                        )
                                                    )
                                                }
                                            >
                                                {[
                                                    "Operations",
                                                    "Underwriter",
                                                    "Agent/Broker",
                                                    "Customer",
                                                    "Regulator/Auditor",
                                                ].map((o) => (
                                                    <MenuItem key={o} value={o}>
                                                        {o}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        ) : (
                                            row.audience
                                        )}
                                    </TableCell>

                                    {/* Depth */}
                                    <TableCell>
                                        {isEdit ? (
                                            <TextField
                                                select
                                                size="small"
                                                value={row.depth}
                                                onChange={(e) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id
                                                                ? { ...r, depth: e.target.value }
                                                                : r
                                                        )
                                                    )
                                                }
                                            >
                                                {["low", "medium", "high"].map((d) => (
                                                    <MenuItem key={d} value={d}>
                                                        {d}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        ) : (
                                            row.depth
                                        )}
                                    </TableCell>

                                    {/* Mandatory */}
                                    <TableCell>
                                        {isEdit ? (
                                            <TextField
                                                select
                                                size="small"
                                                value={row.mandatory}
                                                onChange={(e) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id
                                                                ? { ...r, mandatory: e.target.value }
                                                                : r
                                                        )
                                                    )
                                                }
                                            >
                                                <MenuItem value="yes">yes</MenuItem>
                                                <MenuItem value="no">no</MenuItem>
                                            </TextField>
                                        ) : (
                                            row.mandatory
                                        )}
                                    </TableCell>

                                    {/* Components */}
                                    <TableCell>
                                        {["citations", "reasoning", "confidence", "rule ref"].map(
                                            (c) => (
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
                                            )
                                        )}
                                    </TableCell>

                                    {/* Justification */}
                                    <TableCell>
                                        {isEdit ? (
                                            <TextField
                                                size="small"
                                                value={row.justification}
                                                onChange={(e) =>
                                                    setRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id
                                                                ? { ...r, justification: e.target.value }
                                                                : r
                                                        )
                                                    )
                                                }
                                            />
                                        ) : (
                                            row.justification
                                        )}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell >
                                        {isEdit ? (
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="Save">
                                                    <IconButton
                                                        size="small"
                                                        // color="primary"
                                                        onClick={() => setEditRowId(null)}
                                                    >
                                                        <SaveIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Cancel">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setEditRowId(null)}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        ) : (
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setEditRowId(row.id)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        // color="error"
                                                        onClick={() =>
                                                            setRows((prev) => prev.filter((r) => r.id !== row.id))
                                                        }
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
            </Box >




            <Box sx={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid lightgray",
                borderLeft: "4px solid #184ea4"
            }}>
                <Typography variant="body2" color="black" mt={0.5} display="block">
                    Hard rule: any mandatory output must have at least one explanation component enabled.
                    For decision-influencing use cases, citations + reasoning is recommended baseline.
                </Typography>
            </Box>
        </>
    );
}
