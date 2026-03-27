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

const PartD = ({ projectContext = {}, onStatusMessage }) => {
    // Form data for D. Evaluation & Readiness Proof
    const [formData, setFormData] = useState({
        evaluationResult: '',
    });

    // Evaluation checkboxes
    const [checks, setChecks] = useState({
        auditLogCompleteness: false,
        overrideApprovalWorkflow: false,
        incidentTabletop: false,
        rbacAccessReview: false,
    });

    // DFA & Policy data
    const [dfaJson, setDfaJson] = useState('');
    const [policyPreview, setPolicyPreview] = useState('');

    // Audit trail notes
    const [auditNotes, setAuditNotes] = useState([]);
    const [noteInput, setNoteInput] = useState('');

    // Status message
    const [statusMessage, setStatusMessage] = useState('');

    // Load saved data on mount
    useEffect(() => {
        const saved = localStorage.getItem('accountability_partD_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(parsed.formData || formData);
                setChecks(parsed.checks || checks);
                setAuditNotes(parsed.auditNotes || []);
                setDfaJson(parsed.dfaJson || '');
                setPolicyPreview(parsed.policyPreview || '');
            } catch (e) {
                console.error('Error loading PartD data:', e);
            }
        }
    }, []);

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckChange = (checkKey) => {
        setChecks(prev => ({ ...prev, [checkKey]: !prev[checkKey] }));
    };

    const handleSave = () => {
        try {
            const payload = { formData, checks, auditNotes, dfaJson, policyPreview };
            localStorage.setItem('accountability_partD_data', JSON.stringify(payload));
            setStatusMessage('✓ Accountability D saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Accountability D saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleLoadSample = () => {
        setFormData({
            evaluationResult: 'All checks passed; release recommended',
        });
        setChecks({
            auditLogCompleteness: true,
            overrideApprovalWorkflow: true,
            incidentTabletop: true,
            rbacAccessReview: true,
        });
        setStatusMessage('✓ Sample data loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleLoadDFASample = () => {
        const sample = JSON.stringify({
            evaluationDate: new Date().toISOString(),
            testEnvironment: 'staging',
            checks: {
                auditLogFields: ['who', 'when', 'input', 'output', 'rules', 'override', 'approval'],
                approvalWorkflow: 'Documented and tested',
                incidentScenario: 'False positive escalation',
            },
        }, null, 2);
        setDfaJson(sample);
        setStatusMessage('✓ DFA sample loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleIngestDFA = () => {
        if (dfaJson.trim()) {
            try {
                JSON.parse(dfaJson);
                setStatusMessage('✓ Evaluation data ingested successfully');
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
            part: 'D',
            evaluation: formData,
            checksCompleted: checks,
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
            checks,
            auditNotes,
            dfa: dfaJson,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accountability-partD-${Date.now()}.json`;
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

    const checksCompleted = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    const isFormComplete = formData.evaluationResult && checksCompleted > 0;
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
                        <Typography variant="caption" sx={{ display: 'block', mb: 1,  }}>
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
                                D. Evaluation & Readiness Proof
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                    Save D
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
                                    borderRadius: '4px',
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

                        {/* Evaluation Goal */}
                        <Card variant="outlined" sx={{ mb: 2, p: 1.5, bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Evaluation goal
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                Before release, prove that accountability controls work: logs are complete, approvals/overrides are captured, RBAC is reviewed, and incident response is rehearsed once.
                            </Typography>
                        </Card>

                        {/* Evaluation Checks */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                            {[
                                { key: 'auditLogCompleteness', label: 'Audit log completeness test', hint: 'Can we export required fields?' },
                                { key: 'overrideApprovalWorkflow', label: 'Override + approval workflow test', hint: 'Are overrides recorded and attributable?' },
                                { key: 'incidentTabletop', label: 'Incident tabletop exercise', hint: 'One scenario rehearsed end-to-end' },
                                { key: 'rbacAccessReview', label: 'RBAC access review', hint: 'Access reviewed and approved' },
                            ].map((check) => (
                                <Card key={check.key} variant="outlined">
                                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                                                    {check.label}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                                    {check.hint}
                                                </Typography>
                                            </Box>
                                            <Switch
                                                size="small"
                                                checked={checks[check.key]}
                                                onChange={() => handleCheckChange(check.key)}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>

                        {/* Evaluation Result Summary */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={[
                                'All checks passed; release recommended',
                                'Minor gaps; release allowed with mitigation actions',
                                'Major gaps; release blocked until fixed',
                            ]}
                            value={formData.evaluationResult}
                            onChange={(e, newValue) => handleFormChange('evaluationResult', newValue || '')}
                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Evaluation Result Summary"
                                    helperText="Select a short statement" />}

                            freeSolo
                            sx={{ mb: 3 }}
                        />

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
                                </TableContainer>
                            ) : (
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', py: 2 }}>
                                    No notes yet. Add a short note when decisions are made (e.g., checks passed, evidence approved).
                                </Typography>
                            )}
                        </Box>

                        {/* Why This Matters */}
                        {/* <Card variant="outlined" sx={{ bgcolor: '#fafafa', p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Why this matters
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                Evaluation and readiness proof demonstrate that controls are not just documented—they actually work. Passing these checks ensures incidents can be investigated, approvals are traceable, and release gates have real teeth.
                            </Typography>
                        </Card> */}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PartD;
