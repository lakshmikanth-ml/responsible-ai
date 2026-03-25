import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    Alert,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Autocomplete,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import GetAppIcon from '@mui/icons-material/GetApp';

const STORAGE_KEY_TAB_B = 'TabB_DemoData';

const defaultMetricsData = {
    selectedMetrics: [],
    evalDataset: '',
    decisionThreshold: '',
    evalNotes: '',
    evaluationRun: false,
    evalResults: [],
};

const TabB = () => {
    const [metricsData, setMetricsData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_TAB_B);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed || defaultMetricsData;
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return defaultMetricsData;
    });

    const [statusMessage, setStatusMessage] = useState('');

    // Evaluation dataset options
    const evalDatasetOptions = ['Training', 'Validation', 'Holdout'];

    // Decision threshold options
    const decisionThresholdOptions = [
        'Strict (≥ 0.90 parity)',
        'Standard (≥ 0.85 parity)',
        'Advisory (≥ 0.80 parity)',
    ];

    // Core metrics list
    const coreMetrics = ['Demographic Parity', 'Equal Opportunity', 'Equalized Odds'];

    // Model quality metrics
    const modelQualityMetrics = [
        'Calibration by Group',
        'Error Rate by Group',
        'False Positive/Negative by Group',
    ];

    // All metrics combined
    const allMetrics = [...coreMetrics, ...modelQualityMetrics];

    // Persist data to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_TAB_B, JSON.stringify(metricsData));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [metricsData]);

    const handleMetricChange = (event) => {
        const { value, checked } = event.target;
        setMetricsData(prev => ({
            ...prev,
            selectedMetrics: checked
                ? [...prev.selectedMetrics, value]
                : prev.selectedMetrics.filter(m => m !== value),
        }));
    };

    const handleFieldChange = (field, value) => {
        setMetricsData(prev => ({ ...prev, [field]: value }));
    };

    const saveB1 = () => {
        if (metricsData.selectedMetrics.length === 0 || !metricsData.evalDataset || !metricsData.decisionThreshold) {
            setStatusMessage('❌ Please select metrics, evaluation dataset, and decision threshold.');
            return;
        }
        setStatusMessage('✓ B.1 Metric Selection saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const runEvaluation = () => {
        if (!metricsData.evalDataset || !metricsData.decisionThreshold) {
            setStatusMessage('❌ Please complete B.1 configuration first.');
            return;
        }

        // Generate sample evaluation results
        const sampleResults = [
            { metric: 'Demographic Parity', group: 'Age 18-25', score: 0.88, threshold: 0.85, status: 'PASS' },
            { metric: 'Demographic Parity', group: 'Age 26-40', score: 0.82, threshold: 0.85, status: 'FAIL' },
            { metric: 'Equal Opportunity', group: 'Age 18-25', score: 0.91, threshold: 0.90, status: 'PASS' },
            { metric: 'Equal Opportunity', group: 'Age 26-40', score: 0.87, threshold: 0.90, status: 'FAIL' },
            { metric: 'Equalized Odds', group: 'Gender', score: 0.92, threshold: 0.85, status: 'PASS' },
            { metric: 'Calibration by Group', group: 'Location', score: 0.79, threshold: 0.85, status: 'FAIL' },
        ];

        setMetricsData(prev => ({
            ...prev,
            evaluationRun: true,
            evalResults: sampleResults,
        }));
        setStatusMessage('✓ Evaluation completed successfully!');
    };

    const resetEvaluation = () => {
        setMetricsData(prev => ({
            ...prev,
            evaluationRun: false,
            evalResults: [],
        }));
        setStatusMessage('⟲ Evaluation results cleared.');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const resetAll = () => {
        if (window.confirm('Are you sure you want to reset all demo data? This action cannot be undone.')) {
            setMetricsData(defaultMetricsData);
            setStatusMessage('');
            try {
                localStorage.removeItem(STORAGE_KEY_TAB_B);
            } catch (e) {
                console.error('Failed to clear localStorage:', e);
            }
            alert('Demo data has been reset to defaults.');
        }
    };

    const downloadTemplate = (filename) => {
        alert(`Downloading: ${filename}`);
    };

    const exportResultsJSON = () => {
        const dataStr = JSON.stringify(metricsData.evalResults, null, 2);
        alert(`JSON Export:\n${dataStr}`);
    };

    const exportResultsCSV = () => {
        let csv = 'Metric,Group,Score,Threshold,Status\n';
        metricsData.evalResults.forEach(row => {
            csv += `${row.metric},${row.group},${row.score},${row.threshold},${row.status}\n`;
        });
        alert(`CSV Export:\n${csv}`);
    };

    const createRiskFromFailedResults = () => {
        const failedResults = metricsData.evalResults.filter(r => r.status === 'FAIL');
        setStatusMessage(`✓ Created ${failedResults.length} risk(s) from FAIL results.`);
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const renderKPIBadge = (status) => {
        const colorMap = {
            'Missing': 'error',
            'Not Run': 'error',
            'Complete': 'success',
            'Blocks Training': 'error',
            'Ready': 'success',
        };
        return (
            <Chip
                label={status}
                size="small"
                sx={{
                    bgcolor: colorMap[status] ? `${colorMap[status]}.light` : undefined,
                    color: colorMap[status] ? `${colorMap[status]}.dark` : undefined,
                    fontWeight: 600,
                }}
            />
        );
    };

    // KPI configuration
    const kpiConfig = [
        {
            id: 'B.1',
            label: 'B.1 Metric Selection',
            status: metricsData.selectedMetrics.length > 0 && metricsData.evalDataset && metricsData.decisionThreshold ? 'Complete' : 'Missing',
            description: 'Select metrics + dataset + threshold policy.',
        },
        {
            id: 'B.2',
            label: 'B.2 Evaluation Run',
            status: metricsData.evaluationRun ? 'Complete' : 'Not Run',
            description: 'Produces evidence + drives gating.',
        },
        {
            id: 'Gate',
            label: 'Gate Impact',
            status: metricsData.evaluationRun ? 'Ready' : 'Blocks Training',
            description: 'Computed from A/B completion.',
        },
    ];

    return (
        <Box sx={{ px:0,pt:0 }}>


            <Typography variant="h6" gutterBottom
             sx={{ fontWeight: 700, mb: 1 }}>
                B. Signals & Measurements

            </Typography>
            <Typography variant="body2"
                sx={{ mb: 2 }}>
                Select fairness metrics, configure policy thresholds, and run baseline fairness evaluation.
            </Typography>
            {/* KPI Dashboard */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    md: '1fr 1fr 1fr'
                }, gap: 2, mb: 3, mt: 1
            }}>
                {kpiConfig.map((kpi) => (
                    <Card key={kpi.id} variant="outlined">
                        <CardContent sx={{ pb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                {kpi.label}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                {renderKPIBadge(kpi.status)}
                            </Box>
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                                {kpi.description}
                            </Typography>
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

            {/* B.1 Section */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        B.1 Select Fairness Metrics
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {/* Core Metrics */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card variant="outlined" sx={{
                                border: "1px solid gray.300",
                                borderLeft: "6px solid #93c5fd",
                                padding: "12px",
                                borderRadius: "12px",
                                background: "#f8fafc",
                                p: 2, bgcolor: 'grey.50', height: '100%', display: 'flex', flexDirection: 'column'
                            }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Core Metrics
                                </Typography>
                                <FormGroup sx={{ flex: 1 }}>
                                    {coreMetrics.map((metric) => (
                                        <FormControlLabel
                                            key={metric}
                                            control={
                                                <Checkbox
                                                    checked={metricsData.selectedMetrics.includes(metric)}
                                                    onChange={handleMetricChange}
                                                    value={metric}
                                                    size="small"
                                                />
                                            }
                                            label={<Typography variant="body2">{metric}</Typography>}
                                        />
                                    ))}
                                </FormGroup>
                            </Card>
                        </Grid>

                        {/* Model Quality Metrics */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card variant="outlined" sx={{
                                border: "1px solid gray.300",
                                borderLeft: "6px solid #93c5fd",
                                padding: "12px",
                                borderRadius: "12px",
                                background: "#f8fafc",
                                p: 2,
                                bgcolor: 'grey.50', height: '100%', display: 'flex', flexDirection: 'column'
                            }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Model Quality by Group
                                </Typography>
                                <FormGroup sx={{ flex: 1 }}>
                                    {modelQualityMetrics.map((metric) => (
                                        <FormControlLabel
                                            key={metric}
                                            control={
                                                <Checkbox
                                                    checked={metricsData.selectedMetrics.includes(metric)}
                                                    onChange={handleMetricChange}
                                                    value={metric}
                                                    size="small"
                                                />
                                            }
                                            label={<Typography variant="body2">{metric}</Typography>}
                                        />
                                    ))}
                                </FormGroup>
                            </Card>
                        </Grid>

                        {/* Evaluation Configuration */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card variant="outlined" sx={{
                                border: "1px solid gray.300",
                                borderLeft: "6px solid #93c5fd",
                                padding: "12px",
                                borderRadius: "12px",
                                background: "#f8fafc", p: 2, bgcolor: 'grey.50', height: '100%', display: 'flex', flexDirection: 'column'
                            }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Evaluation Configuration
                                </Typography>
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

                                    <Autocomplete
                                        fullWidth
                                        label="Evaluation Dataset"

                                        size="small"
                                        options={evalDatasetOptions}
                                        value={metricsData.evalDataset || null}
                                        onChange={(event, newValue) => handleFieldChange('evalDataset', newValue || '')}
                                        renderInput={(params) => <TextField {...params}
                                            variant="outlined"
                                            label="Evaluation Dataset"
                                        />}
                                    />


                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={decisionThresholdOptions}
                                        value={metricsData.decisionThreshold || null}
                                        onChange={(event, newValue) => handleFieldChange('decisionThreshold', newValue || '')}
                                        renderInput={(params) => <TextField {...params} label="Decision Threshold (policy)" variant="outlined" />}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Notes (optional)"
                                        placeholder="Add constraints: e.g., exclude zip code proxies, limit to major groups"
                                        multiline
                                        rows={2}
                                        value={metricsData.evalNotes}
                                        onChange={(e) => handleFieldChange('evalNotes', e.target.value)}
                                        size="small"
                                    />
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                        <Button variant="contained" onClick={saveB1}>
                            Save Metric Selection
                        </Button>
                        <Button variant="outlined" onClick={() => downloadTemplate('Fairness_Evaluation_Template.xlsx')}>
                            <DownloadIcon sx={{ mr: 1 }} /> Download Evaluation Template
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* B.2 Section */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        B.2 Run Baseline Evaluation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        In production, this triggers your evaluation pipeline and stores results in Evidence Vault.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={runEvaluation}>
                            Run Evaluation
                        </Button>
                        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={resetEvaluation}>
                            Reset
                        </Button>
                    </Box>

                    {metricsData.evaluationRun && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Evaluation Results (Evidence)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Sample output for UI workflow validation. Backend will populate real results.
                            </Typography>

                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                                            <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Group</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Threshold</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {metricsData.evalResults.map((result, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{result.metric}</TableCell>
                                                <TableCell>{result.group}</TableCell>
                                                <TableCell>{result.score}</TableCell>
                                                <TableCell>{result.threshold}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={result.status}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: result.status === 'PASS' ? 'success.light' : 'error.light',
                                                            color: result.status === 'PASS' ? 'success.dark' : 'error.dark',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                <Button variant="contained" startIcon={<GetAppIcon />} onClick={exportResultsJSON}>
                                    Download Results JSON
                                </Button>
                                <Button variant="contained" startIcon={<GetAppIcon />} onClick={exportResultsCSV}>
                                    Download Results CSV
                                </Button>
                                <Button variant="outlined" onClick={createRiskFromFailedResults}>
                                    Create Risks from FAIL results
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Demo Data Note & Reset Section */}
            <Card variant="outlined" sx={{ bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
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
        </Box >
    );
};

export default TabB;
