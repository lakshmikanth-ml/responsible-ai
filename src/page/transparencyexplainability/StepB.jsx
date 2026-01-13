import { useState } from "react";
import {
    IconButton,
    Tooltip,
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const DEPTH_OPTIONS = ["low", "medium", "high"];
const AUDIENCE_OPTIONS = [
    "Operations",
    "Underwriter",
    "Agent/Broker",
    "Customer",
    "Regulator/Auditor",
];
const COMPONENTS = ["citations", "reasoning", "confidence", "rule ref"];

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

    const updateRow = (id, key, value) =>
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

    return (
        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                {/* HEADER */}
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            B. Scope & Explainability Coverage Matrix
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                            Transparency equivalent of impacted groups. Define mandatory outputs and required explanation components.
                            Missing coverage blocks training.
                        </Typography>
                    </Box>

                    <Stack direction="row" flexDirection={"column"}
                        alignItems={"baseline"} rowGap={1} >
                        <Button variant="outlined">Add Output</Button>
                        <Button variant="outlined">Load Sample</Button>
                        <Button variant="contained">Save B</Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* POLICY CONTROLS */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Autocomplete
                            size="small"
                            options={DEPTH_OPTIONS}
                            defaultValue="medium"
                            renderInput={(p) => <TextField {...p} label="Default Explanation Depth" />}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            size="small"
                            fullWidth
                            label="Allowed Evidence Sources"
                            placeholder="Approved KB, curated policies"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Autocomplete
                            size="small"
                            options={["required", "optional", "restricted"]}
                            defaultValue="required"
                            renderInput={(p) => <TextField {...p} label="Citation Policy" />}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Autocomplete
                            size="small"
                            options={["required", "optional"]}
                            defaultValue="required"
                            renderInput={(p) => <TextField {...p} label="Reasoning Policy" />}
                        />
                    </Grid>
                </Grid>

                {/* TABLE */}
                <Box sx={{ mt: 2, overflowX: "auto", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                    <Table size="small" sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Output Type</TableCell>
                                <TableCell>Audience</TableCell>
                                <TableCell>Depth</TableCell>
                                <TableCell>Mandatory</TableCell>
                                <TableCell>Required Components</TableCell>
                                <TableCell>Justification</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => {
                                const isEdit = editRowId === row.id;
                                return (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            {isEdit ? (
                                                <TextField size="small" value={row.outputType} onChange={(e) => updateRow(row.id, "outputType", e.target.value)} />
                                            ) : (
                                                row.outputType
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEdit ? (
                                                <TextField select size="small" value={row.audience} onChange={(e) => updateRow(row.id, "audience", e.target.value)}>
                                                    {AUDIENCE_OPTIONS.map((o) => (
                                                        <MenuItem key={o} value={o}>{o}</MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : (
                                                row.audience
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEdit ? (
                                                <TextField select size="small" value={row.depth} onChange={(e) => updateRow(row.id, "depth", e.target.value)}>
                                                    {DEPTH_OPTIONS.map((d) => (
                                                        <MenuItem key={d} value={d}>{d}</MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : (
                                                row.depth
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEdit ? (
                                                <TextField select size="small" value={row.mandatory} onChange={(e) => updateRow(row.id, "mandatory", e.target.value)}>
                                                    <MenuItem value="yes">yes</MenuItem>
                                                    <MenuItem value="no">no</MenuItem>
                                                </TextField>
                                            ) : (
                                                <Chip size="small" label={row.mandatory} color={row.mandatory === "yes" ? "error" : "default"} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {COMPONENTS.map((c) => (
                                                <Chip
                                                    key={c}
                                                    label={c}
                                                    size="small"
                                                    clickable={isEdit}
                                                    color={row.components.includes(c) ? "primary" : "default"}
                                                    variant={row.components.includes(c) ? "filled" : "outlined"}
                                                    onClick={isEdit ? () => updateRow(row.id, "components", row.components.includes(c) ? row.components.filter((x) => x !== c) : [...row.components, c]) : undefined}
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {isEdit ? (
                                                <TextField size="small" value={row.justification} onChange={(e) => updateRow(row.id, "justification", e.target.value)} />
                                            ) : (
                                                row.justification
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {isEdit ? (
                                                <>
                                                    <Tooltip title="Save">
                                                        <IconButton size="small" onClick={() => setEditRowId(null)}><SaveIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cancel">
                                                        <IconButton size="small" onClick={() => setEditRowId(null)}><CloseIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <>
                                                    <Tooltip title="Edit">
                                                        <IconButton size="small" onClick={() => setEditRowId(row.id)}><EditIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton size="small" onClick={() => setRows((p) => p.filter((r) => r.id !== row.id))}><DeleteIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>

                <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider", borderLeft: "4px solid #184ea4", background: "#f8fafc" }}>
                    <Typography variant="body2">
                        Hard rule: any mandatory output must have at least one explanation component enabled.
                        For decision-influencing use cases, citations + reasoning is recommended baseline.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
