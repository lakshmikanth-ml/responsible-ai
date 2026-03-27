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
    TableRow,
    TableCell, TableContainer, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const PartF = ({ projectContext = {}, onStatusMessage }) => {
    // Actions register
    const [actions, setActions] = useState([
        {
            id: 'A-MAN-001',
            title: 'Manual action (edit me)',
            createdDate: new Date().toISOString().split('T')[0],
            ownerRole: '',
            dueDate: new Date().toISOString().split('T')[0],
            status: 'Planned',
            successCriteria: '',
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
        const saved = localStorage.getItem('accountability_partF_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setActions(parsed.actions || actions);
                setAuditNotes(parsed.auditNotes || []);
                setDfaJson(parsed.dfaJson || '');
                setPolicyPreview(parsed.policyPreview || '');
            } catch (e) {
                console.error('Error loading PartF data:', e);
            }
        }
    }, []);

    const handleActionChange = (actionIndex, field, value) => {
        const updated = [...actions];
        updated[actionIndex][field] = value;
        setActions(updated);
    };

    const handleAddAction = () => {
        const newActionId = `A-MAN-${String(actions.length + 1).padStart(3, '0')}`;
        const today = new Date().toISOString().split('T')[0];
        const newAction = {
            id: newActionId,
            title: 'New action (edit me)',
            createdDate: today,
            ownerRole: '',
            dueDate: today,
            status: 'Planned',
            successCriteria: '',
        };
        setActions([...actions, newAction]);
        setStatusMessage('✓ New action added');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleRegenerate = () => {
        setStatusMessage('✓ Actions regenerated from missing controls');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleSave = () => {
        try {
            const payload = { actions, auditNotes, dfaJson, policyPreview };
            localStorage.setItem('accountability_partF_data', JSON.stringify(payload));
            setStatusMessage('✓ Accountability F saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Accountability F saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleLoadSample = () => {
        const today = new Date().toISOString().split('T')[0];
        setActions([
            {
                id: 'A-AUTO-001',
                title: 'Implement audit log export SLA',
                createdDate: today,
                ownerRole: 'Compliance Officer',
                dueDate: '2026-02-15',
                status: 'In Progress',
                successCriteria: 'Logs exported within 24 hours; verified by test',
            },
            {
                id: 'A-AUTO-002',
                title: 'Add timestamp to override records',
                createdDate: today,
                ownerRole: 'Data Engineering Lead',
                dueDate: '2026-02-01',
                status: 'Planned',
                successCriteria: 'All overrides timestamped; audit trail tested',
            },
            {
                id: 'A-MAN-001',
                title: 'Manual action (edit me)',
                createdDate: today,
                ownerRole: 'Model Risk Owner (Accountable)',
                dueDate: '2026-01-31',
                status: 'Done',
                successCriteria: 'Dashboard live and monitoring 24/7',
            },
        ]);
        setStatusMessage('✓ Sample data loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleLoadDFASample = () => {
        const sample = JSON.stringify({
            actionsCount: 3,
            plannedCount: 1,
            inProgressCount: 1,
            doneCount: 1,
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
                setStatusMessage('✓ Action plan data ingested successfully');
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
            part: 'F',
            mitigationPlan: actions,
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
            actions,
            auditNotes,
            dfa: dfaJson,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accountability-partF-${Date.now()}.json`;
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

    const doneCount = actions.filter(a => a.status === 'Done').length;
    const isFormComplete = actions.length > 0 && actions.some(a => a.ownerRole && a.status === 'Done');
    const statusColor = isFormComplete ? '#2e7d32' : '#d32f2f';
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
                                p: 1, borderRadius: 1,
                                color: 'text.secondary'
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
                                F. Mitigation Plan (Action Items)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                    Save F
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

                        {/* Action plan info and actions */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                mb: 2,
                            }}
                        >
                            <Typography variant="caption" sx={{ color: 'text.secondary' }} gutterBottom>
                                Actions are generated from missing controls. Set owners, dates, and completion.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={handleRegenerate}>
                                    Regenerate
                                </Button>
                                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAddAction}>
                                    Add Action
                                </Button>
                            </Box>
                        </Box>

                        {/* Actions Table */}
                        <Box sx={{ overflowX: 'auto', mb: 3 }}>
                            <TableContainer sx={{ mb: 0 }} component={Paper}>

                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Action</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Owner Role</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Due Date</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>Success Criteria</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {actions.map((action, idx) => (
                                            <TableRow key={action.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                                                <TableCell>
                                                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                                                        {action.id} — {action.title}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                                        Created: {action.createdDate}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Autocomplete
                                                        size="small"
                                                        value={action.ownerRole}
                                                        onChange={(e, val) => handleActionChange(idx, 'ownerRole', val || '')}
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
                                                    <TextField
                                                        type="date"
                                                        size="small"
                                                        value={action.dueDate}
                                                        onChange={(e) => handleActionChange(idx, 'dueDate', e.target.value)}
                                                        sx={{ minWidth: 110 }}
                                                        slotProps={{
                                                            input: {
                                                                sx: { fontSize: '0.875rem' },
                                                            },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Autocomplete
                                                        size="small"
                                                        value={action.status}
                                                        onChange={(e, val) => handleActionChange(idx, 'status', val)}
                                                        options={['Planned', 'In Progress', 'Blocked', 'Done']}
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
                                                        value={action.successCriteria}
                                                        onChange={(e) => handleActionChange(idx, 'successCriteria', e.target.value)}
                                                        placeholder="Criteria..."
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
                                    No notes yet. Add a short note when decisions are made (e.g., owners assigned, milestones reached).
                                </Typography>
                            )}
                        </Box>

                        {/* Why This Matters */}
                        {/* <Card variant="outlined" sx={{ bgcolor: '#fafafa', p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Why this matters
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                A mitigation plan with assigned owners and clear success criteria turns identified risks into concrete work. Without tracking, mitigations get lost and gaps resurface during audits.
                            </Typography>
                        </Card> */}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PartF;
