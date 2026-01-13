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
import RefreshIcon from '@mui/icons-material/Refresh';

const TabA = ({ projectContext = {}, onStatusMessage }) => {
    const [projectCtx, setProjectCtx] = useState({
        project: projectContext?.project || '',
        modelVersion: projectContext?.modelVersion || '',
        endpoint: projectContext?.endpoint || '',
        decisionRole: projectContext?.decisionRole || 'Decision-support',
        sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
    });

    const [formData, setFormData] = useState({
        privacyPromise: 'No PII is stored or exposed in outputs',
        securityOwner: '',
        privacyOwner: '',
        dataTypes: {
            pii: true,
            phi: false,
            pci: false,
            secrets: true,
            policyData: true,
            internalDocs: true,
            customerChats: false,
        },
        leakageCategory: 'Model reveals PII in response to unauthorized prompt',
        leakageSeverity: 'Critical (blocks release)',
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

        const saved = localStorage.getItem('privacy_tabA_data');
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading TabA data:', e);
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
            setFormData({
                privacyPromise: 'No PII is stored or exposed in outputs',
                securityOwner: '',
                privacyOwner: '',
                dataTypes: {
                    pii: true,
                    phi: false,
                    pci: false,
                    secrets: true,
                    policyData: true,
                    internalDocs: true,
                    customerChats: false,
                },
                leakageCategory: 'Model reveals PII in response to unauthorized prompt',
                leakageSeverity: 'Critical (blocks release)',
            });
            if (onStatusMessage) {
                onStatusMessage('✓ Demo data reset');
            }
        }
    };

    const handleSave = () => {
        try {
            localStorage.setItem('privacy_tabA_data', JSON.stringify(formData));
            if (onStatusMessage) {
                onStatusMessage('✓ Tab A saved successfully');
            }
        } catch (e) {
            if (onStatusMessage) {
                onStatusMessage('✗ Error saving data');
            }
        }
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field) => {
        setFormData(prev => ({
            ...prev,
            dataTypes: { ...prev.dataTypes, [field]: !prev.dataTypes[field] }
        }));
    };

    const loadSample = () => {
        const sampleData = {
            privacyPromise: 'No PII is stored or exposed in outputs',
            securityOwner: 'CISO / Security Lead',
            privacyOwner: 'Privacy Officer / DPO',
            dataTypes: {
                pii: true,
                phi: false,
                pci: false,
                secrets: true,
                policyData: true,
                internalDocs: true,
                customerChats: false,
            },
            leakageCategory: 'Model reveals PII in response to unauthorized prompt',
            leakageSeverity: 'Critical (blocks release)',
        };
        setFormData(sampleData);
        if (onStatusMessage) {
            onStatusMessage('✓ Sample data loaded');
        }
    };

    const securityOwnerOptions = [
        'CISO / Security Lead',
        'Head of Platform Engineering',
        'Head of Data Science',
        'Responsible AI Officer',
    ];

    const privacyOwnerOptions = [
        'Privacy Officer / DPO',
        'Legal Counsel',
        'Compliance Lead',
        'Responsible AI Officer',
    ];

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* LEFT PANEL: PROJECT CONTEXT */}
            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
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

            {/* RIGHT PANEL: TAB A CONTENT */}
            <Grid size={{ xs: 12, md: 8, lg: 8 }}>
                <Box sx={{
                    p: 0,
                    border: "1px solid rgba(117, 117, 117, 0.2)",
                    borderRadius: "8px",
                    padding: "16px",

                }}>
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            A. Privacy Objective &amp; Security Ownership
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Set the privacy promise, define what must never happen (leakage), and assign accountable owners. Missing owners can block release for regulated data use cases.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="outlined" size="small" onClick={loadSample}>
                                Load Sample
                            </Button>
                            <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                                Save A
                            </Button>
                        </Box>
                    </Box>

                    {/* Grid 3 Section - Privacy Promise & Owners */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Autocomplete
                                value={formData.privacyPromise}
                                onChange={(e, newValue) => handleFieldChange('privacyPromise', newValue || '')}
                                options={[
                                    'No PII is stored or exposed in outputs',
                                    'PII is masked in outputs; allowed only with explicit authorization',
                                    'PII may appear for internal users (role-based) with full logging'
                                ]}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Privacy Promise (User-facing)"
                                        placeholder="Select or type..."
                                        size="small"
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '1.2rem' }}>
                                            {option.includes('exposed') ? '🔒' : option.includes('masked') ? '🔐' : '📝'}
                                        </span>
                                        <span>{option}</span>
                                    </Box>
                                )}
                                sx={{ '& .MuiAutocomplete-paper': { maxHeight: '300px' } }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                💡 This becomes part of your audit narrative and can drive disclaimers and UI messaging.
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Autocomplete
                                value={formData.securityOwner}
                                onChange={(e, newValue) => handleFieldChange('securityOwner', newValue || '')}
                                options={securityOwnerOptions}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Security Owner (Accountable)"
                                        placeholder="Search or select..."
                                        size="small"
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <span>👨‍💼</span>
                                        <span>{option}</span>
                                    </Box>
                                )}
                                noOptionsText="No security owners found"
                            />

                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Autocomplete
                                value={formData.privacyOwner}
                                onChange={(e, newValue) => handleFieldChange('privacyOwner', newValue || '')}
                                options={privacyOwnerOptions}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Privacy Owner (Accountable)"
                                        placeholder="Search or select..."
                                        size="small"
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <span>👨‍⚖️</span>
                                        <span>{option}</span>
                                    </Box>
                                )}
                                noOptionsText="No privacy owners found"
                            />

                        </Grid>
                    </Grid>

                    {/* Grid 2 Section - Data Types & Leakage Definition */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Data Types In Scope (check)
                                    </Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={formData?.dataTypes?.pii} onChange={() => handleCheckboxChange('pii')} />}
                                            label="PII (names, SSN, address)"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData?.dataTypes?.phi} onChange={() => handleCheckboxChange('phi')} />}
                                            label="PHI (health info)"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData?.dataTypes?.pci} onChange={() => handleCheckboxChange('pci')} />}
                                            label="PCI (card data)"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData?.dataTypes?.secrets} onChange={() => handleCheckboxChange('secrets')} />}
                                            label="Secrets (keys/tokens)"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData?.dataTypes?.policyData} onChange={() => handleCheckboxChange('policyData')} />}
                                            label="Policy / Claims Documents"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData?.dataTypes?.internalDocs} onChange={() => handleCheckboxChange('internalDocs')} />}
                                            label="Internal SOP / Guidelines"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={formData?.dataTypes?.customerChats} onChange={() => handleCheckboxChange('customerChats')} />}
                                            label="Customer chat transcripts"
                                        />
                                    </FormGroup>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        What Must Never Happen (Leakage Definition)
                                    </Typography>
                                    <Autocomplete
                                        value={formData.leakageCategory}
                                        onChange={(e, newValue) => handleFieldChange('leakageCategory', newValue || '')}
                                        options={[
                                            'Model reveals PII in response to unauthorized prompt',
                                            'Model outputs secrets (API keys/tokens)',
                                            'Model exposes data from another customer/tenant',
                                            'Model reveals internal confidential docs without entitlement'
                                        ]}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Leakage Category"
                                                placeholder="Search or select..."
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                                <span style={{ fontSize: '1.1rem' }}>
                                                    {option.includes('PII') ? '🔓' : option.includes('secrets') ? '🔑' : option.includes('customer') ? '🏢' : '📄'}
                                                </span>
                                                <span>{option}</span>
                                            </Box>
                                        )}
                                        noOptionsText="No leakage categories found"
                                    />
                                    <Autocomplete
                                        value={formData.leakageSeverity}
                                        onChange={(e, newValue) => handleFieldChange('leakageSeverity', newValue || '')}
                                        options={[
                                            'Critical (blocks release)',
                                            'High',
                                            'Medium'
                                        ]}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Severity if happens"
                                                placeholder="Select severity level..."
                                                size="small"
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <Box {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <span>
                                                    {option.includes('Critical') ? '🔴' : option.includes('High') ? '🟠' : '🟡'}
                                                </span>
                                                <span>{option}</span>
                                            </Box>
                                        )}
                                        noOptionsText="No severity levels found"
                                    />
                                    {formData.leakageSeverity && (
                                        <Box sx={{ mt: 2, p: 1.5, bgcolor: formData.leakageSeverity.includes('Critical') ? '#fee2e2' : formData.leakageSeverity.includes('High') ? '#fef3c7' : '#fef3c7', borderRadius: 1, borderLeft: `4px solid ${formData.leakageSeverity.includes('Critical') ? '#dc2626' : formData.leakageSeverity.includes('High') ? '#f59e0b' : '#eab308'}` }}>
                                            <Typography variant="caption" sx={{ fontWeight: 600, color: formData.leakageSeverity.includes('Critical') ? '#7f1d1d' : formData.leakageSeverity.includes('High') ? '#78350f' : '#713f12' }}>
                                                ⚠️ Severity: {formData.leakageSeverity}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Callout */}
                    <Card sx={{
                        mt: 0,
                        bgcolor: '#e3f2fd',
                        //   borderColor: '#1976d2',
                        // border: 1
                    }}>
                        <CardContent>
                            <Typography variant="body2">
                                This section becomes the "Privacy Contract" for the model version. It drives Guardian policy pack defaults and Release Gate requirements.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid >
    );
};

export default TabA;
