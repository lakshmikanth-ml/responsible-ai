import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Button, Alert, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, List,
    ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
// import {
//     Box,
//     Typography,
//     Card,
//     CardContent,
//     Button,
//     Alert,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Chip,
//     List,
//     ListItem,
//     ListItemText,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Chip,
// } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import SendIcon from '@mui/icons-material/Send';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const STORAGE_KEY_TAB_F = 'TabF_DemoData';

const defaultGatesData = {
    gates: [
        {
            stage: 'Baseline (Pre-Training)',
            status: 'BLOCKED',
            blockers: [
                'A.1 objectives incomplete',
                'B.1 metrics configuration incomplete',
                'B.2 evaluation not run',
                'Missing baseline artifacts: Fairness Objectives Document, Fairness Evaluation Results',
            ],
            requiredApprovals: 'RAI Officer + ML Lead',
            approvers: ['RAI Officer', 'ML Lead'],
            approved: [],
        },
        {
            stage: 'Release Readiness',
            status: 'BLOCKED',
            blockers: [
                'Baseline gate not cleared',
                'Missing release artifacts: Bias Mitigation Plan, Release Fairness Sign-off',
            ],
            requiredApprovals: 'RAI Officer + Compliance',
            approvers: ['RAI Officer', 'Compliance Officer'],
            approved: [],
        },
        {
            stage: 'Production Governance',
            status: 'BLOCKED',
            blockers: [
                'Release readiness not cleared',
                'Training modules incomplete (3)',
            ],
            requiredApprovals: 'RAI Officer + Risk Committee',
            approvers: ['RAI Officer', 'Risk Committee Lead'],
            approved: [],
        },
    ],
};

const TabF = () => {
    const [gatesData, setGatesData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_TAB_F);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed || defaultGatesData;
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return defaultGatesData;
    });

    const [statusMessage, setStatusMessage] = useState('');
    const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
    const [selectedStage, setSelectedStage] = useState(null);
    const [approvalNotes, setApprovalNotes] = useState('');

    // Persist data to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_TAB_F, JSON.stringify(gatesData));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [gatesData]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'BLOCKED':
                return { bg: '#ffcdd2', border: '#f44336', accent: '#d32f2f', icon: BlockIcon };
            case 'READY':
                return { bg: '#c8e6c9', border: '#4caf50', accent: '#2e7d32', icon: CheckCircleIcon };
            case 'APPROVED':
                return { bg: '#a5d6a7', border: '#2e7d32', accent: '#1b5e20', icon: CheckCircleIcon };
            default:
                return { bg: '#fff3e0', border: '#ffb74d', accent: '#f57c00', icon: BlockIcon };
        }
    };

    const requestApproval = (stage) => {
        setSelectedStage(stage);
        setApprovalNotes('');
        setApprovalDialogOpen(true);
    };

    const handleSubmitApprovalRequest = () => {
        if (!approvalNotes.trim()) {
            setStatusMessage('❌ Please add notes for the approval request.');
            return;
        }

        setGatesData(prev => {
            const updated = prev.gates.map(gate => {
                if (gate.stage === selectedStage) {
                    return {
                        ...gate,
                        approved: [
                            ...gate.approved,
                            {
                                requestedAt: new Date().toISOString(),
                                notes: approvalNotes,
                                status: 'Pending',
                            },
                        ],
                    };
                }
                return gate;
            });
            return { ...prev, gates: updated };
        });

        setApprovalDialogOpen(false);
        setStatusMessage(`✓ Approval request submitted for ${selectedStage}`);
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const resetAll = () => {
        if (window.confirm('Are you sure you want to reset all demo data? This action cannot be undone.')) {
            setGatesData(defaultGatesData);
            setStatusMessage('');
            try {
                localStorage.removeItem(STORAGE_KEY_TAB_F);
            } catch (e) {
                console.error('Failed to clear localStorage:', e);
            }
            alert('Demo data has been reset to defaults.');
        }
    };

    return (
        <Box sx={{ p: 2 }}>


            {/* Header */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                F. Lifecycle Gating
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Baseline → Release Readiness → Production governance gates computed from pillar state.
            </Typography>

            {/* Status Message */}
            {statusMessage && (
                <Alert severity={statusMessage.includes('✓') ? 'success' : 'error'} sx={{ mb: 2 }}>
                    {statusMessage}
                </Alert>
            )}

            {/* Gates Table */}
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 700, minWidth: 220, color: '#1a1a1a' }}>
                                Stage
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 140, color: '#1a1a1a' }}>
                                Gate Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 300, color: '#1a1a1a' }}>
                                Blocking Reasons
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, minWidth: 180, color: '#1a1a1a' }}>
                                Required Approvals
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gatesData.gates.map((gate, index) => {
                            const statusColor = getStatusColor(gate.status);
                            const StatusIcon = statusColor.icon;

                            return (
                                <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {gate.stage}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <StatusIcon sx={{ fontSize: 18, color: statusColor.accent }} />
                                            <Chip
                                                label={gate.status}
                                                size="small"
                                                sx={{
                                                    bgcolor: statusColor.bg,
                                                    borderColor: statusColor.border,
                                                    color: statusColor.accent,
                                                    fontWeight: 700,
                                                }}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        {gate.blockers.length > 0 ? (
                                            <List sx={{ p: 0, m: 0, '& .MuiListItem-root': { py: 0.5, px: 0 } }}>
                                                {gate.blockers.map((blocker, idx) => (
                                                    <ListItem key={idx} sx={{ display: 'list-item', ml: 2 }}>
                                                        <ListItemText
                                                            primary={blocker}
                                                            primaryTypographyProps={{ variant: 'caption', color: '#666' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                                                ✓ All requirements met
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                            {gate.requiredApprovals}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                            Approved: {gate.approved.length} / {gate.approvers.length}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => requestApproval('Baseline (Pre-Training)')}
                    sx={{
                        bgcolor: '#1976d2',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1565c0' }
                    }}
                >
                    Request Baseline Sign-off
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => requestApproval('Release Readiness')}
                    sx={{
                        bgcolor: '#1976d2',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1565c0' }
                    }}
                >
                    Request Release Sign-off
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => requestApproval('Production Governance')}
                    sx={{
                        bgcolor: '#1976d2',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1565c0' }
                    }}
                >
                    Request Production Enablement
                </Button>
            </Box>

            {/* Info Alert */}
            <Alert severity="info" sx={{ bgcolor: '#e3f2fd', borderColor: '#64b5f6', borderLeft: '4px solid #1976d2' }}>
                <Typography variant="caption" sx={{ color: '#1565c0', lineHeight: 1.6 }}>
                    <strong>💡 Tip:</strong> Approvals are requests in v1. In production: RBAC + workflow + evidence freeze + audit log. All gates must PASS before production deployment.
                </Typography>
            </Alert>

            {/* Approval Request Dialog */}
            <Dialog
                open={approvalDialogOpen}
                onClose={() => setApprovalDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1.5 }}>
                    Request Approval: {selectedStage || '—'}
                </DialogTitle>
                <DialogContent
                    sx={{
                        pt: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >


                    <Typography variant="body2" color="text.secondary">
                        Provide justification and context for this approval request. Required approvers will review and respond.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Approval Notes"
                        placeholder="Explain why this stage is ready for approval..."
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setApprovalDialogOpen(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitApprovalRequest}
                        variant="contained"
                        startIcon={<SendIcon />}
                    >
                        Submit Request
                    </Button>
                </DialogActions>
            </Dialog>

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

export default TabF;
