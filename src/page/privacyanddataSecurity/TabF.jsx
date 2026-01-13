import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    FormLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const TabF = ({ projectContext = {}, onStatusMessage }) => {
    const [projectCtx, setProjectCtx] = useState({
        project: projectContext?.project || '',
        modelVersion: projectContext?.modelVersion || '',
        endpoint: projectContext?.endpoint || '',
        decisionRole: projectContext?.decisionRole || 'Decision-support',
        sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
    });
    const [mitigationData, setMitigationData] = useState({
        actions: [],
    });
    const [metricsData, setMetricsData] = useState({
        selectedMetrics: [],
        evalDataset: '',
        decisionThreshold: '',
        evalNotes: ''
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [actionDialog, setActionDialog] = useState(false);
    const [newAction, setNewAction] = useState({
        description: '',
        linkedRisk: '',
        owner: '',
        dueDate: '',
        status: 'Open',
        evidence: ''
    });
    const [actionErrors, setActionErrors] = useState({ description: false, owner: false });

    const coreMetrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score'];
    const modelQualityMetrics = ['Accuracy by Group', 'Precision by Group', 'Recall by Group'];
    const evalDatasetOptions = ['Train Set', 'Validation Set', 'Test Set', 'Production Data'];
    const decisionThresholdOptions = ['0.5', '0.6', '0.7', '0.8', '0.9'];
    const statuses = ['Open', 'In Progress', 'Completed', 'Blocked'];

    useEffect(() => {
        const saved = localStorage.getItem('privacy_tabF_data');
        if (saved) {
            try {
                setMitigationData(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading TabF data:', e);
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
        const savedMetrics = localStorage.getItem('privacy_tabF_metrics');
        if (savedMetrics) {
            try {
                setMetricsData(JSON.parse(savedMetrics));
            } catch (e) {
                console.error('Error loading metrics:', e);
            }
        }
    }, []);

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
        if (window.confirm('Reset demo data for Mitigation?')) {
            localStorage.removeItem('privacy_tabF_data');
            localStorage.removeItem('privacy_projectContext');
            localStorage.removeItem('privacy_tabF_metrics');
            setMitigationData({ actions: [] });
            setProjectCtx({ project: '', modelVersion: '', endpoint: '', decisionRole: 'Decision-support', sensitivity: 'Tier 4 — Regulated (PII/PHI/PCI)', hostingBoundary: 'Client VPC/VNet (Private)' });
            setMetricsData({ selectedMetrics: [], evalDataset: '', decisionThreshold: '', evalNotes: '' });
            setStatusMessage('✓ Demo reset');
            if (onStatusMessage) onStatusMessage('✓ Demo reset');
        }
    };

    const handleMetricChange = (e) => {
        const value = e.target.value;
        setMetricsData(prev => ({
            ...prev,
            selectedMetrics: prev.selectedMetrics.includes(value)
                ? prev.selectedMetrics.filter(m => m !== value)
                : [...prev.selectedMetrics, value]
        }));
    };

    const handleFieldChange = (field, value) => {
        setMetricsData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveMetrics = () => {
        try {
            localStorage.setItem('privacy_tabF_metrics', JSON.stringify(metricsData));
            localStorage.setItem('privacy_tabF_data', JSON.stringify(mitigationData));
            setStatusMessage('✓ F.1–F.2 metrics & actions saved');
            setTimeout(() => setStatusMessage(''), 2000);
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleAddAction = () => {
        const errors = {
            description: !newAction.description.trim(),
            owner: !newAction.owner.trim()
        };
        setActionErrors(errors);

        if (!errors.description && !errors.owner) {
            setMitigationData(prev => ({
                ...prev,
                actions: [...prev.actions, { id: Date.now(), ...newAction }]
            }));
            setNewAction({
                description: '',
                linkedRisk: '',
                owner: '',
                dueDate: '',
                status: 'Open',
                evidence: ''
            });
            setActionErrors({ description: false, owner: false });
            setActionDialog(false);
        }
    };

    const handleRemoveAction = (id) => {
        setMitigationData(prev => ({
            ...prev,
            actions: prev.actions.filter(a => a.id !== id)
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#2e7d32';
            case 'In Progress': return '#f57c00';
            case 'Open': return '#1976d2';
            case 'Blocked': return '#d32f2f';
            default: return '#666';
        }
    };

    // KPI Dashboard
    const completedCount = mitigationData.actions.filter(a => a.status === 'Completed').length;
    const completionRate = mitigationData.actions.length > 0
        ? Math.round((completedCount / mitigationData.actions.length) * 100)
        : 0;

    const kpiCards = [
        { label: 'Total Actions', value: mitigationData.actions.length, color: '#1976d2' },
        { label: 'Completion %', value: `${completionRate}%`, color: completionRate >= 75 ? '#2e7d32' : '#f57c00' },
        { label: 'Completed', value: completedCount, color: '#2e7d32' },
    ];

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* LEFT PANEL: PROJECT CONTEXT */}
            <Grid size={{ xs: 12, sm: 4, md: 4 }}

            >
                <Box sx={{ p: 2, border: '1px solid rgba(117, 117, 117, 0.2)', borderRadius: 2, p: 2 }}>
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
                        <FormControl size="small" fullWidth>
                            <InputLabel>Decision Role</InputLabel>
                            <Select
                                value={projectCtx.decisionRole}
                                onChange={(e) => handleContextChange('decisionRole', e.target.value)}
                                label="Decision Role"
                            >
                                <MenuItem value="Advisory only">Advisory only</MenuItem>
                                <MenuItem value="Decision-support">Decision-support</MenuItem>
                                <MenuItem value="Automated (restricted)">Automated (restricted)</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Data Sensitivity Tier</InputLabel>
                            <Select
                                value={projectCtx.sensitivity}
                                onChange={(e) => handleContextChange('sensitivity', e.target.value)}
                                label="Data Sensitivity Tier"
                            >
                                <MenuItem value="Tier 1 — Public / Low sensitivity">Tier 1 — Public / Low sensitivity</MenuItem>
                                <MenuItem value="Tier 2 — Internal">Tier 2 — Internal</MenuItem>
                                <MenuItem value="Tier 3 — Confidential">Tier 3 — Confidential</MenuItem>
                                <MenuItem value="Tier 4 — Regulated (PII/PHI/PCI)">Tier 4 — Regulated (PII/PHI/PCI)</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Hosting Boundary</InputLabel>
                            <Select
                                value={projectCtx.hostingBoundary}
                                onChange={(e) => handleContextChange('hostingBoundary', e.target.value)}
                                label="Hosting Boundary"
                            >
                                <MenuItem value="Client VPC/VNet (Private)">Client VPC/VNet (Private)</MenuItem>
                                <MenuItem value="Enkefalos managed (Dedicated)">Enkefalos managed (Dedicated)</MenuItem>
                                <MenuItem value="Hybrid">Hybrid</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RestartAltIcon />}
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

            {/* RIGHT PANEL: Metrics & Actions */}
            <Grid size={{ xs: 12, sm: 8, md: 8 }}
                sx={{
                    p: 2,
                    border: '1px solid rgba(117, 117, 117, 0.2)', borderRadius: 2
                }}>


                {/* F.1: Mitigation Actions */}
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                F.1–F.2 Mitigation Actions
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setActionDialog(true)}
                            >
                                Add Action
                            </Button>
                        </Box>

                        {mitigationData.actions.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Evidence</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {mitigationData.actions.map(action => (
                                            <TableRow key={action.id}>
                                                <TableCell>{action.description}</TableCell>
                                                <TableCell>{action.owner || '—'}</TableCell>
                                                <TableCell>{action.dueDate || '—'}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: getStatusColor(action.status),
                                                            display: 'inline-block',
                                                            px: 1,
                                                            py: 0.5,
                                                            bgcolor: getStatusColor(action.status) + '15',
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        {action.status}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{action.evidence ? '✓' : '—'}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveAction(action.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                No mitigation actions added yet
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* Save Button */}
                <Box sx={{ textAlign: "right" }} >
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveMetrics}
                        sx={{ bgcolor: '#2e7d32' }}
                    >
                        Save Metrics & Actions
                    </Button>
                </Box>

                {/* Action Dialog */}
                <Dialog open={actionDialog} onClose={() => {
                    setActionDialog(false);
                    setActionErrors({ description: false, owner: false });
                }} maxWidth="sm" fullWidth>
                    <DialogTitle>Add Mitigation Action</DialogTitle>
                    <DialogContent sx={{
                        pt: 0, pb: 2,
                        display: 'flex',
                        flexDirection: 'column', gap: 2,
                        '&.MuiDialogContent-root': { pt: 1 }
                    }}
                    >
                        <TextField
                            label="Action Description*"
                            variant="outlined"
                            size="small"
                            fullWidth
                            multiline
                            rows={2}
                            value={newAction.description}
                            onChange={(e) => {
                                setNewAction(prev => ({ ...prev, description: e.target.value }));
                                if (actionErrors.description) setActionErrors(prev => ({ ...prev, description: false }));
                            }}
                            error={actionErrors.description}
                            helperText={actionErrors.description ? 'Description is required' : ''}
                        />
                        <TextField
                            label="Linked Risk"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={newAction.linkedRisk}
                            onChange={(e) => setNewAction(prev => ({ ...prev, linkedRisk: e.target.value }))}
                        />
                        <TextField
                            label="Owner*"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={newAction.owner}
                            onChange={(e) => {
                                setNewAction(prev => ({ ...prev, owner: e.target.value }));
                                if (actionErrors.owner) setActionErrors(prev => ({ ...prev, owner: false }));
                            }}
                            error={actionErrors.owner}
                            helperText={actionErrors.owner ? 'Owner is required' : ''}
                        />
                        <TextField
                            label="Due Date"
                            variant="outlined"
                            size="small"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={newAction.dueDate}
                            onChange={(e) => setNewAction(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                        <Autocomplete
                            options={statuses}
                            value={newAction.status}
                            onChange={(_, value) => setNewAction(prev => ({ ...prev, status: value }))}
                            renderInput={(params) => (
                                <TextField {...params} label="Status" variant="outlined" size="small" fullWidth />
                            )}
                        />
                    </DialogContent>
                    <DialogActions >
                        <Button onClick={() => {
                            setActionDialog(false);
                            setActionErrors({ description: false, owner: false });
                        }}>Cancel</Button>
                        <Button onClick={handleAddAction} variant="contained">Add</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Grid>
    );
};

export default TabF;