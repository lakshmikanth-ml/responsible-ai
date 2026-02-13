import React, { useState, useEffect } from 'react';
import {
    Autocomplete,
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
    TableCell, TableContainer, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';



const purposeOptions = [
    "Audit defensibility",
    "Regulatory readiness",
    "Operational control",
    "Incident escalation clarity",
    "Vendor risk governance"
];


const jurisdictionOptions = [
    "US — multi-state",
    "US — CA focus",
    "US — NY focus",
    "EU — GDPR regulated",
    "APAC — AU focus"
];


const ownerOptions = [
    "Head of Data Science (Accountable)",
    "Model Risk Owner (Accountable)",
    "Compliance Officer",
    "Privacy Officer",
    "Underwriting SME Approver",
    "Claims SME Approver",
    "Incident Manager (Ops/SRE)",
    "Security Lead",
    "Product Manager",
    "Data Engineering Lead",
    "Legal Counsel"
];


const impactOptions = [
    "Low (internal helper)",
    "Medium (advisory on decisions)",
    "High (influences money/outcomes)",
    "Critical (can deny/approve/settle)"
];


const standardOptions = [
    "All decision-influencing outputs must be traceable to logs + approvals; overrides must be recorded; incidents must route within SLA.",
    "Audit logs must capture who/when/input/output/rules/override/approvals; compliance can export within 24 hours.",
    "If confidence is low or violations occur, route to SME review; do not auto-act without approval."
];


const narrativeOptions = [
    "Claims triage assistant recommends next action; adjuster approves before customer impact",
    "Underwriting assistant summarizes submission; underwriter decides and logs approval",
    "Policy compliance scan flags missing clauses; compliance reviews and signs off",
    "Fraud assistant highlights suspicious signals; investigator confirms before escalation"
];


const badOptions = [
    "AI output used for denial/settlement without human approval",
];


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
    const [values, setValues] = useState({});
    // DFA & Policy data
    const [dfaJson, setDfaJson] = useState('');
    const [policyPreview, setPolicyPreview] = useState('');

    // Audit trail notes
    const [auditNotes, setAuditNotes] = useState([]);
    const [noteInput, setNoteInput] = useState('');

    // Status message
    const [statusMessage, setStatusMessage] = useState('');
    const setField = (key, value) =>
        setValues(prev => ({ ...prev, [key]: value }));

    const autoField = (label, key, options, helper) => (
        <Autocomplete
            size='small'
            options={options}
            value={values[key] || null}
            onChange={(_, v) => setField(key, v)}
            renderInput={params => (
                <TextField
                    {...params}
                    label={label}
                    helperText={helper}
                    fullWidth
                />
            )}
        />
    );

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
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                {autoField("Primary Purpose", "purpose", purposeOptions, "Why accountability is required")}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                {autoField("Jurisdiction / Market", "jurisdiction", jurisdictionOptions, "Where this runs")}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                {autoField("Accountable Owner", "owner", ownerOptions, "Single accountable role")}
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, }}>
                                {autoField("Decision Impact", "impact", impactOptions, "Used to set rigor")}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, }}>
                                {autoField("Minimum Accountability Standard", "standard", standardOptions, "Contract summary")}
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, }}>
                                {autoField("Use Case Narrative", "narrative", narrativeOptions, "Keep it short")}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, }}>
                                {autoField("Unacceptable Outcomes", "bad", badOptions, "Structured examples")}
                            </Grid>
                        </Grid>

                        <Box sx={{ mb: 3, mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                                Risk Drivers (check all that apply)
                            </Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2
                            }}>
                                {[
                                    { key: 'audit', label: 'Audit / Regulator', desc: 'Required evidence + traceability' },
                                    { key: 'customer', label: 'Customer Outcomes', desc: 'Disputes + complaints risk' },
                                    { key: 'operational', label: 'Operational Risk', desc: 'SLA impact + override rate' },
                                ].map((driver) => (
                                    <Card key={driver.key} variant="outlined" sx={{ p: 1 }}>
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
                                    No notes yet. Add a short note when decisions are made (e.g., owners assigned, evidence approved).
                                </Typography>
                            )}
                        </Box>

                        {/* Why This Matters */}
                        <Card variant="outlined" sx={{
                            p: 1, border: "1px solid #dbe4ff",
                            background: " #f2f6ff"
                        }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#0f172a" }}>
                                Why this matters
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                Accountability becomes the model’s operational contract: who approves releases, who responds to incidents, and what proof is retained.                            </Typography>
                        </Card>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PartA;
