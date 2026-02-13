import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const TabC = ({ projectContext = {}, onStatusMessage }) => {
    const [projectCtx, setProjectCtx] = useState({
        project: projectContext?.project || '',
        modelVersion: projectContext?.modelVersion || '',
        endpoint: projectContext?.endpoint || '',
        decisionRole: projectContext?.decisionRole || 'Decision-support',
        sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
    });

    const [statusMessage, setStatusMessage] = useState('');

    const [dfaJson, setDfaJson] = useState('');
    const [dfaData, setDfaData] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const savedCtx = localStorage.getItem('privacy_projectContext');
        if (savedCtx) {
            try {
                setProjectCtx(JSON.parse(savedCtx));
            } catch (e) {
                console.error('Error loading project context:', e);
            }
        }

        const saved = localStorage.getItem('privacy_tabC_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setDfaJson(parsed.dfaJson || '');
                setDfaData(parsed.dfaData || null);
                setRecommendations(parsed.recommendations || []);
            } catch (e) {
                console.error('Error loading TabC data:', e);
            }
        }
    }, []);

    const handleContextChange = (field, value) => {
        setProjectCtx(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem('privacy_projectContext', JSON.stringify(projectCtx));
            setStatusMessage('✓ Project Context saved successfully');
            setTimeout(() => setStatusMessage(''), 3000);
            if (onStatusMessage) {
                onStatusMessage('✓ Project Context saved successfully');
            }
        } catch (e) {
            setStatusMessage('✗ Error saving context');
            if (onStatusMessage) {
                onStatusMessage('✗ Error saving context');
            }
        }
    };

    const handleResetDemo = () => {
        if (window.confirm('Reset all demo data? This cannot be undone.')) {
            localStorage.clear();
            setProjectCtx({
                project: '',
                modelVersion: '',
                endpoint: '',
                decisionRole: 'Decision-support',
                sensitivity: 'Tier 4 — Regulated (PII/PHI/PCI)',
                hostingBoundary: 'Client VPC/VNet (Private)',
            });
            setDfaJson('');
            setDfaData(null);
            setRecommendations([]);
            setStatusMessage('✓ Demo data reset');
            if (onStatusMessage) {
                onStatusMessage('✓ Demo data reset');
            }
        }
    };

    const handleSave = () => {
        try {
            localStorage.setItem('privacy_tabC_data', JSON.stringify({
                dfaJson,
                dfaData,
                recommendations,
            }));
            setStatusMessage('✓ Tab C saved successfully');
            setTimeout(() => setStatusMessage(''), 3000);
            if (onStatusMessage) {
                onStatusMessage('✓ Tab C saved successfully');
            }
        } catch (e) {
            setStatusMessage('✗ Error saving data');
            if (onStatusMessage) {
                onStatusMessage('✗ Error saving data');
            }
        }
    };

    const handleIngestDFA = () => {
        try {
            const parsed = JSON.parse(dfaJson);
            setDfaData(parsed);

            // Simulate DFA analysis and recommendation generation
            const autoRecommendations = [];
            if (parsed.pii_detected) {
                autoRecommendations.push({
                    source: 'DFA Analysis',
                    recommendation: 'PII detected - implement masking or exclusion',
                    mappedRisk: 'High',
                });
            }
            if (parsed.duplicates && parsed.duplicates > 5) {
                autoRecommendations.push({
                    source: 'DFA Analysis',
                    recommendation: 'High duplicate rate detected - clean training data',
                    mappedRisk: 'Medium',
                });
            }
            if (parsed.ocr_quality && parsed.ocr_quality < 0.8) {
                autoRecommendations.push({
                    source: 'OCR Quality',
                    recommendation: 'Low OCR quality - improve document preprocessing',
                    mappedRisk: 'Medium',
                });
            }

            setRecommendations(autoRecommendations);
            setStatusMessage('✓ DFA JSON ingested successfully');
            setTimeout(() => setStatusMessage(''), 3000);
            if (onStatusMessage) {
                onStatusMessage('✓ DFA JSON ingested successfully');
            }
        } catch (e) {
            setStatusMessage('✗ Invalid JSON format');
            if (onStatusMessage) {
                onStatusMessage('✗ Invalid JSON format');
            }
        }
    };

    const loadSample = () => {
        const sampleJson = {
            analysis_type: 'file_analysis',
            total_files: 250,
            pii_detected: true,
            pii_count: 12,
            pii_files: 8,
            duplicates: 23,
            conflicting_versions: 5,
            outdated_docs: 15,
            ocr_quality: 0.87,
            issues: 3,
        };
        setDfaJson(JSON.stringify(sampleJson, null, 2));
        setStatusMessage('✓ Sample DFA JSON loaded');
        setTimeout(() => setStatusMessage(''), 3000);
        if (onStatusMessage) {
            onStatusMessage('✓ Sample DFA JSON loaded');
        }
    };

    const getScore = () => {
        if (!dfaData) return '—';
        let score = 100;
        if (dfaData.pii_detected) score -= 20;
        if (dfaData.duplicates > 10) score -= 15;
        if (dfaData.ocr_quality && dfaData.ocr_quality < 0.8) score -= 10;
        if (dfaData.conflicting_versions > 3) score -= 10;
        if (dfaData.outdated_docs > 10) score -= 10;
        return Math.max(0, score);
    };

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* LEFT PANEL: PROJECT CONTEXT */}
            <Grid size={{ xs: 12, md: 4 }}
            >
                <Box sx={{
                    border: "1px solid rgba(117, 117, 117, 0.2)",
                    p: 2,
                    borderRadius: 2,
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
                            Reset Demo
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

            {/* RIGHT PANEL: DFA CONTENT */}
            <Grid size={{ xs: 12, md: 8 }} sx={{
                p: 0,
                border: "1px solid rgba(117, 117, 117, 0.2)",
                p: 2,
                borderRadius: 2
            }}>
                {/* Header */}
                <Box sx={{
                    mb: 0,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        📊 C. Training Readiness (DFA Ingestion)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        Paste/upload DFA JSON from your Data Foundation Analyzer. We compute privacy readiness and create auto-risks (PII, duplicates, OCR quality, outdated docs).
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button variant="outlined" size="small" onClick={loadSample} sx={{ borderRadius: 1 }}>
                            📄 Load Sample DFA
                        </Button>
                        <Button variant="contained" size="small" onClick={handleIngestDFA} sx={{ borderRadius: 1 }}>
                            ⚙️ Ingest DFA JSON
                        </Button>
                        <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave} sx={{ borderRadius: 1 }}>
                            Save Content
                        </Button>
                    </Box>
                </Box>

                {/* DFA Input Section */}
                <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    DFA JSON Input
                                </Typography>
                                <TextField
                                    label={'Paste DFA JSON (file analysis or database profiling)'}
                                    fullWidth
                                    multiline
                                    rows={10}
                                    value={dfaJson}
                                    onChange={(e) => setDfaJson(e.target.value)}
                                    placeholder='Paste JSON here (example: {"analysis_type":"file_analysis",...})'
                                    variant="outlined"
                                    sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    This demo stores DFA JSON locally. In production, GenAI Foundry pulls DFA run artifacts via API.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Computed Privacy Readiness (from DFA)
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            AI Readiness Score
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                                            {getScore()}%
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            PII Detected
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                                            {dfaData?.pii_detected ? 'Yes' : 'No'}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            PII Files Flagged
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                                            {dfaData?.pii_files || '—'}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            OCR Quality Avg
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                                            {dfaData?.ocr_quality ? (dfaData.ocr_quality * 100).toFixed(1) + '%' : '—'}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Duplicates
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                                            {dfaData?.duplicates || '—'}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Conflicting Versions
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                                            {dfaData?.conflicting_versions || '—'}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Outdated Docs
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                                            {dfaData?.outdated_docs || '—'}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Issues
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                                            {dfaData?.issues || '—'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recommendations */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            🎯 DFA Recommendations (Auto-Generated)
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 600, width: '140px' }}>Source</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Recommendation</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '170px' }}>Mapped Risk</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recommendations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} sx={{ color: '#999', fontWeight: 600, textAlign: 'center', py: 3 }}>
                                                No DFA ingested yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recommendations.map((rec, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{rec.source}</TableCell>
                                                <TableCell>{rec.recommendation}</TableCell>
                                                <TableCell>{rec.mappedRisk}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Callout */}
                <Card sx={{
                    border: '1px solid rgba(117, 117, 117, 0.2)',
                    borderRadius: 2,
                }}>
                    <CardContent>
                        <Box sx={{
                            display: 'flex', gap: 1.5,
                            alignItems: 'flex-start'
                        }}>
                            <Typography sx={{ fontSize: '1.5rem', mt: 0.5 }}>🔐</Typography>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: '#0c4a6e' }}>
                                    Pre-Training Gate
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#0c4a6e', lineHeight: 1.6 }}>
                                    DFA informs the Pre-Training Gate. If PII is detected and you have no masking/exclusion plan, training should be blocked.
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default TabC;
