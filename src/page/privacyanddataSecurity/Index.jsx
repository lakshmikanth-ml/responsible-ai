import React, { useEffect, useState } from 'react';
import {
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TabA from './TabA';
import TabB from './TabB';
import TabC from './TabC';
import TabD from './TabD';
import TabE from './TabE';
import TabF from './TabF';
import TabG from './TabG';
import TabH from './TabH';

const DECISION_ROLE_OPTIONS = [
    { value: 'advisory', label: 'Advisory only' },
    { value: 'decision_support', label: 'Decision-support' },
    { value: 'decision_influencing', label: 'Decision-influencing' },
];

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
                    placeholder="e.g., /claims/triage"
                    value={context.endpoint}
                    onChange={(e) => onFieldChange('endpoint', e.target.value)}
                />
                <FormControl fullWidth size="small">
                    <InputLabel id="decision-role-label">Decision Role</InputLabel>
                    <Select
                        labelId="decision-role-label"
                        label="Decision Role"
                        value={context.decisionRole}
                        onChange={(e) => onFieldChange('decisionRole', e.target.value)}
                    >
                        {DECISION_ROLE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
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
        project: 'Carrier A - UW Copilot',
        modelVersion: 'v1.2.0',
        endpoint: '/uw/assistant',
        decisionRole: 'decision_support',
        sensitivity: 'Tier 4 - Regulated (PII/PHI/PCI)',
        hostingBoundary: 'Client VPC/VNet (Private)',
    });
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('privacy_projectContext');
            if (saved) setProjectContext(JSON.parse(saved));
        } catch (e) {
            console.error('Failed to load privacy project context', e);
        }
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleFieldChange = (field, value) => {
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
            case 'A': return <TabA projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'B': return <TabB projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'C': return <TabC projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'D': return <TabD projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'E': return <TabE projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'F': return <TabF projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'G': return <TabG projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'H': return <TabH projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            default: return <TabA projectContext={projectContext} onStatusMessage={setStatusMessage} />;
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


            <Card elevation={1}>
                {/* Header Section */}
                <Box sx={{ p: 2 }}>
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
                                Privacy & Data Security
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Control whether the AI system prevents PII leakage, resists data exfiltration, enforces access boundaries, and remains audit-ready across Pre-Training, Release, and Production.
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
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 0 }}>
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
                            label="Coverage: 100%"
                            variant="outlined"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: '#f1f5f9',
                                borderColor: '#cbd5e1',
                                color: '#334155',
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
                            label="Risks: 0 critical open"
                            variant="outlined"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: '#ecfdf5',
                                borderColor: '#86efac',
                                color: '#166534',
                            }}
                        />
                    </Box>
                </Box>



                {/* Main Content Grid: Project Context (Left) + Tab Content (Right) */}
                <Box sx={{
                    display: 'grid',
                    px: 2,
                   
                    gridTemplateColumns: {
                        xs: '1fr', sm: '1fr 1fr',
                        md: '1fr 1fr 1fr 1fr'
                    }, gap: 2,
                }}>
                    {[
                        { name: 'Pre-Training Gate', status: 'BLOCKED', color: '#d32f2f', msg: 'Regulated data tier: Security Owner and Privacy Owner must be assigned in section A.' },
                        { name: 'Release Gate', status: 'BLOCKED', color: '#d32f2f', msg: 'Evaluation has FAIL tests. All privacy/security tests must PASS before release.' },
                        { name: 'Production Gate', status: 'BLOCKED', color: '#d32f2f', msg: 'Production blocked because release gate is blocked.' },
                        { name: 'Guardian Health', status: '—', color: '#f57c00', msg: 'Derived from runtime signals ingested in section H.' },
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
                <Grid container>
                    {/* Gate Status Cards */}


                    {/* Right Panel: Tabs */}
                    <Grid item xs={12} md={9} sx={{ p: 2 }}>
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
                        <>

                        </>
                        {renderTabContent()}
                    </Grid>
                </Grid>
            </Card>
            {/* <Box mt={2}>
                <ProjectContextCard
                    context={projectContext}
                    onFieldChange={handleFieldChange}
                    onSave={handleSaveContext}
                    onReset={handleResetDemo}
                    statusMessage={statusMessage}
                />
            </Box> */}
        </Box >
    );
};

export default Index;
