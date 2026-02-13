import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Button,
    Stack,
} from "@mui/material";

/**
 * Helpers
 */

export const emptyRisk = () => ({
    id: Date.now() + Math.random(), // reduce collision risk
    severity: "High",
    type: "Access boundary",
    details:
        "Entitlement mapping incomplete for one document repository (role→folder).",
    owner: "Head of Platform Engineering",
    status: "Mitigating",
});

export const severityColor = (sev) => {
    if (sev === "High") return "warning";
    return "default";
};

export const statusColor = (status) => {
    if (status === "Closed") return "success";
    if (status === "Mitigating") return "warning";
    return "default";
};

/**
 * Component
 */

export default function RiskRegisterCard() {
    const [risks, setRisks] = useState([
        emptyRisk(),
        emptyRisk(),
        { ...emptyRisk(), status: "Closed" },
    ]);

    const resolveRisk = (index) => {
        setRisks((prev) =>
            prev.map((r, i) => (i === index ? { ...r, status: "Closed" } : r))
        );
    };

    return (
        <Card variant="outlined">
            <CardContent>
                {/* Header */}
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                    Risk Register
                </Typography>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1} mb={2}>
                    <Button
                        variant="outlined"
                        onClick={() => setRisks((r) => [...r, emptyRisk()])}
                    >
                        Add Manual Risk
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => console.log("Save E:", risks)}
                    >
                        Save E
                    </Button>
                </Stack>

                {/* Table wrapper */}
                <Box
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        overflowX: "auto",
                    }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell width={160}>Severity</TableCell>
                                <TableCell width={220}>Risk Type</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell width={180}>Owner</TableCell>
                                <TableCell width={160}>Status</TableCell>
                                <TableCell width={120}>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {risks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Typography color="text.secondary">
                                            No risks yet.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                risks.map((risk, i) => (
                                    <TableRow key={risk.id} hover>
                                        <TableCell>
                                            <Chip
                                                label={risk.severity}
                                                color={severityColor(risk.severity)}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>{risk.type}</TableCell>

                                        <TableCell>{risk.details}</TableCell>

                                        <TableCell>{risk.owner}</TableCell>

                                        <TableCell>
                                            <Chip
                                                label={risk.status}
                                                color={statusColor(risk.status)}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {risk.status !== "Closed" ? (
                                                <Button
                                                    size="small"
                                                    onClick={() => resolveRisk(i)}
                                                >
                                                    Resolve
                                                </Button>
                                            ) : (
                                                <Chip
                                                    label="Closed"
                                                    color="success"
                                                    size="small"
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </CardContent>
        </Card>
    );
}

/**
 * Lightweight tests (runtime sanity checks)
 * These run once on module load in dev environments.
 */

function runTests() {
    const r = emptyRisk();
    console.assert(r.status === "Mitigating", "emptyRisk default status");
    console.assert(
        severityColor("High") === "warning",
        "severity color mapping"
    );
    console.assert(
        statusColor("Closed") === "success",
        "status color mapping"
    );
}

// Execute tests safely
try {
    runTests();
} catch (e) {
    console.warn("RiskRegisterCard tests failed:", e);
}
