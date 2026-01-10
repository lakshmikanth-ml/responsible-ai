import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Alert,
    List,
    ListItem,
    Chip,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';

const STORAGE_KEY_TAB_C = 'TabC_DemoData';

const defaultRisksData = {
    risks: [
        {
            id: 'risk_a1_incomplete',
            title: 'Fairness objectives not finalized',
            severity: 'Critical',
            source: 'A1 Completeness',
            type: 'AUTO',
            description: 'A.1 requires a fairness goal and business rationale (>=10 chars).',
        },
        {
            id: 'risk_b1_incomplete',
            title: 'Fairness measurement plan not configured',
            severity: 'Critical',
            source: 'B1 Config',
            type: 'AUTO',
            description: 'B.1 must select metrics, dataset, and threshold policy.',
        },
        {
            id: 'risk_b2_notrun',
            title: 'Baseline fairness evaluation not executed',
            severity: 'Critical',
            source: 'B2 Execution',
            type: 'AUTO',
            description: 'Run B.2 evaluation to produce evidence and identify parity failures.',
        },
        {
            id: 'risk_manual_70b99623',
            title: 'Potential proxy discrimination risk',
            severity: 'Warning',
            source: 'Manual',
            type: 'MANUAL',
            description: 'Example: zip code proxies could correlate with protected characteristics.',
        },
        {
            id: 'risk_a3_partial',
            title: 'Regulatory context incomplete',
            severity: 'Warning',
            source: 'A3 Policy Mapping',
            type: 'AUTO',
            description: 'Select jurisdiction and at least one framework to support audit mapping.',
        },
        {
            id: 'risk_release_evidence_missing',
            title: 'Release evidence missing',
            severity: 'Warning',
            source: 'Evidence Vault',
            type: 'AUTO',
            description: 'Release readiness requires: Bias Mitigation Plan, Release Fairness Sign-off.',
        },
    ],
};

