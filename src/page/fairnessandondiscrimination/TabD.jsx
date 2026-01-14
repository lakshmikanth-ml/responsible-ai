import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveIcon from '@mui/icons-material/Save';

const STORAGE_KEY_TAB_D = 'TabD_DemoData';

const riskOptions = [
    { id: 'risk_a1_incomplete', label: 'Critical: Fairness objectives not finalized' },
    { id: 'risk_b1_incomplete', label: 'Critical: Fairness measurement plan not configured' },
    { id: 'risk_b2_notrun', label: 'Critical: Baseline fairness evaluation not executed' },
    { id: 'risk_manual_70b99623', label: 'Warning: Potential proxy discrimination risk' },
    { id: 'risk_a3_partial', label: 'Warning: Regulatory context incomplete' },
    { id: 'risk_release_evidence_missing', label: 'Warning: Release evidence missing' },
];

const defaultActionsData = {
    actions: [
        {
            id: 'action_001',
            riskId: 'risk_manual_70b99623',
            action: 'Audit feature importance and remove high-correlation proxies',
            owner: 'RAI Officer',
            due: '2026-02-15',
            severity: 'Warning',
            status: 'Open',
            files: [],
        },
        {
            id: 'action_002',
            riskId: 'risk_manual_70b99623',
            action: 'Document mitigation rationale in bias report',
            owner: 'ML Lead',
            due: '2026-02-28',
            severity: 'Warning',
            status: 'Open',
            files: [],
        },
    ],
};

