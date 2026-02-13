import React, { useState, useEffect } from 'react';
import {
    Stack,
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Grid, Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RiskRegisterCard from './RiskTable';



const severityOptions = ["Low", "Medium", "High", "Critical"];

const riskTypes = [
    "Data Protection Gap",
    "Model Governance Risk",
    "Security Control Missing",
    "Evaluation Coverage Gap",
];

const statusOptions = [
    "Open",
    "Mitigating",
    "Blocked",
    "Resolved",
];

const emptyRisk = () => ({
    id: Date.now(),
    severity: "Medium",
    type: riskTypes[0],
    details: "",
    owner: "",
    status: "Open",
});



const TabE = ({ projectContext = {}, onStatusMessage }) => {
    const [projectCtx, setProjectCtx] = useState({
        project: projectContext?.project || '',
        modelVersion: projectContext?.modelVersion || '',
        endpoint: projectContext?.endpoint || '',
        decisionRole: projectContext?.decisionRole || 'Decision-support',
        sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
    });
    const [riskData, setRiskData] = useState({
        gaps: [],
        risks: [],
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [riskDialog, setRiskDialog] = useState(false);
    const [newRisk, setNewRisk] = useState({ description: '', severity: 'High', owner: '', mitigation: '' });
    const [riskErrors, setRiskErrors] = useState({ description: false, owner: false });
    const [risks, setRisks] = React.useState([]);

    const severities = ['Critical', 'High', 'Medium', 'Low'];

    useEffect(() => {
        const saved = localStorage.getItem('privacy_tabE_data');
        if (saved) {
            try {
                setRiskData(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading TabE data:', e);
            }
        }
        const savedCtx = localStorage.getItem('privacy_projectContext');
        if (savedCtx) {
            try {
                setProjectCtx(JSON.parse(savedCtx));
            } catch (e) {
                console.error('Error loading project context:', e);
            }
        }
    }, []);

    const handleSave = () => {
        try {
            localStorage.setItem('privacy_tabE_data', JSON.stringify(riskData));
            setStatusMessage('✓ E.1–E.2 gaps & risks saved');
            setTimeout(() => setStatusMessage(''), 2000);
        } catch (e) {
            setStatusMessage('✗ Error saving data');
        }
    };

    const handleContextChange = (field, value) => {
        setProjectCtx(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem('privacy_projectContext', JSON.stringify(projectCtx));
            setStatusMessage('✓ Project Context saved');
            setTimeout(() => setStatusMessage(''), 2000);
            if (onStatusMessage) onStatusMessage('✓ Project Context saved');
        } catch (e) {
            setStatusMessage('✗ Error saving context');
        }
    };

    const handleResetDemo = () => {
        if (window.confirm('Reset demo data for Gaps & Risks?')) {
            localStorage.removeItem('privacy_tabE_data');
            localStorage.removeItem('privacy_projectContext');
            setRiskData({ gaps: [], risks: [] });
            setProjectCtx({ project: '', modelVersion: '', endpoint: '', decisionRole: 'Decision-support', sensitivity: 'Tier 4 — Regulated (PII/PHI/PCI)', hostingBoundary: 'Client VPC/VNet (Private)' });
            setStatusMessage('✓ Demo reset');
            if (onStatusMessage) onStatusMessage('✓ Demo reset');
        }
    };

    const handleAddRisk = () => {
        const errors = {
            description: !newRisk.description.trim(),
            owner: !newRisk.owner.trim()
        };
        setRiskErrors(errors);

        if (!errors.description && !errors.owner) {
            setRiskData(prev => ({
                ...prev,
                risks: [...prev.risks, { id: Date.now(), ...newRisk }]
            }));
            setNewRisk({ description: '', severity: 'High', owner: '', mitigation: '' });
            setRiskErrors({ description: false, owner: false });
            setRiskDialog(false);
        }
    };

    const handleRemoveRisk = (id) => {
        setRiskData(prev => ({
            ...prev,
            risks: prev.risks.filter(r => r.id !== id)
        }));
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return '#d32f2f';
            case 'High': return '#f57c00';
            case 'Medium': return '#fbc02d';
            case 'Low': return '#2e7d32';
            default: return '#666';
        }
    };

    // KPI Dashboard
    const criticalCount = riskData.risks.filter(r => r.severity === 'Critical').length;
    const openCount = riskData.risks.length;



    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* LEFT PANEL: PROJECT CONTEXT */}
            <Grid size={{ xs: 12, sm: 4, md: 4 }}
            >
                <Box sx={{
                    border: '1px solid #e0e0e0',
                    p: 2,
                    borderRadius: 2,
                    mb: 2,
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
                            Reset Data
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

            {/* RIGHT PANEL: Risks & Gaps */}
            <Grid size={{ xs: 12, sm: 8, md: 8 }}
                sx={{
                    p: 2,
                    border: "1px solid rgba(117, 117, 117, 0.2)",
                    borderRadius: 2
                }}>




                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>

                        {/* HEADER */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    E. Gaps & Risks (Auto + Manual)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Auto-generated risks come from DFA and missing coverage/evaluation. You can also add controlled “manual risks” using dropdowns (no free text unless needed).
                                </Typography>
                            </Box>


                        </Box>


                        {/* TABLE */}
                        <RiskRegisterCard />


                        {/* FOOTER NOTE */}
                        <Box
                            sx={{
                                mt: 2,
                                p: 1.5,
                                borderRadius: 2,
                                background: "#f8fafc",
                                borderLeft: "4px solid #184ea4",
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                This register should be exportable into audits and used during client workshops (“here is what blocks training/release and why”).
                            </Typography>
                        </Box>

                    </CardContent>
                </Card>


                {/* Save Button */}
                <Box sx={{ textAlign: 'right' }}>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{ bgcolor: '#2e7d32' }}
                    >
                        Save Gaps & Risks
                    </Button>
                </Box>


            </Grid>
            {/* Risk Dialog */}
            <Dialog open={riskDialog}
                onClose={() => {
                    setRiskDialog(false);
                    setRiskErrors({ description: false, owner: false });
                }}
                maxWidth="sm"
                fullWidth>
                <DialogTitle>Add Risk</DialogTitle>
                <DialogContent sx={{
                    pt: 0, pb: 2,
                    display: 'flex',
                    flexDirection: 'column', gap: 2,
                    '&.MuiDialogContent-root': { pt: 1 }
                }}
                >
                    <TextField
                        label="Risk Description*"
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        value={newRisk?.description || ""}
                        onChange={(e) => {
                            setNewRisk(prev => ({ ...prev, description: e.target.value }));
                            if (riskErrors.description) setRiskErrors(prev => ({ ...prev, description: false }));
                        }}
                        error={riskErrors.description}
                        helperText={riskErrors.description ? 'Description is required' : ''}
                    />
                    <Autocomplete
                        options={severities}
                        value={newRisk.severity}
                        onChange={(_, value) => setNewRisk(prev => ({ ...prev, severity: value }))}
                        renderInput={(params) => (
                            <TextField {...params} label="Severity" variant="outlined" size="small" fullWidth />
                        )}
                    />
                    <TextField
                        label="Risk Owner*"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={newRisk.owner}
                        onChange={(e) => {
                            setNewRisk(prev => ({ ...prev, owner: e.target.value }));
                            if (riskErrors.owner) setRiskErrors(prev => ({ ...prev, owner: false }));
                        }}
                        error={riskErrors.owner}
                        helperText={riskErrors.owner ? 'Owner is required' : ''}
                    />
                    <TextField
                        label="Mitigation Plan"
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        value={newRisk.mitigation}
                        onChange={(e) => setNewRisk(prev => ({ ...prev, mitigation: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRiskDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddRisk} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default TabE;
