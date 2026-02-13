import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    FormHelperText,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';

const PartB = ({ projectContext = {}, onStatusMessage }) => {
    // Coverage toggles
    const [coverage, setCoverage] = useState({
        systems: {
            model: true,
            orchestration: true,
            rag: true,
            ui: true,
            apis: true,
        },
        userGroups: {
            underwriting: true,
            claims: true,
            agents: false,
            brokers: false,
            callCenter: false,
        },
        outputs: {
            recommendations: true,
            summaries: true,
            decisions: false,
            messaging: false,
            compliance: true,
        },
        auditLogs: {
            who: true,
            timestamp: true,
            userInput: true,
            modelOutput: true,
            rules: true,
            overrides: true,
            approvals: true,
        },
    });

    // Form data
    const [formData, setFormData] = useState({
        boundary: '',
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
        const saved = localStorage.getItem('accountability_partB_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCoverage(parsed.coverage || coverage);
                setFormData(parsed.formData || formData);
                setAuditNotes(parsed.auditNotes || []);
                setDfaJson(parsed.dfaJson || '');
                setPolicyPreview(parsed.policyPreview || '');
            } catch (e) {
                console.error('Error loading PartB data:', e);
            }
        }
    }, []);

    const handleCoverageToggle = (category, key) => {
        setCoverage(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key],
            },
        }));
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        try {
            const payload = { coverage, formData, auditNotes, dfaJson, policyPreview };
            localStorage.setItem('accountability_partB_data', JSON.stringify(payload));
            setStatusMessage('✓ Accountability B saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Accountability B saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleLoadSample = () => {
        setCoverage({
            systems: { model: true, orchestration: true, rag: true, ui: true, apis: true },
            userGroups: { underwriting: true, claims: true, agents: false, brokers: false, callCenter: false },
            outputs: { recommendations: true, summaries: true, decisions: false, messaging: false, compliance: true },
            auditLogs: { who: true, timestamp: true, userInput: true, modelOutput: true, rules: true, overrides: true, approvals: true },
        });
        setFormData({ boundary: 'Decisioning with approval (human signs off)' });
        setStatusMessage('✓ Sample data loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleLoadDFASample = () => {
        const sample = JSON.stringify({
            datasetOwnership: 'Data Eng Team',
            dataQuality: 0.92,
            completeness: 0.88,
            lastUpdated: new Date().toISOString(),
        }, null, 2);
        setDfaJson(sample);
        setStatusMessage('✓ DFA sample loaded');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleIngestDFA = () => {
        if (dfaJson.trim()) {
            try {
                JSON.parse(dfaJson);
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
            coverage,
            boundary: formData.boundary,
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
            coverage,
            formData,
            auditNotes,
            dfa: dfaJson,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accountability-partB-${Date.now()}.json`;
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

    const toggleCount = Object.values(coverage).reduce((sum, cat) => sum + Object.values(cat).filter(Boolean).length, 0);
    const totalToggles = Object.values(coverage).reduce((sum, cat) => sum + Object.keys(cat).length, 0);
    const coveragePercent = Math.round((toggleCount / totalToggles) * 100);
    const isComplete = formData.boundary && toggleCount > 0;
    const statusColor = isComplete ? '#2e7d32' : '#d32f2f';
    const statusText = isComplete ? 'Complete' : 'Missing';

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
                                B. Coverage & Responsibility Boundaries
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                    Save B
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
                                {/* Coverage: {coveragePercent}% ({toggleCount}/{totalToggles}) */}
                            </Typography>
                        </Box>

                        {/* Coverage Goal */}
                        <Card variant="outlined" sx={{ mb: 3, p: 1.5, bgcolor: '#fafafa' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Coverage goal
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Accountability must cover systems, users, outputs, and logs. Use toggles instead of free text.
                            </Typography>
                        </Card>

                        {/* Coverage Toggles Grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                            {/* In-scope Systems */}
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                                        In-scope Systems
                                    </Typography>
                                    {[
                                        { key: 'model', label: 'Model' },
                                        { key: 'orchestration', label: 'Orchestration (Airflow/Agents)' },
                                        { key: 'rag', label: 'RAG services' },
                                        { key: 'ui', label: 'UI / App surfaces' },
                                        { key: 'apis', label: 'APIs / Integrations' },
                                    ].map((item) => (
                                        <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, pb: 1, borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 } }}>
                                            <Typography variant="caption">{item.label}</Typography>
                                            <Switch
                                                size="small"
                                                checked={coverage.systems[item.key]}
                                                onChange={() => handleCoverageToggle('systems', item.key)}
                                            />
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* In-scope User Groups */}
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                                        In-scope User Groups
                                    </Typography>
                                    {[
                                        { key: 'underwriting', label: 'Underwriting' },
                                        { key: 'claims', label: 'Claims' },
                                        { key: 'agents', label: 'Agents' },
                                        { key: 'brokers', label: 'Brokers' },
                                        { key: 'callCenter', label: 'Call Center / Support' },
                                    ].map((item) => (
                                        <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, pb: 1, borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 } }}>
                                            <Typography variant="caption">{item.label}</Typography>
                                            <Switch
                                                size="small"
                                                checked={coverage.userGroups[item.key]}
                                                onChange={() => handleCoverageToggle('userGroups', item.key)}
                                            />
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Outputs requiring traceability */}
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                                        Outputs requiring traceability
                                    </Typography>
                                    {[
                                        { key: 'recommendations', label: 'Recommendations' },
                                        { key: 'summaries', label: 'Summaries' },
                                        { key: 'decisions', label: 'Decisions (explicit)' },
                                        { key: 'messaging', label: 'Customer-facing messaging' },
                                        { key: 'compliance', label: 'Compliance flags' },
                                    ].map((item) => (
                                        <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, pb: 1, borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 } }}>
                                            <Typography variant="caption">{item.label}</Typography>
                                            <Switch
                                                size="small"
                                                checked={coverage.outputs[item.key]}
                                                onChange={() => handleCoverageToggle('outputs', item.key)}
                                            />
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Required Audit Logs */}
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                                        Required Audit Logs
                                    </Typography>
                                    {[
                                        { key: 'who', label: 'Who ran it' },
                                        { key: 'timestamp', label: 'Timestamp' },
                                        { key: 'userInput', label: 'User input / context' },
                                        { key: 'modelOutput', label: 'Model output' },
                                        { key: 'rules', label: 'Rules triggered (Guardian)' },
                                        { key: 'overrides', label: 'Overrides' },
                                        { key: 'approvals', label: 'Approvals / sign-offs' },
                                    ].map((item) => (
                                        <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, pb: 1, borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 } }}>
                                            <Typography variant="caption">{item.label}</Typography>
                                            <Switch
                                                size="small"
                                                checked={coverage.auditLogs[item.key]}
                                                onChange={() => handleCoverageToggle('auditLogs', item.key)}
                                            />
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Approval Boundary Select */}
                        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                            <InputLabel>Approval Boundary </InputLabel>
                            <Select
                                value={formData.boundary}
                                label="Approval Boundary"
                                onChange={(e) => handleFormChange('boundary', e.target.value)}
                            >

                                <MenuItem value="Advisory only (human decides)">Advisory only (human decides)</MenuItem>
                                <MenuItem value="Decisioning with approval (human signs off)">Decisioning with approval (human signs off)</MenuItem>
                                <MenuItem value="Automated decisioning (restricted)">Automated decisioning (restricted)</MenuItem>
                            </Select>
                            <FormHelperText>How far the AI can go</FormHelperText>
                        </FormControl>

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
                                    No notes yet. Add a short note when decisions are made (e.g., owners assigned, evidence approved).
                                </Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PartB;
