import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Alert,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Autocomplete,
    FormControl,
    Chip,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GetAppIcon from '@mui/icons-material/GetApp';

const STORAGE_KEY_TAB_E = 'TabE_DemoData';

const defaultArtifactsData = {
    artifacts: [
        {
            id: 'obj_doc',
            name: 'Fairness Objectives Document',
            stage: 'Baseline',
            status: 'Missing',
            approved: false,
            files: [],
        },
        {
            id: 'scope_groups',
            name: 'Impacted Groups Definition Export',
            stage: 'Baseline',
            status: 'Present',
            approved: false,
            files: [],
        },
        {
            id: 'eval_report',
            name: 'Fairness Evaluation Results',
            stage: 'Baseline',
            status: 'Missing',
            approved: false,
            files: [],
        },
        {
            id: 'mitigation_plan',
            name: 'Bias Mitigation Plan',
            stage: 'Release',
            status: 'Missing',
            approved: false,
            files: [],
        },
        {
            id: 'release_signoff',
            name: 'Release Fairness Sign-off',
            stage: 'Release',
            status: 'Missing',
            approved: false,
            files: [],
        },
    ],
};

const TabE = () => {
    const [artifactsData, setArtifactsData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_TAB_E);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed || defaultArtifactsData;
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return defaultArtifactsData;
    });

    const [statusMessage, setStatusMessage] = useState('');

    // Persist data to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_TAB_E, JSON.stringify(artifactsData));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [artifactsData]);

    // Calculate metrics
    const completionCount = artifactsData.artifacts.filter(a => a.status === 'Present').length;
    const totalCount = artifactsData.artifacts.length;
    const itemCount = artifactsData.artifacts.reduce((sum, a) => sum + (a.files?.length || 0), 0);
    const evalEvidenceStatus = artifactsData.artifacts.find(a => a.id === 'eval_report')?.status || 'Missing';

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return { bg: '#c8e6c9', border: '#4caf50', accent: '#2e7d32', label: 'success' };
            case 'Missing':
                return { bg: '#ffcdd2', border: '#f44336', accent: '#d32f2f', label: 'error' };
            default:
                return { bg: '#e3f2fd', border: '#2196f3', accent: '#1976d2', label: 'info' };
        }
    };

    const getStageColor = (stage) => {
        return stage === 'Baseline'
            ? { bg: '#e3f2fd', border: '#2196f3', accent: '#1976d2' }
            : { bg: '#f3e5f5', border: '#9c27b0', accent: '#7b1fa2' };
    };

    const uploadArtifact = (index, event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileName = files[0].name;
            setArtifactsData(prev => {
                const updated = [...prev.artifacts];
                const fileList = updated[index].files || [];
                updated[index] = {
                    ...updated[index],
                    files: [...fileList, { name: fileName, size: files[0].size, uploadedAt: new Date().toISOString() }],
                    status: 'Present',
                };
                return { ...prev, artifacts: updated };
            });
            setStatusMessage(`✓ File uploaded: ${fileName}`);
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    const setArtifactApproval = (index, approved) => {
        setArtifactsData(prev => {
            const updated = [...prev.artifacts];
            updated[index] = { ...updated[index], approved: approved === 'true' };
            return { ...prev, artifacts: updated };
        });
    };

    const downloadArtifactTemplate = (templateId) => {
        setStatusMessage(`📥 Downloading template: ${templateId}.docx`);
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const exportResultsJSON = () => {
        setStatusMessage('✓ Exported evaluation results from Section B.2 as JSON');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const triggerDownload = (filename, content, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const downloadEvidenceIndexCSV = () => {
        const header = ['Artifact', 'Stage', 'Status', 'Approved', 'File Count'];
        const rows = artifactsData.artifacts.map((art) => [
            art.name,
            art.stage,
            art.status,
            art.approved ? 'Yes' : 'No',
            art.files?.length || 0,
        ]);
        const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
        triggerDownload('evidence-index.csv', csv, 'text/csv;charset=utf-8;');
        setStatusMessage('📥 Evidence Index CSV downloaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const generatePillarReportHTML = () => {
        const rows = artifactsData.artifacts.map((art) => {
            return `<tr><td>${art.name}</td><td>${art.stage}</td><td>${art.status}</td><td>${art.approved ? 'Yes' : 'No'}</td><td>${art.files?.length || 0}</td></tr>`;
        }).join('');
        const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Evidence Report</title>
<style>
body { font-family: Arial, sans-serif; padding: 16px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ddd; padding: 8px; }
th { background: #f5f5f5; text-align: left; }
</style>
</head><body>
<h2>Fairness & Non-Discrimination Evidence Report</h2>
<p>Generated ${new Date().toISOString()}</p>
<table>
<thead><tr><th>Artifact</th><th>Stage</th><th>Status</th><th>Approved</th><th>Files</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`;
        triggerDownload('pillar-report.html', html, 'text/html;charset=utf-8;');
        setStatusMessage('📊 Pillar report (HTML) generated.');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const resetAll = () => {
        if (window.confirm('Are you sure you want to reset all demo data? This action cannot be undone.')) {
            setArtifactsData(defaultArtifactsData);
            setStatusMessage('');
            try {
                localStorage.removeItem(STORAGE_KEY_TAB_E);
            } catch (e) {
                console.error('Failed to clear localStorage:', e);
            }
            alert('Demo data has been reset to defaults.');
        }
    };

    return (
        <Box sx={{ px:0,pt:0}}>


            {/* Header */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                E. Evidence & Artifacts
            </Typography>
            <Typography variant="body2"  sx={{ mb: 3 }}>
                Required artifacts are structured. Evidence is versioned and exportable.
            </Typography>

            {/* Status Message */}
            {statusMessage && (
                <Alert severity={statusMessage.includes('✓') || statusMessage.includes('📥') ? 'success' : 'info'} sx={{ mb: 2 }}>
                    {statusMessage}
                </Alert>
            )}

            {/* KPI Dashboard */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                {[
                    {
                        label: 'Required Artifacts Complete',
                        value: `${completionCount} / ${totalCount}`,
                        desc: 'Release Readiness depends on this.',
                        bg: '#fff3e0',
                        border: '#ffb74d',
                        accent: '#f57c00'
                    },
                    {
                        label: 'Evidence Items',
                        value: itemCount,
                        desc: 'Uploads + generated reports.',
                        bg: '#e3f2fd',
                        border: '#64b5f6',
                        accent: '#1976d2'
                    },
                    {
                        label: 'Evaluation Evidence',
                        value: evalEvidenceStatus,
                        desc: 'Expected from Section B.',
                        bg: evalEvidenceStatus === 'Missing' ? '#ffcdd2' : '#c8e6c9',
                        border: evalEvidenceStatus === 'Missing' ? '#f44336' : '#4caf50',
                        accent: evalEvidenceStatus === 'Missing' ? '#d32f2f' : '#2e7d32'
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

                                        minWidth: 50, textAlign: 'right'
                                    }}>
                                    {kpi.value}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Required Artifacts Section */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                        Required Artifacts
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        v1 default set (you can customize per client). Mark "Approved" after review.
                    </Typography>

                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 260, color: '#1a1a1a' }}>
                                        Artifact
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 130, color: '#1a1a1a' }}>
                                        Required   Stage
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 130, color: '#1a1a1a' }}>
                                        Status
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 220, color: '#1a1a1a' }}>
                                        Upload / Generate
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 140, color: '#1a1a1a' }}>
                                        Approval
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {artifactsData.artifacts.map((artifact, index) => {
                                    const statusColor = getStatusColor(artifact.status);
                                    const stageColor = getStageColor(artifact.stage);

                                    return (
                                        <TableRow key={artifact.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                                            <TableCell>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {artifact.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {artifact.id}
                                                </Typography> &nbsp;
                                                <Typography variant="caption" color="text.secondary">
                                                    Status : {artifact.stage}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={artifact.stage}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: stageColor.bg,
                                                        borderColor: stageColor.border,
                                                        color: stageColor.accent,
                                                        fontWeight: 600,
                                                    }}
                                                    variant="outlined"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={artifact.status}
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
                                                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
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
                                                        Upload
                                                        <input
                                                            type="file"
                                                            hidden
                                                            onChange={(e) => uploadArtifact(index, e)}
                                                        />
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() => downloadArtifactTemplate(artifact.id)}
                                                        sx={{
                                                            textTransform: 'none',
                                                            color: '#666',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Template
                                                    </Button>
                                                    {artifact.id === 'eval_report' && (
                                                        <Button
                                                            size="small"
                                                            onClick={exportResultsJSON}
                                                            sx={{
                                                                textTransform: 'none',
                                                                color: '#2e7d32',
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            From B.2
                                                        </Button>
                                                    )}
                                                </Box>
                                                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: '#666' }}>
                                                    {artifact.files?.length || 0} file(s) attached
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <FormControl fullWidth size="small">
                                                    <Autocomplete
                                                    size="small"
                                                        options={[
                                                            { label: 'Not Approved', value: 'false' },
                                                            { label: 'Approved', value: 'true' },
                                                        ]}
                                                        getOptionLabel={(option) => option.label}
                                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                                        value={[
                                                            { label: 'Not Approved', value: 'false' },
                                                            { label: 'Approved', value: 'true' },
                                                        ].find((option) => option.value === (artifact.approved ? 'true' : 'false')) || null}
                                                        onChange={(_, value) => setArtifactApproval(index, value?.value || 'false')}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Export Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={downloadEvidenceIndexCSV}
                            sx={{
                                color: '#1976d2',
                                borderColor: '#1976d2',
                                fontWeight: 600,
                                textTransform: 'none',
                            }}
                        >
                            Download Evidence Index (CSV)
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<GetAppIcon />}
                            onClick={generatePillarReportHTML}
                            sx={{
                                color: '#2e7d32',
                                borderColor: '#2e7d32',
                                fontWeight: 600,
                                textTransform: 'none',
                            }}
                        >
                            Generate Pillar Report (HTML)
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert severity="info" sx={{ bgcolor: '#e3f2fd', borderColor: '#64b5f6', borderLeft: '4px solid #1976d2' }}>
                <Typography variant="caption" sx={{ color: '#1565c0', lineHeight: 1.6 }}>
                    <strong>💡 Tip:</strong> Complete and approve all required artifacts before release. Baseline artifacts are needed for training gate; Release artifacts unlock production deployment.
                </Typography>
            </Alert>

            {/* Demo Data Note & Reset Section */}
            <Card variant="outlined" sx={{ mt: 2, bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
                <CardContent sx={{ pb: 0 }}>
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

export default TabE;
