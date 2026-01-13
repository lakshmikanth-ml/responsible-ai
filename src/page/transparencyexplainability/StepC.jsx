import { useState } from "react";
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

const CHECKLIST = [
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
            "If failing: re-OCR or exclude docs; citations become unreliable.",
    },
    {
        check: "Are outdated docs present in citation scope?",
        input: "DFA: outdated_docs_detected",
        followUp:
            "If failing: curate KB; exclude outdated docs; require pinning.",
    },
    {
        check: "Is PII detected that restricts quoting/citations?",
        input: "DFA: pii_detected",
        followUp:
            "If failing: redact/exclude; switch to restricted citation policy.",
    },
    {
        check: "Is duplication too high causing ambiguous citations?",
        input: "DFA: duplicates_detected",
        followUp:
            "If failing: deduplicate; create single approved knowledge set.",
    },
];

export default function TabCTrainingReadiness() {
    const [dfaLoaded, setDfaLoaded] = useState(false);
    const [readiness, setReadiness] = useState("—");
    const [controls, setControls] = useState("—");
    const [results, setResults] = useState({});

    const loadSampleDFA = () => {
        setDfaLoaded(true);
        setResults({
            0: "PASS",
            1: "PASS",
            2: "FAIL",
            3: "PASS",
            4: "PASS",
        });
        setReadiness("PARTIAL");
        setControls(
            "- Pin approved document versions\n- Exclude outdated docs\n- Enforce citation policy"
        );
    };

    const applyDfaToRisks = () => {
        if (!dfaLoaded) return;
        setReadiness("READY");
    };

    return (
        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                {/* HEADER */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            C. Training-Time Explainability Readiness (DFA + Config)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Ingest Data Foundation Analyzer signals and determine whether
                            citations and explanations can be trusted before training.
                        </Typography>
                    </Box>

                    <Stack direction="row" flexDirection={"column"} justifyContent={"flex-start"}
                        rowGap={1}
                        alignItems={"flex-start"} >

                        <Button variant="outlined" onClick={loadSampleDFA}>
                            Load Sample DFA
                        </Button>
                        <Button variant="outlined">Paste DFA JSON</Button>
                        <Button
                            variant="outlined"
                            disabled={!dfaLoaded}
                            onClick={applyDfaToRisks}
                        >
                            Apply DFA → Risks
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* STATUS GRID */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">DFA Snapshot Status</Typography>
                        <Chip
                            label={dfaLoaded ? "DFA Loaded" : "No DFA loaded"}
                            color={dfaLoaded ? "success" : "default"}
                            sx={{ mt: 0.5 }}
                        />
                        <Typography variant="caption" display="block" mt={0.5}>
                            Load or paste DFA JSON to assess readiness.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">
                            Training Readiness (Explainability)
                        </Typography>
                        <Chip
                            label={readiness}
                            color={
                                readiness === "READY"
                                    ? "success"
                                    : readiness === "PARTIAL"
                                        ? "warning"
                                        : "default"
                            }
                            sx={{ mt: 0.5 }}
                        />
                        <Typography variant="caption" display="block" mt={0.5}>
                            Derived from DFA + coverage requirements.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">
                            Auto-Generated Controls
                        </Typography>
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
                            {controls}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* CHECKLIST */}
                <Typography fontWeight={600} mb={1}>
                    Training Readiness Checklist
                </Typography>

                <Box
                    sx={{
                        overflowX: "auto",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        maxHeight: 320,
                    }}
                >
                    <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Check</TableCell>
                                <TableCell>Input</TableCell>
                                <TableCell>Result</TableCell>
                                <TableCell>Follow-up</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {CHECKLIST.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{row.check}</TableCell>
                                    <TableCell>{row.input}</TableCell>
                                    <TableCell>
                                        {results[idx] ? (
                                            <Chip
                                                size="small"
                                                label={results[idx]}
                                                color={results[idx] === "PASS" ? "success" : "error"}
                                            />
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>
                                    <TableCell>{row.followUp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                {/* CALLOUT */}
                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderLeft: "4px solid #184ea4",
                        background: "#f8fafc",
                    }}
                >
                    <Typography variant="body2">
                        Output: This section creates data-driven constraints for citations,
                        and generates risks/actions before SFT/DPO begins.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