const TabC = () => {
    const [risksData, setRisksData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_TAB_C);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed || defaultRisksData;
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return defaultRisksData;
    });

    const [statusMessage, setStatusMessage] = useState('');
    const [addRiskDialogOpen, setAddRiskDialogOpen] = useState(false);
    const [newRiskForm, setNewRiskForm] = useState({
        title: '',
        severity: 'Warning',
        description: '',
    });

    // Persist data to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_TAB_C, JSON.stringify(risksData));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [risksData]);

    // Calculate risk counts
    const riskCounts = {
        Critical: risksData.risks.filter(r => r.severity === 'Critical').length,
        Warning: risksData.risks.filter(r => r.severity === 'Warning').length,
        Info: risksData.risks.filter(r => r.severity === 'Info').length,
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical':
                return { bg: 'error', icon: ErrorIcon, textColor: 'error' };
            case 'Warning':
                return { bg: 'warning', icon: WarningIcon, textColor: 'warning' };
            case 'Info':
                return { bg: 'info', icon: InfoIcon, textColor: 'info' };
            default:
                return { bg: 'default', icon: InfoIcon, textColor: 'default' };
        }
    };

    const createActionFromRisk = (riskId) => {
        setStatusMessage(`✓ Created action from risk: ${riskId}`);
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const removeManualRisk = (riskId) => {
        setRisksData(prev => ({
            ...prev,
            risks: prev.risks.filter(r => r.id !== riskId),
        }));
        setStatusMessage('✓ Risk removed successfully.');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const addManualRisk = () => {
        setAddRiskDialogOpen(true);
    };

    const handleAddRisk = () => {
        if (!newRiskForm.title.trim() || !newRiskForm.description.trim()) {
            setStatusMessage('❌ Please fill in all fields.');
            return;
        }

        const riskId = `risk_manual_${Date.now()}`;
        const newRisk = {
            id: riskId,
            title: newRiskForm.title,
            severity: newRiskForm.severity,
            source: 'Manual',
            type: 'MANUAL',
            description: newRiskForm.description,
        };

        setRisksData(prev => ({
            ...prev,
            risks: [...prev.risks, newRisk],
        }));

        setAddRiskDialogOpen(false);
        setNewRiskForm({ title: '', severity: 'Warning', description: '' });
        setStatusMessage('✓ Manual risk added successfully.');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const recomputeRisks = () => {
        setStatusMessage('⟲ Auto-risks refreshed from latest A/B data and evidence.');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const resetAll = () => {
        if (window.confirm('Are you sure you want to reset all demo data? This action cannot be undone.')) {
            setRisksData(defaultRisksData);
            setStatusMessage('');
            try {
                localStorage.removeItem(STORAGE_KEY_TAB_C);
            } catch (e) {
                console.error('Failed to clear localStorage:', e);
            }
            alert('Demo data has been reset to defaults.');
        }
    };

    return (
        <Box sx={{ p: 2 }}>


            {/* Header */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                C. Gaps & Risk Assessment
            </Typography>
            <Typography variant="body2"
                color="text.secondary" sx={{ mb: 3 }}>
                Auto-generated from A/B completeness, evaluation results, missing evidence, and open mitigation actions.
            </Typography>

            {/* KPI Dashboard - Risk Counts */}
            <Box sx={{
                display: 'flex', gap: 2,
                mb: 3, flexWrap: 'wrap'
            }}>
                {[
                    { label: 'Critical Risks', count: riskCounts.Critical, desc: 'Must be addressed to pass Baseline.', bg: '#ffebee', border: '#ef5350', accent: '#d32f2f' },
                    { label: 'Warnings', count: riskCounts.Warning, desc: 'May cause conditional release.', bg: '#fff3e0', border: '#ffb74d', accent: '#f57c00' },
                    { label: 'Info', count: riskCounts.Info, desc: 'Tracked for continuous improvement.', bg: '#e3f2fd', border: '#64b5f6', accent: '#1976d2' },
                ].map((kpi) => (
                    <Card
                        key={kpi.label}
                        variant="outlined"
                        sx={{
                            flex: '1 1 calc(33.33% - 12px)',
                            minWidth: 200,
                            bgcolor: kpi.bg,
                            borderColor: kpi.border,
                            borderLeft: `5px solid ${kpi.accent}`,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <CardContent sx={{ p: 2, pb: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#555', display: 'block' }}>
                                        {kpi.label}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#777', display: 'block', lineHeight: 1.3 }}>
                                        {kpi.desc}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ color: kpi.accent, fontWeight: 900, minWidth: 40, textAlign: 'right' }}>
                                    {kpi.count}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Status Message */}
            {statusMessage && (
                <Alert severity={statusMessage.includes('✓') || statusMessage.includes('⟲') ? 'success' : 'error'} sx={{ mb: 2 }}>
                    {statusMessage}
                </Alert>
            )}

            {/* Active Risks Section */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Active Risks
                    </Typography>

                    <Box sx={{ display: 'flex',
                         flexDirection: 'column',
                          gap: 3 }}>
                        {risksData.risks.map((risk) => {
                            const colorConfig = getSeverityColor(risk.severity);
                            const IconComponent = colorConfig.icon;

                            const colorMap = {
                                'Critical': { bg: '#ffebee', border: '#ef5350', accent: '#d32f2f' },
                                'Warning': { bg: '#fff3e0', border: '#ffb74d', accent: '#f57c00' },
                                'Info': { bg: '#e3f2fd', border: '#64b5f6', accent: '#1976d2' },
                            };

                            const colors = colorMap[risk.severity] || colorMap['Info'];

                            return (
                                <Paper
                                    key={risk.id}
                                    variant="outlined"
                                    sx={{
                                        p: 2.5,
                                        bgcolor: colors.bg,
                                        borderColor: colors.border,
                                        borderLeft: `5px solid ${colors.accent}`,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                                <IconComponent sx={{ fontSize: 22, color: colors.accent, mt: 0.2, flexShrink: 0 }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>
                                                    {risk.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#555' }}>
                                                <strong>Severity:</strong> <span style={{ color: colors.accent, fontWeight: 600 }}>{risk.severity}</span> • <strong>Source:</strong> {risk.source} • <strong>Type:</strong> {risk.type}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1, color: '#666', lineHeight: 1.5 }}>
                                                {risk.description}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ minWidth: 180, flexShrink: 0 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.75, color: '#666' }}>
                                                Risk ID
                                            </Typography>
                                            <Chip
                                                label={risk.id}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    mb: 1.5,
                                                    width: '100%',
                                                    bgcolor: '#fff',
                                                    borderColor: colors.accent,
                                                    color: colors.accent,
                                                    fontWeight: 500,
                                                }}
                                            />
                                            <Box sx={{ display: 'flex', gap: 0.75, flexDirection: 'column' }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => createActionFromRisk(risk.id)}
                                                    fullWidth
                                                    sx={{
                                                        bgcolor: colors.accent,
                                                        color: '#fff',
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        '&:hover': { bgcolor: colors.accent, opacity: 0.9 }
                                                    }}
                                                >
                                                    Create Action
                                                </Button>
                                                {risk.type === 'MANUAL' && (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => removeManualRisk(risk.id)}
                                                        fullWidth
                                                        sx={{
                                                            fontWeight: 600,
                                                            textTransform: 'none',
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>

                    <Alert severity="info" sx={{ mt: 3, bgcolor: '#e3f2fd', borderColor: '#64b5f6', borderLeft: '4px solid #1976d2' }}>
                        <Typography variant="caption" sx={{ color: '#1565c0', lineHeight: 1.6 }}>
                            <strong>💡 Tip:</strong> For each Critical/Warning risk, create a mitigation in Section D, upload required evidence in E, and re-run evaluation in B.
                        </Typography>
                    </Alert>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 2.5, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={addManualRisk}
                            sx={{
                                bgcolor: '#1976d2',
                                color: '#fff',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#1565c0' }
                            }}
                        >
                            + Add Risk Manually
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={recomputeRisks}
                            sx={{
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                fontWeight: 600,
                                textTransform: 'none',
                            }}
                        >
                            ⟲ Refresh Auto-Risks
                        </Button>
                    </Box>

                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#888', fontStyle: 'italic' }}>
                        Auto-risks are regenerated when you save A/B, run evaluation, upload evidence, or complete actions.
                    </Typography>
                </CardContent>
            </Card>

            {/* Add Manual Risk Dialog */}
            <Dialog open={addRiskDialogOpen} onClose={() => setAddRiskDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Manual Risk</DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Risk Title"
                        placeholder="e.g., Potential proxy discrimination risk"
                        value={newRiskForm.title}
                        onChange={(e) => setNewRiskForm(prev => ({ ...prev, title: e.target.value }))}
                        variant="outlined"
                    />
                    <FormControl fullWidth>
                        <FormLabel sx={{ mb: 1 }}>Severity</FormLabel>
                        <Select
                            size="small"
                            value={newRiskForm.severity}
                            onChange={(e) => setNewRiskForm(prev => ({ ...prev, severity: e.target.value }))}
                        >
                            <MenuItem value="Critical">Critical</MenuItem>
                            <MenuItem value="Warning">Warning</MenuItem>
                            <MenuItem value="Info">Info</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Description"
                        placeholder="Describe the risk and its implications"
                        value={newRiskForm.description}
                        onChange={(e) => setNewRiskForm(prev => ({ ...prev, description: e.target.value }))}
                        multiline
                        rows={3}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddRiskDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRisk} variant="contained">
                        Add Risk
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Demo Data Note & Reset Section */}
            <Card variant="outlined" sx={{ mb: 0, bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
                <CardContent sx={{ pb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                v1 note:
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                This file stores state in localStorage for demo purposes. Replace with GenAI Foundry backend APIs for enterprise deployments.
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={resetAll}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            Reset Demo Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TabC;