const TabD = () => {
    const [actionsData, setActionsData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_TAB_D);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed || defaultActionsData;
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return defaultActionsData;
    });

    const [statusMessage, setStatusMessage] = useState('');

    // Persist data to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_TAB_D, JSON.stringify(actionsData));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [actionsData]);

    const addActionRow = () => {
        const newAction = {
            id: `action_${Date.now()}`,
            riskId: riskOptions[0].id,
            action: '',
            owner: 'ML Lead',
            due: '',
            severity: 'Warning',
            status: 'Open',
            files: [],
        };

        setActionsData(prev => ({
            ...prev,
            actions: [...prev.actions, newAction],
        }));
    };

    const updateAction = (index, field, value) => {
        setActionsData(prev => {
            const updated = [...prev.actions];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, actions: updated };
        });
    };

    const removeAction = (index) => {
        setActionsData(prev => ({
            ...prev,
            actions: prev.actions.filter((_, i) => i !== index),
        }));
    };

    const attachActionEvidence = (index, event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileName = files[0].name;
            setActionsData(prev => {
                const updated = [...prev.actions];
                const fileList = updated[index].files || [];
                updated[index] = {
                    ...updated[index],
                    files: [...fileList, { name: fileName, size: files[0].size }],
                };
                return { ...prev, actions: updated };
            });
        }
    };

    const saveActions = () => {
        const hasValidActions = actionsData.actions.some(
            a => a.action.trim() && a.owner && a.due && a.status
        );
        if (!hasValidActions) {
            setStatusMessage('❌ Please fill in at least one action with required fields.');
            return;
        }
        setStatusMessage('✓ All mitigation actions saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const resetAll = () => {
        if (window.confirm('Are you sure you want to reset all demo data? This action cannot be undone.')) {
            setActionsData(defaultActionsData);
            setStatusMessage('');
            try {
                localStorage.removeItem(STORAGE_KEY_TAB_D);
            } catch (e) {
                console.error('Failed to clear localStorage:', e);
            }
            alert('Demo data has been reset to defaults.');
        }
    };

    const getRiskDescription = (riskId) => {
        const risk = riskOptions.find(r => r.id === riskId);
        return risk ? risk.label.split(': ')[1] : '';
    };

    return (
        <Box sx={{ p: 2 }}>


            {/* Header */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                D. Mitigation Actions & Ownership
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Turn each risk into tracked remediation work with owners, due dates, and evidence links.
            </Typography>

            {/* Status Message */}
            {statusMessage && (
                <Alert severity={statusMessage.includes('✓') ? 'success' : 'error'} sx={{ mb: 2 }}>
                    {statusMessage}
                </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addActionRow}
                    sx={{
                        bgcolor: '#1976d2',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1565c0' }
                    }}
                >
                    Add Action
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={saveActions}
                    sx={{
                        bgcolor: '#2e7d32',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1b5e20' }
                    }}
                >
                    Save Actions
                </Button>
            </Box>

            {/* Actions Table */}
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 700, minWidth: 180, color: '#1a1a1a' }}>
                                Linked Risk
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 260, color: '#1a1a1a' }}>
                                Action
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 150, color: '#1a1a1a' }}>
                                Owner
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 150, color: '#1a1a1a' }}>
                                Due Date
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 130, color: '#1a1a1a' }}>
                                Severity
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 140, color: '#1a1a1a' }}>
                                Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 110, color: '#1a1a1a' }}>
                                Evidence
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 80, textAlign: 'center', color: '#1a1a1a' }}>
                                Remove
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {actionsData.actions.map((action, index) => (
                            <TableRow key={action.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                                <TableCell>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={action.riskId}
                                            onChange={(e) => updateAction(index, 'riskId', e.target.value)}
                                        >
                                            {riskOptions.map(opt => (
                                                <MenuItem key={opt.id} value={opt.id}>
                                                    {opt.label.substring(0, 40)}...
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#666' }}>
                                        {getRiskDescription(action.riskId)}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        placeholder="Concrete mitigation steps"
                                        value={action.action}
                                        onChange={(e) => updateAction(index, 'action', e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>

                                <TableCell>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={action.owner}
                                            onChange={(e) => updateAction(index, 'owner', e.target.value)}
                                        >
                                            <MenuItem value="ML Lead">ML Lead</MenuItem>
                                            <MenuItem value="Data Engineer">Data Engineer</MenuItem>
                                            <MenuItem value="RAI Officer">RAI Officer</MenuItem>
                                            <MenuItem value="Product Owner">Product Owner</MenuItem>
                                            <MenuItem value="Legal/Compliance">Legal/Compliance</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        type="date"
                                        size="small"
                                        value={action.due}
                                        onChange={(e) => updateAction(index, 'due', e.target.value)}
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={action.severity}
                                            onChange={(e) => updateAction(index, 'severity', e.target.value)}
                                        >
                                            <MenuItem value="Info">Info</MenuItem>
                                            <MenuItem value="Warning">Warning</MenuItem>
                                            <MenuItem value="Critical">Critical</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={action.status}
                                            onChange={(e) => updateAction(index, 'status', e.target.value)}
                                        >
                                            <MenuItem value="Open">Open</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell>
                                    <Box>
                                        <Button
                                            component="label"
                                            size="small"
                                            startIcon={<AttachFileIcon />}
                                            sx={{
                                                textTransform: 'none',
                                                color: '#1976d2',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Attach
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => attachActionEvidence(index, e)}
                                            />
                                        </Button>
                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#666' }}>
                                            {action.files?.length || 0} file(s)
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => removeAction(index)}
                                        sx={{ color: '#d32f2f' }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Empty State */}
            {actionsData.actions.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    No actions yet. Click "+ Add Action" to create your first mitigation action.
                </Alert>
            )}

            {/* Tip */}
            <Alert severity="info" sx={{
                bgcolor: '#e3f2fd', borderColor: '#64b5f6',
                borderLeft: '4px solid #1976d2'
            }} >
                <Typography variant="caption" sx={{ color: '#1565c0', lineHeight: 1.6 }}>
                    <strong>💡 Tip:</strong> Link every Critical/Warning risk to at least one action. Attach evidence when completed.
                </Typography>
            </Alert>

            {/* Demo Data Note & Reset Section */}
            <Card variant="outlined" 

                sx={{ mb: 3, mt: 2, bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
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

export default TabD;
