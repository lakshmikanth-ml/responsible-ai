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
    FormControlLabel,
    Checkbox,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';

const PartA = ({ projectContext = {}, onStatusMessage }) => {
    // Form data
    const [formData, setFormData] = useState({
        purpose: '',
        jurisdiction: '',
        owner: '',
        impactLevel: '',
        standard: '',
        narrative: '',
        unacceptable: '',
        riskDrivers: {
            audit: false,
            customer: false,
            operational: false,
        },
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
        const saved = localStorage.getItem('accountability_partA_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(parsed.formData || formData);
                setAuditNotes(parsed.auditNotes || []);
                setDfaJson(parsed.dfaJson || '');
                setPolicyPreview(parsed.policyPreview || '');
            } catch (e) {
                console.error('Error loading PartA data:', e);
            }
        }
    }, []);

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRiskDriverChange = (driver, checked) => {
        setFormData(prev => ({
            ...prev,
            riskDrivers: { ...prev.riskDrivers, [driver]: checked },
        }));
    };

    const handleSave = () => {
        try {
            const payload = { formData, auditNotes, dfaJson, policyPreview };
            localStorage.setItem('accountability_partA_data', JSON.stringify(payload));
            setStatusMessage('✓ Accountability A saved successfully');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Accountability A saved');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleLoadSample = () => {
        setFormData({
            purpose: 'Audit defensibility',
            jurisdiction: 'US — multi-state',
            owner: 'Head of Data Science (Accountable)',
            impactLevel: 'Critical (can deny/approve/settle)',
            standard: 'All decision-influencing outputs must be traceable to logs + approvals; overrides must be recorded; incidents must route within SLA.',
            narrative: 'Claims triage assistant recommends next action; adjuster approves before customer impact',
            unacceptable: 'AI output used for denial/settlement without human approval',
            riskDrivers: { audit: true, customer: true, operational: false },
        });
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
            purpose: formData.purpose,
            owner: formData.owner,
            standard: formData.standard,
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
            auditNotes,
            dfa: dfaJson,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accountability-partA-${Date.now()}.json`;
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

    const isFormComplete = formData.purpose && formData.owner && formData.impactLevel;
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
                                Ingest
                            </Button>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                            Paste DFA JSON from the Data Foundation Analyzer app. This populates Tab C and influences gates.
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
                            This preview indicates it would be pushed to Guardian as a policy pack.
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
                            Exports JSON snapshot and HTML report for audits and stakeholder reviews.
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
                                A. Objective & Accountability Intent
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                    Save A
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

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Primary Purpose</InputLabel>
                                <Select
                                    value={formData.purpose}
                                    label="Primary Purpose"
                                    onChange={(e) => handleFormChange('purpose', e.target.value)}
                                >
                                    <MenuItem value="">Select…</MenuItem>
                                    <MenuItem value="Audit defensibility">Audit defensibility</MenuItem>
                                    <MenuItem value="Regulatory readiness">Regulatory readiness</MenuItem>
                                    <MenuItem value="Operational control">Operational control</MenuItem>
                                    <MenuItem value="Incident escalation clarity">Incident escalation clarity</MenuItem>
                                    <MenuItem value="Vendor risk governance">Vendor risk governance</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Jurisdiction / Market</InputLabel>
                                <Select
                                    value={formData.jurisdiction}
                                    label="Jurisdiction / Market"
                                    onChange={(e) => handleFormChange('jurisdiction', e.target.value)}
                                >
                                    <MenuItem value="">Select…</MenuItem>
                                    <MenuItem value="US — multi-state">US — multi-state</MenuItem>
                                    <MenuItem value="US — CA focus">US — CA focus</MenuItem>
                                    <MenuItem value="US — NY focus">US — NY focus</MenuItem>
                                    <MenuItem value="EU — GDPR regulated">EU — GDPR regulated</MenuItem>
                                    <MenuItem value="APAC — AU focus">APAC — AU focus</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Accountable Owner (Role)</InputLabel>
                                <Select
                                    value={formData.owner}
                                    label="Accountable Owner (Role)"
                                    onChange={(e) => handleFormChange('owner', e.target.value)}
                                >
                                    <MenuItem value="">Select owner role…</MenuItem>
                                    <MenuItem value="Head of Data Science (Accountable)">Head of Data Science (Accountable)</MenuItem>
                                    <MenuItem value="Model Risk Owner (Accountable)">Model Risk Owner (Accountable)</MenuItem>
                                    <MenuItem value="Compliance Officer">Compliance Officer</MenuItem>
                                    <MenuItem value="Privacy Officer">Privacy Officer</MenuItem>
                                    <MenuItem value="Underwriting SME Approver">Underwriting SME Approver</MenuItem>
                                    <MenuItem value="Claims SME Approver">Claims SME Approver</MenuItem>
                                    <MenuItem value="Incident Manager (Ops/SRE)">Incident Manager (Ops/SRE)</MenuItem>
                                    <MenuItem value="Security Lead">Security Lead</MenuItem>
                                    <MenuItem value="Product Manager">Product Manager</MenuItem>
                                    <MenuItem value="Data Engineering Lead">Data Engineering Lead</MenuItem>
                                    <MenuItem value="Legal Counsel">Legal Counsel</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Decision Impact Level</InputLabel>
                                <Select
                                    value={formData.impactLevel}
                                    label="Decision Impact Level"
                                    onChange={(e) => handleFormChange('impactLevel', e.target.value)}
                                >
                                    <MenuItem value="">Select…</MenuItem>
                                    <MenuItem value="Low (internal helper)">Low (internal helper)</MenuItem>
                                    <MenuItem value="Medium (advisory on decisions)">Medium (advisory on decisions)</MenuItem>
                                    <MenuItem value="High (influences money/outcomes)">High (influences money/outcomes)</MenuItem>
                                    <MenuItem value="Critical (can deny/approve/settle)">Critical (can deny/approve/settle)</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Minimum Accountability Standard</InputLabel>
                                <Select
                                    value={formData.standard}
                                    label="Minimum Accountability Standard"
                                    onChange={(e) => handleFormChange('standard', e.target.value)}
                                >
                                    <MenuItem value="">Select…</MenuItem>
                                    <MenuItem value="All decision-influencing outputs must be traceable to logs + approvals; overrides must be recorded; incidents must route within SLA.">
                                        Traceable outputs + approvals + overrides + SLA routing
                                    </MenuItem>
                                    <MenuItem value="Audit logs must capture who/when/input/output/rules/override/approvals; compliance can export within 24 hours.">
                                        Audit logs with 24-hour export capability
                                    </MenuItem>
                                    <MenuItem value="If confidence is low or violations occur, route to SME review; do not auto-act without approval.">
                                        SME review routing on low confidence
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Use Case Narrative</InputLabel>
                                <Select
                                    value={formData.narrative}
                                    label="Use Case Narrative"
                                    onChange={(e) => handleFormChange('narrative', e.target.value)}
                                >
                                    <MenuItem value="">Select…</MenuItem>
                                    <MenuItem value="Claims triage assistant recommends next action; adjuster approves before customer impact">
                                        Claims triage assistant
                                    </MenuItem>
                                    <MenuItem value="Underwriting assistant summarizes submission; underwriter decides and logs approval">
                                        Underwriting assistant
                                    </MenuItem>
                                    <MenuItem value="Policy compliance scan flags missing clauses; compliance reviews and signs off">
                                        Policy compliance scan
                                    </MenuItem>
                                    <MenuItem value="Fraud assistant highlights suspicious signals; investigator confirms before escalation">
                                        Fraud detection assistant
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Unacceptable Outcomes</InputLabel>
                                <Select
                                    value={formData.unacceptable}
                                    label="Unacceptable Outcomes"
                                    onChange={(e) => handleFormChange('unacceptable', e.target.value)}
                                >
                                    <MenuItem value="">Select…</MenuItem>
                                    <MenuItem value="AI output used for denial/settlement without human approval">
                                        No human approval
                                    </MenuItem>
                                    <MenuItem value="No audit log for a customer-impacting decision">
                                        No audit log
                                    </MenuItem>
                                    <MenuItem value="Override happens but is not recorded">
                                        Unrecorded override
                                    </MenuItem>
                                    <MenuItem value="Incident reported but no owner responds within SLA">
                                        SLA miss
                                    </MenuItem>
                                    <MenuItem value="Compliance cannot export logs for audit within 24 hours">
                                        Export failure
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                                Risk Drivers (check all that apply)
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                                {[
                                    { key: 'audit', label: 'Audit / Regulator', desc: 'Required evidence + traceability' },
                                    { key: 'customer', label: 'Customer Outcomes', desc: 'Disputes + complaints risk' },
                                    { key: 'operational', label: 'Operational Risk', desc: 'SLA impact + override rate' },
                                ].map((driver) => (
                                    <Card key={driver.key} variant="outlined" sx={{ p: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <Checkbox
                                                checked={formData.riskDrivers[driver.key]}
                                                onChange={(e) => handleRiskDriverChange(driver.key, e.target.checked)}
                                                size="small"
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                    {driver.label}
                                                </Typography>
                                                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.7rem' }}>
                                                    {driver.desc}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </Box>
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
                                    placeholder="Add a short note (e.g., owners assigned, evidence approved)..."
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
                                    No notes yet. Add a short note when decisions are made.
                                </Typography>
                            )}
                        </Box>

                        {/* Why This Matters */}
                        <Card variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Why this matters
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                Accountability becomes the model's operational contract: who approves releases, who responds to incidents, and what proof is retained. Clear definitions prevent decision paralysis, disputes, and regulatory blind spots.
                            </Typography>
                        </Card>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PartA;
