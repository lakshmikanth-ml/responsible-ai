import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Autocomplete,
    Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const TabD = ({ projectContext = {}, onStatusMessage }) => {
    const [projectCtx, setProjectCtx] = useState({
        project: projectContext?.project || '',
        modelVersion: projectContext?.modelVersion || '',
        endpoint: projectContext?.endpoint || '',
        decisionRole: projectContext?.decisionRole || 'Decision-support',
        sensitivity: projectContext?.sensitivity || 'Tier 4 — Regulated (PII/PHI/PCI)',
        hostingBoundary: projectContext?.hostingBoundary || 'Client VPC/VNet (Private)',
    });

    const [statusMessage, setStatusMessage] = useState('');

    const [evaluationTests, setEvaluationTests] = useState([
        { category: 'PII Leakage', test: 'Unauthorized PII request prompts', threshold: '0 critical leaks', lastResult: 'Not run', status: 'FAIL' },
        { category: 'Secrets', test: 'Key/token extraction prompts', threshold: '0 exposures', lastResult: 'Not run', status: 'FAIL' },
        { category: 'Prompt Injection', test: 'Ignore-system / override policy', threshold: 'Block ≥ 95%', lastResult: 'Not run', status: 'FAIL' },
        { category: 'Exfiltration', test: 'Dump knowledge base / documents', threshold: 'Block ≥ 95%', lastResult: 'Not run', status: 'FAIL' },
        { category: 'RBAC / Entitlements', test: 'Cross-role doc access attempt', threshold: '0 bypass', lastResult: 'Not run', status: 'FAIL' },
        { category: 'Redaction', test: 'Mask correctness (precision/recall)', threshold: '≥ 0.95 F1', lastResult: 'Not run', status: 'FAIL' },
    ]);

    const [signOffs, setSignOffs] = useState({
        securityReview: 'Head of Platform Engineering',
        privacyReview: 'Privacy Officer / DPO',
        approvalStatus: 'Pending',
    });

    const [passCriteria, setPassCriteria] = useState({
        noCriticalLeak: true,
        injectThreshold: true,
        rbacEnforced: true,
        secureLogging: true,
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

        const saved = localStorage.getItem('privacy_tabD_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.evaluationTests) setEvaluationTests(parsed.evaluationTests);
                if (parsed.signOffs) setSignOffs(parsed.signOffs);
                if (parsed.passCriteria) setPassCriteria(parsed.passCriteria);
            } catch (e) {
                console.error('Error loading TabD data:', e);
            }
        }
    }, []);

    const handleContextChange = (field, value) => {
        setProjectCtx(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem('privacy_projectContext', JSON.stringify(projectCtx));
            setStatusMessage('✓ Project Context saved successfully');
            setTimeout(() => setStatusMessage(''), 3000);
            if (onStatusMessage) onStatusMessage('✓ Project Context saved successfully');
        } catch (e) {
            setStatusMessage('✗ Error saving context');
            if (onStatusMessage) onStatusMessage('✗ Error saving context');
        }
    };

    const handleResetDemo = () => {
        if (window.confirm('Reset all demo data? This cannot be undone.')) {
            localStorage.clear();
            setProjectCtx({ project: '', modelVersion: '', endpoint: '', decisionRole: 'Decision-support', sensitivity: 'Tier 4 — Regulated (PII/PHI/PCI)', hostingBoundary: 'Client VPC/VNet (Private)' });
            setEvaluationTests([]);
            setSignOffs({ securityReview: '', privacyReview: '', approvalStatus: 'Pending' });
            setPassCriteria({ noCriticalLeak: false, injectThreshold: false, rbacEnforced: false, secureLogging: false });
            setStatusMessage('✓ Demo data reset');
            if (onStatusMessage) onStatusMessage('✓ Demo data reset');
        }
    };

    const handleSave = () => {
        try {
            localStorage.setItem('privacy_tabD_data', JSON.stringify({ evaluationTests, signOffs, passCriteria }));
            setStatusMessage('✓ Tab D saved successfully');
            setTimeout(() => setStatusMessage(''), 3000);
            if (onStatusMessage) onStatusMessage('✓ Tab D saved successfully');
        } catch (e) {
            setStatusMessage('✗ Error saving data');
            if (onStatusMessage) onStatusMessage('✗ Error saving data');
        }
    };

    const loadSample = () => {
        setEvaluationTests([
            { category: 'PII Leakage', test: 'Unauthorized PII request prompts', threshold: '0 critical leaks', lastResult: 'Not run', status: 'FAIL' },
            { category: 'Secrets', test: 'Key/token extraction prompts', threshold: '0 exposures', lastResult: 'Not run', status: 'FAIL' },
            { category: 'Prompt Injection', test: 'Ignore-system / override policy', threshold: 'Block ≥ 95%', lastResult: 'Not run', status: 'FAIL' },
            { category: 'Exfiltration', test: 'Dump knowledge base / documents', threshold: 'Block ≥ 95%', lastResult: 'Not run', status: 'FAIL' },
            { category: 'RBAC / Entitlements', test: 'Cross-role doc access attempt', threshold: '0 bypass', lastResult: 'Not run', status: 'FAIL' },
            { category: 'Redaction', test: 'Mask correctness (precision/recall)', threshold: '≥ 0.95 F1', lastResult: 'Not run', status: 'FAIL' },
        ]);
        setSignOffs({ securityReview: 'Head of Platform Engineering', privacyReview: 'Privacy Officer / DPO', approvalStatus: 'Pending' });
        setPassCriteria({ noCriticalLeak: true, injectThreshold: true, rbacEnforced: true, secureLogging: true });
        setStatusMessage('✓ Sample suite loaded');
        if (onStatusMessage) onStatusMessage('✓ Sample suite loaded');
    };

    const toggleTest = (idx) => {
        setEvaluationTests(prev => {
            const copy = [...prev];
            const cur = copy[idx];
            cur.status = cur.status === 'PASS' ? 'FAIL' : 'PASS';
            cur.lastResult = cur.status === 'PASS' ? 'Pass' : 'Not run';
            return copy;
        });
    };

    const handleSignOffChange = (field, value) => {
        setSignOffs(prev => ({ ...prev, [field]: value }));
    };

    const handlePassCriteriaChange = (field) => {
        setPassCriteria(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const securityReviewerOptions = [
        'CISO / Security Lead',
        'Head of Platform Engineering',
        'Responsible AI Officer',
        'Platform Security Manager',
    ];

    const privacyReviewerOptions = [
        'Privacy Officer / DPO',
        'Legal Counsel',
        'Compliance Lead',
        'Data Protection Lead',
    ];

    const approvalStatusOptions = ['Pending', 'Approved', 'Rejected'];

    return (
        <Grid container spacing={2} sx={{ p: 0 }}>
            {/* LEFT PANEL: PROJECT CONTEXT */}
            <Grid size={{ xs: 12, sm: 4, md: 4 }}
            >
                <Box sx={{
                    border: "1px solid rgba(117, 117, 117, 0.2)",
                    p: 2, borderRadius: 2, mb: 2
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
                            Reset Demo
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

            {/* RIGHT PANEL: EVALUATION CONTENT */}
            <Grid size={{ xs: 12, sm: 8, md: 8 }} sx={{ p: 0 }}>
                <Box sx={{ mb: 2, border: "1px solid rgba(117, 117, 117, 0.2)", p: 2, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        🧪 D. Evaluation (Privacy & Security Testing)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Define the test suite that must pass before release: PII leakage tests, prompt-injection tests, exfiltration tests, RBAC/entitlement checks, and redaction correctness.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button variant="outlined" size="small" onClick={loadSample} sx={{ borderRadius: 1 }}>
                            📄 Load Sample Suite
                        </Button>
                        <Button variant="contained" size="small" onClick={handleSave} sx={{ borderRadius: 1 }} startIcon={<SaveIcon />}>
                            Save Evaluation
                        </Button>
                    </Box>
                </Box>

                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Evaluation Suite (must-run)
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 600, width: '220px' }}>Test Category</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '260px' }}>Test</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '160px' }}>Required Threshold</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '160px' }}>Last Result</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '140px' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '120px' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {evaluationTests.map((t, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{t.category}</TableCell>
                                            <TableCell>{t.test}</TableCell>
                                            <TableCell>{t.threshold}</TableCell>
                                            <TableCell>{t.lastResult}</TableCell>
                                            <TableCell>
                                                <Box sx={{ color: t.status === 'PASS' ? '#116530' : '#c62828', fontWeight: 700 }}>{t.status}</Box>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="small" onClick={() => toggleTest(idx)}>
                                                    Toggle
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            In production, this table is populated from your Evaluation & QA service run artifacts and linked to Evidence Vault.
                        </Typography>
                    </CardContent>
                </Card>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Release Sign-off (who approves evaluation)</Typography>
                                <Grid container spacing={2}>
                                    <Grid
                                        size={{
                                            xs: 12,
                                        }}>
                                        <Autocomplete
                                            value={signOffs.securityReview}
                                            onChange={(e, newValue) => handleSignOffChange('securityReview', newValue || '')}
                                            options={securityReviewerOptions}
                                            freeSolo
                                            renderInput={(params) => (
                                                <TextField {...params} label="Security Review" size="small" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{
                                        xs: 12,

                                    }}>
                                        <Autocomplete
                                            value={signOffs.privacyReview}
                                            onChange={(e, newValue) => handleSignOffChange('privacyReview', newValue || '')}
                                            options={privacyReviewerOptions}
                                            freeSolo
                                            renderInput={(params) => (
                                                <TextField {...params} label="Privacy Review" size="small" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{
                                        xs: 12,

                                    }}>
                                        <Autocomplete
                                            value={signOffs.approvalStatus}
                                            onChange={(e, newValue) => handleSignOffChange('approvalStatus', newValue || '')}
                                            options={approvalStatusOptions}
                                            freeSolo
                                            renderInput={(params) => (
                                                <TextField {...params} label="Approval Status" size="small" />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>What “Pass” Means</Typography>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={passCriteria.noCriticalLeak} onChange={() => handlePassCriteriaChange('noCriticalLeak')} />} label="0 critical leakage incidents" />
                                    <FormControlLabel control={<Checkbox checked={passCriteria.injectThreshold} onChange={() => handlePassCriteriaChange('injectThreshold')} />} label="Prompt-injection blocked ≥ threshold" />
                                    <FormControlLabel control={<Checkbox checked={passCriteria.rbacEnforced} onChange={() => handlePassCriteriaChange('rbacEnforced')} />} label="RBAC/entitlements enforced" />
                                    <FormControlLabel control={<Checkbox checked={passCriteria.secureLogging} onChange={() => handlePassCriteriaChange('secureLogging')} />} label="Secure logging mode configured" />
                                </FormGroup>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card sx={{
                    border: '1px solid rgba(117, 117, 117, 0.2)',
                    borderRadius: 2,
                }}>
                    <CardContent>
                        <Typography variant="body2">Release Gate depends on Evaluation: if any critical test is FAIL or approvals are Pending, Release Gate is BLOCKED.</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default TabD;
