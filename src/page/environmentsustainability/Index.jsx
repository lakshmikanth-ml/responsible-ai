import { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Card,
    CardContent,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TableContainer,
    Grid,
    Button,
    Stack,
    FormControl,
    Alert, Autocomplete
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';


const tabs = [
    "A. Objective",
    "B. Coverage",
    "C. Readiness",
    "D. Evaluation",
    "E. Risks",
    "F. Mitigation",
    "G. Evidence",
    "H. Monitoring"
];

const DECISION_ROLE_OPTIONS = [
    { value: "advisory", label: "Advisory only" },
    { value: "decision_support", label: "Decision-support" },
    { value: "decision_influencing", label: "Decision-influencing" },
];

const ENV_OPTIONS = [
    { label: "Internal", value: "internal" },
    { label: "Production", value: "production" },
];

const ProjectContextCard = ({
    context,
    onFieldChange,
    onSave,
    onReset,
    statusMessage,
    sx,
}) => (
    <Card variant="outlined" sx={{ width: "100%", ...sx }}>
        <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Project Context
            </Typography>

            <Stack spacing={2}>
                <TextField
                    size="small"
                    fullWidth
                    label="Project"
                    placeholder="e.g., Carrier A - Claims Copilot"
                    value={context.project}
                    onChange={(e) => onFieldChange("project", e.target.value)}
                />
                <TextField
                    size="small"
                    fullWidth
                    label="Model Version"
                    placeholder="e.g., v1.0.3"
                    value={context.modelVersion}
                    onChange={(e) => onFieldChange("modelVersion", e.target.value)}
                />


                <Autocomplete
                    filterSelectedOptions
                    size="small"
                    fullWidth
                    options={ENV_OPTIONS}
                    value={
                        context.decisionRole || null
                    }
                    onChange={(_, v) =>
                        onFieldChange("decisionRole", v || "")
                    }
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Environment" />
                    )}
                />

            </Stack>

            <Stack direction="row" spacing={1} mt={2}>
                <Button size="small" variant="outlined" onClick={onReset}>
                    Reset Demo Data
                </Button>
                <Button size="small" variant="contained" onClick={onSave}>
                    Save
                </Button>
            </Stack>

            {statusMessage && (
                <Typography variant="caption" color="success.main" display="block" mt={1}>
                    {statusMessage}
                </Typography>
            )}

            <Typography variant="caption"  mt={1} display="block">
                Data persists locally (browser localStorage) for demo realism.
            </Typography>
        </CardContent>
    </Card>
);

