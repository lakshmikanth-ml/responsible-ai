import React, { useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const emptyMitigation = () => ({
    id: Date.now(),
    mitigation: "Guardian policy enforcement rollout",
    where: "Guardian",
    risk: "Access boundary gap",
    owner: "Platform Security",
    due: "2026-03-01",
    status: "Open",
});

export default function TabFMitigation() {
    const [mitigations, setMitigations] = useState([]);

    /* helpers */

    const updateStatus = (i, status) => {
        setMitigations(prev =>
            prev.map((m, idx) =>
                idx === i ? { ...m, status } : m
            )
        );
    };

    const deleteRow = i =>
        setMitigations(prev => prev.filter((_, idx) => idx !== i));

    const addMitigation = () =>
        setMitigations(prev => [...prev, emptyMitigation()]);

    const saveData = () => {
        console.log("Save F:", mitigations);
        localStorage.setItem(
            "mitigation_plan",
            JSON.stringify(mitigations)
        );
    };

    const statusColor = status => {
        if (status === "Completed") return "success";
        if (status === "In Progress") return "warning";
        if (status === "Blocked") return "error";
        return "default";
    };

    /* UI */

    return (
        <Box>

            {/* HEADER */}

            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
                mb={1}
            >
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        F. Mitigation (What We Will Implement)
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Structured mitigation tasks mapped to risks.
                    </Typography>
                </Box>


            </Stack>
            <Stack direction="row" spacing={1} mb={2}>
                <Button variant="outlined" onClick={addMitigation}>
                    Add Mitigation
                </Button>

                <Button variant="contained" onClick={saveData}>
                    Save F
                </Button>
            </Stack>

            {/* TABLE */}

            <Card variant="outlined">
                <CardContent>

                    <Typography fontWeight={600} mb={2}>
                        Mitigation Plan
                    </Typography>

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
                                    <TableCell width={220}>Mitigation</TableCell>
                                    <TableCell width={160}>Where</TableCell>
                                    <TableCell width={220}>Maps to Risk</TableCell>
                                    <TableCell width={180}>Owner</TableCell>
                                    <TableCell width={170}>Due</TableCell>
                                    <TableCell width={140}>Status</TableCell>
                                    <TableCell width={220}>Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {mitigations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography
                                                color="text.secondary"
                                                fontWeight={600}
                                            >
                                                No mitigations yet. Add mitigations for
                                                critical/high risks.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {mitigations.map((m, i) => (
                                    <TableRow key={m.id} hover>

                                        <TableCell>{m.mitigation}</TableCell>
                                        <TableCell>{m.where}</TableCell>
                                        <TableCell>{m.risk}</TableCell>
                                        <TableCell>{m.owner}</TableCell>
                                        <TableCell>{m.due}</TableCell>

                                        {/* STATUS CHIP */}

                                        <TableCell>
                                            <Chip
                                                label={m.status}
                                                color={statusColor(m.status)}
                                                size="small"
                                            />
                                        </TableCell>

                                        {/* ACTION WORKFLOW */}

                                        <TableCell>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">

                                                {m.status === "Open" && (
                                                    <>
                                                        <Chip
                                                            label="Start"
                                                            clickable
                                                            size="small"
                                                            onClick={() =>
                                                                updateStatus(i, "In Progress")
                                                            }
                                                        />
                                                        <Chip
                                                            label="Block"
                                                            color="error"
                                                            clickable
                                                            size="small"
                                                            onClick={() =>
                                                                updateStatus(i, "Blocked")
                                                            }
                                                        />
                                                    </>
                                                )}

                                                {m.status === "In Progress" && (
                                                    <>
                                                        <Chip
                                                            label="Complete"
                                                            color="success"
                                                            clickable
                                                            size="small"
                                                            onClick={() =>
                                                                updateStatus(i, "Completed")
                                                            }
                                                        />
                                                        <Chip
                                                            label="Block"
                                                            color="error"
                                                            clickable
                                                            size="small"
                                                            onClick={() =>
                                                                updateStatus(i, "Blocked")
                                                            }
                                                        />
                                                    </>
                                                )}

                                                {m.status === "Blocked" && (
                                                    <Chip
                                                        label="Resume"
                                                        clickable
                                                        size="small"
                                                        onClick={() =>
                                                            updateStatus(i, "In Progress")
                                                        }
                                                    />
                                                )}

                                                {m.status === "Completed" && (
                                                    <Chip
                                                        label="Done"
                                                        color="success"
                                                        size="small"
                                                    />
                                                )}



                                            </Stack>
                                        </TableCell>

                                    </TableRow>
                                ))}

                            </TableBody>

                        </Table>
                    </Box>

                </CardContent>
            </Card>

            {/* CALLOUT */}

            <Box
                sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    background: "#f8fafc",
                    borderLeft: "4px solid #184ea4",
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Mitigations should close risks and flip gates from BLOCKED → CLEAR.
                    In production, mitigation status links to your project management system.
                </Typography>
            </Box>

        </Box>
    );
}
