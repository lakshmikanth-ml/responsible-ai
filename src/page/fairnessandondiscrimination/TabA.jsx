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
        const colorConfig = {
            'Missing': { 
                light: { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' },
                dark: { bg: 'rgba(244, 67, 54, 0.16)', color: '#ef5350', border: 'rgba(244, 67, 54, 0.32)' }
            },
            'Partial': { 
                light: { bg: '#fff8e1', color: '#f57c00', border: '#ffcc02' },
                dark: { bg: 'rgba(255, 152, 0, 0.16)', color: '#ffb74d', border: 'rgba(255, 152, 0, 0.32)' }
            },
            'Complete': { 
                light: { bg: '#e8f5e8', color: '#2e7d32', border: '#81c784' },
                dark: { bg: 'rgba(76, 175, 80, 0.16)', color: '#81c784', border: 'rgba(76, 175, 80, 0.32)' }
            },
        };

        const config = colorConfig[status];
        if (!config) {
            return (
                <Chip
                    label={status}
                    size="small"
                    sx={{
                        bgcolor: 'grey.100',
                        color: 'grey.700',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: 'grey.300',
                    }}
                />
            );
        }

        return (
            <Chip
                label={status}
                size="small"
                sx={{
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? config.dark.bg : config.light.bg,
                    color: (theme) => theme.palette.mode === 'dark' ? config.dark.color : config.light.color,
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark' ? config.dark.border : config.light.border,
                    '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? config.dark.bg : config.light.bg,
                        opacity: 0.8,
                    },
                }}
            />
        );
    };

    return (
        <Box sx={{ px:0,pt:0 }}>

            <Typography variant="h6"
             gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                A. Objectives & Scope

            </Typography>
            <Typography variant="body2"
                sx={{ mb: 2 }}>
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
                gap: 2, mb: 2, mt: 1
            }}>
                {kpiConfig.map((kpi) => (
                    <Card 
                        key={kpi.id}
                        variant="outlined"
                        sx={{
                            transition: 'all 0.2s ease-in-out',
                            // '&:hover': {
                            //     transform: 'translateY(-2px)',
                            //     boxShadow: (theme) => theme.palette.mode === 'dark' 
                            //         ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                            //         : '0 4px 20px rgba(0, 0, 0, 0.12)',
                            //     borderColor: (theme) => theme.palette.mode === 'dark' 
                            //         ? 'rgba(255, 255, 255, 0.12)' 
                            //         : 'rgba(0, 0, 0, 0.12)',
                            // },
                            bgcolor: (theme) => theme.palette.mode === 'dark' 
                                ? 'background.paper' 
                                : '#ffffff',
                            borderColor: (theme) => theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.08)' 
                                : 'rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <CardContent sx={{ p: 2, pb: '16px !important' }}>
                            <Typography 
                                variant="caption" 
                               
                                sx={{ 
                                    fontWeight: 500,
                                    fontSize: '0.75rem',
                                   
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {kpi.label}
                            </Typography>
                            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                {renderKPIBadge(kpi.status)}
                                {kpi.count > 0 && (
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            fontWeight: 600, 
                                            color: 'primary.main',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        ({kpi.count})
                                    </Typography>
                                )}
                            </Box>
                            <Typography 
                                variant="caption"
                                sx={{ 
                                    mt: 1.5, 
                                    display: 'block', 
                                    
                                    fontSize: '0.7rem',
                                    lineHeight: 1.4,
                                }}
                            >
                                {kpi.description}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* A.1 Section */}
            <Card variant="outlined" sx={{ mb: 2 }}>
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
                                // slotProps={{
                                //     paper: {
                                //         sx: { mt: 0 }
                                //     }
                                // }}
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
                                        sx: { mt: 0 }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{
                            xs: 12, sm: 12,
                            md: 6
                        }}>
                            <FormControl component="fieldset" fullWidth>
                                <Typography   variant="h6"
            sx={{ fontWeight: 600, fontSize:"18px !important",
            marginTop:"6px" }} gutterBottom>Regulatory / Policy Context</Typography>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '0.4fr 0.4fr', gap: 1, mt: 0
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                            size='small'
                                                checked={formData.regulations.includes('NAIC')}
                                                onChange={handleRegulationChange}
                                                value="NAIC"
                                            />
                                        }
                                        label= {
                                        <Typography variant="body2">
                                            NAIC</Typography>
                                            }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                             size='small'
                                                checked={formData.regulations.includes('State DOI')}
                                                onChange={handleRegulationChange}
                                                value="State DOI"
                                            />
                                        }
                                        label={ <Typography variant="body2">

                                        State DOI</Typography> }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                             size='small'
                                                checked={formData.regulations.includes('EU AI Act')}
                                                onChange={handleRegulationChange}
                                                value="EU AI Act"
                                            />
                                        }
                                        label=  {<Typography variant="body2">

                                         EU AI Act</Typography> }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                             size='small'
                                                checked={formData.regulations.includes('Internal Policy')}
                                                onChange={handleRegulationChange}
                                                value="Internal Policy"
                                            />
                                        }
                                        label=
                                         {<Typography variant="body2">

                                         
                                        Internal Policy</Typography>
                                    }
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
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        A.2 Impacted Demographic Groups (Editable Table)
                    </Typography>
                    <Typography variant="body2"  sx={{ mb: 2 }}>
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

                    <TableContainer  >
                        <Table>
                            <TableHead>
                                <TableRow >
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
                                            <Autocomplete
                                                size="small"
                                                options={['Yes', 'No']}
                                                value={row.included || null}
                                                onChange={(_, value) => updateGroupRow(idx, 'included', value || '')}
                                                sx={{ width: '100%' }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
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
                            <Card variant="outlined" sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.neutral' : 'grey.50' }}>
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
                            <Card variant="outlined" sx={{ p: 2, height: "100%", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.neutral' : 'grey.50' }}>
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
            <Card variant="outlined" sx={{ mt: 2,
                 bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.neutral' : '#fafafa',
                 borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(171, 171, 171, 0.15)' : '#e0e0e0'  }}>
                <CardContent sx={{ pb: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600,
                                 display: 'block', mb: 0.5 }}>
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
