import { useEffect, useState } from "react";
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
    Checkbox,
    Select,
    FormControl,
    InputLabel,
    Alert,
    Tooltip,
    IconButton, Autocomplete
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

const DEPTH_OPTIONS = ["low", "medium", "high"];
const AUDIENCE_OPTIONS = [
    "Operations",
    "Underwriter",
    "Agent/Broker",
    "Customer",
    "Regulator/Auditor",
];
const STORAGE_KEY = "transparency_stepB";

const SAMPLE_ROWS = [
    {
        id: 1,
        outputType: "claim_priority",
        audience: "Operations",
        depth: "medium",
        mandatory: "yes",
        components: { citations: true, reasoning: true, confidence: false, ruleRef: false },
        justification: "High dispute & audit risk",
    },
    {
        id: 2,
        outputType: "risk_flag",
        audience: "Underwriter",
        depth: "high",
        mandatory: "yes",
        components: { citations: true, reasoning: true, confidence: true, ruleRef: true },
        justification: "Decision-influencing signal",
    },
    {
        id: 3,
        outputType: "policy_answer",
        audience: "Customer",
        depth: "high",
        mandatory: "yes",
        components: { citations: true, reasoning: true, confidence: false, ruleRef: false },
        justification: "Customer-facing defensibility",
    },
    {
        id: 4,
        outputType: "summary_note",
        audience: "Operations",
        depth: "low",
        mandatory: "no",
        components: { citations: false, reasoning: false, confidence: false, ruleRef: false },
        justification: "Internal convenience output",
    },
];

const depthOptions = [
    { label: "Low (internal advisory)", value: "low" },
    { label: "Medium (internal decisions)", value: "medium" },
    { label: "High (customer / regulator)", value: "high" },
];

const citationOptions = [
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
];

const reasoningOptions = [
    {
        label: "Business-readable reasoning required",
        value: "required",
    },
    {
        label: "Reasoning optional",
        value: "optional",
    },
];


