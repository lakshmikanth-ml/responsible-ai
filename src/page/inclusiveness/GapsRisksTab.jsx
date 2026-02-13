/*
  E. Gaps & Risks Tab – Inclusiveness
  ---------------------------------
  • React + MUI v7
  • useFormik (controlled by parent index)
  • Risks are GENERATED (derived) but persisted
  • Two-column layout with right-side sidebar
*/

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Grid,
    Card,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    MenuItem,
    TextField,
    TableContainer,
    Paper,
    Stack,
    Chip,
    Divider,
} from "@mui/material";

/* ================= INITIAL VALUES ================= */
export const GAPS_RISKS_INITIAL_VALUES = {
    risks: [],
};

const validationSchema = Yup.object({}); // risks are derived, no manual validation

export default function GapsRisksTab({ initialValues, onSave, onGenerateRisks, onClearRisks }) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => onSave(values),
    });

    const [actionItems, setActionItems] = useState([]);
    const [policyPreviewData, setPolicyPreviewData] = useState({});
    const [coveragePercent, setCoveragePercent] = useState(0);
    const [evidenceApproved, setEvidenceApproved] = useState(0);
    const [criticalRisks, setCriticalRisks] = useState(0);

    const priorityColor = (priority) => {
        if (!priority) return 'default';
        const p = String(priority).toLowerCase();
        if (p.includes('high')) return 'error';
        if (p.includes('med')) return 'warning';
        return 'default';
    };

    const formatJsonPreview = (obj) => {
        try { return JSON.stringify(obj, null, 2); } catch (e) { return String(obj); }
    };

    const handleLoadSampleLocal = () => {
        if (onGenerateRisks) onGenerateRisks();
        setActionItems([
            { priority: 'High', action: 'Assign owner for missing DFA', owner: 'Data' },
            { priority: 'Medium', action: 'Schedule additional testing', owner: 'Design' },
        ]);
        setPolicyPreviewData({ preview: 'Gaps & Risks policy', version: '0.1' });
        setCoveragePercent(75);
        setEvidenceApproved(3);
        setCriticalRisks((formik.values.risks || []).filter(r => r.severity === 'high').length);
    };

    const handleGenerateLocalSummary = () => {
        const risks = formik.values.risks || [];
        const pct = risks.length ? Math.round(((risks.length - risks.filter(r => r.status === 'mitigated').length) / risks.length) * 100) : 0;
        setCoveragePercent(pct);
        setEvidenceApproved(Math.max(0, risks.length - 2));
        setCriticalRisks(risks.filter(r => r.severity === 'high').length);
        // generate action items from risks
        const items = [];
        risks.forEach((r, idx) => {
            if (!r.status || r.status !== 'mitigated') {
                const priority = (r.severity || '').toLowerCase().includes('high') ? 'High' : 'Medium';
                items.push({ id: `risk-${idx}`, priority, action: r.risk || r.summary || 'Investigate risk', owner: r.owner || 'TBD', status: r.status || 'open' });
            }
        });
        setActionItems(items);
    };

    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* LEFT: main content */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography fontWeight={700} mb={1}>E. Gaps & Risks</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Risks are generated from missing items across A–D, missing evidence approvals, and missing monitoring. Assign owners and track.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button variant="outlined" onClick={onGenerateRisks}>Generate Risks</Button>
                        <Button variant="outlined" color="error" onClick={onClearRisks}>Clear Risks</Button>
                    </Box>

                    {/* Risks Table */}
                    <TableContainer sx={{ mb: 2 }}
                        component={Paper}>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell>SEVERITY</TableCell>
                                    <TableCell>RISK</TableCell>
                                    <TableCell>STATUS</TableCell>
                                    <TableCell>OWNER</TableCell>
                                    <TableCell>RECOMMENDED ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formik.values.risks.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No risks generated yet.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {formik.values.risks.map((row, i) => (
                                    <TableRow key={row.key}>
                                        <TableCell>
                                            <TextField
                                                select size="small"
                                                value={row.severity}
                                                onChange={(e) => formik.setFieldValue(`risks.${i}.severity`, e.target.value)}
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell>{row.risk}</TableCell>
                                        <TableCell>
                                            <TextField
                                                select size="small"
                                                value={row.status}
                                                onChange={(e) => formik.setFieldValue(`risks.${i}.status`, e.target.value)}
                                            >
                                                <MenuItem value="open">Open</MenuItem>
                                                <MenuItem value="mitigated">Mitigated</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                select size="small"
                                                value={row.owner}
                                                onChange={(e) => formik.setFieldValue(`risks.${i}.owner`, e.target.value)}
                                            >
                                                <MenuItem value="product">Product</MenuItem>
                                                <MenuItem value="design">Design</MenuItem>
                                                <MenuItem value="ml">ML Engineering</MenuItem>
                                                <MenuItem value="qa">QA</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell>{row.recommendedAction}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button variant="contained" onClick={formik.handleSubmit}>Save E</Button>
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
                                    onClick={handleLoadSampleLocal}
                                >
                                    Load Sample
                                </Button>
                                <Button variant="contained" size="small" onClick={handleGenerateLocalSummary}>
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
                                        {actionItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">No data found</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            actionItems.map((row, i) => (
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
                                            ))
                                        )}
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