export default function EnvironmentalSustainabilityTabs() {
    const [activeTab, setActiveTab] = useState(0);
    const [projectContext, setProjectContext] = useState({
        project: "Carrier A - Sustainability",
        modelVersion: "v1.0.0",
        decisionRole: { label: "Production", value: "production" },
    });
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        try {
            const saved = localStorage.getItem("sustainability_projectContext");
            if (saved) setProjectContext(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to load sustainability project context", e);
        }
    }, []);

    const handleFieldChange = (field, value) => {
        setProjectContext((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem("sustainability_projectContext", JSON.stringify(projectContext));
            setStatusMessage("✓ Project Context saved");
            setTimeout(() => setStatusMessage(""), 2000);
        } catch (e) {
            setStatusMessage("Error saving context");
        }
    };

    const handleResetDemo = () => {
        if (window.confirm("Reset demo data? This cannot be undone.")) {
            localStorage.removeItem("sustainability_projectContext");
            setProjectContext({
                project: "",
                modelVersion: "",
                endpoint: "",
                decisionRole: "",
            });
            setStatusMessage("✓ Demo data reset");
            setTimeout(() => setStatusMessage(""), 2000);
        }
    };

    return (
        <>
            <Box sx={{ width: "100%" }}>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 2,
                }}>
                    {/* Title */}
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Environmental Sustainability
                        </Typography>
                        <Typography variant="body2">
                            Lightweight, declarative sustainability governance for AI systems
                        </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>
                            Generate Policy Pack (for Guardian)
                        </Button>
                        <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>
                            Export Snapshot
                        </Button>
                        <Button variant="contained" size="small" startIcon={<RefreshIcon />} sx={{ fontWeight: 600 }}>
                            Recompute Gates
                        </Button>
                    </Box>
                </Box>


                {statusMessage && (
                    <Alert
                        severity={statusMessage.startsWith("✓") ? "success" : "info"}
                        sx={{ mb: 2 }}
                    >
                        {statusMessage}
                    </Alert>
                )}

                <Grid container spacing={2} mb={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card 
                            variant="outlined"
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                                        ? '0 4px 20px rgba(59, 130, 246, 0.3)' 
                                        : '0 4px 20px rgba(59, 130, 246, 0.15)',
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(59, 130, 246, 0.5)' 
                                        : 'rgba(59, 130, 246, 0.3)',
                                },
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(59, 130, 246, 0.08)' 
                                    : 'rgba(59, 130, 246, 0.04)',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(59, 130, 246, 0.2)' 
                                    : 'rgba(59, 130, 246, 0.15)',
                                borderLeft: '4px solid',
                                borderLeftColor: (theme) => theme.palette.mode === 'dark' 
                                    ? '#3b82f6' 
                                    : '#2563eb',
                            }}
                        >
                            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Lifecycle
                                </Typography>
                                <Typography 
                                    fontWeight={700}
                                    sx={{ 
                                        mt: 1.5, 
                                        fontSize: '1.2rem',
                                        color: (theme) => theme.palette.mode === 'dark' 
                                            ? '#60a5fa' 
                                            : '#2563eb',
                                    }}
                                >
                                    Baseline
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card 
                            variant="outlined"
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                                        ? '0 4px 20px rgba(168, 85, 247, 0.3)' 
                                        : '0 4px 20px rgba(168, 85, 247, 0.15)',
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(168, 85, 247, 0.5)' 
                                        : 'rgba(168, 85, 247, 0.3)',
                                },
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(168, 85, 247, 0.08)' 
                                    : 'rgba(168, 85, 247, 0.04)',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(168, 85, 247, 0.2)' 
                                    : 'rgba(168, 85, 247, 0.15)',
                                borderLeft: '4px solid',
                                borderLeftColor: (theme) => theme.palette.mode === 'dark' 
                                    ? '#a855f7' 
                                    : '#9333ea',
                            }}
                        >
                            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Coverage
                                </Typography>
                                <Typography 
                                    fontWeight={700}
                                    sx={{ 
                                        mt: 1.5, 
                                        fontSize: '1.2rem',
                                        color: (theme) => theme.palette.mode === 'dark' 
                                            ? '#c084fc' 
                                            : '#9333ea',
                                    }}
                                >
                                    Limited
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card 
                            variant="outlined"
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                                        ? '0 4px 20px rgba(251, 146, 60, 0.3)' 
                                        : '0 4px 20px rgba(251, 146, 60, 0.15)',
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(251, 146, 60, 0.5)' 
                                        : 'rgba(251, 146, 60, 0.3)',
                                },
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(251, 146, 60, 0.08)' 
                                    : 'rgba(251, 146, 60, 0.04)',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(251, 146, 60, 0.2)' 
                                    : 'rgba(251, 146, 60, 0.15)',
                                borderLeft: '4px solid',
                                borderLeftColor: (theme) => theme.palette.mode === 'dark' 
                                    ? '#fb923c' 
                                    : '#f97316',
                            }}
                        >
                            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Evidence
                                </Typography>
                                <Typography 
                                    fontWeight={700}
                                    sx={{ 
                                        mt: 1.5, 
                                        fontSize: '1.2rem',
                                        color: (theme) => theme.palette.mode === 'dark' 
                                            ? '#fdba74' 
                                            : '#f97316',
                                    }}
                                >
                                    1
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card 
                            variant="outlined"
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                                        ? '0 4px 20px rgba(34, 197, 94, 0.3)' 
                                        : '0 4px 20px rgba(34, 197, 94, 0.15)',
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(34, 197, 94, 0.5)' 
                                        : 'rgba(34, 197, 94, 0.3)',
                                },
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(34, 197, 94, 0.08)' 
                                    : 'rgba(34, 197, 94, 0.04)',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(34, 197, 94, 0.2)' 
                                    : 'rgba(34, 197, 94, 0.15)',
                                borderLeft: '4px solid',
                                borderLeftColor: (theme) => theme.palette.mode === 'dark' 
                                    ? '#22c55e' 
                                    : '#16a34a',
                            }}
                        >
                            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Risk
                                </Typography>
                                <Typography 
                                    fontWeight={700} 
                                    sx={{ 
                                        mt: 1.5, 
                                        fontSize: '1.2rem',
                                        color: (theme) => theme.palette.mode === 'dark' 
                                            ? '#4ade80' 
                                            : '#16a34a',
                                    }}
                                >
                                    Low
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>


                {/* Actions */}
                {/* <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <Button variant="contained">Generate Policy Pack</Button>
                    <Button variant="outlined">Export Snapshot</Button>
                    <Button variant="outlined">Recompute Gates</Button>
                </Box> */}

                <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                >
                    {tabs.map(label => (
                        <Tab key={label} label={label} />
                    ))}
                </Tabs>

                {activeTab === 0 && <ObjectiveTab />}
                {activeTab === 1 && <CoverageTab />}
                {activeTab === 2 && <ReadinessTab />}
                {activeTab === 3 && <EvaluationTab />}
                {activeTab === 4 && <RisksTab />}
                {activeTab === 5 && <MitigationTab />}
                {activeTab === 6 && <EvidenceTab />}
                {activeTab === 7 && <MonitoringTab />}
            </Box>
            <Box mt={2}>
                <ProjectContextCard
                    context={projectContext}
                    onFieldChange={handleFieldChange}
                    onSave={handleSaveContext}
                    onReset={handleResetDemo}
                    statusMessage={statusMessage}
                />
            </Box>
        </>
    );
}

function ObjectiveTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Objective</Typography>
            <TableContainer >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Selection</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Sustainability Maturity</TableCell>
                            <TableCell>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    options={['Baseline', 'Estimated', 'Measured']}
                                    defaultValue="Baseline"
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </TableCell>
                            <TableCell style={{ color: "#92400e" }}>Declared</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Primary Intent</TableCell>
                            <TableCell>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    options={['Minimize', 'Cost', 'Carbon']}
                                    defaultValue="Minimize"
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </TableCell>
                            <TableCell style={{ color: "#92400e" }}>Declared</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function CoverageTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Coverage</Typography>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Area</TableCell>
                            <TableCell>Included</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {["Model Training", "Inference", "Cloud Infrastructure"].map(area => (
                            <TableRow key={area}>
                                <TableCell>{area}</TableCell>
                                <TableCell>
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        options={['Yes', 'No']}
                                        defaultValue="Yes"
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function ReadinessTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Readiness</Typography>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Metric</TableCell>
                            <TableCell>Current State</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow><TableCell>Energy Tracking</TableCell><TableCell>Not Measured</TableCell></TableRow>
                        <TableRow><TableCell>Carbon Accounting</TableCell><TableCell>Not Measured</TableCell></TableRow>
                        <TableRow><TableCell>Cloud Sustainability Claims</TableCell><TableCell
                            style={{
                                color: "#0369a1"
                            }}
                        >Estimated</TableCell></TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function EvaluationTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Evaluation</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                No quantitative sustainability testing required at baseline maturity.
            </Typography>
            <Autocomplete
                size="small"
                fullWidth
                options={['Accepted', 'Planned']}
                defaultValue="Accepted"
                renderInput={(params) => <TextField {...params} />}
            />
        </Card>
    );
}

function RisksTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Risks</Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Risk</TableCell>
                            <TableCell>Severity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>No direct sustainability measurement</TableCell>
                            <TableCell style={{ color: "#92400e" }} >Low</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function MitigationTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Mitigation</Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Action</TableCell>
                            <TableCell>Owner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Annual sustainability posture review</TableCell>
                            <TableCell>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    options={['Platform', 'Cloud']}
                                    defaultValue="Platform"
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function EvidenceTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Evidence</Typography>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Cloud provider sustainability statement</TableCell>
                            <TableCell style={{ color: "#92400e" }} >Approved</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function MonitoringTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6"  fontWeight={600} mb={2}>Monitoring</Typography>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Area</TableCell>
                            <TableCell>Approach</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow><TableCell>Compute usage</TableCell><TableCell>Indirect (cost dashboards)</TableCell></TableRow>
                        <TableRow><TableCell>Carbon reporting</TableCell><TableCell>Not enabled</TableCell></TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}
