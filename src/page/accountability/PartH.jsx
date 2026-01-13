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
    TableCell, Select, MenuItem, Stack, Switch
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const OWNER_OPTIONS = [
    { label: "Head of Data Science (Accountable)" },
    { label: "Model Risk Owner (Accountable)" },
    { label: "Compliance Officer" },
    { label: "Privacy Officer" },
    { label: "Underwriting SME Approver" },
    { label: "Claims SME Approver" },
    { label: "Incident Manager (Ops/SRE)" },
    { label: "Security Lead" },
    { label: "Product Manager" },
    { label: "Data Engineering Lead" },
    { label: "Legal Counsel" },
];


// ✅ INITIAL ROWS
const INIT = [
    "Governance Structure Document",
    "Role Matrix / Responsibility Tracker",
    "Incident Response Plan + SLAs",
    "Audit Log Schema + Sample Export",
    "Review Cadence Agenda + Minutes Template",
    "Compliance Checklist / Audit Prep Toolkit",
].map((name) => ({
    name,
    owner: null, // IMPORTANT: object or null
    status: "Missing",
    file: null,
    approved: false,
    updatedAt: null,
}));

const PartH = ({ projectContext = {}, onStatusMessage }) => {
    // Actions register
    const [rows, setRows] = React.useState(INIT);


    // ✅ SAFE UPDATE FUNCTION (NO AUTOCOMPLETE RESET)
    const update = (i, field, value) => {
        setRows((prev) =>
            prev.map((r, idx) =>
                idx === i
                    ? {
                        ...r,
                        [field]: value,
                        ...(field !== "owner" && { updatedAt: new Date() }),
                    }
                    : r
            )
        );
    };
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
    const [notes, setNotes] = React.useState([]);





    const loadSample = () => {
        setRows((prev) =>
            prev.map((r) => ({ ...r, owner: "Compliance Officer", status: "In Progress" }))
        );
    };


    const addAction = () => {
        setRows((r) => [
            ...r,
            {
                id: `A-MAN-00${r.length + 1}`,
                title: "Manual action (edit me)",
                owner: "",
                due: new Date().toISOString().slice(0, 10),
                status: "Planned",
                success: "",
                created: new Date().toISOString().slice(0, 10),
            },
        ]);
    };


    const missing = rows.some((r) => r.status !== "Done");

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
                                Ingest
                            </Button>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                            Paste DFA JSON from the separate Data Foundation Analyzer app. This populates Tab F and influences gates.
                        </Typography>
                        <TextField
                            multiline
                            minRows={4}
                            maxRows={8}
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="Paste DFA JSON here..."
                            value={dfaJson}
                            onChange={(e) => setDfaJson(e.target.value)}
                            sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', bgcolor: '#fafafa', p: 1, borderRadius: 1, color: 'text.secondary' }}>
                            💡 <strong>Tip:</strong> For demo, use <code>Load Sample</code>, then <code>Ingest</code>. In production, this would be an API integration.
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
                                Copy
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
                            This preview indicates it would be pushed to Guardian.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Snapshot Export Card */}
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Snapshot Export
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
                            Exports JSON snapshot and HTML report for audits.
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<CloudDownloadIcon />}
                            onClick={handleExportJSON}
                        >
                            Export JSON
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
                                G. Evidence (Local Demo Vault)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                    Save G
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

                        {/* Action plan info and actions */}

                        <Box sx={{
                            display: 'flex', gap: 1,
                            mb: 1
                        }}>
                            <Typography variant="body2"
                                sx={{
                                    color: '#1565c0',
                                    background: '#f2f6ff',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #90caf9',
                                }}>
                                <b>Evidence rules</b>
                                <br />
                                For demo, evidence files are stored as metadata (filename + timestamp). In production, this connects to your Evidence Vault storage + approvals workflow.
                            </Typography>
                        </Box>



                        {/* Actions Table */}
                        <Box sx={{ overflowX: 'auto', mb: 3 }}>
                            <Table sx={{ mt: 2 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Evidence Item</TableCell>
                                        <TableCell>Owner Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>File</TableCell>
                                        <TableCell>Approved</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {rows?.map((r, i) => (
                                        <TableRow key={r.name}>
                                            {/* Evidence Item */}
                                            <TableCell>
                                                <Typography fontWeight={800} fontSize={12}>{r.name}</Typography>
                                                <Typography fontSize={11} color="text.secondary" mt={0.5}>
                                                    Last updated: {r.updatedAt ? r.updatedAt.toLocaleString() : "—"}
                                                </Typography>
                                            </TableCell>


                                            {/* Owner Role (Autocomplete — FIXED) */}
                                            <TableCell>
                                                <Autocomplete
                                                    options={OWNER_OPTIONS}
                                                    value={r.owner}
                                                    size="small"
                                                    disableClearable
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, value) =>
                                                        option.label === value.label
                                                    }
                                                    onChange={(_, newValue) => update(i, "owner", newValue)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} placeholder="Select…" />
                                                    )}
                                                />
                                            </TableCell>


                                            {/* Status */}
                                            <TableCell>
                                                <Select
                                                    fullWidth
                                                    size="small"
                                                    value={r.status}
                                                    onChange={(e) => update(i, "status", e.target.value)}
                                                >
                                                    <MenuItem value="Missing">Missing</MenuItem>
                                                    <MenuItem value="Partial">Partial</MenuItem>
                                                    <MenuItem value="Complete">Complete</MenuItem>
                                                </Select>
                                            </TableCell>


                                            {/* File */}
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => update(i, "file", e.target.files?.[0] || null)}
                                                    />
                                                    <Typography fontSize={11} color="text.secondary">
                                                        {r.file ? r.file.name : "No file"}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>


                                            {/* Approved */}
                                            <TableCell>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                    <Typography
                                                        fontSize={11}
                                                        fontWeight={800}
                                                        sx={{ color: r.approved ? "#15803d" : "#92400e" }}
                                                    >
                                                        {r.approved ? "Approved" : "Not approved"}
                                                    </Typography>
                                                    <Switch
                                                        checked={r.approved}
                                                        onChange={(e) => update(i, "approved", e.target.checked)}
                                                    />
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>


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
                            ) : (
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', py: 2 }}>
                                    No notes yet. Add a short note when decisions are made (e.g., owners assigned, milestones reached).
                                </Typography>
                            )}
                        </Box>

                        {/* Why This Matters */}
                        <Card variant="outlined" sx={{ bgcolor: '#fafafa', p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Why this matters
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                A mitigation plan with assigned owners and clear success criteria turns identified risks into concrete work. Without tracking, mitigations get lost and gaps resurface during audits.
                            </Typography>
                        </Card>
                    </CardContent>
                </Card >
            </Grid >
        </Grid >
    );
};

export default PartH;
