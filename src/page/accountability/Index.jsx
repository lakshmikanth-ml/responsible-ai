import React, { useState, useEffect } from 'react';
import {
    Box,
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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';

// Import Privacy & Data Security Tab Components

import TabH from '../privacyanddataSecurity/TabH';

// Import Accountability Tab Components
import PartA from './PartA';
import PartB from './PartB';
import PartC from './PartC';
import PartD from './PartD';
import PartE from './PartE';
import PartF from './PartF';
import PartG from './PartG';
import PartH from './PartH';

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
                return <PartG projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            case 'H':
                return <PartH projectContext={projectContext} onStatusMessage={setStatusMessage} />;
            default:
                return <PartA projectContext={projectContext} onStatusMessage={setStatusMessage} />;
        }
    };

    return (
        <Box >
            {/* Gate Cards Row */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                    gap: 2,
                    mb: 2,
                }}
            >
                {[
                    {
                        title: 'Pre-Training Gate',
                        status: gateStatuses.preTraining,
                        hint: 'Missing required owners or DFA readiness signals.',
                        color: gateStatuses.preTraining === 'BLOCKED' ? '#d32f2f' : '#2e7d32',
                    },
                    {
                        title: 'Release Gate',
                        status: gateStatuses.release,
                        hint: 'Release blocked until incident process + evidence minimum is met.',
                        color: gateStatuses.release === 'BLOCKED' ? '#d32f2f' : '#2e7d32',
                    },
                    {
                        title: 'Production Gate',
                        status: gateStatuses.production,
                        hint: 'Production blocked because release gate is blocked.',
                        color: gateStatuses.production === 'BLOCKED' ? '#d32f2f' : '#2e7d32',
                    },
                    {
                        title: 'Guardian Health',
                        status: gateStatuses.guardianHealth,
                        hint: 'Derived from runtime signals configured in Tab H.',
                        color: gateStatuses.guardianHealth === 'UNKNOWN' ? '#f57c00' : '#2e7d32',
                    },
                ].map((gate, idx) => (
                    <Card key={idx} variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {gate.title}
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
                            {gate.hint}
                        </Typography>
                    </Card>
                ))}
            </Box>

            {/* Main Card with Header + Content */}
            <Card elevation={1} sx={{ m: 0 }}>
                {/* Header Section */}
                <Box sx={{ p: 3 }}>
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
                            <Typography variant="body2" color="text.secondary">
                                Ensure clear ownership, approval paths, audit logs, and incident response so AI deployments remain defensible and controllable across Pre-Training, Release, and Production.
                            </Typography>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button variant="outlined" size="small" onClick={handleGeneratePolicyPack} sx={{ fontWeight: 600 }}>
                                Generate Policy Pack
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
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                        <Chip label="Lifecycle Controlled" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                        <Chip label={`Coverage: ${kpis.coverage}`} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                        <Chip label={`Evidence: ${kpis.evidenceApproved} approved`} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                        <Chip label={`Risks: ${kpis.risksOpen}`} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                    </Box>
                </Box>



                {/* Main Content Grid: Left Sidebar + Right Tab Content */}
                <Grid container>


                    {/* Right Panel: Tabs + Content */}
                    <Grid size={{ xs: 12 }} sx={{ p: 2 }}>
                        {/* Tab Navigation */}
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
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
            </Card>
        </Box>
    );
};

export default Index;
