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
                 <Card elevation={0} sx={{ position: 'sticky', top: 20 }}>
                        <CardContent>
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

                    <Typography variant="caption"  sx={{ display: 'block', mt: 2,  }}>
                        Data persists locally (browser localStorage) for demo realism.
                    </Typography>
                </CardContent></Card>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }} sx={{ p: 0, }}>
                {/* Section Header */}
               
  <Card elevation={0} sx={{ position: 'sticky', top: 20 }}>
                        <CardContent>
                             <Box sx={{ display: 'flex', justifyContent: 'space-between',
                     alignItems: 'flex-start', gap: 3, mb: 3,
                    }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            H. Gates &amp; Monitoring (Production Governance)
                        </Typography>
                        <Typography variant="body2" sx={{  maxWidth: 600 }}>
                            Define runtime KPIs and thresholds that Guardian must log and enforce. This is the "always-on" privacy protection after deployment.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleLoadSampleMonitoring}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Load Sample Monitoring
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleSave}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Save H
                        </Button>
                    </Box>
                </Box>

                {/* Status Message */}
                {statusMessage && (
                    <Card variant="outlined" sx={{ mb: 2, bgcolor: '#c8e6c9', borderColor: '#4caf50' }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                                {statusMessage}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
                {/* 2-Column Grid: Signals + Thresholds */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {/* Guardian Runtime Signals */}
                    <Grid size={{ xs: 12, md: 6 }}>
                           <Card elevation={0} sx={{ position: 'sticky', top: 20 }}>
                                                <CardContent>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                                    Guardian Runtime Signals (must log)
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={monitoringData.signals.pii}
                                                onChange={(e) => handleMonitoringChange('signals.pii', e.target.checked)}
                                            />
                                        }
                                        label={<Typography variant="body2">PII detections + redactions</Typography>}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={monitoringData.signals.secrets}
                                                onChange={(e) => handleMonitoringChange('signals.secrets', e.target.checked)}
                                            />
                                        }
                                        label={<Typography variant="body2">Secrets detections</Typography>}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={monitoringData.signals.injection}
                                                onChange={(e) => handleMonitoringChange('signals.injection', e.target.checked)}
                                            />
                                        }
                                        label={<Typography variant="body2">Prompt-injection flags</Typography>}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={monitoringData.signals.exfil}
                                                onChange={(e) => handleMonitoringChange('signals.exfil', e.target.checked)}
                                            />
                                        }
                                        label={<Typography variant="body2">Exfiltration intent flags</Typography>}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={monitoringData.signals.rbac}
                                                onChange={(e) => handleMonitoringChange('signals.rbac', e.target.checked)}
                                            />
                                        }
                                        label={<Typography variant="body2">Entitlement decisions (allow/deny)</Typography>}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={monitoringData.signals.toolCalls}
                                                onChange={(e) => handleMonitoringChange('signals.toolCalls', e.target.checked)}
                                            />
                                        }
                                        label={<Typography variant="body2">Tool calls (allowed/blocked)</Typography>}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={monitoringData.signals.overrides}
                                                onChange={(e) => handleMonitoringChange('signals.overrides', e.target.checked)}
                                            />
                                        }
                                        label={<Typography variant="body2">SME overrides</Typography>}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Production Thresholds */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                                    Production Thresholds (block / alert)
                                </Typography>
                                <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Critical Leakage Threshold</InputLabel>
                                            <Select
                                                value={monitoringData.thresholds.leakThresh}
                                                onChange={(e) => handleMonitoringChange('thresholds.leakThresh', e.target.value)}
                                                label="Critical Leakage Threshold"
                                            >
                                                <MenuItem value="0 incidents / day (block)">0 incidents / day (block)</MenuItem>
                                                <MenuItem value="1 incident / day (block)">1 incident / day (block)</MenuItem>
                                                <MenuItem value="1 incident / week (block)">1 incident / week (block)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Injection Flag Rate</InputLabel>
                                            <Select
                                                value={monitoringData.thresholds.injectRate}
                                                onChange={(e) => handleMonitoringChange('thresholds.injectRate', e.target.value)}
                                                label="Injection Flag Rate"
                                            >
                                                <MenuItem value="< 1% (alert)">&lt; 1% (alert)</MenuItem>
                                                <MenuItem value="< 3% (alert)">&lt; 3% (alert)</MenuItem>
                                                <MenuItem value="< 5% (alert)">&lt; 5% (alert)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>RBAC Deny Rate (expected)</InputLabel>
                                            <Select
                                                value={monitoringData.thresholds.denyRate}
                                                onChange={(e) => handleMonitoringChange('thresholds.denyRate', e.target.value)}
                                                label="RBAC Deny Rate (expected)"
                                            >
                                                <MenuItem value="< 2% (review)">&lt; 2% (review)</MenuItem>
                                                <MenuItem value="< 5% (review)">&lt; 5% (review)</MenuItem>
                                                <MenuItem value="< 10% (review)">&lt; 10% (review)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1.5 }}>
                                    <Grid container spacing={1.5}>
                                        <Grid size={{ xs: 12 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Escalation Rule (low confidence)</InputLabel>
                                                <Select
                                                    value={monitoringData.thresholds.escRule}
                                                    onChange={(e) => handleMonitoringChange('thresholds.escRule', e.target.value)}
                                                    label="Escalation Rule (low confidence)"
                                                >
                                                    <MenuItem value="Route to SME + hide sensitive spans">Route to SME + hide sensitive spans</MenuItem>
                                                    <MenuItem value="Route to SME (no hide)">Route to SME (no hide)</MenuItem>
                                                    <MenuItem value="Block response">Block response</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Secure Logging Mode</InputLabel>
                                                <Select
                                                    value={monitoringData.thresholds.logMode}
                                                    onChange={(e) => handleMonitoringChange('thresholds.logMode', e.target.value)}
                                                    label="Secure Logging Mode"
                                                >
                                                    <MenuItem value="Secure logs (PII removed)">Secure logs (PII removed)</MenuItem>
                                                    <MenuItem value="Metadata only">Metadata only</MenuItem>
                                                    <MenuItem value="Full logs (restricted)">Full logs (restricted)</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Audit Export Frequency</InputLabel>
                                                <Select
                                                    value={monitoringData.thresholds.auditFreq}
                                                    onChange={(e) => handleMonitoringChange('thresholds.auditFreq', e.target.value)}
                                                    label="Audit Export Frequency"
                                                >
                                                    <MenuItem value="Weekly">Weekly</MenuItem>
                                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Guardian Health Table */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                            Guardian Health (runtime placeholder)
                        </Typography>
                        <TableContainer>
                            <Table size="small" >
                                <TableHead>
                                    <TableRow >
                                        <TableCell sx={{ fontWeight: 700, width: 260 }}>Signal</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: 160 }}>Last 7 days</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: 160 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>PII detections (blocked/redacted)</TableCell>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>{monitoringData.health.pii}</TableCell>
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
                                        <TableCell sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>Derived from Guardian runtime logs</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>Prompt injection flags</TableCell>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>{monitoringData.health.injection}</TableCell>
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
                                        <TableCell sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>Should not trend upward</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>Secrets detected</TableCell>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>{monitoringData.health.secrets}</TableCell>
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
                                        <TableCell sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>Must be blocked</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>RBAC denies</TableCell>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>{monitoringData.health.rbacDenies}</TableCell>
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
                                        <TableCell sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>Unexpected spikes indicate misconfigured entitlements</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Callout Message */}
                <Box sx={{ p: 1.5, bgcolor: '#f2f6ff', borderRadius: 1, border: '1px solid #90caf9' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        ℹ️ This section is where Guardian "writes back" into Responsible AI: runtime metrics, violations, and audit exports. It keeps the pillar defensible over time.
                    </Typography>
                </Box>






</CardContent></Card>

            </Grid>
        </Grid>
    );
};

export default TabH;
