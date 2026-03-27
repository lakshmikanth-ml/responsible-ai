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
    Chip,InputLabel ,Select ,MenuItem 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import EditIcon from '@mui/icons-material/Edit';

const TabG = ({ projectContext = {}, onStatusMessage }) => {
    // Evidence Checklist Data
       const [projectCtx, setProjectCtx] = useState({
            project: projectContext?.project || '',
            modelVersion: projectContext?.modelVersion || '',
            endpoint: projectContext?.endpoint || '',
            decisionRole: projectContext?.decisionRole || 'Decision-support',
            sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
            hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
        });
    const [evidenceItems, setEvidenceItems] = useState([
        { id: 1, evidenceItem: 'DFA Privacy Readiness Report', source: 'DFA run artifact', owner: 'Head of Data Science', approval: 'Pending', notes: 'File + DB profiling attached' },
        { id: 2, evidenceItem: 'Privacy/PII Leakage Test Report', source: 'Evaluation Suite', owner: 'Privacy Officer / DPO', approval: 'Pending', notes: 'Must be PASS for release' },
        { id: 3, evidenceItem: 'Security Test Report (Injection/Exfil)', source: 'Evaluation Suite', owner: 'CISO / Security Lead', approval: 'Pending', notes: 'Must show block rate >= threshold' },
        { id: 4, evidenceItem: 'Guardian Policy Pack (Privacy)', source: 'Guardian config export', owner: 'Head of Platform Engineering', approval: 'Pending', notes: 'Generated from this pillar' },
        { id: 5, evidenceItem: 'RBAC / Entitlement Proof', source: 'IAM config evidence', owner: 'Head of Platform Engineering', approval: 'Pending', notes: 'Role->repo mapping sign-off' },
        { id: 6, evidenceItem: 'Release Sign-off Record', source: 'Section D approvals', owner: 'Responsible AI Officer', approval: 'Pending', notes: 'Privacy + Security approvals' },
    ]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [formData, setFormData] = useState({
        evidenceItem: '',
        source: '',
        owner: '',
        approval: 'Pending',
        notes: '',
    });

    const evidenceItemOptions = [
        'DFA Privacy Readiness Report',
        'Privacy/PII Leakage Test Report',
        'Security Test Report (Injection/Exfil)',
        'Guardian Policy Pack (Privacy)',
        'RBAC / Entitlement Proof',
        'Release Sign-off Record',
        'Redaction Correctness Report',
        'Prompt Injection Test Results',
        'Secrets Detection Report',
        'Cross-tenant Isolation Proof',
    ];

    const sourceOptions = [
        'DFA run artifact',
        'Evaluation Suite',
        'Guardian config export',
        'IAM config evidence',
        'Section D approvals',
        'Manual upload',
    ];

    const ownerOptions = [
        'Head of Data Science',
        'Privacy Officer / DPO',
        'CISO / Security Lead',
        'Head of Platform Engineering',
        'Responsible AI Officer',
        'Legal Counsel',
        'Compliance Lead',
    ];

    const approvalStatuses = ['Pending', 'Approved', 'Rejected', 'Needs Review'];
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


    // Load saved data on mount
    useEffect(() => {
        const saved = localStorage.getItem('privacySecurity_tabG_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setEvidenceItems(parsed);
            } catch (e) {
                console.error('Error loading TabG data:', e);
            }
        }
    }, []);

    // Handle Save
    const handleSave = () => {
        try {
            localStorage.setItem('privacySecurity_tabG_data', JSON.stringify(evidenceItems));
            setStatusMessage('✓ Evidence checklist saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ G Evidence saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    // Handle Load Sample
    const handleLoadSample = () => {
        const sampleData = [
            { id: 1, evidenceItem: 'DFA Privacy Readiness Report', source: 'DFA run artifact', owner: 'Head of Data Science', approval: 'Approved', notes: 'File + DB profiling attached' },
            { id: 2, evidenceItem: 'Privacy/PII Leakage Test Report', source: 'Evaluation Suite', owner: 'Privacy Officer / DPO', approval: 'Approved', notes: 'Must be PASS for release' },
            { id: 3, evidenceItem: 'Security Test Report (Injection/Exfil)', source: 'Evaluation Suite', owner: 'CISO / Security Lead', approval: 'Approved', notes: 'Must show block rate >= threshold' },
            { id: 4, evidenceItem: 'Guardian Policy Pack (Privacy)', source: 'Guardian config export', owner: 'Head of Platform Engineering', approval: 'Approved', notes: 'Generated from this pillar' },
            { id: 5, evidenceItem: 'RBAC / Entitlement Proof', source: 'IAM config evidence', owner: 'Head of Platform Engineering', approval: 'Approved', notes: 'Role->repo mapping sign-off' },
            { id: 6, evidenceItem: 'Release Sign-off Record', source: 'Section D approvals', owner: 'Responsible AI Officer', approval: 'Approved', notes: 'Privacy + Security approvals' },
        ];
        setEvidenceItems(sampleData);
        setStatusMessage('✓ Sample evidence loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    // Handle Dialog Open
    const handleOpenDialog = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setFormData({ ...item });
        } else {
            setEditingId(null);
            setFormData({
                evidenceItem: '',
                source: '',
                owner: '',
                approval: 'Pending',
                notes: '',
            });
        }
        setDialogOpen(true);
    };

    // Handle Dialog Close
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingId(null);
        setFormData({
            evidenceItem: '',
            source: '',
            owner: '',
            approval: 'Pending',
            notes: '',
        });
    };

    // Handle Form Submit
    const handleSubmit = () => {
        if (!formData.evidenceItem || !formData.source || !formData.owner) {
            setStatusMessage('✗ Please fill all required fields');
            return;
        }

        if (editingId) {
            // Update existing
            setEvidenceItems(prev =>
                prev.map(item => item.id === editingId ? { ...item, ...formData } : item)
            );
            setStatusMessage('✓ Evidence item updated');
        } else {
            // Add new
            setEvidenceItems(prev => [...prev, { id: Date.now(), ...formData }]);
            setStatusMessage('✓ Evidence item added');
        }
        setTimeout(() => setStatusMessage(''), 2000);
        handleCloseDialog();
    };

    // Handle Delete
    const handleDelete = (id) => {
        if (window.confirm('Delete this evidence item?')) {
            setEvidenceItems(prev => prev.filter(item => item.id !== id));
            setStatusMessage('✓ Evidence item deleted');
            setTimeout(() => setStatusMessage(''), 2000);
        }
    };

    // Handle Approval Toggle
    const handleToggleApproval = (id, currentStatus) => {
        const statusCycle = ['Pending', 'Approved', 'Rejected', 'Needs Review'];
        const nextIndex = (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length;
        const nextStatus = statusCycle[nextIndex];

        setEvidenceItems(prev =>
            prev.map(item => item.id === id ? { ...item, approval: nextStatus } : item)
        );
    };

    // Get approval color
    const getApprovalColor = (status) => {
        switch (status) {
            case 'Approved': return '#2e7d32';
            case 'Pending': return '#f57c00';
            case 'Rejected': return '#d32f2f';
            case 'Needs Review': return '#1976d2';
            default: return '#666';
        }
    };

    // Get approval badge
    const getApprovalBadge = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Pending': return 'warning';
            case 'Rejected': return 'error';
            case 'Needs Review': return 'info';
            default: return 'default';
        }
    };

    // Calculate KPIs
    const approved = evidenceItems.filter(e => e.approval === 'Approved').length;
    const pending = evidenceItems.filter(e => e.approval === 'Pending').length;
    const completionRate = evidenceItems.length > 0 ? Math.round((approved / evidenceItems.length) * 100) : 0;

    return (
        <Box sx={{ p: 0 }}>
           
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={0} sx={{ position: 'sticky', top: 20 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Project Context
                            </Typography>

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

                            <Typography variant="caption" sx={{ display: 'block', mt: 2 }}>
                                Data persists locally (browser localStorage) for demo realism.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Card elevation={0}>
                        <CardContent>

                         {/* Section Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        G. Evidence (What We Must Prove)
                    </Typography>
                    <Typography variant="body2" sx={{  maxWidth: 600 }}>
                        Evidence items are required for audits and client sign-off: DFA report, security test report, Guardian policy pack, access control proof, and approvals.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleLoadSample}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Load Sample Evidence
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleSave}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Save G
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
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Evidence Checklist
                            </Typography>

                            <TableContainer sx={{ mb: 2 }} component={Paper} variant="outlined">
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 700, width: 260 }}>Evidence Item</TableCell>
                                            <TableCell sx={{ fontWeight: 700, width: 200 }}>Source</TableCell>
                                            <TableCell sx={{ fontWeight: 700, width: 180 }}>Owner</TableCell>
                                            <TableCell sx={{ fontWeight: 700, width: 160 }}>Approval</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                                            <TableCell sx={{ fontWeight: 700, width: 120, textAlign: 'center' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {evidenceItems.length > 0 ? (
                                            evidenceItems.map((item) => (
                                                <TableRow key={item.id} sx={{ '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.palette.action.hover : '#fafafa' } }}>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>{item.evidenceItem}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>{item.source}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.9rem' }}>{item.owner}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={item.approval}
                                                            size="small"
                                                            variant="outlined"
                                                            color={getApprovalBadge(item.approval)}
                                                            onClick={() => handleToggleApproval(item.id, item.approval)}
                                                            sx={{
                                                                cursor: 'pointer',
                                                                fontWeight: 600,
                                                                fontSize: '0.75rem',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                                                        {item.notes}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            size="small"
                                                            variant="text"
                                                            onClick={() => handleToggleApproval(item.id, item.approval)}
                                                            sx={{ textTransform: 'none', fontWeight: 600, color: '#1976d2' }}
                                                        >
                                                            Toggle
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                    No evidence items added yet. Click "Add Item" or "Load Sample Evidence" to begin.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Hint Message */}
            <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f2f6ff', borderRadius: 1, border: '1px solid #90caf9' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    ℹ️ When you click "Generate Policy Pack (for Guardian)" in other sections, it should automatically attach as an evidence item here in production.
                </Typography>
            </Box>

            {/* Add/Edit Evidence Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editingId ? 'Edit Evidence Item' : 'Add Evidence Item'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Autocomplete
                        options={evidenceItemOptions}
                        value={formData.evidenceItem}
                        onChange={(_, value) => setFormData(prev => ({ ...prev, evidenceItem: value || '' }))}
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Evidence Item *"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    />
                    <Autocomplete
                        options={sourceOptions}
                        value={formData.source}
                        onChange={(_, value) => setFormData(prev => ({ ...prev, source: value || '' }))}
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Source *"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    />
                    <Autocomplete
                        options={ownerOptions}
                        value={formData.owner}
                        onChange={(_, value) => setFormData(prev => ({ ...prev, owner: value || '' }))}
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Owner *"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    />
                    <FormControl fullWidth size="small">
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={approvalStatuses}
                            value={formData.approval || null}
                            onChange={(_, value) => setFormData(prev => ({ ...prev, approval: value || '' }))}
                            renderInput={(params) => <TextField {...params} label="Approval Status" />}
                        />
                    </FormControl>
                    <TextField
                        label="Notes (optional)"
                        variant="outlined"
                        size="small"
                        multiline
                        rows={3}
                        fullWidth
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add relevant notes about this evidence item..."
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingId ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TabG;
