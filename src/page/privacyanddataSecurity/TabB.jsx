import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Divider,
    Autocomplete,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const TabB = ({ projectContext = {}, onStatusMessage }) => {
    const [projectCtx, setProjectCtx] = useState({
        project: projectContext?.project || '',
        modelVersion: projectContext?.modelVersion || '',
        endpoint: projectContext?.endpoint || '',
        decisionRole: projectContext?.decisionRole || 'Decision-support',
        sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
    });

    const [formData, setFormData] = useState({
        outputControls: {
            piiMask: true,
            piiBlock: false,
            secretsBlock: true,
            tenantBlock: true,
            docEntitle: true,
            citationsReq: true,
            redactionLogs: true,
        },
        inputControls: {
            promptInject: true,
            exfilDetect: true,
            allowlistTools: true,
            rateLimit: true,
            piiInbound: true,
            dlp: false,
        },
        dataHandling: {
            loggingMode: 'Secure logs (PII removed)',
            retention: '30 days',
            encryption: 'At rest + in transit',
        },
        accessBoundaries: {
            rbac: 'Strict (least privilege)',
            tenantIso: 'Hard isolation (required)',
            adminAccess: 'JIT + approvals',
        },
    });

    useEffect(() => {
        const savedCtx = localStorage.getItem('privacy_projectContext');
        if (savedCtx) {
            try {
                setProjectCtx(JSON.parse(savedCtx));
            } catch (e) {
                console.error('Error loading project context:', e);
            }
        }

        const saved = localStorage.getItem('privacy_tabB_data');
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading TabB data:', e);
            }
        }
    }, []);

    const handleContextChange = (field, value) => {
        setProjectCtx(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem('privacy_projectContext', JSON.stringify(projectCtx));
            if (onStatusMessage) {
                onStatusMessage('✓ Project Context saved successfully');
            }
        } catch (e) {
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
            if (onStatusMessage) {
                onStatusMessage('✓ Demo data reset');
            }
        }
    };

    useEffect(() => {
        const savedCtx = localStorage.getItem('privacy_projectContext');
        if (savedCtx) {
            try {
                setProjectCtx(JSON.parse(savedCtx));
            } catch (e) {
                console.error('Error loading project context:', e);
            }
        }

        const saved = localStorage.getItem('privacy_tabB_data');
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading TabB data:', e);
            }
        }
    }, []);

    const handleSave = () => {
        try {
            localStorage.setItem('privacy_tabB_data', JSON.stringify(formData));
            if (onStatusMessage) {
                onStatusMessage('✓ Tab B saved successfully');
            }
        } catch (e) {
            if (onStatusMessage) {
                onStatusMessage('✗ Error saving data');
            }
        }
    };

    const handleCheckboxChange = (section, field) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: !prev[section][field] }
        }));
    };

    const handleSelectChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const loadSample = () => {
        const sampleData = {
            outputControls: {
                piiMask: true,
                piiBlock: false,
                secretsBlock: true,
                tenantBlock: true,
                docEntitle: true,
                citationsReq: true,
                redactionLogs: true,
            },
            inputControls: {
                promptInject: true,
                exfilDetect: true,
                allowlistTools: true,
                rateLimit: true,
                piiInbound: true,
                dlp: false,
            },
            dataHandling: {
                loggingMode: 'Secure logs (PII removed)',
                retention: '30 days',
                encryption: 'At rest + in transit',
            },
            accessBoundaries: {
                rbac: 'Strict (least privilege)',
                tenantIso: 'Hard isolation (required)',
                adminAccess: 'JIT + approvals',
            },
        };
        setFormData(sampleData);
        if (onStatusMessage) {
            onStatusMessage('✓ Sample data loaded');
        }
    };

    const loggingModeOptions = [
        'Secure logs (PII removed)',
        'Full logs (restricted)',
        'No content logs (metadata only)',
    ];

    const retentionOptions = [
        '7 days',
        '30 days',
        '90 days',
        'Custom',
    ];

    const encryptionOptions = [
        'At rest + in transit',
        'At rest only',
        'In transit only',
    ];

    const rbacOptions = [
        'Strict (least privilege)',
        'Standard',
        'Relaxed (not recommended)',
    ];

    const tenantIsoOptions = [
        'Hard isolation (required)',
        'Soft isolation',
    ];

    const adminAccessOptions = [
        'JIT + approvals',
        'Always-on (not recommended)',
    ];

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* LEFT PANEL: PROJECT CONTEXT */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Card elevation={0}
                    sx={{ position: 'sticky', top: 20 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Project Context
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* Project & Model */}
                        <TextField
                            fullWidth
                            size="small"
                            label="Project"
                            value={projectCtx.project}
                            onChange={(e) => handleContextChange('project', e.target.value)}
                            placeholder="e.g., Carrier A — UW Copilot"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Model Version"
                            value={projectCtx.modelVersion}
                            onChange={(e) => handleContextChange('modelVersion', e.target.value)}
                            placeholder="e.g., v1.2.0"
                            sx={{ mb: 2 }}
                        />

                        {/* Endpoint & Decision Role */}
                        <TextField
                            fullWidth
                            size="small"
                            label="Endpoint"
                            value={projectCtx.endpoint}
                            onChange={(e) => handleContextChange('endpoint', e.target.value)}
                            placeholder="e.g., /uw/assistant"
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Decision Role</InputLabel>
                            <Select
                                value={projectCtx.decisionRole}
                                onChange={(e) => handleContextChange('decisionRole', e.target.value)}
                                label="Decision Role"
                                size="small"
                            >
                                <MenuItem value="Advisory only">Advisory only</MenuItem>
                                <MenuItem value="Decision-support">Decision-support</MenuItem>
                                <MenuItem value="Automated (restricted)">Automated (restricted)</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Data Sensitivity & Hosting */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Data Sensitivity Tier</InputLabel>
                            <Select
                                value={projectCtx.sensitivity}
                                onChange={(e) => handleContextChange('sensitivity', e.target.value)}
                                label="Data Sensitivity Tier"
                                size="small"
                            >
                                <MenuItem value="Tier 1 — Public / Low sensitivity">Tier 1 — Public / Low sensitivity</MenuItem>
                                <MenuItem value="Tier 2 — Internal">Tier 2 — Internal</MenuItem>
                                <MenuItem value="Tier 3 — Confidential">Tier 3 — Confidential</MenuItem>
                                <MenuItem value="Tier 4 — Regulated (PII/PHI/PCI)">Tier 4 — Regulated (PII/PHI/PCI)</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Hosting Boundary</InputLabel>
                            <Select
                                value={projectCtx.hostingBoundary}
                                onChange={(e) => handleContextChange('hostingBoundary', e.target.value)}
                                label="Hosting Boundary"
                                size="small"
                            >
                                <MenuItem value="Client VPC/VNet (Private)">Client VPC/VNet (Private)</MenuItem>
                                <MenuItem value="Enkefalos managed (Dedicated)">Enkefalos managed (Dedicated)</MenuItem>
                                <MenuItem value="Hybrid">Hybrid</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                size="small"
                                onClick={handleResetDemo}
                                sx={{ fontWeight: 600 }}
                            >
                                Reset Demo
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveContext}
                                sx={{ fontWeight: 600 }}
                            >
                                Save
                            </Button>
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.6 }}>
                            Data persists locally (browser localStorage) for demo realism.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* RIGHT PANEL: TAB B CONTENT */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{
                    p: 0,
                    border: "1px solid rgba(117, 117, 117, 0.2)",
                    borderRadius: "8px",
                    padding: "16px",
                }}>
                    {/* Header Section */}
                    <Box sx={{
                        mb: 2, pb: 0,
                    }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                🛡️ B. Coverage (Controls You Promise to Enforce)
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                            Select which privacy/security controls are mandatory. We avoid free-text: each control is a concrete switch that maps to Guardian + platform configuration.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={loadSample}
                                sx={{ borderRadius: 1, fontWeight: 600 }}
                            >
                                📄 Load Sample
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                sx={{ borderRadius: 1, fontWeight: 600 }}
                            >
                                Save Coverage
                            </Button>
                        </Box>
                    </Box>

                    {/* Output and Input Controls */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1a1a1a', display: 'flex', gap: 1 }}>
                                        📤 Output Controls
                                    </Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.outputControls.piiMask} onChange={() => handleCheckboxChange('outputControls', 'piiMask')} />}
                                            label="PII masking"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.outputControls.piiBlock} onChange={() => handleCheckboxChange('outputControls', 'piiBlock')} />}
                                            label="PII hard-block (deny response)"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.outputControls.secretsBlock} onChange={() => handleCheckboxChange('outputControls', 'secretsBlock')} />}
                                            label="Secrets detection + block"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.outputControls.tenantBlock} onChange={() => handleCheckboxChange('outputControls', 'tenantBlock')} />}
                                            label="Cross-tenant leakage block"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.outputControls.docEntitle} onChange={() => handleCheckboxChange('outputControls', 'docEntitle')} />}
                                            label="Document entitlement checks (RBAC)"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.outputControls.citationsReq} onChange={() => handleCheckboxChange('outputControls', 'citationsReq')} />}
                                            label="Require citations for doc answers"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.outputControls.redactionLogs} onChange={() => handleCheckboxChange('outputControls', 'redactionLogs')} />}
                                            label="Redaction logging (what was masked)"

                                        />
                                    </FormGroup>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1a1a1a', display: 'flex', gap: 1 }}>
                                        📥 Input Controls
                                    </Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.inputControls.promptInject} onChange={() => handleCheckboxChange('inputControls', 'promptInject')} />}
                                            label="Prompt injection detection"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.inputControls.exfilDetect} onChange={() => handleCheckboxChange('inputControls', 'exfilDetect')} />}
                                            label="Data exfiltration intent detection"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.inputControls.allowlistTools} onChange={() => handleCheckboxChange('inputControls', 'allowlistTools')} />}
                                            label="Tool/function allowlisting"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.inputControls.rateLimit} onChange={() => handleCheckboxChange('inputControls', 'rateLimit')} />}
                                            label="Rate limiting (abuse)"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.inputControls.piiInbound} onChange={() => handleCheckboxChange('inputControls', 'piiInbound')} />}
                                            label="Inbound PII detection (user input)"

                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData.inputControls.dlp} onChange={() => handleCheckboxChange('inputControls', 'dlp')} />}
                                            label="DLP integration (optional)"

                                        />
                                    </FormGroup>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Data Handling and Access Boundaries */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1a1a1a', display: 'flex', gap: 1 }}>
                                        💾 Data Handling
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        <Grid size={{ xs: 12 }}>
                                            <Autocomplete
                                                value={formData.dataHandling.loggingMode}
                                                onChange={(e, newValue) => handleSelectChange('dataHandling', 'loggingMode', newValue || '')}
                                                options={loggingModeOptions}
                                                freeSolo
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Logging Mode"
                                                        placeholder="Select or type..."
                                                        size="small"
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <span>
                                                            {option.includes('PII removed') ? '🔒' : option.includes('restricted') ? '📋' : '🔐'}
                                                        </span>
                                                        <span>{option}</span>
                                                    </Box>
                                                )}
                                                sx={{ '& .MuiAutocomplete-paper': { maxHeight: '250px' } }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Autocomplete
                                                value={formData.dataHandling.retention}
                                                onChange={(e, newValue) => handleSelectChange('dataHandling', 'retention', newValue || '')}
                                                options={retentionOptions}
                                                freeSolo
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Retention"
                                                        placeholder="Select or type..."
                                                        size="small"
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <span>
                                                            {option.includes('7') ? '⏱️' : option.includes('30') ? '📅' : option.includes('90') ? '📆' : '⚙️'}
                                                        </span>
                                                        <span>{option}</span>
                                                    </Box>
                                                )}
                                                sx={{ '& .MuiAutocomplete-paper': { maxHeight: '250px' } }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Autocomplete
                                                value={formData.dataHandling.encryption}
                                                onChange={(e, newValue) => handleSelectChange('dataHandling', 'encryption', newValue || '')}
                                                options={encryptionOptions}
                                                freeSolo
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Encryption"
                                                        placeholder="Select or type..."
                                                        size="small"
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <span>
                                                            {option.includes('rest + in transit') ? '🔐' : option.includes('rest') ? '🔒' : '🔑'}
                                                        </span>
                                                        <span>{option}</span>
                                                    </Box>
                                                )}
                                                sx={{ '& .MuiAutocomplete-paper': { maxHeight: '250px' } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1a1a1a', display: 'flex', gap: 1 }}>
                                        🔐 Access Boundaries
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        <Grid size={{ xs: 12 }}>
                                            <Autocomplete
                                                value={formData.accessBoundaries.rbac}
                                                onChange={(e, newValue) => handleSelectChange('accessBoundaries', 'rbac', newValue || '')}
                                                options={rbacOptions}
                                                freeSolo
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="RBAC Mode"
                                                        placeholder="Select or type..."
                                                        size="small"
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <span>
                                                            {option.includes('Strict') ? '🛡️' : option.includes('Standard') ? '📌' : '⚠️'}
                                                        </span>
                                                        <span>{option}</span>
                                                    </Box>
                                                )}
                                                sx={{ '& .MuiAutocomplete-paper': { maxHeight: '250px' } }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Autocomplete
                                                value={formData.accessBoundaries.tenantIso}
                                                onChange={(e, newValue) => handleSelectChange('accessBoundaries', 'tenantIso', newValue || '')}
                                                options={tenantIsoOptions}
                                                freeSolo
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Tenant Isolation"
                                                        placeholder="Select or type..."
                                                        size="small"
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <span>
                                                            {option.includes('Hard') ? '🔒' : '🔓'}
                                                        </span>
                                                        <span>{option}</span>
                                                    </Box>
                                                )}
                                                sx={{ '& .MuiAutocomplete-paper': { maxHeight: '250px' } }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Autocomplete
                                                value={formData.accessBoundaries.adminAccess}
                                                onChange={(e, newValue) => handleSelectChange('accessBoundaries', 'adminAccess', newValue || '')}
                                                options={adminAccessOptions}
                                                freeSolo
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Admin Access"
                                                        placeholder="Select or type..."
                                                        size="small"
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <span>
                                                            {option.includes('JIT') ? '✅' : '⚠️'}
                                                        </span>
                                                        <span>{option}</span>
                                                    </Box>
                                                )}
                                                sx={{ '& .MuiAutocomplete-paper': { maxHeight: '250px' } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Callout */}
                    <Card sx={{
                        border: '1px solid rgba(117, 117, 117, 0.2)',
                        borderRadius: 2,
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Typography sx={{ fontSize: '1.5rem', mt: 0.5 }}>📝</Typography>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: '#0c4a6e' }}>
                                        Release Gate Requirements
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#0c4a6e', lineHeight: 1.6 }}>
                                        Coverage drives your Release Gate. If any mandatory switches are OFF (e.g., tenant isolation, PII control, prompt-injection), Release Gate remains BLOCKED.
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );
};

export default TabB;
