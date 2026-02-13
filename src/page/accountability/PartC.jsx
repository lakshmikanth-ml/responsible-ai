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
    Switch,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell, TableContainer, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';

const PartC = ({ projectContext = {}, onStatusMessage }) => {
    // Form data for C. Training Readiness (DFA Ingest)
    const [formData, setFormData] = useState({
        datasetOwnership: '',
        lineageProvenance: '',
        accessApprovals: '',
        piiHandling: '',
        retentionDeletion: '',
        dataIntegrity: '',
    });

    // DFA & Policy data
    const [dfaJson, setDfaJson] = useState('');
    const [policyPreview, setPolicyPreview] = useState('');

    // DFA ingestion state
    const [dfaIngested, setDfaIngested] = useState(false);
    const [dfaMetadata, setDfaMetadata] = useState({ datasets: '—', piiFlags: '—' });

    // Audit trail notes
    const [auditNotes, setAuditNotes] = useState([]);
    const [noteInput, setNoteInput] = useState('');

    // Status message
    const [statusMessage, setStatusMessage] = useState('');

    // Load saved data on mount
    useEffect(() => {
        const saved = localStorage.getItem('accountability_partC_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(parsed.formData || formData);
                setAuditNotes(parsed.auditNotes || []);
                setDfaJson(parsed.dfaJson || '');
                setPolicyPreview(parsed.policyPreview || '');
                setDfaIngested(parsed.dfaIngested || false);
                setDfaMetadata(parsed.dfaMetadata || { datasets: '—', piiFlags: '—' });
            } catch (e) {
                console.error('Error loading PartC data:', e);
            }
        }
    }, []);

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        try {
            const payload = { formData, auditNotes, dfaJson, policyPreview, dfaIngested, dfaMetadata };
            localStorage.setItem('accountability_partC_data', JSON.stringify(payload));
            setStatusMessage('✓ Accountability C saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Accountability C saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleLoadSample = () => {
        setFormData({
            datasetOwnership: 'Named owners for all datasets',
            lineageProvenance: 'Lineage captured end-to-end',
            accessApprovals: 'Approved access controls exist',
            piiHandling: 'PII tagged + protected',
            retentionDeletion: 'Retention policy defined',
            dataIntegrity: 'Meets training readiness baseline',
        });
        setDfaIngested(true);
        setDfaMetadata({ datasets: '5 datasets', piiFlags: '12 fields' });
        setStatusMessage('✓ Sample data loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleLoadDFASample = () => {
        const sample = JSON.stringify({
            datasets: 5,
            features: 48,
            records: 125000,
            quality: 0.91,
            piiFields: 12,
            lastUpdated: new Date().toISOString(),
        }, null, 2);
        setDfaJson(sample);
        setStatusMessage('✓ DFA sample loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleIngestDFA = () => {
        if (dfaJson.trim()) {
            try {
                const parsed = JSON.parse(dfaJson);
                setDfaIngested(true);
                setDfaMetadata({
                    datasets: parsed.datasets || '—',
                    piiFlags: parsed.piiFields || '—',
                });
                setStatusMessage('✓ DFA ingested successfully');
                setTimeout(() => setStatusMessage(''), 2000);
            } catch (e) {
                setStatusMessage('✗ Invalid JSON');
                setTimeout(() => setStatusMessage(''), 2000);
            }
        }
    };

    const handleGeneratePolicyPack = () => {
        const policy = JSON.stringify({
            version: '1.0',
            part: 'C',
            dataReadiness: formData,
            dfaIngested,
            timestamp: new Date().toISOString(),
        }, null, 2);
        setPolicyPreview(policy);
        setStatusMessage('✓ Policy pack generated');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleCopyPolicy = () => {
        navigator.clipboard.writeText(policyPreview).then(() => {
            setStatusMessage('✓ Policy copied to clipboard');
            setTimeout(() => setStatusMessage(''), 2000);
        });
    };

    const handleExportJSON = () => {
        const snapshot = {
            formData,
            riskDrivers,
            auditNotes,
            dfa: dfaJson,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accountability-partC-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStatusMessage('✓ Snapshot exported');
        setTimeout(() => setStatusMessage(''), 2000);
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

    const isFormComplete = formData.datasetOwnership && formData.lineageProvenance && formData.accessApprovals;
    const statusColor = isFormComplete ? '#2e7d32' : '#d32f2f';
    const statusText = isFormComplete ? 'Complete' : 'Missing';

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* Left Sidebar */}
            <Grid size={{ xs: 12, md: 4 }}>
                {statusMessage && (
                    <Card variant="outlined" sx={{ mb: 2, bgcolor: '#c8e6c9', borderColor: '#4caf50' }}>
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                            <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                                {statusMessage}
                            </Typography>
                        </CardContent>
                    </Card>
                )}


                {/* DFA Ingestion Card */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            DFA Ingestion
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Button variant="outlined" size="small" onClick={handleLoadDFASample}>
                                Load Sample
                            </Button>
                            <Button variant="contained" size="small" onClick={handleIngestDFA}>
                                Ingest DFA JSON
                            </Button>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                            Paste DFA JSON from the separate Data Foundation Analyzer app. This populates Tab C and influences gates.                        </Typography>
                        <TextField
                            multiline
                            minRows={4}
                            maxRows={8}
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="Paste DFA JSON here (e.g., {&quot;datasetOwnership&quot;:...})"
                            value={dfaJson}
                            onChange={(e) => setDfaJson(e.target.value)}
                            sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mb: 1 }}
                        />
                        <Typography variant="caption"
                            sx={{
                                display: 'block',
                                bgcolor: '#f2f6ff',
                                border: "1px solid #dbe4ff",
                                p: 1, borderRadius: 1, color: 'text.secondary'
                            }}>
                            💡 <strong>Tip:</strong> For demo, use <code>Load DFA Sample</code>, then <code>Ingest</code>. In production, this would be an API integration.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Policy Pack Preview Card */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Policy Pack Preview
                            </Typography>
                            <Button variant="outlined" size="small" onClick={handleCopyPolicy}>
                                Copy  JSON
                            </Button>
                        </Box>
                        <TextField
                            multiline
                            minRows={6}
                            maxRows={10}
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="Generate Policy Pack to preview JSON here."
                            value={policyPreview}
                            sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                            This preview indicates it would be pushed to Guardian as a policy pack.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Snapshot Export Card */}
                <Card variant="outlined">
                    <CardContent>
                        <Box display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            mb={1}     >
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, }}>
                                Snapshot Export
                            </Typography>
                            <Button

                                variant="contained"
                                size="small"

                            // onClick={handleExportJSON}
                            >
                                Export HTML Report
                            </Button>
                        </Box>

                        <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
                            Exports a simple JSON snapshot and an HTML report (download). Useful for audit packets and stakeholder reviews.

                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<CloudDownloadIcon />}
                            onClick={handleExportJSON}
                        >
                            Export JSON snapshot
                        </Button>
                    </CardContent>
                </Card>
            </Grid>

            {/* Right Panel */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Card variant="outlined">
                    <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                C. Training Readiness (DFA Ingest)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                    Save C
                                </Button>
                            </Box>
                        </Box>

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

                        {/* How to use this tab */}
                        <Card variant="outlined" sx={{ mb: 2, p: 1.5, bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                How to use this tab
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                Ingest DFA JSON (left panel). Then confirm the key readiness fields below. These directly affect the Pre-Training Gate.
                            </Typography>
                        </Card>

                        {/* KPI Boxes */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                            <Card variant="outlined">
                                <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                        DFA Ingested
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: dfaIngested ? '#2e7d32' : '#d32f2f' }}>
                                        {dfaIngested ? 'Yes' : 'No'}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card variant="outlined">
                                <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                        Datasets
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {dfaMetadata.datasets}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card variant="outlined">
                                <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                        PII Flags
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {dfaMetadata.piiFlags}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Data Readiness Form - 3 columns */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={[
                                    'Named owners for all datasets',
                                    'Owners missing for some datasets',
                                    'Unknown',
                                ]}
                                value={formData.datasetOwnership}
                                onChange={(e, newValue) => handleFormChange('datasetOwnership', newValue || '')}
                                renderInput={(params) => <TextField {...params} label="Dataset Ownership Confirmed" />}
                                freeSolo
                            />

                            <Autocomplete
                                fullWidth
                                size="small"
                                options={[
                                    'Lineage captured end-to-end',
                                    'Partial lineage',
                                    'No lineage',
                                ]}
                                value={formData.lineageProvenance}
                                onChange={(e, newValue) => handleFormChange('lineageProvenance', newValue || '')}
                                renderInput={(params) => <TextField {...params} label="Lineage / Provenance" />}
                                freeSolo
                            />

                            <Autocomplete
                                fullWidth
                                size="small"
                                options={[
                                    'Approved access controls exist',
                                    'Partial / informal approvals',
                                    'Unknown',
                                ]}
                                value={formData.accessApprovals}
                                onChange={(e, newValue) => handleFormChange('accessApprovals', newValue || '')}
                                renderInput={(params) => <TextField {...params} label="Access Approvals" />}
                                freeSolo
                            />

                            <Autocomplete
                                fullWidth
                                size="small"
                                options={[
                                    'PII tagged + protected',
                                    'PII present but controls unclear',
                                    'No PII',
                                    'Unknown',
                                ]}
                                value={formData.piiHandling}
                                onChange={(e, newValue) => handleFormChange('piiHandling', newValue || '')}
                                renderInput={(params) => <TextField {...params} label="Sensitive Fields (PII) Handling" />}
                                freeSolo
                            />

                            <Autocomplete
                                fullWidth
                                size="small"
                                options={[
                                    'Retention policy defined',
                                    'Partial retention policy',
                                    'Unknown',
                                ]}
                                value={formData.retentionDeletion}
                                onChange={(e, newValue) => handleFormChange('retentionDeletion', newValue || '')}
                                renderInput={(params) => <TextField {...params} label="Retention / Deletion" />}
                                freeSolo
                            />

                            <Autocomplete
                                fullWidth
                                size="small"
                                options={[
                                    'Meets training readiness baseline',
                                    'Partial readiness',
                                    'Not ready',
                                ]}
                                value={formData.dataIntegrity}
                                onChange={(e, newValue) => handleFormChange('dataIntegrity', newValue || '')}
                                renderInput={(params) => <TextField {...params} label="Data Integrity Summary" />}
                                freeSolo
                            />
                        </Box>

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

                                <TableContainer sx={{ mb: 0 }} component={Paper}>
                                    <Table size="small"
                                    >
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
                                </TableContainer>
                            ) : (
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', py: 2 }}>
                                    No notes yet. Add a short note when decisions are made (e.g., training approved, evaluation started).
                                </Typography>
                            )}
                        </Box>

                        {/* Why This Matters */}
                        {/* <Card variant="outlined" sx={{ bgcolor: '#fafafa', p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Why this matters
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                Data readiness is the foundation of model governance. Poor data practices lead to regulatory failures, biased outcomes, and audit risks. This section ensures all training data meets baseline standards before models are released.
                            </Typography>
                        </Card> */}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PartC;
