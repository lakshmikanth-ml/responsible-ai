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
    Table,
    TableHead,
    TableBody,
    TableRow, TableContainer, Paper,
    TableCell,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const PartE = ({ projectContext = {}, onStatusMessage }) => {
    // Risks register
    const [risks, setRisks] = useState([
        {
            id: 'R-MAN-001',
            title: 'R-OWN-001 — No accountable owner assigned for the model version',
            trigger: 'Trigger: Tab A: Accountable owner is empty',
            severity: 'Critical',
            phase: 'Pre-Training',
            ownerRole: 'Security Lead',
            status: 'Open',
            notes: '',
        },
        {
            id: 'R-MAN-001',
            title: 'R-DFA-001 — DFA not ingested (unknown data ownership/lineage)',
            trigger: 'Trigger: Tab C: DFA not ingested',
            severity: 'Critical',
            phase: 'Pre-Training',
            ownerRole: 'Security Lead',
            status: 'Open',
            notes: '',
        },
    ]);

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
        const saved = localStorage.getItem('accountability_partE_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setRisks(parsed.risks || risks);
                setAuditNotes(parsed.auditNotes || []);
                setDfaJson(parsed.dfaJson || '');
                setPolicyPreview(parsed.policyPreview || '');
            } catch (e) {
                console.error('Error loading PartE data:', e);
            }
        }
    }, []);

    const handleRiskChange = (riskIndex, field, value) => {
        const updated = [...risks];
        updated[riskIndex][field] = value;
        setRisks(updated);
    };

    const handleAddRisk = () => {
        const newRiskId = `R-MAN-${String(risks.length + 1).padStart(3, '0')}`;
        const newRisk = {
            id: newRiskId,
            title: 'New risk (edit me)',
            trigger: 'Manual entry',
            severity: 'High',
            phase: 'Pre-Training',
            ownerRole: '',
            status: 'Open',
            notes: '',
        };
        setRisks([...risks, newRisk]);
        setStatusMessage('✓ New risk added');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleRegenerate = () => {
        setStatusMessage('✓ Risks regenerated from controls');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleSave = () => {
        try {
            const payload = { risks, auditNotes, dfaJson, policyPreview };
            localStorage.setItem('accountability_partE_data', JSON.stringify(payload));
            setStatusMessage('✓ Accountability E saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Accountability E saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleLoadSample = () => {
        setRisks([
            {
                id: 'R-AUTO-001',
                title: 'Audit log export SLA not met',
                trigger: 'Missing audit log completeness check',
                severity: 'Critical',
                phase: 'Release',
                ownerRole: 'Compliance Officer',
                status: 'In Progress',
                notes: 'Implementing 24-hour export SLA',
            },
            {
                id: 'R-AUTO-002',
                title: 'Override tracking incomplete',
                trigger: 'Override + approval workflow test failed',
                severity: 'High',
                phase: 'Pre-Training',
                ownerRole: 'Security Lead',
                status: 'Open',
                notes: 'Need to add timestamp to override records',
            },
            {
                id: 'R-MAN-001',
                title: 'Manual risk (edit me)',
                trigger: 'Manual entry',
                severity: 'Medium',
                phase: 'Production',
                ownerRole: 'Incident Manager (Ops/SRE)',
                status: 'Mitigated',
                notes: 'Monitoring dashboard in place',
            },
        ]);
        setStatusMessage('✓ Sample data loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleLoadDFASample = () => {
        const sample = JSON.stringify({
            risksCount: 3,
            criticalCount: 1,
            openCount: 2,
            lastRegenerated: new Date().toISOString(),
        }, null, 2);
        setDfaJson(sample);
        setStatusMessage('✓ DFA sample loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleIngestDFA = () => {
        if (dfaJson.trim()) {
            try {
                JSON.parse(dfaJson);
                setStatusMessage('✓ Risk register data ingested successfully');
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
            part: 'E',
            risksRegister: risks,
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
            risks,
            auditNotes,
            dfa: dfaJson,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accountability-partE-${Date.now()}.json`;
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

    const criticalCount = risks.filter(r => r.severity === 'Critical').length;
    const openCount = risks.filter(r => r.status === 'Open').length;
    const isFormComplete = risks.length > 0 &&
        risks.some(r => r.ownerRole && r.status !== 'Open');
    const statusColor = isFormComplete ?
        '#2e7d32' : '#d32f2f';
    const statusText = isFormComplete ? 'Complete' : 'Missing';

    const ownerOptions = [
        'Head of Data Science (Accountable)',
        'Model Risk Owner (Accountable)',
        'Compliance Officer',
        'Privacy Officer',
        'Underwriting SME Approver',
        'Claims SME Approver',
        'Incident Manager (Ops/SRE)',
        'Security Lead',
        'Product Manager',
        'Data Engineering Lead',
        'Legal Counsel',
    ];

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
                                E. Gaps & Risks (Structured Register)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                    Save E
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

                        {/* Risk register info and actions */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: "column",
                            justifyContent: 'space-between',
                            alignItems: 'start', mb: 2
                        }}>
                            <Typography variant="caption"
                                sx={{ color: 'text.secondary' }} gutterBottom>
                                Risks are auto-generated from missing controls. You can edit severity/owner/status.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={handleRegenerate}>
                                    Regenerate
                                </Button>
                                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAddRisk}>
                                    Add Risk
                                </Button>
                            </Box>
                        </Box>

                        {/* Risks Table */}
                        <Box sx={{ overflowX: 'auto', mb: 3 }}>
                            <TableContainer sx={{ mb: 0 }} component={Paper}>

                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Risk</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Severity</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Phase</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Owner Role</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Notes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {risks.map((risk, idx) => (
                                            <TableRow key={risk.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                                                <TableCell>
                                                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                                                        {risk.id} — {risk.title}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                                        Trigger: {risk.trigger}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Autocomplete
                                                        size="small"
                                                        value={risk.severity}
                                                        onChange={(e, val) => handleRiskChange(idx, 'severity', val)}
                                                        options={['Critical', 'High', 'Medium', 'Low']}
                                                        freeSolo
                                                        sx={{ minWidth: 90 }}
                                                        slotProps={{
                                                            paper: {
                                                                sx: { fontSize: '0.875rem' },
                                                            },
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Autocomplete
                                                        size="small"
                                                        value={risk.phase}
                                                        onChange={(e, val) => handleRiskChange(idx, 'phase', val)}
                                                        options={['Pre-Training', 'Release', 'Production']}
                                                        freeSolo
                                                        sx={{ minWidth: 90 }}
                                                        slotProps={{
                                                            paper: {
                                                                sx: { fontSize: '0.875rem' },
                                                            },
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Autocomplete
                                                        size="small"
                                                        value={risk.ownerRole}
                                                        onChange={(e, val) => handleRiskChange(idx, 'ownerRole', val || '')}
                                                        options={ownerOptions}
                                                        freeSolo
                                                        sx={{ minWidth: 140 }}
                                                        slotProps={{
                                                            paper: {
                                                                sx: { fontSize: '0.875rem' },
                                                            },
                                                        }}
                                                        renderInput={(params) => <TextField {...params} placeholder="Select or type..." />}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Autocomplete
                                                        size="small"
                                                        value={risk.status}
                                                        onChange={(e, val) => handleRiskChange(idx, 'status', val)}
                                                        options={['Open', 'In Progress', 'Mitigated', 'Closed']}
                                                        freeSolo
                                                        sx={{ minWidth: 90 }}
                                                        slotProps={{
                                                            paper: {
                                                                sx: { fontSize: '0.875rem' },
                                                            },
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        value={risk.notes}
                                                        onChange={(e) => handleRiskChange(idx, 'notes', e.target.value)}
                                                        placeholder="Notes..."
                                                        sx={{ width: '100%' }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
                                    No notes yet. Add a short note when decisions are made (e.g., owners assigned, risks mitigated).
                                </Typography>
                            )}
                        </Box>

                        {/* Why This Matters */}
                        {/* <Card variant="outlined" sx={{ bgcolor: '#fafafa', p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Why this matters
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                A structured risk register documents known gaps and mitigation owners. Without clear accountability and tracking, risks slip through release gates and resurface as production incidents.
                            </Typography>
                        </Card> */}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PartE;
