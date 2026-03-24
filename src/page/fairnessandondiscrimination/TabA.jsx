import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    Alert,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Autocomplete, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const STORAGE_KEY = 'TabA_DemoData';

const LOCKED_DEFAULT_TYPES = new Set(['Age', 'Gender', 'Location']);

const defaultGroupRows = [
    { type: 'Age', name: 'Age Band', included: 'Yes', justification: 'Pricing sensitivity / compliance review', locked: true },
    { type: 'Gender', name: 'Gender', included: 'Yes', justification: 'Regulatory fairness requirement', locked: true },
    { type: 'Location', name: 'Zip Code', included: 'No', justification: 'Proxy risk; assess separately', locked: true },
];

const ensureDefaultRows = (rows) => {
    const seen = new Set(rows.map(r => r.type));
    const merged = [...rows];
    defaultGroupRows.forEach((def) => {
        if (!seen.has(def.type)) {
            merged.unshift({ ...def });
        }
    });
    return merged;
};

const defaultFormData = {
    useCase: 'Underwriting Assistant – Eligibility & Risk Notes',
    fairnessGoal: '',
    businessRationale: '',
    jurisdiction: '',
    scopeNotes: '',
    regulations: [],
};

const TabA = () => {
    const [groupRows, setGroupRows] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const loadedRows = (parsed.groupRows || defaultGroupRows).map((row) => ({
                    ...row,
                    locked: !!row.locked || LOCKED_DEFAULT_TYPES.has(row.type),
                }));
                return ensureDefaultRows(loadedRows);
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return defaultGroupRows;
    });

    const [formData, setFormData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.formData || defaultFormData;
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return defaultFormData;
    });

    const [uploadedFiles, setUploadedFiles] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.uploadedFiles || { workshop: [], legal: [] };
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return { workshop: [], legal: [] };
    });

    const [validationMsg, setValidationMsg] = useState('');

    // Fairness goal options for autocomplete
    const fairnessGoalOptions = [
        'Demographic Parity',
        'Equal Opportunity',
        'Equalized Odds',
        'Predictive Parity',
        'Other',
    ];

    // Jurisdiction options for autocomplete
    const jurisdictionOptions = [
        'USA – Multi-state',
        'USA – California',
        'USA – New York',
        'UK',
        'EU',
        'Australia',
        'Other',
    ];

    // KPI configuration for reusable dashboard
    const kpiConfig = [
        {
            id: 'A.1',
            label: 'A.1 Objectives',
            status: formData.fairnessGoal && formData.businessRationale ? 'Complete' : 'Missing',
            description: 'Required for Baseline gate.',
        },
        {
            id: 'A.2',
            label: 'A.2 Impacted Groups',
            status: groupRows.length > 0 ? 'Complete' : 'Missing',
            description: 'Table must validate; exclusions need justification.',

        },
        {
            id: 'A.3',
            label: 'A.3 Regulatory Context',
            status: formData.regulations.length > 0 ? 'Complete' : 'Partial',
            description: 'Select frameworks for audit mapping.',

        },
    ];

    // Persist data to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                groupRows,
                formData,
                uploadedFiles,
            }));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [groupRows, formData, uploadedFiles]);

    const resetAll = () => {
        if (window.confirm('Are you sure you want to reset all demo data? This action cannot be undone.')) {
            setGroupRows(defaultGroupRows);
            setFormData(defaultFormData);
            setUploadedFiles({ workshop: [], legal: [] });
            setValidationMsg('');
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (e) {
                console.error('Failed to clear localStorage:', e);
            }
            alert('Demo data has been reset to defaults.');
        }
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegulationChange = (event) => {
        const { value, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            regulations: checked
                ? [...prev.regulations, value]
                : prev.regulations.filter(r => r !== value),
        }));
    };

    const addGroupRow = () => {
        setGroupRows([...groupRows, { type: '', name: '', included: 'Yes', justification: '', locked: false }]);
    };

    const removeGroupRow = (index) => {
        if (groupRows[index]?.locked) {
            return;
        }
        setGroupRows(groupRows.filter((_, i) => i !== index));
    };

    const updateGroupRow = (index, field, value) => {
        const updated = [...groupRows];
        const nextRow = {
            ...updated[index],
            [field]: value,
        };
        nextRow.locked = nextRow.locked || LOCKED_DEFAULT_TYPES.has(nextRow.type);
        updated[index] = nextRow;
        setGroupRows(updated);
    };

    const validateA2 = () => {
        const errors = [];
        groupRows.forEach((row, idx) => {
            if (!row.type) errors.push(`Row ${idx + 1}: Attribute Type is required`);
            if (!row.name) errors.push(`Row ${idx + 1}: Attribute Name is required`);
            if (row.included === 'No' && !row.justification) {
                errors.push(`Row ${idx + 1}: Justification required when excluded`);
            }
        });
        if (errors.length > 0) {
            setValidationMsg(`❌ Validation failed:\n${errors.join('\n')}`);
            return false;
        } else {
            setValidationMsg('✓ Table validation passed!');
            return true;
        }
    };

    const saveA1 = () => {
        if (!formData.fairnessGoal || !formData.businessRationale) {
            alert('Please fill in all required fields (Fairness Goal, Business Rationale)');
            return;
        }
        alert('A.1 Objectives saved successfully');
    };

    const saveA2 = () => {
        if (validateA2()) {
            alert('A.2 Impacted Groups saved successfully');
        }
    };

    const handleFileUpload = (type, files) => {
        if (files && files[0]) {
            const file = files[0];
            setUploadedFiles(prev => ({
                ...prev,
                [type]: [...prev[type], { name: file.name, size: file.size }],
            }));
        }
    };

    const downloadTemplate = (filename) => {
        alert(`Downloading: ${filename}`);
    };

    const renderKPIBadge = (status) => {
        const colorMap = {
            'Missing': 'error',
            'Partial': 'warning',
            'Complete': 'success',
        };
        return (
            <Chip
                label={status}
                size="small"
                sx={{
                    bgcolor: colorMap[status] ? `${colorMap[status]}.light` : undefined,
                    color: colorMap[status] ? `${colorMap[status]}.dark` : undefined,
                    fontWeight: 600,
                }}
            />
        );
    };

    return (
        <Box sx={{ p: 2 }}>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                A. Objectives & Scope

            </Typography>
            <Typography variant="body2"
                color="text.secondary" sx={{ mb: 2 }}>
                Define what “fairness” means for this use case and document impacted groups.
            </Typography>
            {/* KPI Dashboard - Reusable */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns:
                {
                    xs: '1fr', sm: '1fr 1fr 1fr',
                    lg: '1fr 1fr 1fr'
                },
                gap: 2, mb: 3, mt: 1
            }}>
                {kpiConfig.map((kpi) => (
                    <Card key={kpi.id}
                        variant="outlined">
                        <CardContent p={2} pb={2}>
                            <Typography variant="caption" color="text.secondary">
                                {kpi.label}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                {renderKPIBadge(kpi.status)}
                                {kpi.count > 0 && (
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                        ({kpi.count})
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="caption"
                                sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                                {kpi.description}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* A.1 Section */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        A.1 Fairness Objective Definition
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{
                            xs: 12,
                            sm: 12, md: 6
                        }}
                        >
                            <TextField
                                fullWidth
                                label="Use Case (auto from project)"
                                value={formData.useCase}
                                disabled
                                size="small"
                            />
                        </Grid>
                        <Grid size={{
                            xs: 12, sm: 12,
                            md: 6
                        }}>
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={jurisdictionOptions}
                                value={formData.jurisdiction || null}
                                onChange={(event, newValue) => handleFormChange('jurisdiction', newValue || '')}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Jurisdiction / Market"
                                        variant="outlined"
                                    />
                                )}
                                noOptionsText="No options"
                                clearIcon={null}
                                slotProps={{
                                    paper: {
                                        sx: { mt: 1 }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{
                            xs: 12,
                            sm: 12, md: 6
                        }}>
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={fairnessGoalOptions}
                                value={formData.fairnessGoal || null}
                                onChange={(event, newValue) => handleFormChange('fairnessGoal', newValue || '')}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Primary Fairness Goal (required)"
                                        variant="outlined"
                                    />
                                )}
                                noOptionsText="No options"
                                clearIcon={null}
                                slotProps={{
                                    paper: {
                                        sx: { mt: 1 }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{
                            xs: 12, sm: 12,
                            md: 6
                        }}>
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel>Regulatory / Policy Context</FormLabel>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr', gap: 1, mt: 0
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.regulations.includes('NAIC')}
                                                onChange={handleRegulationChange}
                                                value="NAIC"
                                            />
                                        }
                                        label="NAIC"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.regulations.includes('State DOI')}
                                                onChange={handleRegulationChange}
                                                value="State DOI"
                                            />
                                        }
                                        label="State DOI"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.regulations.includes('EU AI Act')}
                                                onChange={handleRegulationChange}
                                                value="EU AI Act"
                                            />
                                        }
                                        label="EU AI Act"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.regulations.includes('Internal Policy')}
                                                onChange={handleRegulationChange}
                                                value="Internal Policy"
                                            />
                                        }
                                        label="Internal Policy"
                                    />
                                </Box>
                            </FormControl>
                        </Grid>
                        <Grid size={{
                            xs: 12, sm: 12,
                            md: 6
                        }}>
                            <TextField
                                fullWidth
                                label="Business Rationale (required)"
                                placeholder="Why is fairness required? What harm are we preventing?"
                                multiline
                                rows={4}
                                value={formData.businessRationale}
                                onChange={(e) => handleFormChange('businessRationale', e.target.value)}
                                size="small"
                            />
                        </Grid>
                        <Grid size={{
                            xs: 12, sm: 12,
                            md: 6
                        }}>
                            <TextField
                                fullWidth
                                label="Scope Notes (optional)"
                                placeholder="Constraints, exclusions, internal governance notes"
                                multiline
                                rows={4}
                                value={formData.scopeNotes}
                                onChange={(e) => handleFormChange('scopeNotes', e.target.value)}
                                size="small"
                            />
                        </Grid>






                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                        <Button variant="contained" onClick={saveA1}>
                            Save Objectives
                        </Button>
                        
                        <Button variant="outlined" 
                        onClick={() => downloadTemplate('Fairness_Objectives_Template.docx')}>
                            <DownloadIcon sx={{ mr: 1 }} /> Download  Objectives Template
                        </Button>
                    </Box>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        If you're unsure which fairness goal to start with, pick "Demographic Parity" and refine during Release Readiness.
                    </Alert>
                </CardContent>
            </Card>

            {/* A.2 Section */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        A.2 Impacted Demographic Groups (Editable Table)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Define protected/sensitive attributes. Exclusions require a justification to manage proxy risk.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={addGroupRow}>
                            Add Attribute
                        </Button>
                        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => downloadTemplate('groups.csv')}>
                            Download CSV Template
                        </Button>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                        >
                            Import CSV
                            <input
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={(e) => handleFileUpload('csv', e.target.files)}
                            />
                        </Button>
                    </Box>

                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Attribute Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Attribute Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Included?</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Justification (required if excluded)</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: 100 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {groupRows.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                value={row.type}
                                                onChange={(e) => updateGroupRow(idx, 'type', e.target.value)}
                                                variant="outlined"
                                                sx={{ width: '100%' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                value={row.name}
                                                onChange={(e) => updateGroupRow(idx, 'name', e.target.value)}
                                                variant="outlined"
                                                sx={{ width: '100%' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                size="small"
                                                value={row.included}
                                                onChange={(e) => updateGroupRow(idx, 'included', e.target.value)}
                                                sx={{ width: '100%' }}
                                            >
                                                <MenuItem value="Yes">Yes</MenuItem>
                                                <MenuItem value="No">No</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                value={row.justification}
                                                onChange={(e) => updateGroupRow(idx, 'justification', e.target.value)}
                                                placeholder="Required if excluded"
                                                variant="outlined"
                                                sx={{ width: '100%' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title={row.locked ? "Default attribute cannot be deleted" : "Delete"}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeGroupRow(idx)}
                                                        disabled={row.locked}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                        <Button variant="contained" onClick={saveA2}>
                            Save Impacted Groups
                        </Button>
                        <Button variant="outlined" onClick={() => validateA2()}>
                            Validate Table
                        </Button>
                    </Box>

                    {validationMsg && (
                        <Alert severity={validationMsg.includes('✓') ? 'success' : 'error'} sx={{ mt: 2 }}>
                            {validationMsg}
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* A.3 Section */}
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        A.3 Evidence Upload (Workshop + Legal)
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Upload Workshop Notes / Minutes
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    Accepted: PDF, DOCX, TXT
                                </Typography>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    fullWidth
                                    sx={{ mb: 1 }}
                                >
                                    Choose File
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        hidden
                                        onChange={(e) => handleFileUpload('workshop', e.target.files)}
                                    />
                                </Button>
                                <List dense>
                                    {uploadedFiles.workshop.map((file, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ p: 2, height: "100%", bgcolor: 'grey.50' }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Upload Legal / Compliance Notes
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    Accepted: PDF, DOCX, TXT
                                </Typography>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    fullWidth
                                    sx={{ mb: 1 }}
                                >
                                    Choose File
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        hidden
                                        onChange={(e) => handleFileUpload('legal', e.target.files)}
                                    />
                                </Button>
                                <List dense>
                                    {uploadedFiles.legal.map((file, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Demo Data Note & Reset Section */}
            <Card variant="outlined" sx={{ mt: 3, bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
                <CardContent sx={{ pb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                v1 note:
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                This file stores state in localStorage for demo purposes. Replace with GenAI Foundry backend APIs for enterprise deployments.
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={resetAll}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            Reset Demo Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>

        </Box>
    );
};

export default TabA;
