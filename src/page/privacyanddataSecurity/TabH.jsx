import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@mui/material';
import { Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const TabH = ({ projectContext = {}, onStatusMessage }) => {
    const [projectCtx, setProjectCtx] = useState({
        project: projectContext?.project || '',
        modelVersion: projectContext?.modelVersion || '',
        endpoint: projectContext?.endpoint || '',
        decisionRole: projectContext?.decisionRole || 'Decision-support',
        sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
    });

    const [gateData, setGateData] = useState({
        gates: [
            { name: 'Pre-Training Gate', status: 'BLOCKED', blockers: ['Security Owner not assigned', 'Privacy Owner not assigned'], expanded: true },
            { name: 'Release Gate', status: 'BLOCKED', blockers: ['Evaluation has FAIL tests', 'Risk mitigation incomplete'], expanded: true },
            { name: 'Production Gate', status: 'BLOCKED', blockers: ['Release gate is blocked'], expanded: true },
        ],
        statusMessage: '',
    });
    const [monitoringData, setMonitoringData] = useState({
        signals: {
            pii: true,
            secrets: true,
            injection: true,
            exfil: true,
            rbac: true,
            toolCalls: true,
            overrides: false,
        },
        thresholds: {
            leakThresh: '0 incidents / day (block)',
            injectRate: '< 1% (alert)',
            denyRate: '< 5% (review)',
            escRule: 'Route to SME + hide sensitive spans',
            logMode: 'Secure logs (PII removed)',
            auditFreq: 'Monthly',
        },
        health: {
            pii: 0,
            injection: 0,
            secrets: 0,
            rbacDenies: 0,
            piiStatus: 'OK',
            injectionStatus: 'OK',
            secretsStatus: 'OK',
            rbacStatus: 'OK',
        }
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [approvalDialog, setApprovalDialog] = useState(false);
    const [selectedGateIndex, setSelectedGateIndex] = useState(null);
    const [approvalNotes, setApprovalNotes] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('privacy_tabH_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Support legacy shape (gateData only) and new shape { gateData, monitoring }
                if (parsed.gates) {
                    setGateData(parsed);
                } else if (parsed.gateData) {
                    setGateData(parsed.gateData);
                    if (parsed.monitoring) setMonitoringData(parsed.monitoring);
                }
            } catch (e) {
                console.error('Error loading TabH data:', e);
            }
        }
        const savedCtx = localStorage.getItem('privacy_projectContext');
        if (savedCtx) {
            try {
                setProjectCtx(JSON.parse(savedCtx));
            } catch (e) {
                console.error('Error loading project context:', e);
            }
        }
    }, []);

    const handleSave = () => {
        try {
            // persist both gate data and monitoring data together
            const payload = { gateData, monitoring: monitoringData };
            localStorage.setItem('privacy_tabH_data', JSON.stringify(payload));
            setStatusMessage('✓ H.1–H.2 gates & monitoring saved');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ H.1–H.2 gates & monitoring saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleMonitoringChange = (path, value) => {
        if (path.startsWith('signals.')) {
            const key = path.split('.')[1];
            setMonitoringData(prev => ({ ...prev, signals: { ...prev.signals, [key]: value } }));
        } else if (path.startsWith('thresholds.')) {
            const key = path.split('.')[1];
            setMonitoringData(prev => ({ ...prev, thresholds: { ...prev.thresholds, [key]: value } }));
        } else if (path.startsWith('health.')) {
            const key = path.split('.')[1];
            setMonitoringData(prev => ({ ...prev, health: { ...prev.health, [key]: value } }));
        }
    };

    const handleLoadSampleMonitoring = () => {
        setMonitoringData({
            signals: { pii: true, secrets: true, injection: true, exfil: true, rbac: true, toolCalls: true, overrides: false },
            thresholds: { leakThresh: '0 incidents / day (block)', injectRate: '< 1% (alert)', denyRate: '< 5% (review)', escRule: 'Route to SME + hide sensitive spans', logMode: 'Secure logs (PII removed)', auditFreq: 'Monthly' },
            health: { pii: 12, injection: 5, secrets: 0, rbacDenies: 64, piiStatus: 'WARN', injectionStatus: 'OK', secretsStatus: 'OK', rbacStatus: 'WARN' }
        });
        setStatusMessage('✓ Sample monitoring loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleContextChange = (field, value) => {
        setProjectCtx(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem('privacy_projectContext', JSON.stringify(projectCtx));
            setStatusMessage('✓ Project Context saved');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Project Context saved');
        } catch (e) {
            setStatusMessage('✗ Error saving context');
        }
    };

    const handleResetDemo = () => {
        if (window.confirm('Reset demo data for Gates & Monitoring?')) {
            localStorage.removeItem('privacy_tabH_data');
            localStorage.removeItem('privacy_projectContext');
            setGateData({
                gates: [
                    { name: 'Pre-Training Gate', status: 'BLOCKED', blockers: ['Security Owner not assigned', 'Privacy Owner not assigned'], expanded: true },
                    { name: 'Release Gate', status: 'BLOCKED', blockers: ['Evaluation has FAIL tests', 'Risk mitigation incomplete'], expanded: true },
                    { name: 'Production Gate', status: 'BLOCKED', blockers: ['Release gate is blocked'], expanded: true },
                ],
                statusMessage: '',
            });
            setProjectCtx({ project: '', modelVersion: '', endpoint: '', decisionRole: 'Decision-support', sensitivity: 'Tier 4 — Regulated (PII/PHI/PCI)', hostingBoundary: 'Client VPC/VNet (Private)' });
            setStatusMessage('✓ Demo reset');
            if (onStatusMessage) onStatusMessage('✓ Demo reset');
        }
    };

    const handleToggleExpanded = (index) => {
        setGateData(prev => ({
            ...prev,
            gates: prev.gates.map((g, idx) =>
                idx === index ? { ...g, expanded: !g.expanded } : g
            )
        }));
    };

    const handleApprove = (index) => {
        setSelectedGateIndex(index);
        setApprovalDialog(true);
    };

    const handleSubmitApproval = () => {
        if (selectedGateIndex !== null) {
            setGateData(prev => ({
                ...prev,
                gates: prev.gates.map((g, idx) =>
                    idx === selectedGateIndex ? { ...g, status: 'APPROVED', approvalNotes } : g
                )
            }));
            setStatusMessage(`✓ ${gateData.gates[selectedGateIndex].name} approved`);
            setTimeout(() => setStatusMessage(''), 2000);
            setApprovalDialog(false);
            setApprovalNotes('');
            setSelectedGateIndex(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return '#2e7d32';
            case 'READY': return '#f57c00';
            case 'BLOCKED': return '#d32f2f';
            default: return '#666';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircleIcon sx={{ color: '#2e7d32' }} />;
            case 'READY': return <InfoIcon sx={{ color: '#f57c00' }} />;
            case 'BLOCKED': return <BlockIcon sx={{ color: '#d32f2f' }} />;
            default: return null;
        }
    };

    const getHealthColor = (status) => {
        switch ((status || '').toUpperCase()) {
            case 'OK': return '#2e7d32';
            case 'WARN': return '#f57c00';
            default: return '#666';
        }
    };

    // KPI Dashboard
    const approvedCount = gateData.gates.filter(g => g.status === 'APPROVED').length;
    const blockedCount = gateData.gates.filter(g => g.status === 'BLOCKED').length;
    const totalBlockers = gateData.gates.reduce((sum, g) => sum + (g.blockers?.length || 0), 0);

    const kpiCards = [
        { label: 'Gates Approved', value: approvedCount, color: '#2e7d32' },
        { label: 'Gates Blocked', value: blockedCount, color: '#d32f2f' },
        { label: 'Total Blockers', value: totalBlockers, color: '#f57c00' },
    ];

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            <Grid size={{ xs: 12, md: 4 }}
            >
                <Box sx={{
                    border: '1px solid #e0e0e0',
                    mb: 2, pb: 1, p: 2, borderRadius: 2
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Project Context
                    </Typography>

                    {statusMessage && (
                        <Card variant="outlined" sx={{ mb: 2, bgcolor: '#c8e6c9', borderColor: '#4caf50' }}>
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                                    {statusMessage}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <TextField
                            label="Project"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={projectCtx.project}
                            onChange={(e) => handleContextChange('project', e.target.value)}
                            placeholder="e.g., Carrier A — UW Copilot"
                        />
                        <TextField
                            label="Model Version"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={projectCtx.modelVersion}
                            onChange={(e) => handleContextChange('modelVersion', e.target.value)}
                            placeholder="e.g., v1.2.0"
                        />
                        <TextField
                            label="Endpoint"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={projectCtx.endpoint}
                            onChange={(e) => handleContextChange('endpoint', e.target.value)}
                            placeholder="e.g., /uw/assistant"
                        />
                        <FormControl fullWidth size="small">
                            <InputLabel id="decision-role-label">Decision Role</InputLabel>
                            <Select
                                labelId="decision-role-label"
                                value={projectCtx.decisionRole}
                                label="Decision Role"
                                onChange={(e) => handleContextChange('decisionRole', e.target.value)}
                            >
                                <MenuItem value={'Decision-support'}>Decision-support</MenuItem>
                                <MenuItem value={'Human-in-the-loop'}>Human-in-the-loop</MenuItem>
                                <MenuItem value={'Autonomous'}>Autonomous</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel id="sensitivity-label">Data Sensitivity Tier</InputLabel>
                            <Select
                                labelId="sensitivity-label"
                                value={projectCtx.sensitivity}
                                label="Data Sensitivity Tier"
                                onChange={(e) => handleContextChange('sensitivity', e.target.value)}
                            >
                                <MenuItem value={'Tier 1 — Low'}>Tier 1 — Low</MenuItem>
                                <MenuItem value={'Tier 2 — Moderate'}>Tier 2 — Moderate</MenuItem>
                                <MenuItem value={'Tier 3 — High'}>Tier 3 — High</MenuItem>
                                <MenuItem value={'Tier 4 — Regulated (PII/PHI/PCI)'}>Tier 4 — Regulated (PII/PHI/PCI)</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel id="hosting-boundary-label">Hosting Boundary</InputLabel>
                            <Select
                                labelId="hosting-boundary-label"
                                value={projectCtx.hostingBoundary}
                                label="Hosting Boundary"
                                onChange={(e) => handleContextChange('hostingBoundary', e.target.value)}
                            >
                                <MenuItem value={'Client VPC/VNet (Private)'}>Client VPC/VNet (Private)</MenuItem>
                                <MenuItem value={'Cloud Managed (Restricted)'}>Cloud Managed (Restricted)</MenuItem>
                                <MenuItem value={'Public Cloud (Shared)'}>Public Cloud (Shared)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ExpandMoreIcon />}
                            onClick={handleResetDemo}
                            fullWidth
                        >
                            Reset Data
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveContext}
                            fullWidth
                        >
                            Save
                        </Button>
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontStyle: 'italic' }}>
                        Data persists locally (browser localStorage) for demo realism.
                    </Typography>
                </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }} sx={{
                p: 2, border:
                    "1px solid rgba(117, 117, 117, 0.2)",
                borderRadius: 2
            }}>


                {/* Monitoring Controls: Signals + Thresholds (from HTML spec) */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 6 }}
                     sx={{ display: 'flex',
                     justifyContent: 'space-between',
                      alignItems: 'center'
                      }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Guardian Runtime Signals (must log)</Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // gap: 0.5
                                }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={monitoringData.signals.pii} onChange={(e) => handleMonitoringChange('signals.pii', e.target.checked)} />} label="PII detections + redactions" />
                                    <FormControlLabel control={<Checkbox checked={monitoringData.signals.secrets} onChange={(e) => handleMonitoringChange('signals.secrets', e.target.checked)} />} label="Secrets detections" />
                                    <FormControlLabel control={<Checkbox checked={monitoringData.signals.injection} onChange={(e) => handleMonitoringChange('signals.injection', e.target.checked)} />} label="Prompt-injection flags" />
                                    <FormControlLabel control={<Checkbox checked={monitoringData.signals.exfil} onChange={(e) => handleMonitoringChange('signals.exfil', e.target.checked)} />} label="Exfiltration intent flags" />
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    //  gap: 1, mt: 1
                                }}>
                                    <FormControlLabel control={<Checkbox checked={monitoringData.signals.rbac} onChange={(e) => handleMonitoringChange('signals.rbac', e.target.checked)} />} label="Entitlement decisions (allow/deny)" />
                                    <FormControlLabel control={<Checkbox checked={monitoringData.signals.toolCalls} onChange={(e) => handleMonitoringChange('signals.toolCalls', e.target.checked)} />} label="Tool calls (allowed/blocked)" />
                                    <FormControlLabel control={<Checkbox checked={monitoringData.signals.overrides} onChange={(e) => handleMonitoringChange('signals.overrides', e.target.checked)} />} label="SME overrides" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Production Thresholds (block / alert)</Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, }}>
                                        <Autocomplete
                                            freeSolo
                                            fullWidth
                                            options={['0 incidents / day (block)', '1 incident / day (block)', '1 incident / week (block)']}
                                            value={monitoringData.thresholds.leakThresh}
                                            onChange={(e, newValue) => handleMonitoringChange('thresholds.leakThresh', newValue)}
                                            renderInput={(params) => <TextField {...params} label="Critical Leakage Threshold" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, }}>
                                        <Autocomplete
                                            freeSolo
                                            fullWidth
                                            options={['< 1% (alert)', '< 3% (alert)', '< 5% (alert)']}
                                            value={monitoringData.thresholds.injectRate}
                                            onChange={(e, newValue) => handleMonitoringChange('thresholds.injectRate', newValue)}
                                            renderInput={(params) => <TextField {...params} label="Injection Flag Rate" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, }}>
                                        <Autocomplete
                                            freeSolo
                                            fullWidth
                                            options={['< 2% (review)', '< 5% (review)', '< 10% (review)']}
                                            value={monitoringData.thresholds.denyRate}
                                            onChange={(e, newValue) => handleMonitoringChange('thresholds.denyRate', newValue)}
                                            renderInput={(params) => <TextField {...params} label="RBAC Deny Rate" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, }}>
                                        <Autocomplete
                                            freeSolo
                                            fullWidth
                                            options={['Route to SME + hide sensitive spans', 'Route to SME (no hide)', 'Block response']}
                                            value={monitoringData.thresholds.escRule}
                                            onChange={(e, newValue) => handleMonitoringChange('thresholds.escRule', newValue)}
                                            renderInput={(params) => <TextField {...params} label="Escalation Rule" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, }}>
                                        <Autocomplete
                                            freeSolo
                                            fullWidth
                                            options={['Secure logs (PII removed)', 'Metadata only', 'Full logs (restricted)']}
                                            value={monitoringData.thresholds.logMode}
                                            onChange={(e, newValue) => handleMonitoringChange('thresholds.logMode', newValue)}
                                            renderInput={(params) => <TextField {...params} label="Secure Logging Mode" size="small" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, }}>
                                        <Autocomplete
                                            freeSolo
                                            fullWidth
                                            options={['Weekly', 'Monthly', 'Quarterly']}
                                            value={monitoringData.thresholds.auditFreq}
                                            onChange={(e, newValue) => handleMonitoringChange('thresholds.auditFreq', newValue)}
                                            renderInput={(params) => <TextField {...params} label="Audit Export Frequency" size="small" />}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Guardian Health (runtime placeholder) */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Guardian Health (runtime placeholder)</Typography>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Signal</TableCell>
                                        <TableCell>Last 7 days</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Notes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>PII detections (blocked/redacted)</TableCell>
                                        <TableCell>{monitoringData.health.pii}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: getHealthColor(monitoringData.health.piiStatus),
                                                    px: 1,
                                                    py: 0.5,
                                                    bgcolor: getHealthColor(monitoringData.health.piiStatus) + '15',
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {monitoringData.health.piiStatus}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>Derived from Guardian runtime logs</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Prompt injection flags</TableCell>
                                        <TableCell>{monitoringData.health.injection}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: getHealthColor(monitoringData.health.injectionStatus),
                                                    px: 1,
                                                    py: 0.5,
                                                    bgcolor: getHealthColor(monitoringData.health.injectionStatus) + '15',
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {monitoringData.health.injectionStatus}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>Should not trend upward</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Secrets detected</TableCell>
                                        <TableCell>{monitoringData.health.secrets}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: getHealthColor(monitoringData.health.secretsStatus),
                                                    px: 1,
                                                    py: 0.5,
                                                    bgcolor: getHealthColor(monitoringData.health.secretsStatus) + '15',
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {monitoringData.health.secretsStatus}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>Must be blocked</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>RBAC denies</TableCell>
                                        <TableCell>{monitoringData.health.rbacDenies}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: getHealthColor(monitoringData.health.rbacStatus),
                                                    px: 1,
                                                    py: 0.5,
                                                    bgcolor: getHealthColor(monitoringData.health.rbacStatus) + '15',
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {monitoringData.health.rbacStatus}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>Unexpected spikes indicate misconfigured entitlements</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>








            </Grid>
        </Grid>
    );
};

export default TabH;
