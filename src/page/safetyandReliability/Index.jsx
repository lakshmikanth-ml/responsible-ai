import React, { useState } from 'react';
import {
    Stack,
    Box,
    Typography,
    Tabs,
    Tab,
    Chip,
    Card,
    CardContent,
    Button,
    Divider,
    Grid,
    TextField,
    FormControl,
    Autocomplete,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ObjectiveTabA from './TabA';
import TabBCoverage from './TabB';
import TabCTrainingReadiness from './TabC';
import TabDEvaluation from './TabD';
import TabEGapsRisks from './TabE';
import TabFGapsRisks from './TabF';
import TabGEvidence from './TabG';
import TabHGatesMonitoring from './TabH';

const DECISION_ROLE_OPTIONS = [
    { value: "advisory", label: "Advisory only" },
    { value: "decision_support", label: "Decision-support" },
    { value: "decision_influencing", label: "Decision-influencing" },
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
                <TextField
                    size="small"
                    fullWidth
                    label="Endpoint"
                    placeholder="e.g., /claims/triage"
                    value={context.endpoint}
                    onChange={(e) => onFieldChange("endpoint", e.target.value)}
                />
                <FormControl fullWidth size="small">
                    <Autocomplete
                        fullWidth
                        size="small"
                        options={DECISION_ROLE_OPTIONS}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={DECISION_ROLE_OPTIONS.find((option) => option.value === context.decisionRole) || null}
                        onChange={(_, value) => onFieldChange("decisionRole", value?.value || "")}
                        renderInput={(params) => <TextField {...params} label="Decision Role" />}
                    />
                </FormControl>
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

            <Typography variant="caption" color="text.secondary" mt={1} display="block">
                Data persists locally (browser localStorage) for demo realism.
            </Typography>
        </CardContent>
    </Card>
);


const Index = () => {
    const [activeTab, setActiveTab] = useState('A');
    const [projectContext, setProjectContext] = useState({
        project: 'Carrier A — UW Copilot',
        modelVersion: 'v1.2.0',
        endpoint: '/uw/assistant',
        decisionRole: 'Decision-support',
        sensitivity: 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: 'Client VPC/VNet (Private)',
    });
    const [statusMessage, setStatusMessage] = useState('');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleContextChange = (field, value) => {
        setProjectContext(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem('privacy_projectContext', JSON.stringify(projectContext));
            setStatusMessage('✓ Project Context saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
        } catch (e) {
            setStatusMessage('✗ Error saving context');
        }
    };


    const handleFieldChange = (field, value) => {
        setProjectContext((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleResetDemo = () => {
        if (window.confirm('Reset all demo data? This cannot be undone.')) {
            localStorage.clear();
            setProjectContext({
                project: '',
                modelVersion: '',
                endpoint: '',
                decisionRole: '',
                sensitivity: '',
                hostingBoundary: '',
            });
            setStatusMessage('✓ Demo data reset');
            setTimeout(() => setStatusMessage(''), 2000);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'A': return <ObjectiveTabA />;
            case 'B': return <TabBCoverage />;
            case 'C': return <TabCTrainingReadiness />;
            case 'D': return <TabDEvaluation />;
            case 'E': return <TabEGapsRisks />;
            case 'F': return <TabFGapsRisks />;
            case 'G': return <TabGEvidence />;
            case 'H': return <TabHGatesMonitoring />;
            default: return <ObjectiveTabA />;
        }
    };

    const tabLabels = [
        'A. Objective',
        'B. Coverage',
        'C. Training Readiness (DFA)',
        'D. Evaluation',
        'E. Gaps & Risks',
        'F. Mitigation',
        'G. Evidence',
        'H. Gates & Monitoring',
    ];

    const tabValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                {/* Header Section */}
                <Box>
                    {/* Header Top */}
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
                                Safety & Reliability
                            </Typography>
                            <Typography variant="body2"
                             >
                                Control whether the AI system is stable, resilient to edge cases, safe under failures, and operationally reliable across Pre-Training, Release, and Production. This includes uptime, latency, error budgets, stress testing, fallback protocols, incident response readiness, and runtime monitoring.
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

                    {/* Status Chips */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{ mt: 2, flexWrap: "wrap",mb:2 }}
                    >
                        <Chip
                            label="Lifecycle Controlled"
                            variant="outlined"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: 'rgba(25, 118, 210, 0.12)',
                                borderColor: 'rgba(25, 118, 210, 0.35)',
                                color: 'primary.dark',
                            }}
                        />


                        <Chip
                            label="Coverage: 44%"
                            variant="outlined"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: '#fffbeb',
                                borderColor: '#fcd34d',
                                color: '#b45309',
                            }}
                        />


                        <Chip
                            label="Evidence: 0/6 approved"
                            variant="outlined"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: '#fff7ed',
                                borderColor: '#fdba74',
                                color: '#c2410c',
                            }}
                        />


                        <Chip
                            label="Risks: 3 open (3 critical)"
                            variant="outlined"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: '#fef2f2',
                                borderColor: '#fca5a5',
                                color: '#b91c1c',
                            }}
                        />
                    </Stack>
                </Box>


                {/* Gate Status Cards */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 2, mb: 2
                }}>
                    {[
                        {
                            name: 'Pre-Training Gate',
                            status: 'BLOCKED',
                            color: '#d32f2f',
                            msg: 'DFA not ingested (Tab C). Critical safety risks are still open (Tab E).'
                        },
                        {
                            name: 'Release Gate', status: 'BLOCKED',
                            color: '#d32f2f',
                            msg: 'Pre-training gate not passed. Missing required testing (stress + edge cases + UAT) in Tab D. Failover / fallback evidence not approved (Tab G). Incident response playbook not approved (Tab G). Critical risks still open (Tab E).'
                        },
                        {
                            name: 'Production Gate', status: 'BLOCKED',
                            color: '#d32f2f',
                            msg: 'Release gate is blocked.'
                        },
                        {
                            name: 'Guardian Health', status: '—',
                            color: '#f57c00',
                            msg: 'No Guardian runtime signals loaded yet.'
                        },
                    ].map((gate, idx) => (
                        <Card key={idx} variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                {gate.name}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1.5,
                                p: 1,
                                bgcolor: gate.color + '15',
                                borderRadius: '4px',
                                width: 'fit-content',
                            }}>
                                <Box sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    bgcolor: gate.color,
                                }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: gate.color }}>
                                    {gate.status}
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                                {gate.msg}
                            </Typography>
                        </Card>
                    ))}
                </Box>
                {/* Main Content Grid: Project Context (Left) + Tab Content (Right) */}
                <Grid container>


                    {/* Right Panel: Tabs */}
                    <Grid item xs={12} md={9}>
                        {/* Tab Navigation */}
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                mb: 2,
                            }}
                        >
                            {tabValues.map((value, index) => (
                                <Tab
                                    key={value}
                                    label={tabLabels[index]}
                                    value={value}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                    }}
                                />
                            ))}
                        </Tabs>

                        {/* Tab Content */}
                        {renderTabContent()}
                    </Grid>
                </Grid>
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
        </Box >
    );
};

export default Index;
