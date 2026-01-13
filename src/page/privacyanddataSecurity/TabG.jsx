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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const TabG = ({ projectContext = {}, onStatusMessage }) => {
    const [projectCtx, setProjectCtx] = useState({
        project: projectContext?.project || '',
        modelVersion: projectContext?.modelVersion || '',
        endpoint: projectContext?.endpoint || '',
        decisionRole: projectContext?.decisionRole || 'Decision-support',
        sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
    });
    const [evidenceData, setEvidenceData] = useState({
        items: [],
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [evidenceDialog, setEvidenceDialog] = useState(false);
    const [newEvidence, setNewEvidence] = useState({
        evidenceItem: '',
        source: '',
        owner: '',
        approval: 'Pending',
        notes: ''
    });
    const [evidenceErrors, setEvidenceErrors] = useState({
        evidenceItem: false,
        source: false,
        owner: false,
    });

    const evidenceItems = [
        'Guardian Policy Pack (Privacy)',
        'DFA Report (Data Foundation Analysis)',
        'Security Test Report',
        'Access Control Proof (RBAC audit)',
        'Privacy Approval Sign-off',
        'Security Review Approval',
        'Redaction Correctness Report',
        'Prompt Injection Test Results',
    ];
    const sourceOptions = [
        'Guardian config export',
        'DFA run artifact',
        'Evaluation & QA service',
        'Access control audit',
        'Manual upload',
        'Other'
    ];
    const ownerOptions = [
        'CISO / Security Lead',
        'Head of Platform Engineering',
        'Privacy Officer / DPO',
        'Head of Data Science',
        'Responsible AI Officer',
        'Legal Counsel'
    ];
    const approvalStatuses = ['Pending', 'Approved', 'Rejected', 'Needs Review'];

    useEffect(() => {
        const saved = localStorage.getItem('privacy_tabG_data');
        if (saved) {
            try {
                setEvidenceData(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading TabG data:', e);
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
        if (window.confirm('Reset demo data for Evidence?')) {
            localStorage.removeItem('privacy_tabG_data');
            localStorage.removeItem('privacy_projectContext');
            setEvidenceData({ items: [] });
            setProjectCtx({ project: '', modelVersion: '', endpoint: '', decisionRole: 'Decision-support', sensitivity: 'Tier 4 — Regulated (PII/PHI/PCI)', hostingBoundary: 'Client VPC/VNet (Private)' });
            setStatusMessage('✓ Demo reset');
            if (onStatusMessage) onStatusMessage('✓ Demo reset');
        }
    };

    const handleLoadSample = () => {
        const sampleEvidence = {
            items: [
                { id: 1, evidenceItem: 'Guardian Policy Pack (Privacy)', source: 'Guardian config export', owner: 'Head of Platform Engineering', approval: 'Pending', notes: 'Generated from Privacy & Data Security pillar' },
                { id: 2, evidenceItem: 'DFA Report (Data Foundation Analysis)', source: 'DFA run artifact', owner: 'Head of Data Science', approval: 'Approved', notes: 'Latest DFA scan showing PII patterns' },
                { id: 3, evidenceItem: 'Security Test Report', source: 'Evaluation & QA service', owner: 'CISO / Security Lead', approval: 'Approved', notes: 'All critical tests passed' },
                { id: 4, evidenceItem: 'Access Control Proof (RBAC audit)', source: 'Access control audit', owner: 'Head of Platform Engineering', approval: 'Approved', notes: 'Entitlement mappings validated' },
            ]
        };
        setEvidenceData(sampleEvidence);
        setStatusMessage('✓ Sample evidence loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleSave = () => {
        try {
            localStorage.setItem('privacy_tabG_data', JSON.stringify(evidenceData));
            setStatusMessage('✓ G Evidence checklist saved');
            setTimeout(() => setStatusMessage(''), 2000);
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleAddEvidence = () => {
        const errors = {
            evidenceItem: !newEvidence.evidenceItem.trim(),
            source: !newEvidence.source.trim(),
            owner: !newEvidence.owner.trim(),
        };
        setEvidenceErrors(errors);
        const hasError = Object.values(errors).some(Boolean);
        if (hasError) return;

        setEvidenceData(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now(), ...newEvidence }]
        }));
        setNewEvidence({
            evidenceItem: '',
            source: '',
            owner: '',
            approval: 'Pending',
            notes: ''
        });
        setEvidenceErrors({ evidenceItem: false, source: false, owner: false });
        setEvidenceDialog(false);
    };

    const handleRemoveEvidence = (id) => {
        setEvidenceData(prev => ({
            ...prev,
            items: prev.items.filter(e => e.id !== id)
        }));
    };

    const getApprovalColor = (status) => {
        switch (status) {
            case 'Approved': return '#2e7d32';
            case 'Pending': return '#f57c00';
            case 'Rejected': return '#d32f2f';
            case 'Needs Review': return '#1976d2';
            default: return '#666';
        }
    };

    // KPI Dashboard
    const approvedCount = evidenceData.items.filter(e => e.approval === 'Approved').length;
    const totalCount = evidenceData.items.length;
    const completionRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

    const kpiCards = [
        { label: 'Total Evidence Items', value: totalCount, color: '#1976d2' },
        { label: 'Approved', value: approvedCount, color: '#2e7d32' },
        { label: 'Completion %', value: `${completionRate}%`, color: completionRate >= 75 ? '#2e7d32' : '#f57c00' },
    ];

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* LEFT PANEL: PROJECT CONTEXT */}
            <Grid size={{ xs: 12, md: 4, }}
            >
                <Box sx={{ border: '1px solid rgba(117, 117, 117, 0.2)', borderRadius: 2, p: 2, mb: 3 }}>

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

            {/* RIGHT PANEL: Evidence Checklist */}
            <Grid size={{ xs: 12, md: 8 }} sx={{
                p: 2,
                borderRadius: 2,
                border: {
                    xs: 'none',
                    md: '1px solid rgba(117, 117, 117, 0.2)',
                }
            }} >


                {/* G: Evidence Checklist */}
                <Card variant="outlined" sx={{
                    mb: 2,
                    textAlign: "-khtml-right"
                }}>
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center', mb: 2
                        }}>
                            <Typography variant="h6"
                                sx={{ fontWeight: 600 }}>
                                G Evidence Checklist
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setEvidenceDialog(true)}
                            >
                                Add Item
                            </Button>
                        </Box>

                        {evidenceData.items.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
                                <Table size="small" stickyHeader>
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Evidence Item</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Source</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Owner</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Approval</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Notes</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {evidenceData.items.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell sx={{ fontSize: '0.85rem' }}>{item.evidenceItem}</TableCell>
                                                <TableCell sx={{ fontSize: '0.85rem' }}>{item.source}</TableCell>
                                                <TableCell sx={{ fontSize: '0.85rem' }}>{item.owner}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: getApprovalColor(item.approval),
                                                            display: 'inline-block',
                                                            px: 1,
                                                            py: 0.5,
                                                            bgcolor: getApprovalColor(item.approval) + '15',
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        {item.approval}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '0.85rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.notes}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveEvidence(item.id)}
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
                                No evidence items added yet. Click "Add Item" or "Load Sample Evidence" to begin.
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Box sx={{
                    display: 'flex', justifyContent:
                        'flex-end', gap: 2
                }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={handleLoadSample}
                    >
                        Load Sample Evidence
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{ bgcolor: '#2e7d32' }}
                    >
                        Save Evidence
                    </Button>
                </Box>

                {/* Evidence Dialog */}

            </Grid>
            <Dialog open={evidenceDialog} onClose={() => setEvidenceDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Evidence Item</DialogTitle>
                <DialogContent
                    sx={{
                        pt: 0, pb: 2,
                        display: 'flex',
                        flexDirection: 'column', gap: 2,
                        '&.MuiDialogContent-root': { pt: 1 }
                    }}
                    onClose={() => setEvidenceDialog(false)}
                >
                    <Autocomplete
                        options={evidenceItems}
                        value={newEvidence.evidenceItem}
                        onChange={(_, value) => {
                            setNewEvidence(prev => ({ ...prev, evidenceItem: value || '' }));
                            if (evidenceErrors.evidenceItem) setEvidenceErrors(prev => ({ ...prev, evidenceItem: false }));
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Evidence Item*" variant="outlined" size="small" error={evidenceErrors.evidenceItem} helperText={evidenceErrors.evidenceItem ? 'Required' : ''} />
                        )}
                        freeSolo
                    />
                    <Autocomplete
                        options={sourceOptions}
                        value={newEvidence.source}
                        onChange={(_, value) => {
                            setNewEvidence(prev => ({ ...prev, source: value || '' }));
                            if (evidenceErrors.source) setEvidenceErrors(prev => ({ ...prev, source: false }));
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Source*" variant="outlined" size="small" error={evidenceErrors.source} helperText={evidenceErrors.source ? 'Required' : ''} />
                        )}
                        freeSolo
                    />
                    <Autocomplete
                        options={ownerOptions}
                        value={newEvidence.owner}
                        onChange={(_, value) => {
                            setNewEvidence(prev => ({ ...prev, owner: value || '' }));
                            if (evidenceErrors.owner) setEvidenceErrors(prev => ({ ...prev, owner: false }));
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Owner*" variant="outlined" size="small" error={evidenceErrors.owner} helperText={evidenceErrors.owner ? 'Required' : ''} />
                        )}
                        freeSolo
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel>Approval Status</InputLabel>
                        <Select
                            value={newEvidence.approval}
                            onChange={(e) => setNewEvidence(prev => ({ ...prev, approval: e.target.value }))}
                            label="Approval Status"
                        >
                            {approvalStatuses.map(status => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Notes (optional)"
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        value={newEvidence.notes}
                        onChange={(e) => setNewEvidence(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="e.g., Generated from Privacy & Data Security pillar"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setEvidenceDialog(false);
                        setEvidenceErrors({ evidenceItem: false, source: false, owner: false });
                    }}>Cancel</Button>
                    <Button onClick={handleAddEvidence} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Grid >
    );
};

export default TabG;
