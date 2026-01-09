import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";

export default function TabCTrainingReadiness() {
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
                        C. Training-Time Explainability Readiness (DFA + Config)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                        Ingest Data Foundation Analyzer signals and determine whether citations and explanations can be trusted before training.
                        DFA does not write to Guardian directly; it generates risks/actions and constrains policy.
                    </Typography>
                </Box>


            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
                <Button variant="outlined">Load Sample DFA</Button>
                <Button variant="outlined">Paste DFA JSON</Button>
                <Button variant="contained">Apply DFA → Risks</Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Grid 3 - Status */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="subtitle2">DFA Snapshot Status</Typography>
                    <Chip label="No DFA loaded" variant="outlined" sx={{ mt: 0.5 }} />
                    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        Load or paste DFA JSON to assess training-time explainability readiness.
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="subtitle2">Training Readiness (Explainability)</Typography>
                    <Chip label="—" variant="outlined" sx={{ mt: 0.5 }} />
                    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        Derived from DFA + coverage requirements.
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="subtitle2">Auto-Generated Controls</Typography>
                    <Typography
                        variant="caption"
                        component="pre"
                        sx={{
                            mt: 0.5,
                            p: 1,
                            bgcolor: "background.default",
                            borderRadius: 1,
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        —
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Checklist */}
            <Typography variant="subtitle1" color="black" fontWeight={600} mb={1}>
                Training Readiness Checklist
            </Typography>

            <Box sx={{
                overflowX: "auto",
                maxHeight: 320,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
            }}>
                <Table stickyHeader
                    sx={{
                        minWidth: 800,
                        "& th, & td": {
                            borderRight: "1px solid",
                            borderColor: "divider",
                        },
                        "& th:last-of-type, & td:last-of-type": {
                            borderRight: 0,
                        },
                    }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Check</TableCell>
                            <TableCell>Input</TableCell>
                            <TableCell>Result</TableCell>
                            <TableCell>Follow-up</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[
                            {
                                check: "Are sources stable (no conflicting versions)?",
                                input: "DFA: conflicting_versions_detected",
                                followUp:
                                    "If failing: pin approved versions; block training for mandatory citation outputs.",
                            },
                            {
                                check: "Is OCR quality acceptable for citations?",
                                input: "DFA: ocr_quality_avg",
                                followUp:
                                    "If failing: re-OCR or exclude docs from KB; citations become unreliable.",
                            },
                            {
                                check: "Are outdated docs present in citation scope?",
                                input: "DFA: outdated_docs_detected",
                                followUp:
                                    "If failing: curate KB; exclude outdated docs; require doc pinning.",
                            },
                            {
                                check: "Is PII detected that restricts quoting/citations?",
                                input: "DFA: pii_detected / pii_files_flagged",
                                followUp:
                                    "If failing: redact/exclude; switch to restricted citations policy for those sources.",
                            },
                            {
                                check: "Is duplication too high causing ambiguous citations?",
                                input: "DFA: duplicates_detected",
                                followUp:
                                    "If failing: deduplicate; create single approved knowledge set with citations.",
                            },
                        ].map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{row.check}</TableCell>
                                <TableCell>{row.input}</TableCell>
                                <TableCell>—</TableCell>
                                <TableCell>{row.followUp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>


            <Box sx={{
                marginTop: 2,
                padding: "12px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid lightgray",
                borderLeft: "4px solid #184ea4"
            }}>
                <Typography variant="body2" color="black" mt={0} display="block">
                    Output: This section creates data-driven constraints for citations, and generates risks/actions before SFT/DPO begins.
                </Typography>
            </Box>


        </>
    );
}
