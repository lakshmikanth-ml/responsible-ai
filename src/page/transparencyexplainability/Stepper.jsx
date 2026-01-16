import {
    IconButton,
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState } from "react";
import TabAObjective from "./StepA";
import TabBCoverage from "./StepB";
import TabCTrainingReadiness from "./StepC";
import TabDEvaluation from "./StepD";
import TabERisks from "./StepE";
import TabFMitigation from "./StepF";
import TabGEvidenceAudit from "./StepG";
import TabHLifecycleMonitoring from "./StepH";

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

const PILL_ITEMS = [
    {
        label: "Lifecycle Controlled",
        tone: "slate",
        backgroundColor: "rgba(25, 118, 210, 0.12)",
        borderColor: "rgba(25, 118, 210, 0.35)",
        dotColor: "#1976d2",
    },
    { label: "Coverage: 100%", tone: "slate" },
    { label: "Evidence: 0/4 approved", tone: "slate" },
    { label: "Risks: 2 critical open", tone: "slate" },
];

const Pill = ({
    label,
    tone = "primary",
    backgroundColor,
    borderColor,
    dotColor,
}) => {
    const palette = {
        primary: { bg: "primary.50", border: "primary.200", dot: "primary.main" },
        slate: { bg: "grey.50", border: "grey.200", dot: "primary.main" },
        warn: { bg: "warning.50", border: "warning.200", dot: "warning.main" },
    };
    const base = palette[tone] || palette.primary;
    const colors = {
        bg: backgroundColor || base.bg,
        border: borderColor || base.border,
        dot: dotColor || base.dot,
    };

    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: "999px",
                bgcolor: colors.bg,
                border: "1px solid",
                borderColor: colors.border,
                minHeight: 34,
            }}
        >
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: colors.dot,
                }}
            />
            <Typography variant="caption" fontWeight={700}>
                {label}
            </Typography>
        </Box>
    );
};

function TabPanel({ value, index, children }) {
    return (
        <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
            {value === index && children}
        </Box>
    );
}

