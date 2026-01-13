import React, { useState } from 'react';
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
import TabG from './TabG';
import TabGEvidence from './TabG';
import TabHGatesMonitoring from './TabH';


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
            {/* Gate Status Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
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
                            borderRadius: '50px',
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
                                Safety & Reliability
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                        <Chip
                            label="Lifecycle Controlled"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        <Chip
                            label="Coverage: 100%"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        <Chip
                            label="Evidence: 0/6 approved"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        <Chip
                            label="Risks: 0 critical open"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>
                </Box>



                {/* Main Content Grid: Project Context (Left) + Tab Content (Right) */}
                <Grid container>


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
                        {renderTabContent()}
                    </Grid>
                </Grid>
            </Card>
        </Box >
    );
};

export default Index;
