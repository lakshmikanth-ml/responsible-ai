import { useState } from 'react';
import {
    Paper,
    Box,
    Grid,
    Typography,
    TextField,
    Switch,
    Button,
    Card,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Autocomplete,
} from '@mui/material';

const roleOptions = [
    'Product Manager',
    'Head of Product',
    'Accessibility Lead',
    'Design Systems Lead',
    'Engineering Manager',
    'QA Lead',
    'Compliance Lead',
    'Customer Experience Lead',
    'Support Operations Lead',
    'Data Engineering Lead',
    'ML Lead',
    'Data Governance Lead',
];

const criticalUserGroupsOptions = [
    'Older adults (low digital literacy)',
    'Non-native language speakers',
    'Rural applicants (limited connectivity)',
    'Users with visual impairments',
    'Users with hearing impairments',
    'Users with motor impairments (keyboard-only)',
    'Low-income / underserved communities',
    'Neurodiverse users (clarity & consistency)',
];

const failureDefinitionOptions = [
    'Quote or claim journey unusable on low bandwidth',
    'UI not navigable via keyboard-only',
    'Missing screen-reader labels / ARIA roles',
    'Low-contrast text for critical actions',
    'Non-native speakers cannot understand output',
    'Required steps are too complex for low digital literacy',
    'Error messages not actionable or not plain-English',
];

const statusOptions = ['Missing', 'Partial', 'Complete', 'Pass', 'Fail'];