export default function TransparencyExplainabilityHeader() {
    const [tab, setTab] = useState(0);
    const [drawerType, setDrawerType] = useState(null);

    const policyPackJson = `{
  "policy_type": "transparency_explainability",
  "version": "v1",
  "generated_at_utc": "2026-01-14T06:19:43.757Z",
  "citation_policy": "required",
  "reasoning_policy": "required",
  "allowed_sources_summary": "",
  "dfa_constraints": {},
  "failure_definition": "Any mandatory output without a source citation OR an explanation that an operations user cannot understand. Any fabricated citation is unacceptable.",
  "contract_summary": "Mandatory outputs must include citations + business-readable reasoning. If confidence is low or user asks 'why', system shows approved explanation template and routes to SME review when needed.",
  "required_components_by_output": {
    "claim_priority": {
      "mandatory": true,
      "audience": "Operations",
      "depth": "medium",
      "required_components": {
        "citations": true,
        "reasoning": true,
        "confidence": false,
        "rule_ref": false
      }
    }
  },
  "escalation_rules": {
    "fabricated_citation_tolerance": 0,
    "low_confidence_route_to_sme": true,
    "missing_citation_on_mandatory_output": "block_or_escalate",
    "why_question_detected": "show_explainability_template"
  },
  "context": {
    "project": "",
    "model_version": "",
    "endpoint": "",
    "decision_role": "advisory"
  }
}`;

    const snapshotJson = `{
  "ctx": {
    "project": "",
    "model_version": "",
    "endpoint": "",
    "decision_role": "advisory"
  },
  "A": {
    "purpose": "audit_defensibility",
    "juris": "US - multi-state (CA/NY focus)",
    "owner": "Head of Data Science",
    "usecase": "Claims triage copilot that recommends claim priority and suggests next actions for adjusters based on claim notes and policy guidance.",
    "failure": "Any mandatory output without a source citation OR an explanation that an operations user cannot understand. Any fabricated citation is unacceptable.",
    "contract": "Mandatory outputs must include citations + business-readable reasoning. If confidence is low or user asks 'why', system shows approved explanation template and routes to SME review when needed.",
    "risk_audit": true,
    "risk_trace": true,
    "risk_dispute": true,
    "risk_complaint": false,
    "risk_sla": false,
    "risk_override": false
  },
  "B": {
    "defaultDepth": "medium",
    "sources": "",
    "citationPolicy": "required",
    "reasoningPolicy": "required",
    "coverage": [
      {
        "output_type": "claim_priority",
        "audience": "Operations",
        "depth": "medium",
        "mandatory": "yes",
        "req": {
          "citations": true,
          "reasoning": true,
          "confidence": false,
          "rule_ref": false
        },
        "justification": "Audit + dispute risk"
      }
    ]
  },
  "C": {
    "dfa": null,
    "controls": {},
    "readiness": "unknown"
  },
  "D": {
    "thresholds": {
      "cit_cov": 90,
      "cit_int": 95,
      "clarity": 85,
      "fabricated": 0
    },
    "cases": [
      {
        "case_id": "CASE-001",
        "prompt": "Explain why this claim was prioritized.",
        "exp": {
          "citations": true,
          "reasoning": true,
          "confidence": false
        },
        "citation_ok": "no",
        "clarity_ok": "no",
        "fabricated": "no"
      }
    ]
  },
  "E": {
    "risks": [
      {
        "risk_id": "RISK_bd3f9a_b18df8",
        "source": "Guardian",
        "severity": "critical",
        "stage_impact": "production",
        "issue": "Missing citations spike (critical)",
        "description": "Missing citation rate is 0.5. Explanations are not defensible for mandatory outputs.",
        "status": "open",
        "linked_action_id": "",
        "signature": "guard_missing_cit_crit",
        "created_at": "2026-01-08T08:20:40.568Z"
      },
      {
        "risk_id": "RISK_b2f9e4_b18df8",
        "source": "Guardian",
        "severity": "critical",
        "stage_impact": "production",
        "issue": "Unclear explanations spike (critical)",
        "description": "Unclear explanation rate is 0.5. Users cannot understand outputs; requires template/prompt fixes.",
        "status": "open",
        "linked_action_id": "",
        "signature": "guard_unclear_crit",
        "created_at": "2026-01-08T08:20:40.568Z"
      }
    ]
  },
  "F": {
    "actions": [
      {
        "action_id": "ACT_1c5fea_7c8c7e",
        "linked_risk_id": "",
        "action": "",
        "owner": "",
        "due": "",
        "recheck": "evaluation",
        "status": "open"
      }
    ]
  },
  "G": {
    "evidence": [
      {
        "type": "",
        "notes": "",
        "stage": "release",
        "status": "present",
        "owner": "",
        "timestamp": "2026-01-08T08:02:59.883Z"
      },
      {
        "type": "",
        "notes": "",
        "stage": "release",
        "status": "present",
        "owner": "",
        "timestamp": "2026-01-08T08:03:09.252Z"
      },
      {
        "type": "Runtime Explained Output Samples (Guardian)",
        "notes": "Ingested 4 events",
        "stage": "production",
        "status": "present",
        "owner": "Ops Lead",
        "timestamp": "2026-01-08T08:20:40.568Z"
      },
      {
        "type": "Explainability Contract (A+B)",
        "notes": "Derived from A and B sections",
        "stage": "pre_training",
        "status": "present",
        "owner": "Head of Data Science",
        "timestamp": "2026-01-14T06:16:48.897Z"
      }
    ]
  },
  "H": {
    "guardian": {
      "events": [
        {
          "timestamp": "2026-01-08T08:20:38.997Z",
          "endpoint": "/claims/triage",
          "output_type": "claim_priority",
          "explainability": {
            "missing_citation": false,
            "unclear_explanation": false,
            "fabricated_citation": false
          },
          "why_question_detected": true,
          "override": false
        },
        {
          "timestamp": "2026-01-08T08:20:38.997Z",
          "endpoint": "/claims/triage",
          "output_type": "risk_flag",
          "explainability": {
            "missing_citation": true,
            "unclear_explanation": false,
            "fabricated_citation": false
          },
          "why_question_detected": false,
          "override": true
        },
        {
          "timestamp": "2026-01-08T08:20:38.997Z",
          "endpoint": "/claims/triage",
          "output_type": "risk_flag",
          "explainability": {
            "missing_citation": true,
            "unclear_explanation": true,
            "fabricated_citation": false
          },
          "why_question_detected": true,
          "override": false
        },
        {
          "timestamp": "2026-01-08T08:20:38.997Z",
          "endpoint": "/claims/triage",
          "output_type": "policy_answer",
          "explainability": {
            "missing_citation": false,
            "unclear_explanation": true,
            "fabricated_citation": false
          },
          "why_question_detected": false,
          "override": false
        }
      ],
      "ingested_at": "2026-01-08T08:20:38.997Z"
    },
    "monitor_policy": {
      "missing_citation_rate_warn": 0.05,
      "missing_citation_rate_crit": 0.12,
      "unclear_expl_rate_warn": 0.06,
      "unclear_expl_rate_crit": 0.15,
      "fabricated_citation_incident": 0
    }
  },
  "meta": {
    "last_saved": "2026-01-14T06:16:48.898Z",
    "last_eval": null,
    "eval_pass": null,
    "recheck": {
      "evaluation_passed": false,
      "guardian_health_ok": false,
      "dfa_ok": false
    }
  }
}`;

    const getDrawerContent = () => {
        if (drawerType === "policy") {
            return {
                title: "Transparency Policy Pack (push to Guardian)",
                hint: "This JSON is what GenAI Foundry would push into Guardian as rule configuration for explainability enforcement.",
                body: policyPackJson,
                copyLabel: "Copy JSON",
            };
        }
        if (drawerType === "snapshot") {
            return {
                title: "Export Snapshot",
                hint: "Export a full snapshot of this pillar state (for audit pack or internal export).",
                body: snapshotJson,
                copyLabel: "Copy JSON",
            };
        }
        return null;
    };

    const drawerContent = getDrawerContent();

    const handleCopy = async () => {
        if (!drawerContent) return;
        try {
            await navigator.clipboard.writeText(drawerContent.body);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return (
        <>
            <Card sx={{ mt: 2 }}>
                <CardContent sx={{ p: { xs: 2, sm: 2 } }}>
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
                                Transparency & Explainability
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Control whether AI outputs are explainable, defensible, and
                                audit-ready across Pre-Training, Release, and Production.
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
                        mt={2}
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        alignItems="center"
                        useFlexGap
                    >
                        {PILL_ITEMS.map((pill) => (
                            <Pill key={pill.label} {...pill} />
                        ))}
                    </Stack>


                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            mt: 3,
                        }}
                    >
                        {TABS.map((label) => (
                            <Tab key={label} label={label} />
                        ))}
                    </Tabs>

                    <TabPanel value={tab} index={0}>
                        <TabAObjective />
                    </TabPanel>

                    <TabPanel value={tab} index={1}>
                        <TabBCoverage />
                    </TabPanel>

                    <TabPanel value={tab} index={2}>
                        <TabCTrainingReadiness />
                    </TabPanel>

                    <TabPanel value={tab} index={3}>
                        <TabDEvaluation />
                    </TabPanel>

                    <TabPanel value={tab} index={4}>
                        <TabERisks />
                    </TabPanel>

                    <TabPanel value={tab} index={5}>
                        <TabFMitigation />
                    </TabPanel>

                    <TabPanel value={tab} index={6}>
                        <TabGEvidenceAudit />
                    </TabPanel>

                    <TabPanel value={tab} index={7}>
                        <TabHLifecycleMonitoring />
                    </TabPanel>
                </CardContent>
            </Card>

            <Dialog
                open={Boolean(drawerContent)}
                onClose={() => setDrawerType(null)}
                fullWidth
                maxWidth="md"
            >
                {drawerContent && (
                    <>
                        <DialogTitle
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                pr: 2,
                            }}
                        >
                            <Typography variant="h6">{drawerContent.title}</Typography>
                            <IconButton
                                onClick={() => setDrawerType(null)}
                                size="small"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                {drawerContent.hint}
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={14}
                                value={drawerContent.body}
                                InputProps={{ readOnly: true, sx: { fontFamily: "monospace" } }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button variant="outlined" onClick={handleCopy}>
                                {drawerContent.copyLabel}
                            </Button>
                            <Button variant="outlined" onClick={() => setDrawerType(null)}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}
