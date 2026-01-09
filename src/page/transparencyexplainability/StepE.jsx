
import { useState } from "react";
import {
    TablePagination,
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Divider,
    Grid,
    Chip,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    MenuItem,
    IconButton,
    Tooltip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RiskDrawer from "./RiskDrawer";




const rowsData = [
    {
        id: "RISK_d3e370_93586f",
        title: "Citation integrity below threshold",
        desc: "Citation integrity score is 0%, below threshold 95%.",
        severity: "Critical",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
    {
        id: "RISK_352fac_93586f",
        title: "Explainability coverage below threshold",
        desc: "Explainability coverage score is 0%, below threshold 90%.",
        severity: "Critical",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
    {
        id: "RISK_6972fd_93586f",
        title: "Explanation clarity below threshold",
        desc: "Clarity score is 0%, below threshold 85%.",
        severity: "Warning",
        stage: "release",
        source: "Evaluation",
        status: "open",
    },
];


export default function TabERisks() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRisk, setSelectedRisk] = useState(null);

    const pagedRows = rowsData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>

            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
            >
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        E. Gaps, Risks & Failure Modes (Risk Register)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                        Single source of truth for explainability risks. Risks can originate from DFA, Evaluation, Guardian, or SME feedback.
                    </Typography>
                </Box>


            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
                <Button variant="outlined">Add Risk</Button>
                <Button variant="outlined">Bulk Import Risks</Button>
                <Button variant="contained">Save E</Button>
            </Stack>


            {/* KPI Tiles */}
            <Grid container spacing={2} mt={2} mb={2}>
                {[
                    {
                        title: "Critical Open Risks",
                        value: "2",
                        desc: "Any critical open risk blocks Release.",
                    },
                    {
                        title: "Warnings Open",
                        value: "1",
                        desc: "Warnings may set gate to Conditional.",
                    },
                    {
                        title: "Risk Sources",
                        value: "Evaluation",
                        desc: "DFA / Evaluation / Guardian / SME",
                        mono: true,
                    },
                ].map((kpi) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kpi.title}>
                        <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                            <Typography variant="caption" color="text.secondary">
                                {kpi.title}
                            </Typography>
                            <Typography
                                variant="h5"
                                mt={0.5}
                                sx={kpi.mono ? { fontFamily: "monospace", fontSize: 14 } : undefined}
                            >
                                {kpi.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {kpi.desc}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>



            <Box
                sx={{
                    overflowX: "auto",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                }}
            >
                <Table stickyHeader sx={{ minWidth: 900 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Risk ID</TableCell>
                            <TableCell>Issue</TableCell>
                            <TableCell>Severity</TableCell>
                            <TableCell>Stage Impact</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Link</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pagedRows.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ fontFamily: "monospace" }}>{row.id}</TableCell>

                                <TableCell>
                                    <strong>{row.title}</strong>
                                    <br />
                                    <small>{row.desc}</small>
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={row.severity}
                                        color={row.severity === "Critical" ? "error" : "warning"}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Chip size="small" label={row.stage} variant="outlined" />
                                </TableCell>

                                <TableCell>
                                    <Chip size="small" label={row.source} color="info" />
                                </TableCell>

                                <TableCell>
                                    <TextField select size="small" value={row.status}>
                                        <MenuItem value="open">open</MenuItem>
                                        <MenuItem value="done">done</MenuItem>
                                    </TextField>
                                </TableCell>

                                <TableCell align="center">
                                    <Tooltip title="View Risk">
                                        <IconButton size="small" onClick={() => setSelectedRisk(row)}>
                                            <OpenInNewIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={rowsData.length}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Box>





            <Box sx={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid lightgray",
                borderLeft: "4px solid #184ea4"
            }}>
                <Typography variant="body2" color="black" mt={0.5} display="block">
                    Each Critical risk must have a mitigation action in section F and evidence in section G.
                    Closing a critical risk requires re-check in section D (or runtime confirmation in H).                </Typography>
            </Box>

            {/* Drawer */}
            <RiskDrawer
                open={!!selectedRisk}
                risk={selectedRisk}
                onClose={() => setSelectedRisk(null)}
            />

        </>

    );
}
