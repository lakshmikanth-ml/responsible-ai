import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const STORAGE_KEY_TAB_G = 'TabG_DemoData';

const defaultTrainingData = {
    raiOwner: '',
    modules: [
        {
            id: 'mod_001',
            name: 'Fairness & Bias in AI',
            audience: 'Data Science Team',
            status: 'Incomplete',
            files: [],
        },
        {
            id: 'mod_002',
            name: 'Bias Mitigation Workshop',
            audience: 'Product + ML Leads',
            status: 'Incomplete',
            files: [],
        },
        {
            id: 'mod_003',
            name: 'Regulatory Fairness Obligations',
            audience: 'Legal + Compliance',
            status: 'Incomplete',
            files: [],
        },
    ],
};

const TabG = () => {
    const [trainingData, setTrainingData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_TAB_G);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed || defaultTrainingData;
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return defaultTrainingData;
    });

    const [statusMessage, setStatusMessage] = useState('');

    // Persist data to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_TAB_G, JSON.stringify(trainingData));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [trainingData]);

    // Calculate metrics
    const completedModules = trainingData.modules.filter(m => m.status === 'Complete').length;
    const totalModules = trainingData.modules.length;
    const completionPercentage = Math.round((completedModules / totalModules) * 100);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Complete':
                return { bg: '#c8e6c9', border: '#4caf50', accent: '#2e7d32', label: 'success' };
            case 'Partial':
                return { bg: '#fff3e0', border: '#ffb74d', accent: '#f57c00', label: 'warning' };
            case 'Incomplete':
                return { bg: '#ffcdd2', border: '#f44336', accent: '#d32f2f', label: 'error' };
            default:
                return { bg: '#e3f2fd', border: '#2196f3', accent: '#1976d2', label: 'info' };
        }
    };

    const saveRAIOwner = () => {
        if (!trainingData.raiOwner.trim()) {
            setStatusMessage('❌ Please enter a Responsible AI Officer name.');
            return;
        }
        setStatusMessage(`✓ RAI Officer set to: ${trainingData.raiOwner}`);
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const attachTrainingEvidence = (index, event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileName = files[0].name;
            setTrainingData(prev => {
                const updated = { ...prev };
                const fileList = updated.modules[index].files || [];
                updated.modules[index] = {
                    ...updated.modules[index],
                    files: [...fileList, { name: fileName, size: files[0].size, uploadedAt: new Date().toISOString() }],
                };
                return updated;
            });
            setStatusMessage(`✓ Evidence uploaded: ${fileName}`);
            setTimeout(() => setStatusMessage(''), 2000);
        }
    };

    const setTrainingStatus = (index, status) => {
        setTrainingData(prev => {
            const updated = { ...prev };
            updated.modules[index] = { ...updated.modules[index], status };
            return updated;
        });
    };

    const resetAll = () => {
        if (window.confirm('Are you sure you want to reset all demo data? This action cannot be undone.')) {
            setTrainingData(defaultTrainingData);
            setStatusMessage('');
            try {
                localStorage.removeItem(STORAGE_KEY_TAB_G);
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
                G. Training & Accountability
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Track role-based enablement. Auditors often ask "Were people trained?"
            </Typography>

            {/* Status Message */}
            {statusMessage && (
                <Card variant="outlined" sx={{ mb: 2, bgcolor: statusMessage.includes('✓') ? '#c8e6c9' : '#ffcdd2', borderColor: statusMessage.includes('✓') ? '#4caf50' : '#f44336' }}>
                    <CardContent sx={{ p: 1.5 }}>
                        <Typography variant="caption" sx={{ color: statusMessage.includes('✓') ? '#2e7d32' : '#d32f2f', fontWeight: 600 }}>
                            {statusMessage}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* KPI Dashboard */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                {[
                    {
                        label: 'Training Completion',
                        value: `${completionPercentage}%`,
                        desc: 'Required for high-risk deployments.',
                        bg: completionPercentage === 100 ? '#c8e6c9' : completionPercentage > 0 ? '#fff3e0' : '#ffcdd2',
                        border: completionPercentage === 100 ? '#4caf50' : completionPercentage > 0 ? '#ffb74d' : '#f44336',
                        accent: completionPercentage === 100 ? '#2e7d32' : completionPercentage > 0 ? '#f57c00' : '#d32f2f'
                    },
                    {
                        label: 'Modules Completed',
                        value: `${completedModules} / ${totalModules}`,
                        desc: 'Upload evidence for each module.',
                        bg: '#e3f2fd',
                        border: '#64b5f6',
                        accent: '#1976d2'
                    },
                    {
                        label: 'Accountability Owner',
                        value: trainingData.raiOwner || 'Not Set',
                        desc: 'Set Responsible AI Officer for pillar.',
                        bg: trainingData.raiOwner ? '#e8f5e9' : '#f3e5f5',
                        border: trainingData.raiOwner ? '#81c784' : '#ce93d8',
                        accent: trainingData.raiOwner ? '#2e7d32' : '#7b1fa2'
                    },
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
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: kpi.accent,

                                        minWidth: 60,
                                        textAlign: 'right'
                                    }}>
                                    {kpi.value}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* RAI Owner Section */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Responsible AI Officer (Owner)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <TextField
                            label="RAI Officer Name"
                            placeholder="e.g., Head of Risk, Compliance Officer, RAI Lead"
                            value={trainingData.raiOwner}
                            onChange={(e) => setTrainingData(prev => ({ ...prev, raiOwner: e.target.value }))}
                            variant="outlined"
                            size="small"
                            sx={{ flex: '1 1 300px', minWidth: 250 }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={saveRAIOwner}
                            sx={{
                                bgcolor: '#2e7d32',
                                color: '#fff',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#1b5e20' }
                            }}
                        >
                            Save Owner
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Training Modules Section */}
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Training Modules
                    </Typography>

                    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 240, color: '#1a1a1a' }}>
                                        Module
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 180, color: '#1a1a1a' }}>
                                        Audience
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 130, color: '#1a1a1a' }}>
                                        Status
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 240, color: '#1a1a1a' }}>
                                        Evidence Upload
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 140, color: '#1a1a1a' }}>
                                        Mark Complete
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainingData.modules.map((module, index) => {
                                    const statusColor = getStatusColor(module.status);

                                    return (
                                        <TableRow key={module.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                                            <TableCell>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {module.name}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="caption" color="text.secondary">
                                                    {module.audience}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={module.status}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: statusColor.bg,
                                                        borderColor: statusColor.border,
                                                        color: statusColor.accent,
                                                        fontWeight: 600,
                                                    }}
                                                    variant="outlined"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Box>
                                                    <Button
                                                        component="label"
                                                        size="small"
                                                        startIcon={<CloudUploadIcon />}
                                                        sx={{
                                                            textTransform: 'none',
                                                            color: '#1976d2',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Upload Evidence
                                                        <input
                                                            type="file"
                                                            hidden
                                                            onChange={(e) => attachTrainingEvidence(index, e)}
                                                        />
                                                    </Button>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#666' }}>
                                                        {module.files?.length || 0} file(s)
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        value={module.status}
                                                        onChange={(e) => setTrainingStatus(index, e.target.value)}
                                                    >
                                                        <MenuItem value="Incomplete">Incomplete</MenuItem>
                                                        <MenuItem value="Partial">Partial</MenuItem>
                                                        <MenuItem value="Complete">Complete</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Demo Data Note & Reset Section */}
            <Card variant="outlined" sx={{ mt: 3, bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
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

export default TabG;
