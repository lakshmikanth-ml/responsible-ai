import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Autocomplete, TableContainer
} from "@mui/material";
import { useState } from "react";

/**
 * AuditTrail (ALL-IN-ONE)
 * - Self contained
 * - No props required
 * - MUI v7 compatible
 * - Button enabled only when values exist
 * - Table same as original HTML
 */

const OWNER_ROLES = [
    { label: "Product Owner", value: "Product Owner" },
    { label: "AI Product Manager", value: "AI Product Manager" },
    { label: "MLOps / Platform Owner", value: "MLOps / Platform Owner" },
    { label: "SRE / DevOps Lead", value: "SRE / DevOps Lead" },
    { label: "Security Lead", value: "Security Lead" },
];

export default function AuditTrail() {
    const [actor, setActor] = useState(null);
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);

    const canAdd = Boolean(actor && note.trim());

    const handleAdd = () => {
        if (!canAdd) return;

        setNotes((prev) => [
            ...prev,
            {
                ts: new Date().toLocaleString(),
                text: `${actor.label}: ${note}`,
            },
        ]);

        setActor(null);
        setNote("");
    };

    return (
        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={600}>Audit Trail Notes</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAdd}
                        disabled={!canAdd}
                    >
                        Add Note
                    </Button>
                </Stack>

                {/* Inputs */}
                <Grid container spacing={2} mt={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Autocomplete
                            size="small"
                            options={OWNER_ROLES}
                            value={actor}
                            onChange={(_, value) => setActor(value)}
                            getOptionLabel={(o) => o?.label || ""}
                            isOptionEqualToValue={(opt, val) => opt?.value === val?.value}
                            renderInput={(params) => (
                                <TextField {...params} size="small" label="Actor Role" />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                            size="small"
                            fullWidth
                            label="Note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g., Updated latency threshold after UAT peak test results"
                        />
                    </Grid>
                </Grid>

                {/* Table (same as original) */}
                <TableContainer sx={{
                    mt: 2,
                    border: "1px solid #ccc", borderRadius: 2
                }}>
                    <Table size="small"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Entry</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        No audit notes yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                notes.map((n, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{n.ts}</TableCell>
                                        <TableCell>{n.text}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
