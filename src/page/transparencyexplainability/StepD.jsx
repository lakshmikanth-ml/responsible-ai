import { useMemo, useState } from "react";
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
    Autocomplete,
    Tooltip,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const COMPONENTS = ["citations", "reasoning", "confidence"];

const SAMPLE_ROWS = [
    {
        id: 1,
        caseId: "CASE-001",
        scenario: "Explain why this claim was prioritized high.",
        components: ["citations", "reasoning"],
        citationOk: "yes",
        clarityOk: "yes",
        fabricated: "no",
    },
    {
        id: 2,
        caseId: "CASE-002",
        scenario: "Cite the policy clause for coverage exclusion.",
        components: ["citations"],
        citationOk: "no",
        clarityOk: "yes",
        fabricated: "no",
    },
    {
        id: 3,
        caseId: "CASE-003",
        scenario: "Summarize rationale for fraud risk signal.",
        components: ["citations", "reasoning", "confidence"],
        citationOk: "yes",
        clarityOk: "no",
        fabricated: "no",
    },
    {
        id: 4,
        caseId: "CASE-004",
        scenario: "",
        components: ["citations", "reasoning"],
        citationOk: "no",
        clarityOk: "no",
        fabricated: "no",
    },
];

export default function TabDEvaluation() {
    const [rows, setRows] = useState(SAMPLE_ROWS);
    const [thresholds, setThresholds] = useState({
        citCov: 90,
        citInt: 95,
        clarity: 85,
        fabricated: 0,
    });

    const kpis = useMemo(() => {
        const total = rows.length || 1;
        const coverage =
            (rows.filter((r) => r.components.length === COMPONENTS.length).length /
                total) *
            100;
        const citationScore =
            (rows.filter((r) => r.citationOk === "yes").length / total) * 100;
        const clarityScore =
            (rows.filter((r) => r.clarityOk === "yes").length / total) * 100;
        const fabricatedCount = rows.filter((r) => r.fabricated === "yes").length;

        return [
            {
                title: "Explainability Coverage Score",
                value: `${Math.round(coverage)}%`,
                desc: "How many mandatory outputs have all required components present.",
                warn: coverage < thresholds.citCov,
            },
            {
                title: "Citation Integrity Score",
                value: `${Math.round(citationScore)}%`,
                desc: "Spot-check confidence that citations point to correct sources.",
                warn: citationScore < thresholds.citInt,
            },
            {
                title: "Explanation Clarity Score",
                value: `${Math.round(clarityScore)}%`,
                desc: "Readability for business users (SME rubric or automated score).",
                warn: clarityScore < thresholds.clarity,
            },
            {
                title: "Fabricated Citations",
                value: fabricatedCount,
                desc: "Must be 0 for release.",
                warn: fabricatedCount > thresholds.fabricated,
                isNumber: true,
            },
        ];
    }, [rows, thresholds]);

    const handleThresholdChange = (key, value) =>
        setThresholds((prev) => ({ ...prev, [key]: value }));

    const handleLoadSample = () => setRows(SAMPLE_ROWS);

    const handleRunEval = () => {
        // Simulate evaluation results
        setRows((prev) =>
            prev.map((row) => ({
                ...row,
                citationOk: Math.random() > 0.3 ? "yes" : "no",
                clarityOk: Math.random() > 0.4 ? "yes" : "no",
                fabricated: Math.random() > 0.9 ? "yes" : "no",
            }))
        );
    };

    const handleAddCase = () => {
        setRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                caseId: `CASE-${String(prev.length + 1).padStart(3, "0")}`,
                scenario: "",
                components: [],
                citationOk: "no",
                clarityOk: "no",
                fabricated: "no",
            },
        ]);
    };

    const handleDelete = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

    const toggleComponent = (id, comp) =>
        setRows((prev) =>
            prev.map((r) =>
                r.id === id
                    ? {
                        ...r,
                        components: r.components.includes(comp)
                            ? r.components.filter((c) => c !== comp)
                            : [...r.components, comp],
                    }
                    : r
            )
        );

    const updateRow = (id, key, value) =>
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

    const renderSelect = (rowId, field, value) => (
        <Autocomplete
            size="small"
            fullWidth
            options={["yes", "no"]}
            value={value || null}
            onChange={(_, nextValue) => updateRow(rowId, field, nextValue || "")}
            renderInput={(params) => <TextField {...params} />}
        />
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
                            D. Explainability Methods &amp; Validation (Evaluation)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Run baseline (pre-training) and post-training validation. Failures automatically create risks and can block release.
                        </Typography>
                    </Box>

                </Stack>
                <Stack direction={{ xs: "row" }} spacing={1} mt={2}>
                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleLoadSample}>
                        Load Sample Eval
                    </Button>
                    <Button variant="contained" startIcon={<PlayCircleOutlineIcon />} onClick={handleRunEval}>
                        Run Evaluation (Simulated)
                    </Button>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddCase}>
                        Add Eval Case
                    </Button>
                </Stack>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Threshold: Citation Coverage %"
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            size="small"
                            fullWidth
                            value={thresholds.citCov}
                            onChange={(e) => handleThresholdChange("citCov", Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Threshold: Citation Integrity %"
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            size="small"
                            fullWidth
                            value={thresholds.citInt}
                            onChange={(e) => handleThresholdChange("citInt", Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Threshold: Explanation Clarity %"
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            size="small"
                            fullWidth
                            value={thresholds.clarity}
                            onChange={(e) => handleThresholdChange("clarity", Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Fabricated Citations Allowed"
                            type="number"
                            inputProps={{ min: 0, max: 10 }}
                            size="small"
                            fullWidth
                            value={thresholds.fabricated}
                            onChange={(e) => handleThresholdChange("fabricated", Number(e.target.value))}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    {kpis.map((kpi) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.title}>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                    p: 2,
                                    borderColor: kpi.warn ? "warning.light" : "divider",
                                    background: kpi.warn ? "linear-gradient(120deg, #fff3e0 0%, #fff7ed 100%)" : "transparent",
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    {kpi.title}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={kpi.warn ? "warning.main" : "text.primary"}
                                    sx={{ fontWeight: 700, mt: 0.5 }}
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

                <Box
                    mt={2}
                    sx={{
                        overflowX: "auto",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    }}
                >
                    <Table
                        stickyHeader
                        size="small"
                        sx={{
                            minWidth: 1100,
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
                                <TableCell sx={{ width: 180 }}>Case ID</TableCell>
                                <TableCell>Prompt / Scenario</TableCell>
                                <TableCell sx={{ width: 180 }}>Expected Components</TableCell>
                                <TableCell sx={{ width: 120 }}>Citation OK</TableCell>
                                <TableCell sx={{ width: 140 }}>Clarity OK</TableCell>
                                <TableCell sx={{ width: 140 }}>Fabricated?</TableCell>
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
                                            value={row.caseId}
                                            onChange={(e) => updateRow(row.id, "caseId", e.target.value)}
                                            placeholder="CASE-001"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            value={row.scenario}
                                            onChange={(e) => updateRow(row.id, "scenario", e.target.value)}
                                            placeholder="Explain why this claim was prioritized high."
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {COMPONENTS.map((c) => (
                                                <Chip
                                                    key={c}
                                                    label={c}
                                                    size="small"
                                                    variant={row.components.includes(c) ? "filled" : "outlined"}
                                                    color={row.components.includes(c) ? "primary" : "default"}
                                                    onClick={() => toggleComponent(row.id, c)}
                                                    sx={{
                                                        pl: 0.5,
                                                        backgroundColor: row.components.includes(c) ? "primary.50" : "#f1f5f9",
                                                        color: "#0f172a",
                                                        border: "1px solid var(--border)",
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{renderSelect(row.id, "citationOk", row.citationOk)}</TableCell>
                                    <TableCell>{renderSelect(row.id, "clarityOk", row.clarityOk)}</TableCell>
                                    <TableCell>{renderSelect(row.id, "fabricated", row.fabricated)}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Delete case">
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

                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderLeft: "4px solid #184ea4",
                        background: "#f8fafc",
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                    }}
                >
                    <InfoOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.25 }} />
                    <Typography variant="body2">
                        Evaluation results automatically generate risks in section E and may block Release in section H.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
