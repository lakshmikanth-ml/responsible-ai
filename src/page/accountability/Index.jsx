import React, { useState, useEffect } from 'react';
import {
    Box,
    Stack,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Paper,
    Chip,
    IconButton,
    Tabs,
    Tab,
    Divider,
    FormControl,
    Autocomplete,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';

// Import Privacy & Data Security Tab Components


// Import Accountability Tab Components
import PartA from './PartA';
import PartB from './PartB';
import PartC from './PartC';
import PartD from './PartD';
import PartE from './PartE';
import PartF from './PartF';
import PartG from './PartG';
import PartH from './PartH';

const DECISION_ROLE_OPTIONS = [
    { value: 'advisory', label: 'Advisory only' },
    { value: 'decision_support', label: 'Decision-support' },
    { value: 'decision_influencing', label: 'Decision-influencing' },
];

const PILL_ITEMS = [
    {
        label: "Lifecycle Controlled",
        tone: "slate",
        backgroundColor: "rgba(25, 118, 210, 0.12)",
        // borderColor: "rgba(25, 118, 210, 0.35)",
        dotColor: "#1976d2",
    },
    { label: "Coverage: 31%", tone: "slate", backgroundColor: "#f1f5f9", },
    { label: "Evidence: 0/6 approved", tone: "slate", backgroundColor: "#f1f5f9" },
    {
        label: "Risks: 2 critical open", tone: "slate", backgroundColor: "#f1f5f9",
        dotColor: "red",
    },
];

const Pill = ({
    label,
    tone = "primary",
    backgroundColor,
    borderColor,
    dotColor,
}) => {
    const palette = {
        primary: { bg: "primary.50", border: "primary.200", dot: "primary.main" },
        slate: { bg: "grey.50", border: "grey.200", dot: "primary.main" },
        warn: { bg: "warning.50", border: "warning.200", dot: "warning.main" },
    };
    const base = palette[tone] || palette.primary;
    const colors = {
        bg: backgroundColor || base.bg,
        border: borderColor || base.border,
        dot: dotColor || base.dot,
    };

    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: "4px",
                bgcolor: colors.bg,
                border: "1px solid",
                borderColor: colors.border,
                minHeight: 34,
            }}
        >
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: colors.dot,
                }}
            />
            <Typography variant="caption" fontWeight={700}>
                {label}
            </Typography>
        </Box>
    );
};

const ProjectContextCard = ({
    context,
    onFieldChange,
    onSave,
    onReset,
    statusMessage,
    sx,
}) => (
    <Card variant="outlined" sx={{ width: '100%', ...sx }}>
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
                    onChange={(e) => onFieldChange('project', e.target.value)}
                />
                <TextField
                    size="small"
                    fullWidth
                    label="Model Version"
                    placeholder="e.g., v1.0.3"
                    value={context.modelVersion}
                    onChange={(e) => onFieldChange('modelVersion', e.target.value)}
                />
                <TextField
                    size="small"
                    fullWidth
                    label="Endpoint"
                    placeholder="e.g., /uw/assistant"
                    value={context.endpoint}
                    onChange={(e) => onFieldChange('endpoint', e.target.value)}
                />
                <FormControl fullWidth size="small">
                    <Autocomplete
                        fullWidth
                        size="small"
                        options={DECISION_ROLE_OPTIONS}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={DECISION_ROLE_OPTIONS.find((option) => option.value === context.decisionRole) || null}
                        onChange={(_, value) => onFieldChange('decisionRole', value?.value || '')}
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

            <Typography variant="caption"  mt={1} display="block">
                Data persists locally (browser localStorage) for demo realism.
            </Typography>
        </CardContent>
    </Card>
);

