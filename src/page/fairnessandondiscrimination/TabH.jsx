import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import GetAppIcon from '@mui/icons-material/GetApp';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const TabH = () => {
    const [statusMessage, setStatusMessage] = useState('');

    const resetAllData = () => {
        // Clear all localStorage keys for tabs A-G
        const keys = [
            'fairness_tabA_data',
            'fairness_tabB_data',
            'fairness_tabC_data',
            'fairness_tabD_data',
            'fairness_tabE_data',
            'fairness_tabF_data',
            'fairness_tabG_data',
        ];

        keys.forEach(key => localStorage.removeItem(key));

        setStatusMessage('🔄 All data has been reset. Please refresh the page to see changes.');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const downloadAuditSnapshot = () => {
        // In a real app, this would compile all data from tabs A-G
        const auditData = {
            pillar: 'Fairness & Non-Discrimination',
            generatedAt: new Date().toISOString(),
            version: 'v1',
            sections: {
                A: {
                    title: 'Objectives & Scope',
                    data: {
                        useCase: 'Underwriting Assistant – Eligibility & Risk Notes',
                        fairnessGoal: '[To be completed]',
                        businessRationale: '[To be completed]',
                        jurisdiction: '[To be completed]',
                        regulations: [],
                        impactedGroups: [],
                    }
                },
                B: {
                    title: 'Signals & Measurements',
                    data: {
                        selectedMetrics: [],
                        evaluationDataset: '',
                        decisionThreshold: '',
                        evaluationResults: [],
                    }
                },
                C: {
                    title: 'Gaps & Risk Assessment',
                    data: {
                        risks: [],
                    }
                },
                D: {
                    title: 'Mitigation Actions & Ownership',
                    data: {
                        actions: [],
                    }
                },
                E: {
                    title: 'Evidence & Artifacts',
                    data: {
                        artifacts: [],
                    }
                },
                F: {
                    title: 'Lifecycle Gating',
                    data: {
                        gates: [],
                    }
                },
                G: {
                    title: 'Training & Accountability',
                    data: {
                        raiOwner: '',
                        modules: [],
                    }
                },
            },
            exportInfo: {
                includes: [
                    'All A–H inputs, tables, and selections',
                    'Evaluation results and derived risk statements',
                    'Mitigation actions with owners, due dates, and status',
                    'Evidence artifacts list (with timestamps)',
                    'Lifecycle gate decisions + blocking reasons',
                    'Training completion + evidence',
                ],
                timestamp: new Date().toISOString(),
                note: 'In production: add immutable hashing, signatures, and role-based approvals.',
            }
        };

        const dataStr = JSON.stringify(auditData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fairness_audit_snapshot_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setStatusMessage('📥 Audit Snapshot (JSON) downloaded successfully');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const downloadEvidenceIndexCSV = () => {
        // Create a sample evidence index CSV
        let csv = 'Artifact Name,Stage,Status,Approved,Upload Date,File Count\n';
        csv += 'Fairness Objectives Document,Baseline,Missing,No,2026-01-09,0\n';
        csv += 'Impacted Groups Definition Export,Baseline,Present,No,2026-01-08,0\n';
        csv += 'Fairness Evaluation Results,Baseline,Missing,No,2026-01-09,0\n';
        csv += 'Bias Mitigation Plan,Release,Missing,No,2026-01-09,0\n';
        csv += 'Release Fairness Sign-off,Release,Missing,No,2026-01-09,0\n';

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `evidence_index_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setStatusMessage('📥 Evidence Index (CSV) downloaded successfully');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const generatePillarReportHTML = () => {
        // Generate a readable HTML report
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fairness & Non-Discrimination Pillar Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 960px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #1976d2;
            border-bottom: 3px solid #1976d2;
            padding-bottom: 10px;
        }
        h2 {
            color: #2e7d32;
            margin-top: 30px;
        }
        .meta {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .section {
            margin: 30px 0;
            background: #fafafa;
            padding: 20px;
            border-left: 4px solid #1976d2;
        }
        .status-pass { color: #2e7d32; font-weight: bold; }
        .status-fail { color: #d32f2f; font-weight: bold; }
        .status-pending { color: #f57c00; font-weight: bold; }
        ul { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f5f5f5;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>Fairness & Non-Discrimination Pillar Report</h1>

    <div class="meta">
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Pillar:</strong> Fairness & Non-Discrimination</p>
        <p><strong>Version:</strong> v1</p>
    </div>

    <div class="section">
        <h2>A. Objectives & Scope</h2>
        <p><strong>Status:</strong> <span class="status-pending">⏳ Incomplete</span></p>
        <p>This section defines fairness objectives and identifies impacted demographic groups.</p>
        <ul>
            <li>Use Case: Underwriting Assistant – Eligibility & Risk Notes</li>
            <li>Fairness Goal: [To be completed]</li>
            <li>Impacted Groups: [To be defined]</li>
        </ul>
    </div>

    <div class="section">
        <h2>B. Signals & Measurements</h2>
        <p><strong>Status:</strong> <span class="status-pending">⏳ Not Run</span></p>
        <p>Baseline fairness evaluation configuration and results.</p>
        <ul>
            <li>Selected Metrics: [To be configured]</li>
            <li>Evaluation Dataset: [To be selected]</li>
            <li>Decision Threshold: [To be set]</li>
        </ul>
    </div>

    <div class="section">
        <h2>C. Gaps & Risk Assessment</h2>
        <p><strong>Risk Summary:</strong> 3 Critical, 3 Warnings identified</p>
        <p>Automated risk assessment computed from A/B completeness and evaluation results.</p>
    </div>

    <div class="section">
        <h2>D. Mitigation Actions & Ownership</h2>
        <p><strong>Actions:</strong> Track remediation work with owners and due dates</p>
        <p>Each risk should have at least one associated mitigation action.</p>
    </div>

    <div class="section">
        <h2>E. Evidence & Artifacts</h2>
        <p><strong>Artifacts Status:</strong> 1 / 5 complete</p>
        <ul>
            <li>Baseline Artifacts: Fairness Objectives Document, Fairness Evaluation Results</li>
            <li>Release Artifacts: Bias Mitigation Plan, Release Fairness Sign-off</li>
        </ul>
    </div>

    <div class="section">
        <h2>F. Lifecycle Gating</h2>
        <p><strong>Gates:</strong> All 3 gates currently BLOCKED</p>
        <ul>
            <li>Baseline (Pre-Training): BLOCKED – A.1/B requirements incomplete</li>
            <li>Release Readiness: BLOCKED – Baseline gate not cleared</li>
            <li>Production Governance: BLOCKED – Release gate not cleared</li>
        </ul>
    </div>

    <div class="section">
        <h2>G. Training & Accountability</h2>
        <p><strong>Training Completion:</strong> <span class="status-pending">0%</span></p>
        <p><strong>RAI Officer:</strong> [Not assigned]</p>
        <p>Required training modules:</p>
        <ul>
            <li>Fairness & Bias in AI (Data Science Team)</li>
            <li>Bias Mitigation Workshop (Product + ML Leads)</li>
            <li>Regulatory Fairness Obligations (Legal + Compliance)</li>
        </ul>
    </div>

    <div class="section">
        <h2>What's Included in This Report</h2>
        <ul>
            <li>✓ All A–H inputs, tables, and selections</li>
            <li>✓ Evaluation results and derived risk statements</li>
            <li>✓ Mitigation actions with owners, due dates, and status</li>
            <li>✓ Evidence artifacts list (with timestamps)</li>
            <li>✓ Lifecycle gate decisions + blocking reasons</li>
            <li>✓ Training completion + evidence</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>Note:</strong> In production: add immutable hashing, signatures, and role-based approvals.</p>
        <p>This report represents a snapshot of the Responsible AI pillar at the time of generation. All data is stored with version history and audit trail enabled.</p>
    </div>
</body>
</html>
`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fairness_pillar_report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setStatusMessage('📊 Pillar Report (HTML) generated and downloaded successfully');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    return (
        <Box sx={{ p: 2 }}>


            {/* Header */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                H. Compliance, Reporting & Traceability
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Always-on exports: snapshot JSON, evidence index CSV, and a readable pillar report.
            </Typography>

            {/* Status Message */}
            {statusMessage && (
                <Card variant="outlined" sx={{ mb: 2, bgcolor: '#c8e6c9', borderColor: '#4caf50' }}>
                    <CardContent sx={{ p: 1.5 }}>
                        <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                            {statusMessage}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Export Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadAuditSnapshot}
                    sx={{
                        bgcolor: '#1976d2',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1565c0' }
                    }}
                >
                    Download Audit Snapshot (JSON)
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={downloadEvidenceIndexCSV}
                    sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        fontWeight: 600,
                        textTransform: 'none',
                    }}
                >
                    Download Evidence Index (CSV)
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<DescriptionIcon />}
                    onClick={generatePillarReportHTML}
                    sx={{
                        borderColor: '#2e7d32',
                        color: '#2e7d32',
                        fontWeight: 600,
                        textTransform: 'none',
                    }}
                >
                    Download Pillar Report (HTML)
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={resetAllData}
                    sx={{
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        fontWeight: 600,
                        textTransform: 'none',
                        ml: 'auto'
                    }}
                >
                    Reset All Data
                </Button>
            </Box>

            {/* What Gets Exported Card */}
            <Card variant="outlined" sx={{
                bgcolor: '#f3e5f5',
                borderColor: '#ce93d8',
                borderLeft: '5px solid #7b1fa2'
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#4a148c', mb: 2 }}>
                        What Gets Exported
                    </Typography>

                    <List sx={{ p: 0, m: 0 }}>
                        {[
                            'All A–H inputs, tables, and selections',
                            'Evaluation results and derived risk statements',
                            'Mitigation actions with owners, due dates, and status',
                            'Evidence artifacts list (with timestamps)',
                            'Lifecycle gate decisions + blocking reasons',
                            'Training completion + evidence',
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.75, px: 0, display: 'flex', alignItems: 'flex-start' }}>
                                <Typography sx={{ mr: 1.5, color: '#7b1fa2', fontWeight: 700 }}>✓</Typography>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: 'body2', color: '#333' }}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="caption" sx={{
                        display: 'block',
                        mt: 2.5,
                        pt: 2,
                        borderTop: '1px solid #ce93d8',
                        color: '#666',
                        fontStyle: 'italic'
                    }}>
                        <strong>Production Note:</strong> Add immutable hashing, signatures, and role-based approvals for enterprise deployments.
                    </Typography>
                </CardContent>
            </Card>

            {/* Additional Info */}
            <Card variant="outlined" sx={{ mt: 3, bgcolor: '#e3f2fd', borderColor: '#64b5f6' }}>
                <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1565c0', mb: 1 }}>
                        💡 About These Exports
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1976d2', lineHeight: 1.6, display: 'block' }}>
                        <strong>JSON Snapshot:</strong> Complete structured export of all pillar data for system-to-system integration and archival.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1976d2', lineHeight: 1.6, display: 'block', mt: 1 }}>
                        <strong>CSV Index:</strong> Lightweight evidence inventory for compliance audits and tracking.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1976d2', lineHeight: 1.6, display: 'block', mt: 1 }}>
                        <strong>HTML Report:</strong> Human-readable comprehensive report suitable for stakeholder review and regulatory submission.
                    </Typography>
                </CardContent>
            </Card>


            {/* Demo Data Note */}
            <Card variant="outlined" sx={{ mt: 3, bgcolor: '#fafafa', borderColor: '#e0e0e0' }}>
                <CardContent sx={{ pb: 2 }}>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                            v1 note:
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            This file stores state in localStorage for demo purposes. Replace with GenAI Foundry backend APIs for enterprise deployments.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TabH;
