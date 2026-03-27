import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    TextField,
    Autocomplete,
    Divider,
    Chip,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
} from "@mui/material";
import { useState } from "react";
import AuditTrail from "./AuditNotes";

const OWNER_ROLES = [
    "Product Owner",
    "AI Product Manager",
    "Head of Data Science",
    "ML Engineering Lead",
    "MLOps / Platform Owner",
    "SRE / DevOps Lead",
    "Security Lead",
    "Compliance Officer",
    "Model Risk Owner",
    "Claims Ops SME",
    "Underwriting SME",
    "Customer Support Lead",
];

const INITIAL_EVIDENCE = [
    {
        id: "ev1",
        name: "Reliability Benchmarks (SLO/SLA)",
        required: true,
        type: "doc",
        owner: "MLOps / Platform Owner",
        file: null,
        approved: false,
    },
    {
        id: "ev2",
        name: "Stress / Load Test Report",
        required: true,
        type: "report",
        owner: "SRE / DevOps Lead",
        file: null,
        approved: false,
    },
    {
        id: "ev3",
        name: "Failover / Fallback Protocols",
        required: true,
        type: "doc",
        owner: "SRE / DevOps Lead",
        file: null,
        approved: false,
    },
    {
        id: "ev4",
        name: "Monitoring & Alerting Runbook",
        required: true,
        type: "runbook",
        owner: "MLOps / Platform Owner",
        file: null,
        approved: false,
    },
    {
        id: "ev5",
        name: "Incident Response Playbook",
        required: true,
        type: "playbook",
        owner: "SRE / DevOps Lead",
        file: null,
        approved: false,
    },
    {
        id: "ev6",
        name: "UAT Summary + Sign-off",
        required: false,
        type: "doc",
        owner: "Product Owner",
        file: null,
        approved: false,
    },
];

export default function TabGEvidence() {
    const [evidence, setEvidence] = useState(INITIAL_EVIDENCE);

    const updateEvidence = (id, field, value) => {
        setEvidence((prev) =>
            prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
        );
    };

    const approveRequired = () => {
        setEvidence((prev) =>
            prev.map((e) =>
                e.required ? { ...e, approved: true } : e
            )
        );
    };

    const clearEvidence = () => setEvidence(INITIAL_EVIDENCE);

    const allRequiredApproved = evidence
        .filter((e) => e.required)
        .every((e) => e.approved);

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            G. Evidence
                        </Typography>
                        <Typography variant="body2" >
                            Upload and approve evidence artifacts for audits and release defensibility.
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems={"baseline"} spacing={1}>
                        <Button variant="outlined" onClick={clearEvidence}>
                            Load Sample
                        </Button>
                        <Button variant="outlined" disabled={!allRequiredApproved}>
                            Save G
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* EVIDENCE VAULT */}
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6">
                                Evidence Vault (Local Demo Uploads)
                               <br /> <Typography variant="body2"
                                
                                    component="span" gutterBottom>
                                    Upload artifacts and mark them approved to satisfy gates and audits.
                                </Typography>
                            </Typography>
                            
                             <Chip
                                                        label={allRequiredApproved ? "INGESTED" : "MISSING"}
                                                        size="small"
                                                        sx={(theme) => ({
                                                            bgcolor: allRequiredApproved 
                                                                ? (theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)')
                                                                : (theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(251, 146, 60, 0.08)'),
                                                            border: '1px solid',
                                                            borderColor: allRequiredApproved 
                                                                ? (theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)')
                                                                : (theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.3)'),
                                                            color: allRequiredApproved ? '#4caf50' : '#f97316',
                                                            fontWeight: 600,
                                                        })}
                                                    />
                        </Stack>

                        <Stack direction="row" spacing={1} mt={1}>
                            <Button size="small" variant="outlined" onClick={approveRequired}>
                                Approve all required (demo)
                            </Button>
                            <Button size="small" variant="outlined" onClick={clearEvidence}>
                                Clear evidence uploads
                            </Button>
                        </Stack>

                        <TableContainer
                            sx={{
                                mt: 2,
                              
                            }}
                        >
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Evidence</TableCell>
                                        <TableCell>Owner</TableCell>
                                        <TableCell>Upload</TableCell>
                                        <TableCell>Approval</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {evidence.map((e) => (
                                        <TableRow key={e.id}>
                                            <TableCell>
                                                <b>{e.name}</b>
                                                <Box mt={0.5}>
                                                    {e.required && (
                                                        <Chip
                                                            label="Required"
                                                            size="small"
                                                            sx={{
                                                                mr: 0.5,
                                                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                                                                border: '1px solid',
                                                                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)',
                                                                color: '#f44336',
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    )}
                                                    <Chip 
                                                        label={e.type} 
                                                        size="small"
                                                        sx={(theme) => ({
                                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
                                                            border: '1px solid',
                                                            borderColor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)',
                                                            color: '#3b82f6',
                                                            fontWeight: 600,
                                                        })}
                                                    />
                                                </Box>
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 200 }}>
                                                <Autocomplete
                                             size="small"
                                      options={OWNER_ROLES}
                                                    value={e.owner}
                                                    onChange={(_, v) => updateEvidence(e.id, "owner", v)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} size="small" />
                                                    )}
                                                />
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 140 }}>
                                                {e.file ? (
                                                    <Chip 
                                                        label="Uploaded" 
                                                        size="small"
                                                        sx={(theme) => ({
                                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
                                                            border: '1px solid',
                                                            borderColor: theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
                                                            color: '#4caf50',
                                                            fontWeight: 600,
                                                        })}
                                                    />
                                                ) : (
                                                    <Chip 
                                                        label="MISSING" 
                                                        size="small"
                                                        sx={(theme) => ({
                                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(251, 146, 60, 0.08)',
                                                            border: '1px solid',
                                                            borderColor: theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.3)',
                                                            color: '#f97316',
                                                            fontWeight: 600,
                                                        })}
                                                    />
                                                )}
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 140 }}>
                                                <Chip
                                                    label={e.approved ? "APPROVED" : "PENDING"}
                                                    size="small"
                                                    sx={(theme) => ({
                                                        bgcolor: e.approved 
                                                            ? (theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)')
                                                            : (theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(251, 146, 60, 0.08)'),
                                                        border: '1px solid',
                                                        borderColor: e.approved 
                                                            ? (theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)')
                                                            : (theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.3)'),
                                                        color: e.approved ? '#4caf50' : '#f97316',
                                                        fontWeight: 600,
                                                    })}
                                                />
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 220 }}>
                                                <input
                                                    type="file"
                                                    style={{ fontSize: 12 }}
                                                    onChange={(ev) =>
                                                        updateEvidence(e.id, "file", ev.target.files?.[0])
                                                    }
                                                />
                                                <Box mt={1}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() =>
                                                            updateEvidence(e.id, "approved", !e.approved)
                                                        }
                                                    >
                                                        Toggle Approve
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box mt={2} color="text.secondary"
                           sx={{
                                border: '1px solid',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(171, 171, 171, 0.15)' 
                                    : '#888f9e',
                                background: (theme) => theme.palette.mode === 'dark' 
                                    ? 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)' 
                                    : 'linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
                                borderRadius: '14px',
                                padding: '12px',
                                color: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.9)' 
                                    : '#0b2a70'
                            }}>
                            Release Gate requires approved failover/fallback protocols and
                            incident response playbook (minimum).
                        </Box>
                    </CardContent>
                </Card>
            </CardContent>
            <Box pl={2} pr={2} pb={2}>
                <AuditTrail />

            </Box>
        </Card>
    );
}