const Index = () => {
    const [activeTab, setActiveTab] = useState('A');
    const [statusMessage, setStatusMessage] = useState('');

    // Project context (shared across tabs)
    const [projectContext, setProjectContext] = useState({
        project: 'Carrier A — UW Copilot',
        modelVersion: 'v1.2.0',
        endpoint: '/uw/assistant',
        decisionRole: 'Decision-support',
        sensitivity: 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: 'Client VPC/VNet (Private)',
    });

    // Gate statuses (derived from tab data)
    const [gateStatuses, setGateStatuses] = useState({
        preTraining: 'BLOCKED',
        release: 'BLOCKED',
        production: 'BLOCKED',
        guardianHealth: 'UNKNOWN',
    });

    // KPI data
    const [kpis, setKpis] = useState({
        coverage: '0%',
        evidenceApproved: '0/0',
        risksOpen: '0 critical',
    });

    // DFA & policy data
    const [dfaJson, setDfaJson] = useState('');
    const [policyPreview, setPolicyPreview] = useState('');

    // Load saved data on mount
    useEffect(() => {
        const savedData = localStorage.getItem('accountability_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setGateStatuses(parsed.gates || gateStatuses);
                setKpis(parsed.kpis || kpis);
            } catch (e) {
                console.error('Error loading accountability data:', e);
            }
        }

        const savedCtx = localStorage.getItem('accountability_projectContext');
        if (savedCtx) {
            try {
                setProjectContext(JSON.parse(savedCtx));
            } catch (e) {
                console.error('Error loading accountability project context:', e);
            }
        }
    }, []);

    const handleLoadDFASample = () => {
        const sample = JSON.stringify({
            datasetOwnership: 'Data Eng Team',
            dataQuality: 0.92,
            completeness: 0.88,
            lastUpdated: new Date().toISOString(),
        }, null, 2);
        setDfaJson(sample);
        setStatusMessage('✓ DFA sample loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleIngestDFA = () => {
        if (dfaJson.trim()) {
            try {
                JSON.parse(dfaJson);
                setStatusMessage('✓ DFA ingested successfully');
                setTimeout(() => setStatusMessage(''), 2000);
            } catch (e) {
                setStatusMessage('✗ Invalid JSON');
                setTimeout(() => setStatusMessage(''), 2000);
            }
        }
    };

    const handleGeneratePolicyPack = () => {
        const policy = JSON.stringify({
            version: '1.0',
            gateRules: gateStatuses,
            timestamp: new Date().toISOString(),
        }, null, 2);
        setPolicyPreview(policy);
        setStatusMessage('✓ Policy pack generated');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleExportJSON = () => {
        const snapshot = {
            gates: gateStatuses,
            kpis,
            dfa: dfaJson,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accountability-snapshot-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStatusMessage('✓ Snapshot exported');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleCopyPolicy = () => {
        navigator.clipboard.writeText(policyPreview).then(() => {
            setStatusMessage('✓ Policy copied to clipboard');
            setTimeout(() => setStatusMessage(''), 2000);
        });
    };

    const handleRecomputeGates = () => {
        // Placeholder: in production, this would fetch gate status from backend
        setGateStatuses({
            preTraining: 'BLOCKED',
            release: 'BLOCKED',
            production: 'BLOCKED',
            guardianHealth: 'WARN',
        });
        setStatusMessage('✓ Gates recomputed');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleFieldChange = (field, value) => {
        setProjectContext((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem('accountability_projectContext', JSON.stringify(projectContext));
            setStatusMessage('✓ Project Context saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
        } catch (e) {
            setStatusMessage('✗ Error saving context');
        }
    };

    const handleResetDemo = () => {
        if (window.confirm('Reset all demo data? This cannot be undone.')) {
            localStorage.removeItem('accountability_projectContext');
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

    const getGateColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return '#2e7d32';
            case 'READY':
                return '#f57c00';
            case 'BLOCKED':
                return '#d32f2f';
            case 'UNKNOWN':
                return '#666';
            default:
                return '#666';
        }
    };

    const getGateIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircleIcon sx={{ color: '#2e7d32', mr: 1 }} />;
            case 'BLOCKED':
                return <BlockIcon sx={{ color: '#d32f2f', mr: 1 }} />;
            case 'UNKNOWN':
                return <InfoIcon sx={{ color: '#666', mr: 1 }} />;
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'A', label: 'A. Objective' },
        { id: 'B', label: 'B. Coverage' },
        { id: 'C', label: 'C. Training Readiness (DFA)' },
        { id: 'D', label: 'D. Evaluation' },
        { id: 'E', label: 'E. Gaps & Risks' },
        { id: 'F', label: 'F. Mitigation' },
        { id: 'G', label: 'G. Evidence' },
        { id: 'H', label: 'H. Gates & Monitoring' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'A':
                return <PartA projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'B':
                return <PartB projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'C':
                return <PartC projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'D':
                return <PartD projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'E':
                return <PartE projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'F':
                return <PartF projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'G':
                return <PartG projectContext={projectContext}
                    onStatusMessage={setStatusMessage} />;
            case 'H':
                return <PartH projectContext={projectContext}
                    onStatusMessage={setStatusMessage} />;
            default:
                return <PartA projectContext={projectContext} onStatusMessage={setStatusMessage} />;
        }
    };

    return (
        <Box >
            <Box sx={{ width: '100%', m: 0 }}>
                {/* Header Section */}
                <Box>
                    {/* Header Top: Title + Action Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 2,
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        {/* Title */}
                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                Accountability
                            </Typography>
                            <Typography variant="body2" >
                                Ensure clear ownership, approval paths, audit logs, and incident response so AI deployments remain defensible and controllable across Pre-Training, Release, and Production.
                            </Typography>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button variant="outlined" size="small" onClick={handleGeneratePolicyPack} sx={{ fontWeight: 600 }}>
                                Generate Policy Pack  (for Guardian)
                            </Button>
                            <Button variant="outlined" size="small" onClick={handleExportJSON} sx={{ fontWeight: 600 }}>
                                Export Snapshot
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<RefreshIcon />}
                                onClick={handleRecomputeGates}
                                sx={{ fontWeight: 600 }}
                            >
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
                            label="Coverage: 31%"
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
                            label="Risks: 2 open (3 critical)"
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

                {/* Gate Cards Row */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                        gap: 2,
                    }}
                >
                    {[
                        {
                            title: 'Pre-Training Gate',
                            status: gateStatuses.preTraining,
                            hint: 'Project Context incomplete (Project/Model Version/Endpoint/Decision Role required).',
                            color: gateStatuses.preTraining === 'BLOCKED' ? '#d32f2f' : '#2e7d32',
                        },
                        {
                            title: 'Release Gate',
                            status: gateStatuses.release,
                            hint: 'Pre-Training Gate is not passing.',
                            color: gateStatuses.release === 'BLOCKED' ? '#d32f2f' : '#2e7d32',
                        },
                        {
                            title: 'Production Gate',
                            status: gateStatuses.production,
                            hint: 'Release Gate is not passing.',
                            color: gateStatuses.production === 'BLOCKED' ? '#d32f2f' : '#2e7d32',
                        },
                        {
                            title: 'Guardian Health',
                            status: gateStatuses.guardianHealth,
                            hint: 'No runtime signals loaded (sample or pasted).',
                            color: gateStatuses.guardianHealth === 'UNKNOWN' ? '#f57c00' : '#2e7d32',
                        },
                    ].map((gate, idx) => (
                        <Card 
                            key={idx} 
                            variant="outlined" 
                            sx={{ 
                                p: 2,
                                border: '1px solid',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(171, 171, 171, 0.15)' 
                                    : 'rgba(117, 117, 117, 0.2)',
                                background: (theme) => theme.palette.mode === 'dark' 
                                    ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)' 
                                    : 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(171, 171, 171, 0.25)' 
                                        : 'rgba(117, 117, 117, 0.3)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                                        ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            <Typography 
                                variant="subtitle2"
                                sx={{ 
                                    fontWeight: 600, 
                                    mb: 1,
                                    color: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.95)' 
                                        : 'rgba(0, 0, 0, 0.87)',
                                }}
                            >
                                {gate.title}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1.5,
                                p: "6px",
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? gate.color + '25' 
                                    : gate.color + '15',
                                borderRadius: '4px',
                                width: 'fit-content',
                                border: '1px solid',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? gate.color + '40' 
                                    : gate.color + '30',
                            }}>
                                <Box sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    bgcolor: gate.color,
                                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                                        ? `0 0 8px ${gate.color}40` 
                                        : `0 0 8px ${gate.color}20`,
                                }} />
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        color: gate.color,
                                        textShadow: (theme) => theme.palette.mode === 'dark' 
                                            ? `0 0 4px ${gate.color}20` 
                                            : 'none',
                                    }}
                                >
                                    {gate.status}
                                </Typography>
                            </Box>
                            <Typography 
                                variant="caption" 
                              
                                sx={{ 
                                    display: 'block', 
                                    lineHeight: 1.5,
                                   
                                }}
                            >
                                {gate.hint}
                            </Typography>
                        </Card>
                    ))}
                </Box>

                {/* Main Content Grid: Left Sidebar + Right Tab Content */}
                <Grid container mt={2}>


                    {/* Right Panel: Tabs + Content */}
                    <Grid size={{ xs: 12 }}>
                        {/* Tab Navigation */}
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) =>
                                setActiveTab(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                mb: 2,
                            }}
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.id}
                                    label={tab.label}
                                    value={tab.id}
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
        </Box>
    );
};

export default Index;
