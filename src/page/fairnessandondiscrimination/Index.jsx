import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Chip,
    Card,
    CardContent,Stack,Grid
    
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import TabA from './TabA';
import TabB from './TabB';
import TabC from './TabC';
import TabD from './TabD';
import TabE from './TabE';
import TabF from './TabF';
import TabG from './TabG';
import TabH from './TabH';
import {StatusChip,chips} from '../../components/card/StatusChip';

const Index = () => {
    const [activeTab, setActiveTab] = useState('A');
    const [groupRows, setGroupRows] = useState([
        { type: 'Age', name: 'Age Band', included: 'Yes', justification: 'Pricing sensitivity / compliance review' },
        { type: 'Gender', name: 'Gender', included: 'Yes', justification: 'Regulatory fairness requirement' },
        { type: 'Location', name: 'Zip Code', included: 'No', justification: 'Proxy risk; assess separately' },
    ]);
    const [formData, setFormData] = useState({
        useCase: 'Underwriting Assistant â€“ Eligibility & Risk Notes',
        fairnessGoal: '',
        businessRationale: '',
        jurisdiction: '',
        scopeNotes: '',
        regulations: [],
    });
    const [uploadedFiles, setUploadedFiles] = useState({
        workshop: [],
        legal: [],
    });
    const [validationMsg, setValidationMsg] = useState('');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
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
        setGroupRows([...groupRows, { type: '', name: '', included: 'Yes', justification: '' }]);
    };

    const removeGroupRow = (index) => {
        setGroupRows(groupRows.filter((_, i) => i !== index));
    };

    const updateGroupRow = (index, field, value) => {
        const updated = [...groupRows];
        updated[index][field] = value;
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
            setValidationMsg(`âŒ Validation failed:\n${errors.join('\n')}`);
            return false;
        } else {
            setValidationMsg('âœ“ Table validation passed!');
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

    const tabLabels = [
        'A. Objectives & Scope',
        'B. Signals & Measurements',
        'C. Gaps & Risk Assessment',
        'D. Mitigation Actions',
        'E. Evidence & Artifacts',
        'F. Lifecycle Gating',
        'G. Training & Accountability',
        'H. Compliance & Reporting',
    ];

    const tabValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    const renderKPIBadge = (status) => {
        const colorMap = {
            'Missing': 'error',
            'Partial': 'warning',
            'Complete': 'success',
        };
        return <Chip label={status} size="small" color={colorMap[status]} />;
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'A':
                return (
                    <TabA />
                );

            case 'B':
                return (
                    <TabB />
                );

            case 'C':
                return (
                    <TabC />
                );

            case 'D':
                return (
                    <TabD />
                );

            case 'E':
                return (
                    <TabE />
                );

            case 'F':
                return (
                    <TabF />
                );

            case 'G':
                return (
                    <TabG />
                );

            case 'H':
                return <TabH />;

            default:
                return (
                    <Box sx={{ p: 3, minHeight: 300 }}>
                        <Typography variant="h6">Content Loading</Typography>
                    </Box>
                );
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
                {/* Header Section */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 360px' },
                        gap: 2,
                        // p: 3,
                        alignItems: 'start',
                    }}
                >
                    {/* Left Content */}
                    <Box>
                        <Typography variant="h4" color="text.primary" sx={{fontWeight:600}}  gutterBottom>
                            Fairness & Non-Discrimination
                        </Typography>
                        <Typography
                        variant='body2'
                         gutterBottom>
                            Actionable control plane for defining fairness scope, running
                            measurements, managing mitigations, and producing audit-ready
                            evidence.
                        </Typography>
<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
  {chips.map((chip, index) => (
    <StatusChip key={index} label={chip.label} value={chip.value} />
  ))}
</Box>
                       
   {/* Status Chips */}
                        
                    </Box>

                    {/* Right Callout Box */}
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: '14px',
                            background: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.neutral : '#f8fafc',
                            border: '1px solid lightgray',
                            borderLeft: '4px solid #184ea4',
                        }}
                    >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                How to use this pillar
                            </Typography>
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{ lineHeight: 1.8, color: 'text.secondary' }}
                            >
                                1) Complete A (Objectives/Scope) and A2 table validation.
                                <br />
                                2) Configure metrics in B and run baseline evaluation.
                                <br />
                                3) Fix C risks by creating D actions and uploading E evidence.
                                <br />
                                4) Gates in F must PASS before Release/Production approvals.
                                <br />
                                5) Use H to export audit snapshot anytime.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* <Divider /> */}

                {/* Tab Navigation */}
                    <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                     variant="scrollable"
                    scrollButtonsDisplay="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        // alignContent:"start",
                        // display:"flex"
                    }}
                      
                     
                      
                        allowScrollButtonsMobile
                       
                >
                    {tabValues.map((value, index) => (
                        <Tab
                            key={value}
                            label={tabLabels[index]}
                            value={value}
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                            }}
                        />
                    ))}
                </Tabs>
</Grid>
                {/* Tab Content */}
                   <Card className="tabPanel"
                         variant="outlined" sx={{mt:2}} >
                     <CardContent  >      
                {renderTabContent()}
                 </CardContent>
                 </Card>
        </Box>
    );
};

export default Index;
