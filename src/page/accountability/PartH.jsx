import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Autocomplete,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Select,
    MenuItem,
    Stack,
    Switch,
    FormHelperText,
    FormControlLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const OWNER_OPTIONS = [
    { label: "Head of Data Science (Accountable)" },
    { label: "Model Risk Owner (Accountable)" },
    { label: "Compliance Officer" },
    { label: "Privacy Officer" },
    { label: "Underwriting SME Approver" },
    { label: "Claims SME Approver" },
    { label: "Incident Manager (Ops/SRE)" },
    { label: "Security Lead" },
    { label: "Product Manager" },
    { label: "Data Engineering Lead" },
    { label: "Legal Counsel" },
];

const PartH = ({ projectContext = {}, onStatusMessage }) => {
    // Gates & Monitoring state
    const [guardianSignals, setGuardianSignals] = useState(true);
    const [alertViolations, setAlertViolations] = useState(true);
    const [alertOverrides, setAlertOverrides] = useState(true);
    const [alertMissingApprovals, setAlertMissingApprovals] = useState(true);

    const [violationThreshold, setViolationThreshold] = useState('5');
    const [overrideThreshold, setOverrideThreshold] = useState('15');
    const [reviewCadence, setReviewCadence] = useState('Weekly');
    const [criticalSLA, setCriticalSLA] = useState('24');
    const [nonCriticalSLA, setNonCriticalSLA] = useState('5');
    const [routeCritical, setRouteCritical] = useState(OWNER_OPTIONS[1]);
    const [routeCompliance, setRouteCompliance] = useState(OWNER_OPTIONS[2]);
    const [smEscalation, setSmEscalation] = useState(OWNER_OPTIONS[1]);

    // Guardian runtime data
    const [guardianJson, setGuardianJson] = useState('');
    const [runtimeMetrics, setRuntimeMetrics] = useState({
        rowsLoaded: 2,
        violations: 1,
        overrideRate: '50%',
    });

    // Audit trail
    const [auditNotes, setAuditNotes] = useState([]);
    const [noteInput, setNoteInput] = useState('');

    // Status message
    const [statusMessage, setStatusMessage] = useState('');





    // Load saved data on mount
    useEffect(() => {
        const saved = localStorage.getItem('accountability_partH_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setGuardianSignals(parsed.guardianSignals ?? true);
                setAlertViolations(parsed.alertViolations ?? true);
                setAlertOverrides(parsed.alertOverrides ?? true);
                setAlertMissingApprovals(parsed.alertMissingApprovals ?? true);
                setViolationThreshold(parsed.violationThreshold || '');
                setOverrideThreshold(parsed.overrideThreshold || '');
                setReviewCadence(parsed.reviewCadence || '');
                setCriticalSLA(parsed.criticalSLA || '');
                setNonCriticalSLA(parsed.nonCriticalSLA || '');
                setRouteCritical(parsed.routeCritical || '');
                setRouteCompliance(parsed.routeCompliance || '');
                setSmEscalation(parsed.smEscalation || '');
                setGuardianJson(parsed.guardianJson || '');
                setRuntimeMetrics(parsed.runtimeMetrics || runtimeMetrics);
                setAuditNotes(parsed.auditNotes || []);
            } catch (e) {
                console.error('Error loading PartH data:', e);
            }
        }
    }, []);

    const handleSave = () => {
        try {
            const payload = {
                guardianSignals,
                alertViolations,
                alertOverrides,
                alertMissingApprovals,
                violationThreshold,
                overrideThreshold,
                reviewCadence,
                criticalSLA,
                nonCriticalSLA,
                routeCritical,
                routeCompliance,
                smEscalation,
                guardianJson,
                runtimeMetrics,
                auditNotes,
            };
            localStorage.setItem('accountability_partH_data', JSON.stringify(payload));
            setStatusMessage('✓ Accountability H saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Accountability H saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleLoadSample = () => {
        setGuardianSignals(true);
        setAlertViolations(true);
        setAlertOverrides(true);
        setAlertMissingApprovals(true);
        setViolationThreshold('5');
        setOverrideThreshold('15');
        setReviewCadence('Weekly');
        setCriticalSLA('24');
        setNonCriticalSLA('5');
        setRouteCritical('Incident Manager (Ops/SRE)');
        setRouteCompliance('Compliance Officer');
        setSmEscalation('Model Risk Owner (Accountable)');
        setStatusMessage('✓ Sample data loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleLoadGuardianSample = () => {
        const sample = JSON.stringify([
            {
                timestamp: new Date().toISOString(),
                project: 'Underwriting AI',
                violations: ['policy_breach', 'threshold_exceeded'],
                actions: 'override',
                approver: 'john.doe@company.com',
            },
            {
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                project: 'Underwriting AI',
                violations: [],
                actions: 'approved',
                approver: 'system',
            },
        ], null, 2);
        setGuardianJson(sample);
        setStatusMessage('✓ Guardian sample loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleIngestGuardian = () => {
        if (guardianJson.trim()) {
            try {
                const parsed = JSON.parse(guardianJson);
                if (Array.isArray(parsed)) {
                    const violations = parsed.filter(r => r.violations?.length > 0).length;
                    const overrides = parsed.filter(r => r.actions === 'override').length;
                    const rate = parsed.length > 0 ? Math.round((overrides / parsed.length) * 100) : 0;
                    setRuntimeMetrics({
                        rowsLoaded: parsed.length,
                        violations,
                        overrideRate: `${rate}%`,
                    });
                    setStatusMessage('✓ Guardian signals ingested successfully');
                } else {
                    setStatusMessage('✗ Expected JSON array');
                }
                setTimeout(() => setStatusMessage(''), 2000);
            } catch (e) {
                setStatusMessage('✗ Invalid JSON');
                setTimeout(() => setStatusMessage(''), 2000);
            }
        }
    };

    const handleAddNote = () => {
        if (noteInput.trim()) {
            const newNote = {
                time: new Date().toLocaleTimeString(),
                text: noteInput,
            };
            setAuditNotes([...auditNotes, newNote]);
            setNoteInput('');
        }
    };

    const isComplete = violationThreshold && overrideThreshold && reviewCadence && criticalSLA && nonCriticalSLA && routeCritical && routeCompliance && smEscalation;
    const statusColor = isComplete ? '#2e7d32' : '#d32f2f';
    const statusText = isComplete ? 'Complete' : 'Missing';

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* Right Panel - Full Width */}
            <Grid size={{ xs: 12 }}>
                <Card variant="outlined">
                    <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                H. Gates & Monitoring (Guardian Integration)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                    Save H
                                </Button>
                            </Box>
                        </Box>

                        {/* Status Message */}
                        {statusMessage && (
                            <Card variant="outlined" sx={{ mb: 2, bgcolor: '#c8e6c9', borderColor: '#4caf50' }}>
                                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                    <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                                        {statusMessage}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status Pill */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1.5,
                                    py: 0.75,
                                    bgcolor: statusColor + '15',
                                    borderRadius: '50px',
                                    border: `1px solid ${statusColor}30`,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: statusColor,
                                    }}
                                />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: statusColor }}>
                                    Status: {statusText}
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Use Save + Recompute Gates after updates.
                            </Typography>
                        </Box>

                        {/* Guardian Integration Info */}
                        <Card variant="outlined" sx={{ mb: 3, p: 1.5, bgcolor: '#fafafa' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Guardian integration
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Guardian already collects runtime rows. This tab defines how those signals drive accountability monitoring, routing, and the Guardian Health card.
                            </Typography>
                        </Card>

                        {/* Guardian Signals Toggle Grid */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Alert Signals Configuration</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Guardian signals enabled</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Use runtime signals for health + alerts</Typography>
                                    </Box>
                                    <Switch checked={guardianSignals} onChange={(e) => setGuardianSignals(e.target.checked)} />
                                </Box>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Alert on violations</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Create incidents when violations spike</Typography>
                                    </Box>
                                    <Switch checked={alertViolations} onChange={(e) => setAlertViolations(e.target.checked)} />
                                </Box>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Alert on high overrides</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Track decision overrides</Typography>
                                    </Box>
                                    <Switch checked={alertOverrides} onChange={(e) => setAlertOverrides(e.target.checked)} />
                                </Box>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Alert on missing approvals</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Detect missing sign-offs</Typography>
                                    </Box>
                                    <Switch checked={alertMissingApprovals} onChange={(e) => setAlertMissingApprovals(e.target.checked)} />
                                </Box>
                            </Card>
                        </Box>

                        {/* Thresholds Grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Violation threshold (count)</Typography>
                                <Select
                                    fullWidth
                                    size="small"
                                    value={violationThreshold}
                                    onChange={(e) => setViolationThreshold(e.target.value)}
                                >
                                    <MenuItem value="3">3</MenuItem>
                                    <MenuItem value="5">5</MenuItem>
                                    <MenuItem value="10">10</MenuItem>
                                    <MenuItem value="20">20</MenuItem>
                                </Select>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Override threshold (%)</Typography>
                                <Select
                                    fullWidth
                                    size="small"
                                    value={overrideThreshold}
                                    onChange={(e) => setOverrideThreshold(e.target.value)}
                                >
                                    <MenuItem value="10">10</MenuItem>
                                    <MenuItem value="15">15</MenuItem>
                                    <MenuItem value="25">25</MenuItem>
                                    <MenuItem value="40">40</MenuItem>
                                </Select>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Review cadence</Typography>
                                <Select
                                    fullWidth
                                    size="small"
                                    value={reviewCadence}
                                    onChange={(e) => setReviewCadence(e.target.value)}
                                >
                                    <MenuItem value="Weekly">Weekly</MenuItem>
                                    <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                                </Select>
                            </Card>
                        </Box>

                        {/* SLA & Routing Grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Critical SLA (hours)</Typography>
                                <Select
                                    fullWidth
                                    size="small"
                                    value={criticalSLA}
                                    onChange={(e) => setCriticalSLA(e.target.value)}
                                >
                                    <MenuItem value="24">24</MenuItem>
                                    <MenuItem value="48">48</MenuItem>
                                    <MenuItem value="72">72</MenuItem>
                                </Select>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Non-critical SLA (days)</Typography>
                                <Select
                                    fullWidth
                                    size="small"
                                    value={nonCriticalSLA}
                                    onChange={(e) => setNonCriticalSLA(e.target.value)}
                                >
                                    <MenuItem value="3">3</MenuItem>
                                    <MenuItem value="5">5</MenuItem>
                                    <MenuItem value="7">7</MenuItem>
                                    <MenuItem value="10">10</MenuItem>
                                </Select>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Route critical incidents to *</Typography>
                                <Autocomplete
                                    options={OWNER_OPTIONS}
                                    value={routeCritical || null}
                                    size="small"
                                    onChange={(_, value) => setRouteCritical(value)}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option?.label || ''}
                                    isOptionEqualToValue={(option, value) => {
                                        if (!value) return false;
                                        return option?.label === (typeof value === 'string' ? value : value?.label);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select owner role…"
                                            error={!routeCritical}
                                        />
                                    )}
                                />
                                {!routeCritical && (
                                    <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5, display: 'block' }}>
                                        Required field
                                    </Typography>
                                )}
                            </Card>
                        </Box>

                        {/* Additional Routing Grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Route compliance notifications to *</Typography>
                                <Autocomplete
                                    options={OWNER_OPTIONS}
                                    value={routeCompliance || null}
                                    size="small"
                                    onChange={(_, value) => setRouteCompliance(value)}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option?.label || ''}
                                    isOptionEqualToValue={(option, value) => {
                                        if (!value) return false;
                                        return option?.label === (typeof value === 'string' ? value : value?.label);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select owner role…"
                                            error={!routeCompliance}
                                        />
                                    )}
                                />
                                {!routeCompliance && (
                                    <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5, display: 'block' }}>
                                        Required field
                                    </Typography>
                                )}
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>SME approver for escalations *</Typography>
                                <Autocomplete
                                    options={OWNER_OPTIONS}
                                    value={smEscalation || null}
                                    size="small"
                                    onChange={(_, value) => setSmEscalation(value)}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option?.label || ''}
                                    isOptionEqualToValue={(option, value) => {
                                        if (!value) return false;
                                        return option?.label === (typeof value === 'string' ? value : value?.label);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select owner role…"
                                            error={!smEscalation}
                                        />
                                    )}
                                />
                                {!smEscalation && (
                                    <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5, display: 'block' }}>
                                        Required field
                                    </Typography>
                                )}
                            </Card>
                        </Box>

                        {/* Guardian Runtime Signals */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Guardian runtime signals (sample / paste)</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadGuardianSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" onClick={handleIngestGuardian}>
                                    Ingest JSON
                                </Button>
                            </Box>
                        </Box>

                        <TextField
                            multiline
                            minRows={6}
                            maxRows={10}
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder='Paste runtime JSON array here (Guardian table rows). Example: [{"timestamp":"...","project":"...","violations":["..."],"actions":"override"}]'
                            value={guardianJson}
                            onChange={(e) => setGuardianJson(e.target.value)}
                            sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mb: 2 }}
                        />

                        {/* Runtime Metrics KPIs */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                                    Runtime rows loaded
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {runtimeMetrics.rowsLoaded}
                                </Typography>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                                    Violations (total)
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {runtimeMetrics.violations}
                                </Typography>
                            </Card>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                                    Override rate
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {runtimeMetrics.overrideRate}
                                </Typography>
                            </Card>
                        </Box>

                        {/* Guardian Info Card */}
                        <Card variant="outlined" sx={{ mb: 3, p: 1.5, bgcolor: '#fafafa' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Where these signals feed the UI
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                These rows drive the Guardian Health card and can trigger incident routing based on thresholds. In production, this is a live feed from Guardian.
                            </Typography>
                        </Card>

                        {/* Audit Trail */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Audit Trail Notes (demo)
                                </Typography>
                                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddNote}>
                                    Add Note
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Add a short note..."
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                                />
                            </Box>

                            {auditNotes.length > 0 ? (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {auditNotes.map((note, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                    {note.time}
                                                </TableCell>
                                                <TableCell variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                    {note.text}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', py: 2 }}>
                                    No notes yet. Add a short note when decisions are made (e.g., owners assigned, evidence approved).
                                </Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card >
            </Grid >
        </Grid >
    );
};

export default PartH;