export default function TabBCoverage() {
    const [rows, setRows] = useState(SAMPLE_ROWS);
    const [policy, setPolicy] = useState({
        defaultDepth: "medium",
        sources: "",
        citationPolicy: "required",
        reasoningPolicy: "required",
    });

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.rows) setRows(parsed.rows);
                if (parsed.policy) setPolicy(parsed.policy);
            }
        } catch (err) {
            console.error("Failed to load Step B data", err);
        }
    }, []);

    const persist = (nextRows, nextPolicy = policy) => {
        setRows(nextRows);
        setPolicy(nextPolicy);
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ rows: nextRows, policy: nextPolicy })
            );
        } catch (err) {
            console.error("Failed to save Step B data", err);
        }
    };

    const handleAddRow = () => {
        const next = [
            ...rows,
            {
                id: Date.now(),
                outputType: "",
                audience: AUDIENCE_OPTIONS[0],
                depth: policy.defaultDepth || "medium",
                mandatory: "no",
                components: { citations: false, reasoning: false, confidence: false, ruleRef: false },
                justification: "",
            },
        ];
        persist(next);
    };

    const handleDelete = (id) => persist(rows.filter((r) => r.id !== id));

    const handleUpdate = (id, key, value) => {
        const next = rows.map((r) => (r.id === id ? { ...r, [key]: value } : r));
        persist(next);
    };

    const toggleComponent = (id, field) => {
        const next = rows.map((r) =>
            r.id === id
                ? { ...r, components: { ...r.components, [field]: !r.components[field] } }
                : r
        );
        persist(next);
    };

    const handleLoadSample = () => {
        persist(SAMPLE_ROWS);
    };

    const handleSave = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ rows, policy }));
        } catch (err) {
            console.error("Failed to save Step B data", err);
        }
    };

    const mandatoryRows = rows.filter((r) => r.mandatory === "yes");
    const coveredMandatory = mandatoryRows.filter((r) =>
        Object.values(r.components).some(Boolean)
    );
    const coverageScore =
        mandatoryRows.length === 0
            ? 100
            : Math.round((coveredMandatory.length / mandatoryRows.length) * 100);

    return (
        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                    alignItems={{ xs: "flex-start", }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            B. Scope & Explainability Coverage Matrix
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                            Transparency equivalent of “impacted groups.” Define mandatory outputs and required explanation components.
                            Missing coverage blocks training.
                        </Typography>
                    </Box>


                </Stack>
                <Stack direction={{ xs: "row" }} spacing={1} mt={2} >
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRow}>
                        Add Output
                    </Button>
                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleLoadSample}>
                        Load Sample
                    </Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                        Save B
                    </Button>
                </Stack>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid size={{ xs: 12, md: 3 }}>

                        <Autocomplete
                            size="small"
                            fullWidth
                            options={depthOptions}
                            getOptionLabel={(option) => option.label}
                            value={
                                depthOptions.find(
                                    (opt) => opt.value === policy.defaultDepth
                                ) || null
                            }
                            onChange={(_, newValue) =>
                                persist(rows, {
                                    ...policy,
                                    defaultDepth: newValue?.value || "",
                                })
                            }
                            isOptionEqualToValue={(opt, val) =>
                                opt.value === val.value
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Default Explanation Depth"
                                />
                            )}
                        />



                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            size="small"
                            fullWidth
                            label="Allowed Evidence Sources (summary)"
                            placeholder="e.g., Approved KB only (pinned versions), curated policies, guidelines"
                            value={policy.sources}
                            onChange={(e) => persist(rows, { ...policy, sources: e.target.value })}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Autocomplete
                            size="small"
                            fullWidth
                            options={citationOptions}
                            getOptionLabel={(option) => option.label}
                            value={
                                citationOptions.find(
                                    (opt) => opt.value === policy.citationPolicy
                                ) || null
                            }
                            onChange={(_, newValue) =>
                                persist(rows, {
                                    ...policy,
                                    citationPolicy: newValue?.value || "",
                                })
                            }
                            isOptionEqualToValue={(opt, val) =>
                                opt.value === val.value
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Citation Policy"
                                />
                            )}
                        />

                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Autocomplete
                            size="small"
                            fullWidth
                            options={reasoningOptions}
                            getOptionLabel={(option) => option.label}
                            value={
                                reasoningOptions.find(
                                    (opt) => opt.value === policy.reasoningPolicy
                                ) || null
                            }
                            onChange={(_, newValue) =>
                                persist(rows, {
                                    ...policy,
                                    reasoningPolicy: newValue?.value || "",
                                })
                            }
                            isOptionEqualToValue={(opt, val) =>
                                opt.value === val.value
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Reasoning Policy"
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                p: 2,
                                background: "linear-gradient(120deg, #e3f2fd 0%, #f5f8ff 100%)",
                                borderColor: "#bbdefb",
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <InfoOutlinedIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle2" color="text.secondary">
                                    Coverage Completeness
                                </Typography>
                            </Stack>
                            <Typography variant="h5" fontWeight={700} mt={0.5}>
                                {coverageScore}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {mandatoryRows.length === 0
                                    ? "No mandatory outputs defined."
                                    : coveredMandatory.length === mandatoryRows.length
                                        ? "All mandatory outputs have required components defined."
                                        : `${coveredMandatory.length}/${mandatoryRows.length} mandatory outputs have required components.`}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                p: 2,
                                background: "linear-gradient(120deg, #fff3e0 0%, #fff7ed 100%)",
                                borderColor: "#ffe0b2",
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <ShieldOutlinedIcon color="warning" fontSize="small" />
                                <Typography variant="subtitle2" color="text.secondary">
                                    Mandatory Outputs
                                </Typography>
                            </Stack>
                            <Typography variant="h5" fontWeight={700} mt={0.5}>
                                {mandatoryRows.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Outputs marked mandatory must pass evaluation and runtime monitoring.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ p: 2, borderColor: "divider" }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Policy Pack Preview
                            </Typography>
                            <Typography variant="h6" fontFamily="monospace">
                                {rows.length} outputs mapped
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Generated JSON pushed into Guardian as rule configuration.
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        mt: 2,
                        overflowX: "auto",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    }}
                >
                    <Table
                        size="small"
                        sx={{
                            minWidth: 1000,
                            "& thead th": {
                                bgcolor: "grey.50",
                                fontWeight: 600,
                            },
                            "& tbody tr:hover": {
                                backgroundColor: "action.hover",
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 220 }}>Output Type</TableCell>
                                <TableCell sx={{ width: 160 }}>Audience</TableCell>
                                <TableCell sx={{ width: 140 }}>Depth</TableCell>
                                <TableCell sx={{ width: 120 }}>Mandatory</TableCell>
                                <TableCell>Required Components</TableCell>
                                <TableCell sx={{ width: 220 }}>Justification</TableCell>
                                <TableCell sx={{ width: 70 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={row.outputType}
                                            placeholder="e.g., claim_priority"
                                            onChange={(e) => handleUpdate(row.id, "outputType", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={row.audience}
                                                onChange={(e) => handleUpdate(row.id, "audience", e.target.value)}
                                            >
                                                {AUDIENCE_OPTIONS.map((opt) => (
                                                    <MenuItem key={opt} value={opt}>
                                                        {opt}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={row.depth}
                                                onChange={(e) => handleUpdate(row.id, "depth", e.target.value)}
                                            >
                                                {DEPTH_OPTIONS.map((opt) => (
                                                    <MenuItem key={opt} value={opt}>
                                                        {opt}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={row.mandatory}
                                                onChange={(e) => handleUpdate(row.id, "mandatory", e.target.value)}
                                            >
                                                <MenuItem value="yes">yes</MenuItem>
                                                <MenuItem value="no">no</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {Object.entries(row.components).map(([key, val]) => (
                                                <Chip
                                                    key={key}
                                                    label={key.replace("ruleRef", "rule ref")}
                                                    size="small"
                                                    icon={
                                                        <Checkbox
                                                            checked={val}
                                                            onChange={() => toggleComponent(row.id, key)}
                                                            sx={{
                                                                p: 0.2,
                                                                color: "grey",
                                                                "&.Mui-checked":
                                                                    { color: "#0190FE" },

                                                            }}

                                                            color="green"
                                                            size="small"
                                                        />
                                                    }
                                                    variant={val ? "filled" : "outlined"}
                                                    color={val ? "primary" : "default"}
                                                    onClick={() => toggleComponent(row.id, key)}
                                                    sx={{
                                                        pl: 0.5,
                                                        backgroundColor: "#f1f5f9",
                                                        color: "#0f172a",
                                                        border: "1px solid var(--border)",
                                                        "& .MuiChip-icon": {
                                                            color: "#0f172a",
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={row.justification}
                                            placeholder="Audit / dispute risk"
                                            onChange={(e) => handleUpdate(row.id, "justification", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Delete row">
                                            <IconButton
                                                size="small"

                                                onClick={() => handleDelete(row.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Alert
                    icon={<InfoOutlinedIcon />}
                    severity="info"
                    sx={{
                        mt: 2,
                        border: "1px solid",
                        borderColor: "primary.100",
                        background: "#f8fafc",
                    }}
                >
                    Hard rule: any mandatory output must have at least one explanation component enabled.
                    For decision-influencing use cases, citations + reasoning is recommended baseline.
                </Alert>
            </CardContent>
        </Card>
    );
}
