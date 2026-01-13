/*
  Inclusiveness – FULL PAGE (Formik + Yup)
  =====================================
  - No sidebar
  - Summary cards ABOVE tabs
  - Tabs A–H
  - ALL fields per screenshots
  - Formik for state
  - Yup for validation
  - Values persist across tabs
*/

import { useState } from "react";
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
    Switch,
    FormControlLabel,
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
            notes: "Select groups in Tab A",
        },
        {
            key: "underserved_rep",
            label: "Underserved community representation included",
            status: "miss",
            owner: "design",
            notes: "Plan workshops / focus groups",
        },
        // ...
    ],
};






export default function InclusivenessFormikPage() {
    const [tab, setTab] = useState(0);

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
                    notes: "",
                },
                {
                    key: "underserved_representation",
                    label: "Underserved community representation included",
                    status: "miss",
                    owner: "design",
                    notes: "",
                },
                {
                    key: "localization_plan",
                    label: "Localization plan defined",
                    status: "miss",
                    owner: "product",
                    notes: "",
                },
                {
                    key: "keyboard_navigation",
                    label: "Keyboard-only navigation supported",
                    status: "miss",
                    owner: "design",
                    notes: "",
                },
                {
                    key: "screen_reader_labels",
                    label: "Screen-reader labels validated",
                    status: "miss",
                    owner: "qa",
                    notes: "",
                },
                {
                    key: "low_bandwidth",
                    label: "Low-bandwidth mode tested",
                    status: "miss",
                    owner: "engineering",
                    notes: "",
                },
            ],

        }
        // coverage, training, evaluation...
    });

    const loadObjectiveSample = () => {
        setFormState((prev) => ({
            ...prev,
            objective: OBJECTIVE_SAMPLE,
        }));
    };

    return (

        <Paper variant="outlined" sx={{ p: 2 }}>
            {/* Header */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={700}>Inclusiveness</Typography>
                    <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                        <Chip color="primary" label="Lifecycle Controlled" />
                        <Chip color="error" label="Coverage: 3%" />
                        <Chip color="warning" label="Evidence: 0/6 approved" />
                        <Chip color="error" label="Risks: 3 critical open" />
                    </Stack>
                </CardContent>
            </Card>

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
            {tab === 2 && <TrainingTab values={values} setFieldValue={setFieldValue} />}
            {tab === 3 && <EvaluationTab values={values} setFieldValue={setFieldValue} />}
            {tab === 4 && <RisksTab />}
            {tab === 5 && <MitigationTab values={values} />}
            {tab === 6 && <EvidenceTab />}
            {tab === 7 && <MonitoringTab values={values} setFieldValue={setFieldValue} />}
        </Paper>

    );
}

/* ========== TAB A ========= */



function TrainingTab() { return <Card sx={{ p: 3 }}><Typography>C. Training Readiness</Typography></Card>; }
function EvaluationTab() { return <Card sx={{ p: 3 }}><Typography>D. Evaluation</Typography></Card>; }
function RisksTab() { return <Card sx={{ p: 3 }}><Typography>E. Gaps & Risks</Typography></Card>; }
function MitigationTab() { return <Card sx={{ p: 3 }}><Typography>F. Mitigation</Typography></Card>; }
function EvidenceTab() { return <Card sx={{ p: 3 }}><Typography>G. Evidence</Typography></Card>; }
function MonitoringTab({ values, setFieldValue }) {
    return (
        <Card sx={{ p: 3 }}>
            <Typography fontWeight={700}>H. Gates & Monitoring</Typography>
            <FormControlLabel control={<Switch checked={values.monitoring.accessibilityAlerts}
                onChange={e => setFieldValue('monitoring.accessibilityAlerts', e.target.checked)} />} label="Accessibility Alerts" />
            <FormControlLabel control={<Switch checked={values.monitoring.languageMonitoring}
                onChange={e => setFieldValue('monitoring.languageMonitoring', e.target.checked)} />} label="Language Monitoring" />
        </Card>
    );
}
