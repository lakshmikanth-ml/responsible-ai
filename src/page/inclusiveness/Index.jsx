import RefreshIcon from '@mui/icons-material/Refresh';
import { useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Chip,
    Button,
    Alert,
    Switch,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
    Paper
} from "@mui/material";
import ObjectiveTab from "./ObjectiveTab";
import CoverageTab from "./CoverageTab";
import TrainingReadinessTab from "./TrainingReadinessTab";
import EvaluationTab from "./EvaluationTab";
import GapsRisksTab from "./GapsRisksTab";
import MitigationTab from "./MitigationTab";
import EvidenceTab from "./EvidenceTab";
import GatesMonitoringTab from "./GatesMonitoringTab";

const TABS = [
    "A. Objective",
    "B. Coverage",
    "C. Training Readiness (DFA)",
    "D. Evaluation",
    "E. Gaps & Risks",
    "F. Mitigation",
    "G. Evidence",
    "H. Gates & Monitoring",
];

const DECISION_ROLE_OPTIONS = [
    { value: "advisory", label: "Advisory only" },
    { value: "decision_support", label: "Decision-support" },
    { value: "decision_influencing", label: "Decision-influencing" },
];

const ProjectContextCard = ({
    context,
    onFieldChange,
    onSave,
    onReset,
    statusMessage,
    sx,
}) => (
    <Card variant="outlined" sx={{ width: "100%", ...sx }}>
        <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Project Context
            </Typography>

            <Stack spacing={2}>
                <TextField
                    size="small"
                    fullWidth
                    label="Project"
                    placeholder="e.g., Carrier A - Claims Copilot"
                    value={context.project}
                    onChange={(e) => onFieldChange("project", e.target.value)}
                />
                <TextField
                    size="small"
                    fullWidth
                    label="Model Version"
                    placeholder="e.g., v1.0.3"
                    value={context.modelVersion}
                    onChange={(e) => onFieldChange("modelVersion", e.target.value)}
                />
                <TextField
                    size="small"
                    fullWidth
                    label="Endpoint"
                    placeholder="e.g., /claims/triage"
                    value={context.endpoint}
                    onChange={(e) => onFieldChange("endpoint", e.target.value)}
                />
                <FormControl fullWidth size="small">
                    <InputLabel id="decision-role-label">Decision Role</InputLabel>
                    <Select
                        labelId="decision-role-label"
                        label="Decision Role"
                        value={context.decisionRole}
                        onChange={(e) => onFieldChange("decisionRole", e.target.value)}
                    >
                        {DECISION_ROLE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            <Stack direction="row" spacing={1} mt={2}>
                <Button size="small" variant="outlined" onClick={onReset}>
                    Reset Demo Data
                </Button>
                <Button size="small" variant="contained" onClick={onSave}>
                    Save
                </Button>
            </Stack>

            {statusMessage && (
                <Typography variant="caption" color="success.main" display="block" mt={1}>
                    {statusMessage}
                </Typography>
            )}

            <Typography variant="caption" color="text.secondary" mt={1} display="block">
                Data persists locally (browser localStorage) for demo realism.
            </Typography>
        </CardContent>
    </Card>
);


const OBJECTIVE_SAMPLE = {
    primaryPurpose: "customer_facing",
    jurisdiction: "india",
    owner: "product",
    audience: "consumers",
    criticalUserGroups: [
        "older_adults",
        "non_native",
        "rural",
    ],
    languageLocalization: true,
    assistiveUx: true,
    failureDefinition:
        "A rural applicant cannot complete the quote journey due to connectivity or UX constraints.",
    minimumStandard: "wcag_aa",
};


const COVERAGE_SAMPLE = {
    quoteJourney: true,
    claimsJourney: false,
    customerSupport: false,
    wcagRequired: true,
    targetStandard: "wcag_aa",
    validationTools: ["axe", "manual"],
    checklist: [
        {
            key: "critical_groups",
            label: "Critical user groups selected",
            status: "miss",
            owner: "product",
            notes:
                "Critical user groups have not yet been formally identified or documented. Selection is pending based on target market, accessibility needs, and usage context.",
        },
        {
            key: "underserved_representation",
            label: "Underserved community representation included",
            status: "miss",
            owner: "design",
            notes:
                "Design and training data review has not yet confirmed representation of underserved or marginalized user groups. Assessment and inclusion plan required.",
        },
        {
            key: "localization_plan",
            label: "Localization plan defined",
            status: "miss",
            owner: "product",
            notes:
                "No formal localization strategy has been defined for supported languages, regions, or cultural contexts. Language coverage requirements need to be finalized.",
        },
        {
            key: "keyboard_navigation",
            label: "Keyboard-only navigation supported",
            status: "miss",
            owner: "design",
            notes:
                "Keyboard-only navigation has not yet been validated across primary user journeys. Accessibility testing is required to ensure full operability without a mouse.",
        },
        {
            key: "screen_reader_labels",
            label: "Screen-reader labels validated",
            status: "miss",
            owner: "qa",
            notes:
                "Screen-reader compatibility and ARIA labeling have not yet been validated. Automated and manual accessibility testing is required.",
        },
        {
            key: "low_bandwidth",
            label: "Low-bandwidth mode tested",
            status: "miss",
            owner: "engineering",
            notes:
                "Low-bandwidth and degraded-network scenarios have not yet been tested. Performance and usability under constrained connectivity must be evaluated.",
        },
    ]
};



const TRAINING_READINESS_SAMPLE = {
    dfaJson: JSON.stringify(
        {
            dataset_provenance: {
                source: "internal + licensed third-party datasets",
                confidence: "high",
                review_status: "approved",
            },
            language_coverage: {
                primary: "English",
                supported: ["English", "Hindi", "Kannada"],
                localization_required: true,
            },
            readability: {
                grade_level: "8",
                plain_language_ready: true,
            },
            representation: {
                underserved_groups_included: true,
                notes:
                    "Includes rural applicants, non-native English speakers, and low digital literacy users.",
            },
            data_stability: {
                source_volatility: "low",
                update_frequency: "quarterly",
            },
            privacy: {
                pii_present: true,
                mitigation_controls: [
                    "PII masking",
                    "consent enforcement",
                    "data minimization",
                ],
            },
        },
        null,
        2
    ),

    dfaOwner: "data",

    signals: [
        {
            key: "provenance_confidence",
            label: "Provenance confidence",
            value: "High",
            status: "available",
            interpretation:
                "High provenance confidence reduces the risk of hidden gaps affecting underserved users.",
        },
        {
            key: "language_coverage",
            label: "Language coverage",
            value: "English, Hindi, Kannada",
            status: "available",
            interpretation:
                "Multilingual coverage aligns with localization needs and reduces inclusiveness risk.",
        },
        {
            key: "readability",
            label: "Readability / plain-language readiness",
            value: "Grade 8, plain-language ready",
            status: "available",
            interpretation:
                "Plain-language readiness improves accessibility for low digital literacy and non-native speakers.",
        },
        {
            key: "representation_notes",
            label: "Representation notes",
            value: "Underserved groups included",
            status: "available",
            interpretation:
                "Representation of underserved communities reduces exclusion risk and bias.",
        },
        {
            key: "data_stability",
            label: "Data stability",
            value: "Low volatility, quarterly updates",
            status: "available",
            interpretation:
                "Stable data sources reduce unexpected behavior that could impact accessibility flows.",
        },
        {
            key: "pii_risk",
            label: "PII risk flag",
            value: "PII present with controls",
            status: "available",
            interpretation:
                "PII risks are mitigated with controls; inclusive experiences require clear consent and transparency.",
        },
    ],
};


const EVALUATION_SAMPLE = {
    // Evaluation completion toggles
    axeCompleted: true,
    manualAuditCompleted: true,
    diverseUserTestingCompleted: true,

    // Governance controls
    testingCadence: "per_release",
    evaluationOutcome: "conditional",

    // User testing sessions
    userTestingSessions: [
        {
            key: "older_adults",
            userGroup: "Older adults (low digital literacy)",
            scenario: "Quote journey end-to-end",
            result: "partial",
            owner: "product",
            notes:
                "Users were able to complete the flow with guidance. Some confusion observed around terminology and error messages.",
        },
        {
            key: "non_native",
            userGroup: "Non-native language speakers",
            scenario: "Understand quote explanations",
            result: "partial",
            owner: "customer",
            notes:
                "Complex language and long sentences caused comprehension issues. Plain-language improvements recommended.",
        },
        {
            key: "keyboard_only",
            userGroup: "Keyboard-only users",
            scenario: "Complete key actions",
            result: "pass",
            owner: "qa",
            notes:
                "All critical actions accessible via keyboard. Focus order and visual focus indicators validated.",
        },
    ],
};



const GAPS_RISKS_SAMPLE = {
    risks: [
        {
            key: "missing_dfa",
            severity: "high",
            risk: "Training readiness signals are missing due to absent DFA ingestion.",
            status: "open",
            owner: "ml",
            recommendedAction: "Ingest DFA JSON and assign accountable owner.",
        },
        {
            key: "incomplete_coverage",
            severity: "medium",
            risk: "Coverage checklist items are incomplete for underserved user groups.",
            status: "open",
            owner: "product",
            recommendedAction: "Finalize coverage scope and update checklist statuses.",
        },
        {
            key: "evaluation_gaps",
            severity: "medium",
            risk: "User testing indicates partial failures for non-native language speakers.",
            status: "open",
            owner: "design",
            recommendedAction: "Improve language clarity and re-run evaluation tests.",
        },
    ],
};



const MITIGATION_SAMPLE = {
    mitigations: [
        {
            key: "language_simplification",
            mitigation: "Simplify customer-facing language and error messages",
            priority: "high",
            owner: "design",
            dueDate: "2026-02-15",
            status: "open",
        },
        {
            key: "localization_support",
            mitigation: "Add multilingual support for Hindi and Kannada",
            priority: "medium",
            owner: "product",
            dueDate: "2026-03-01",
            status: "open",
        },
        {
            key: "keyboard_validation",
            mitigation: "Re-test keyboard-only navigation across critical journeys",
            priority: "high",
            owner: "qa",
            dueDate: "2026-01-30",
            status: "complete",
        },
    ],
    auditTrailNotes:
        "Enabled high-contrast mode, improved keyboard focus states, and updated content guidelines based on evaluation feedback.",
};


const GATES_MONITORING_SAMPLE = {
    monitoringToggles: {
        accessibilityAlerts: true,
        languageComprehension: true,
        underservedFeedbackPriority: true,
    },
    reviewCadence: "monthly",
    escalationOwnerRole: "head_product",
    runtimeSignals: [
        {
            timestamp: "2026-01-10T09:45:00Z",
            project: "Carrier A",
            modelVersion: "v1.0.3",
            endpoint: "/quotes",
            userInput: "Unable to complete quote",
            modelOutput: "Please try again later",
            violations: "Low comprehension",
            rulesTriggered: "Language clarity",
            smeFeedback: "Simplify phrasing",
            actions: "Added clarification tooltip",
        },
        {
            timestamp: "2026-01-15T14:20:00Z",
            project: "Carrier A",
            modelVersion: "v1.0.3",
            endpoint: "/claims",
            userInput: "Screen reader failed",
            modelOutput: "Unsupported flow",
            violations: "Accessibility",
            rulesTriggered: "WCAG 2.1",
            smeFeedback: "ARIA labels missing",
            actions: "Queued remediation",
        },
    ],
};








export default function InclusivenessFormikPage() {
    const [tab, setTab] = useState(0);
    const [projectContext, setProjectContext] = useState({
        project: "Carrier A - Inclusiveness",
        modelVersion: "v1.0.3",
        endpoint: "/quotes",
        decisionRole: "decision_support",
    });
    const [statusMessage, setStatusMessage] = useState("");

    const [formState, setFormState] = useState({
        objective: {
            primaryPurpose: "",
            jurisdiction: "",
            owner: "",
            audience: "",
            criticalUserGroups: [],
            languageLocalization: false,
            assistiveUx: false,
            failureDefinition: "",
            minimumStandard: "",
        },
        coverage: {
            quoteJourney: false,
            claimsJourney: false,
            customerSupport: false,

            // Standards
            wcagRequired: false,
            targetStandard: "",            // required by Yup
            validationTools: [],            // multi-select

            // Coverage checklist (table)
            checklist: [
                {
                    key: "critical_groups",
                    label: "Critical user groups selected",
                    status: "miss",
                    owner: "product",
                    notes: "Groups selected and validated for customer quote journey.",
                },
                {
                    key: "underserved_representation",
                    label: "Underserved community representation included",
                    status: "miss",
                    owner: "design",
                    notes: "Workshops scheduled with rural + older adult participants.",
                },
                {
                    key: "localization_plan",
                    label: "Localization plan defined",
                    status: "miss",
                    owner: "product",
                    notes: "Spanish output planned for key quote explanations.",
                },
                {
                    key: "keyboard_navigation",
                    label: "Keyboard-only navigation supported",
                    status: "miss",
                    owner: "design",
                    notes: "Keyboard focus states implemented; needs QA validation.",
                },
                {
                    key: "screen_reader_labels",
                    label: "Screen-reader labels validated",
                    status: "miss",
                    owner: "qa",
                    notes: "Validate ARIA labels on critical actions and forms.",
                },
                {
                    key: "low_bandwidth",
                    label: "Low-bandwidth mode tested",
                    status: "miss",
                    owner: "engineering",
                    notes: "Verify journey completion under constrained network.",
                },
            ],


        },
        training: {
            dfaJson: "",
            dfaOwner: "",
            signals: [
                {
                    key: "provenance_confidence",
                    label: "Provenance confidence",
                    value: "—",
                    status: "missing",
                    interpretation:
                        "Higher confidence reduces risk of hidden gaps affecting underserved users.",
                },
                {
                    key: "language_coverage",
                    label: "Language coverage",
                    value: "—",
                    status: "missing",
                    interpretation:
                        "If English-only but localization is required, inclusiveness risk increases.",
                },
                {
                    key: "readability",
                    label: "Readability / plain-language readiness",
                    value: "—",
                    status: "missing",
                    interpretation:
                        "Low readability increases failure for low digital literacy and non-native speakers.",
                },
                {
                    key: "representation_notes",
                    label: "Representation notes",
                    value: "—",
                    status: "missing",
                    interpretation:
                        "If underserved communities are missing, targeted stakeholder engagement is mandatory.",
                },
                {
                    key: "data_stability",
                    label: "Data stability",
                    value: "—",
                    status: "missing",
                    interpretation:
                        "Unstable sources may change outputs unexpectedly, harming user trust and accessibility flows.",
                },
                {
                    key: "pii_risk",
                    label: "PII risk flag",
                    value: "—",
                    status: "missing",
                    interpretation:
                        "High PII risk requires privacy controls; for inclusiveness, ensure consent and clarity for users.",
                },
            ],
        },
        evaluation: {
            axeCompleted: false,
            manualAuditCompleted: false,
            diverseUserTestingCompleted: false,

            testingCadence: "",
            evaluationOutcome: "",

            userTestingSessions: [
                {
                    key: "older_adults",
                    userGroup: "Older adults (low digital literacy)",
                    scenario: "Quote journey end-to-end",
                    result: "miss",
                    owner: "product",
                    notes: "",
                },
                {
                    key: "non_native",
                    userGroup: "Non-native language speakers",
                    scenario: "Understand quote explanations",
                    result: "miss",
                    owner: "customer",
                    notes: "",
                },
                {
                    key: "keyboard_only",
                    userGroup: "Keyboard-only users",
                    scenario: "Complete key actions",
                    result: "miss",
                    owner: "qa",
                    notes: "",
                },
            ],
        },
        gapsRisks: {
            risks: [
                {
                    key: "missing_dfa",
                    severity: "high",
                    risk: "Training readiness signals are missing due to absent DFA ingestion.",
                    status: "open",
                    owner: "ml",
                    recommendedAction: "Ingest DFA JSON and assign accountable owner.",
                },
                {
                    key: "incomplete_coverage",
                    severity: "medium",
                    risk: "Coverage checklist items are incomplete for underserved user groups.",
                    status: "open",
                    owner: "product",
                    recommendedAction: "Finalize coverage scope and update checklist statuses.",
                },
                {
                    key: "evaluation_gaps",
                    severity: "medium",
                    risk: "User testing indicates partial failures for non-native language speakers.",
                    status: "open",
                    owner: "design",
                    recommendedAction: "Improve language clarity and re-run evaluation tests.",
                },
            ],
        },
        mitigation: {
            mitigations: [],
            auditTrailNotes: "",
        },
        evidence: {
            evidenceItems: [
                {
                    key: "stakeholder_engagement",
                    label: "Stakeholder engagement plan",
                    description:
                        "Workshops, interviews, focus groups; include underserved representation.",
                    owner: "",
                    file: null,
                    status: "missing",
                },
                {
                    key: "accessibility_checklist",
                    label: "Accessibility compliance checklist",
                    description:
                        "WCAG target + checklist for key journeys.",
                    owner: "",
                    file: null,
                    status: "missing",
                },
                {
                    key: "axe_report",
                    label: "Axe / Lighthouse report",
                    description:
                        "Automated scan output (screenshots or export).",
                    owner: "",
                    file: null,
                    status: "missing",
                },
                {
                    key: "manual_audit",
                    label: "Manual accessibility audit notes",
                    description:
                        "Screen reader + keyboard-only findings and fixes.",
                    owner: "",
                    file: null,
                    status: "missing",
                },
                {
                    key: "diverse_testing",
                    label: "Diverse user testing report",
                    description:
                        "Sessions + issues + resolution log (min 3 groups).",
                    owner: "",
                    file: null,
                    status: "missing",
                },
                {
                    key: "feedback_tracker",
                    label: "Feedback channel & tracker",
                    description:
                        "Forms/surveys + monthly analysis + prioritization.",
                    owner: "",
                    file: null,
                    status: "missing",
                },
            ],
        },
        gatesMonitoring: {
            monitoringToggles: {
                accessibilityAlerts: false,
                languageComprehension: false,
                underservedFeedbackPriority: false,
            },
            reviewCadence: "",
            escalationOwnerRole: "",
            runtimeSignals: [], // reference-only table
        }

        // coverage, training, evaluation...
    });

    const loadObjectiveSample = () => {
        setFormState((prev) => ({
            ...prev,
            objective: OBJECTIVE_SAMPLE,
        }));
    };

    useEffect(() => {
        try {
            const saved = localStorage.getItem("inclusiveness_projectContext");
            if (saved) setProjectContext(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to load inclusiveness project context", e);
        }
    }, []);

    const handleFieldChange = (field, value) => {
        setProjectContext((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveContext = () => {
        try {
            localStorage.setItem("inclusiveness_projectContext", JSON.stringify(projectContext));
            setStatusMessage("✓ Project Context saved");
            setTimeout(() => setStatusMessage(""), 2000);
        } catch (e) {
            setStatusMessage("✗ Error saving context");
        }
    };

    const handleResetDemo = () => {
        if (window.confirm("Reset demo data? This cannot be undone.")) {
            localStorage.removeItem("inclusiveness_projectContext");
            setProjectContext({
                project: "",
                modelVersion: "",
                endpoint: "",
                decisionRole: "decision_support",
            });
            setStatusMessage("✓ Demo data reset");
            setTimeout(() => setStatusMessage(""), 2000);
        }
    };

    return (
        <>
            <Paper variant="outlined" sx={{ p: 2 }}>
                {/* Header */}



                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 2,
                }}>
                    {/* Title */}
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Inclusiveness
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ensure the AI system is accessible, usable, and beneficial across diverse user groups (including underserved communities), and that accessibility standards and inclusive testing are enforced across pre-training, release, and production.
                        </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>
                            Generate Policy Pack (for Guardian)
                        </Button>
                        <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>
                            Export Snapshot
                        </Button>
                        <Button variant="contained" size="small" startIcon={<RefreshIcon />} sx={{ fontWeight: 600 }}>
                            Recompute Gates
                        </Button>
                    </Box>
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ mt: 2, mb: 2, flexWrap: "wrap" }}
                >
                    <Chip
                        label="Lifecycle Controlled"
                        variant="outlined"
                        size="small"
                        sx={{
                            fontWeight: 600,
                            bgcolor: 'rgba(25, 118, 210, 0.12)',
                            borderColor: 'rgba(25, 118, 210, 0.35)',
                            color: 'primary.dark',
                        }}
                    />
                    <Chip
                        label="Coverage: 3%"
                        variant="outlined"
                        size="small"
                        sx={{
                            fontWeight: 600,
                            bgcolor: '#fffbeb',
                            borderColor: '#fcd34d',
                            color: '#b45309',
                        }}
                    />
                    <Chip
                        label="Evidence: 0/6 approved"
                        variant="outlined"
                        size="small"
                        sx={{
                            fontWeight: 600,
                            bgcolor: '#fff7ed',
                            borderColor: '#fdba74',
                            color: '#c2410c',
                        }}
                    />
                    <Chip
                        label="Risks: 3 critical open"
                        variant="outlined"
                        size="small"
                        sx={{
                            fontWeight: 600,
                            bgcolor: '#fef2f2',
                            borderColor: '#fca5a5',
                            color: '#b91c1c',
                        }}
                    />
                </Stack>

                <Grid container spacing={2} mb={2}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <GateCard
                            title="Pre-Training Gate"
                            status="PASS"
                            description="Pre-training inclusiveness prerequisites met (DFA ingested + groups + WCAG scope)."
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <GateCard
                            title="Release Gate"
                            status="BLOCKED"
                            description="Accessibility testing and/or diverse testing and/or evidence approvals incomplete; critical risks may be open."
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <GateCard
                            title="Production Gate"
                            status="BLOCKED"
                            description="Production blocked because release gate is blocked or monitoring configuration is incomplete."
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <GateCard
                            title="Guardian Health"
                            status="DEGRADED"
                            description="Guardian indicates repeated inclusiveness/usability issues. Route to owner for remediation."
                        />
                    </Grid>
                </Grid>

                {statusMessage && (
                    <Alert
                        severity={statusMessage.startsWith("\u2713") ? "success" : "info"}
                        sx={{ mb: 2 }}
                    >
                        {statusMessage}
                    </Alert>
                )}

                {/* Tabs */}
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                >
                    {TABS.map(t => <Tab key={t} label={t} />)}
                </Tabs>

                {tab === 0 && (
                    <ObjectiveTab
                        initialValues={formState.objective}
                        onSave={(values) =>
                            setFormState((prev) => ({
                                ...prev,
                                objective: values,
                            }))
                        }
                        onLoadSample={loadObjectiveSample}
                    />
                )}
                {tab === 1 && (
                    <CoverageTab
                        initialValues={formState.coverage}
                        onSave={(values) =>
                            setFormState((prev) => ({ ...prev, coverage: values }))
                        }
                        onLoadSample={() =>
                            setFormState((prev) => ({ ...prev, coverage: COVERAGE_SAMPLE }))
                        }
                    />
                )}
                {tab === 2 && (
                    <TrainingReadinessTab
                        initialValues={formState.training}
                        onSave={(values) =>
                            setFormState((prev) => ({
                                ...prev,
                                training: values,
                            }))
                        }
                        onLoadSample={() =>
                            setFormState((prev) => ({
                                ...prev,
                                training: TRAINING_READINESS_SAMPLE,
                            }))
                        }
                    />

                )}
                {tab === 3 && (
                    <EvaluationTab
                        initialValues={formState.evaluation}
                        onSave={(values) =>
                            setFormState((prev) => ({ ...prev, evaluation: values }))
                        }
                        onLoadSample={() =>
                            setFormState((prev) => ({ ...prev, evaluation: EVALUATION_SAMPLE }))
                        }
                    />

                )}
                {tab === 4 && (
                    <GapsRisksTab
                        initialValues={formState.gapsRisks}
                        onSave={(values) =>
                            setFormState((prev) => ({ ...prev, gapsRisks: values }))
                        }
                        onGenerateRisks={() =>
                            setFormState((prev) => ({ ...prev, gapsRisks: GAPS_RISKS_SAMPLE }))
                        }
                        onClearRisks={() =>
                            setFormState((prev) => ({ ...prev, gapsRisks: { risks: [] } }))
                        }
                    />

                )}
                {tab === 5 && (
                    <MitigationTab
                        initialValues={formState.mitigation}
                        onSave={(values) =>
                            setFormState((prev) => ({ ...prev, mitigation: values }))
                        }
                        onGenerateFromRisks={() =>
                            setFormState((prev) => ({ ...prev, mitigation: MITIGATION_SAMPLE }))
                        }
                        onAddMitigation={() =>
                            setFormState((prev) => ({
                                ...prev,
                                mitigation: {
                                    ...prev.mitigation,
                                    mitigations: [
                                        ...prev.mitigation.mitigations,
                                        {
                                            key: crypto.randomUUID(),
                                            mitigation: "New mitigation task",
                                            priority: "medium",
                                            owner: "product",
                                            dueDate: "",
                                            status: "open",
                                        },
                                    ],
                                },
                            }))
                        }
                    />

                )}
                {tab === 6 && (
                    <EvidenceTab
                        initialValues={formState.evidence}
                        onSave={(values) =>
                            setFormState((prev) => ({ ...prev, evidence: values }))
                        }
                    />

                )}
                {tab === 7 && (
                    <GatesMonitoringTab
                        initialValues={formState.gatesMonitoring}
                        onSave={(values) =>
                            setFormState((prev) => ({ ...prev, gatesMonitoring: values }))
                        }
                        onLoadSample={() =>
                            setFormState((prev) => ({
                                ...prev,
                                gatesMonitoring: GATES_MONITORING_SAMPLE,
                            }))
                        }
                    />

                )}
            </Paper>
            <Box mt={2}>
                <ProjectContextCard
                    context={projectContext}
                    onFieldChange={handleFieldChange}
                    onSave={handleSaveContext}
                    onReset={handleResetDemo}
                    statusMessage={statusMessage}
                />
            </Box>
        </>
    );
}


const STATUS_CONFIG = {
    PASS: {
        label: "PASS",
        color: "success",
        bg: "success.light",
    },
    BLOCKED: {
        label: "BLOCKED",
        color: "error",
        bg: "error.light",
    },
    DEGRADED: {
        label: "DEGRADED",
        color: "warning",
        bg: "warning.light",
    },
};

/* ---------------- Card Component ---------------- */
function GateCard({ title, status, description }) {
    const config = STATUS_CONFIG[status];

    return (
        <Card
            sx={{
                borderRadius: 3,
                height: "100%",
            }}
        >
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                >
                    <Typography fontWeight={600}>{title}</Typography>
                    <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                </Box>

                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}