export default function ObjectiveTab() {
    const [activeTab, setActiveTab] = useState('tabA');

    // ==================== STATE ====================
    const [tabA, setTabA] = useState({
        primaryPurpose: '',
        jurisdiction: '',
        owner: '',
        audience: '',
        criticalUserGroups: [],
        localizationRequired: false,
        accessibilityRequired: false,
        failureDefinition: [],
        minimumStandard: '',
    });

    const [tabB, setTabB] = useState({
        quoteJourney: false,
        claimsJourney: false,
        supportCoverage: false,
        wcagRequired: false,
        wcagLevel: '',
        tools: [],
        coverageTable: [
            { item: 'Critical user groups selected', status: 'Missing', owner: '', notes: '' },
            { item: 'Underserved community representation included', status: 'Missing', owner: '', notes: '' },
            { item: 'Localization plan defined', status: 'Missing', owner: '', notes: '' },
            { item: 'Keyboard-only navigation supported', status: 'Missing', owner: '', notes: '' },
            { item: 'Screen-reader labels validated', status: 'Missing', owner: '', notes: '' },
            { item: 'Low-bandwidth mode tested', status: 'Missing', owner: '', notes: '' },
        ],
    });

    const [tabC, setTabC] = useState({
        dfaJson: '',
        owner: '',
        dfaTable: [
            { signal: 'Provenance confidence', value: '—', status: 'Missing', interpretation: 'Higher confidence reduces risk of hidden gaps affecting underserved users.' },
            { signal: 'Language coverage', value: '—', status: 'Missing', interpretation: 'If English-only but localization is required, inclusiveness risk increases.' },
            { signal: 'Readability / plain-language readiness', value: '—', status: 'Missing', interpretation: 'Low readability increases failure for low digital literacy and non-native speakers.' },
            { signal: 'Representation notes', value: '—', status: 'Missing', interpretation: 'If underserved communities are missing, targeted stakeholder engagement is mandatory.' },
            { signal: 'Data stability', value: '—', status: 'Missing', interpretation: 'Unstable sources may change outputs unexpectedly, harming user trust and accessibility flows.' },
            { signal: 'PII risk flag', value: '—', status: 'Missing', interpretation: 'High PII risk requires privacy controls; for inclusiveness, ensure consent/clarity for users.' },
        ],
    });

    const [tabD, setTabD] = useState({
        axeCompleted: false,
        manualCompleted: false,
        diverseCompleted: false,
        cadence: '',
        outcome: '',
        sessions: [
            { group: 'Older adults (low digital literacy)', scenario: 'Quote journey end-to-end', result: 'Missing', owner: '', notes: '' },
            { group: 'Non-native language speakers', scenario: 'Understand quote explanations', result: 'Missing', owner: '', notes: '' },
            { group: 'Keyboard-only users', scenario: 'Complete key actions', result: 'Missing', owner: '', notes: '' },
        ],
    });

    const [tabE, setTabE] = useState({
        risks: [],
    });

    const [tabF, setTabF] = useState({
        mitigations: [],
        auditNotes: '',
    });

    const [tabG, setTabG] = useState({
        evidenceSlots: [
            { name: 'Stakeholder engagement plan', hint: 'Workshops, interviews, focus groups; include underserved representation.', status: 'Missing', owner: '', file: null },
            { name: 'Accessibility compliance checklist', hint: 'WCAG target + checklist for key journeys.', status: 'Missing', owner: '', file: null },
            { name: 'Axe / Lighthouse report', hint: 'Automated scan output (screenshots or export).', status: 'Missing', owner: '', file: null },
            { name: 'Manual accessibility audit notes', hint: 'Screen reader + keyboard-only findings and fixes.', status: 'Missing', owner: '', file: null },
            { name: 'Diverse user testing report', hint: 'Sessions + issues + resolution log (min 3 groups).', status: 'Missing', owner: '', file: null },
            { name: 'Feedback channel & tracker', hint: 'Forms/surveys + monthly analysis + prioritization.', status: 'Missing', owner: '', file: null },
        ],
    });

    const [tabH, setTabH] = useState({
        accessibilityAlerts: false,
        languageMonitoring: false,
        underservedPriority: false,
        reviewCadence: '',
        escalationOwner: '',
        guardianTable: [],
    });

    // Additional UI state for side-panel and summaries
    const [actionItems, setActionItems] = useState([]);
    const [policyPreviewData, setPolicyPreviewData] = useState({});
    const [coveragePercent, setCoveragePercent] = useState(0);
    const [evidenceApproved, setEvidenceApproved] = useState(0);
    const [criticalRisks, setCriticalRisks] = useState(0);

    const computeCoveragePercent = () => {
        const rows = tabB.coverageTable || [];
        if (!rows.length) return 0;
        let score = 0;
        rows.forEach((r) => {
            if (r.status === 'Complete') score += 1;
            else if (r.status === 'Partial') score += 0.5;
        });
        const pct = Math.round((score / rows.length) * 100);
        setCoveragePercent(pct);
        return pct;
    };

    const computeEvidenceApproved = () => {
        const slots = tabG.evidenceSlots || [];
        const approved = slots.filter((s) => s.status === 'Approved').length;
        setEvidenceApproved(approved);
        return approved;
    };

    const generateActionItems = () => {
        const items = [];
        (tabB.coverageTable || []).forEach((r, idx) => {
            if (r.status !== 'Complete') items.push({ id: `coverage-${idx}`, priority: 'High', action: `Fix coverage: ${r.item}`, owner: r.owner || 'TBD', status: r.status });
        });
        (tabG.evidenceSlots || []).forEach((s, idx) => {
            if (s.status !== 'Approved') items.push({ id: `evidence-${idx}`, priority: 'Medium', action: `Provide evidence: ${s.name}`, owner: s.owner || 'TBD', status: s.status });
        });
        setActionItems(items);
    };

    const handleLoadSample = () => {
        // Populate Tab A with sample data
        setTabA({
            primaryPurpose: 'quotes',
            jurisdiction: 'us_multi',
            owner: roleOptions[0],
            audience: 'customers',
            criticalUserGroups: ['Older adults (low digital literacy)', 'Non-native language speakers'],
            localizationRequired: true,
            accessibilityRequired: true,
            failureDefinition: ['Quote or claim journey unusable on low bandwidth', 'UI not navigable via keyboard-only'],
            minimumStandard: 'wcag_aa',
        });

        // Generate sample action items
        const sampleItems = [
            { id: '1', priority: 'High', action: 'Complete Axe accessibility audit', owner: 'Accessibility Lead' },
            { id: '2', priority: 'High', action: 'Conduct user testing with 3+ groups', owner: 'Design Lead' },
            { id: '3', priority: 'Medium', action: 'Implement keyboard navigation', owner: 'Engineering Manager' },
            { id: '4', priority: 'Medium', action: 'Add localization for Spanish & Mandarin', owner: 'Localization Lead' },
        ];
        setActionItems(sampleItems);

        // Set sample policy preview
        const samplePolicy = {
            'Version': '1.0',
            'Standard': 'WCAG 2.1 AA',
            'CriticalGroups': ['Older adults', 'Non-native speakers'],
            'Localization': true,
            'Audits': 'Quarterly',
            'Testing': 'Min 3 user groups',
        };
        setPolicyPreviewData(samplePolicy);
        setCoveragePercent(75);
        setEvidenceApproved(3);
        setCriticalRisks(1);
    };

    const priorityColor = (priority) => {
        if (priority === 'High') return 'error';
        if (priority === 'Medium') return 'warning';
        return 'default';
    };

    const formatJsonPreview = (obj) => {
        return JSON.stringify(obj, null, 2);
    };

    const loadSampleAll = () => {
        setTabA({ ...tabA, primaryPurpose: 'quotes', jurisdiction: 'us_multi', owner: roleOptions[0], audience: 'customers', criticalUserGroups: ['older_adults', 'non_native'], localizationRequired: true, accessibilityRequired: true, minimumStandard: 'wcag_2_1_aa' });
        const coverage = (tabB.coverageTable || []).map((r, i) => ({ ...r, status: i < 3 ? 'Complete' : 'Partial', owner: roleOptions[i % roleOptions.length] }));
        setTabB({ ...tabB, quoteJourney: true, claimsJourney: true, supportCoverage: true, wcagRequired: true, wcagLevel: 'wcag_2_1_aa', tools: ['axe', 'lighthouse'], coverageTable: coverage });
        const evidence = (tabG.evidenceSlots || []).map((s, i) => ({ ...s, status: i < 3 ? 'Approved' : 'Missing', owner: roleOptions[(i + 2) % roleOptions.length] }));
        setTabG({ ...tabG, evidenceSlots: evidence });
        // setPolicyPreview('Policy Pack: Require WCAG AA, diverse testing (3 groups), localization for top languages.');
        computeCoveragePercent();
        computeEvidenceApproved();
        generateActionItems();
    };

    // ==================== TAB A ====================
    const renderTabA = () => (
        <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>A. Objective &amp; Inclusion Intent</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Define why inclusiveness is required, who is accountable, which groups must be supported, and what failure looks like.
                Missing objectives can block training and release for customer-facing or decision-influencing systems.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" select label="Primary Purpose" value={tabA.primaryPurpose} onChange={(e) => setTabA({ ...tabA, primaryPurpose: e.target.value })}>
                        <option value="">Select…</option>
                        <option value="quotes">Improve access to insurance quotes</option>
                        <option value="selfservice">Improve customer self-service</option>
                        <option value="agents">Assist internal agents / CSRs</option>
                        <option value="underwriting">Support underwriting decision consistency</option>
                        <option value="underserved">Reduce friction for underserved applicants</option>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" select label="Jurisdiction / Market" value={tabA.jurisdiction} onChange={(e) => setTabA({ ...tabA, jurisdiction: e.target.value })}>
                        <option value="">Select…</option>
                        <option value="us_multi">US — multi-state</option>
                        <option value="us_ca">US — CA focus</option>
                        <option value="us_ny">US — NY focus</option>
                        <option value="uk">UK</option>
                        <option value="eu">EU</option>
                        <option value="apac">APAC</option>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" select label="Inclusiveness Owner (Accountable Role)" value={tabA.owner} onChange={(e) => setTabA({ ...tabA, owner: e.target.value })}>
                        <option value="">Select…</option>
                        {roleOptions.map((role) => (<option key={role} value={role}>{role}</option>))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" select label="Deployment Audience" value={tabA.audience} onChange={(e) => setTabA({ ...tabA, audience: e.target.value })}>
                        <option value="">Select…</option>
                        <option value="internal">Internal only (employees)</option>
                        <option value="partners">Partner-facing (brokers / agents)</option>
                        <option value="customers">Customer-facing (policyholders / applicants)</option>
                        <option value="mixed">Mixed audience</option>
                    </TextField>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        multiple
                        options={criticalUserGroupsOptions}
                        value={tabA.criticalUserGroups}
                        onChange={(event, newValue) => setTabA({ ...tabA, criticalUserGroups: newValue })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Critical User Groups (Required coverage)"
                                size="small"
                                placeholder="Select at least 3 groups"
                            />
                        )}
                        noOptionsText="No groups available"
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>Tip: choose at least 3 groups for customer-facing flows.</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Language Localization Required</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Enable multilingual support for inputs/outputs and UI labels.</Typography>
                                </Box>
                                <Switch checked={tabA.localizationRequired} onChange={(e) => setTabA({ ...tabA, localizationRequired: e.target.checked })} />
                            </Stack>
                        </Box>
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Assistive UX Required</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Keyboard navigation, screen-reader labels, readable contrast.</Typography>
                                </Box>
                                <Switch checked={tabA.accessibilityRequired} onChange={(e) => setTabA({ ...tabA, accessibilityRequired: e.target.checked })} />
                            </Stack>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#fafafa', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#444' }}>Failure definition should be explicit: "A rural applicant cannot complete the quote journey due to connectivity or UX constraints."</Typography>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        multiple
                        options={failureDefinitionOptions}
                        value={tabA.failureDefinition}
                        onChange={(event, newValue) => setTabA({ ...tabA, failureDefinition: newValue })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="What is Unacceptable (Failure Definition)"
                                size="small"
                                placeholder="Select at least 3 failure scenarios"
                            />
                        )}
                        noOptionsText="No definitions available"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" select label="Minimum Inclusion Standard (Contract Summary)" value={tabA.minimumStandard} onChange={(e) => setTabA({ ...tabA, minimumStandard: e.target.value })}>
                        <option value="">Select…</option>
                        <option value="wcag_aa">WCAG 2.1 AA + quarterly audits + diverse testing (min 3 groups)</option>
                        <option value="wcag_aa_v2">WCAG 2.2 AA + release audit + localization for top 2 languages</option>
                        <option value="keyboard">Keyboard-only + contrast compliance + rural bandwidth mode + quarterly review</option>
                        <option value="assistive">Assistive UX + multilingual output + monthly feedback loop + escalation</option>
                    </TextField>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>This becomes the "Inclusiveness Contract" for the model version and is referenced in gates and the Guardian policy pack.</Typography>
                </Grid>
            </Grid>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="outlined" size="small" onClick={handleLoadSample}>Load Sample</Button>
                <Button variant="contained" size="small">Save A</Button>
            </Stack>
        </Box>
    );



    // ==================== MAIN RENDER ====================
    return (
        <Card variant="outlined" sx={{ p: 2 }}>
            <Grid container spacing={3}>
                {/* LEFT COLUMN - FORM */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {renderTabA()}
                </Grid>

                {/* RIGHT COLUMN - SIDEBAR */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={2}>
                        {/* Quick Actions */}
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography fontWeight={600} mb={2}>Quick Actions</Typography>
                            <Stack spacing={1}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleLoadSample}
                                >
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" onClick={() => { computeCoveragePercent(); computeEvidenceApproved(); generateActionItems(); }}>
                                    Generate
                                </Button>
                            </Stack>
                        </Card>

                        {/* Action Items */}
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography fontWeight={600} mb={2}>Action Items</Typography>
                            <TableContainer sx={{ mb: 2 }} component={Paper}>

                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Priority</TableCell>
                                            <TableCell>Action</TableCell>
                                            <TableCell>Owner</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {actionItems.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Chip
                                                        label={row.priority}
                                                        color={priorityColor(row.priority)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{row.action}</TableCell>
                                                <TableCell>{row.owner}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>

                        {/* Policy Pack Preview */}
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography fontWeight={600} mb={2}>Policy Pack Preview</Typography>
                            <Box
                                sx={{
                                    bgcolor: '#0f172a',
                                    color: '#e5e7eb',
                                    p: 2,
                                    borderRadius: '12px',
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.75rem',
                                    maxHeight: '200px',
                                    overflow: 'auto',
                                }}
                            >
                                {formatJsonPreview(policyPreviewData)}
                            </Box>
                        </Card>

                        {/* Status Summary */}
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography fontWeight={600} mb={2}>Status Summary</Typography>
                            <Typography variant="body2">
                                <b>Coverage:</b> {coveragePercent}%
                                <br />
                                <b>Evidence Approved:</b> {evidenceApproved}/6
                                <br />
                                <b>Critical Risks:</b> {criticalRisks}
                                <br />
                                <br />Use "Generate" after updating form.
                            </Typography>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    );
}
