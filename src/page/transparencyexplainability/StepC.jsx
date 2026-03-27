import { useMemo, useState } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const CHECKLIST = [
    {
        check: "Are sources stable (no conflicting versions)?",
        input: "DFA: conflicting_versions_detected",
        key: "conflict",
        followUp:
            "If failing: pin approved versions; block training for mandatory citation outputs.",
    },
    {
        check: "Is OCR quality acceptable for citations?",
        input: "DFA: ocr_quality_avg",
        key: "ocr",
        followUp:
            "If failing: re-OCR or exclude docs; citations become unreliable.",
    },
    {
        check: "Are outdated docs present in citation scope?",
        input: "DFA: outdated_docs_detected",
        key: "outdated",
        followUp:
            "If failing: curate KB; exclude outdated docs; require pinning.",
    },
    {
        check: "Is PII detected that restricts quoting/citations?",
        input: "DFA: pii_detected / pii_files_flagged",
        key: "pii",
        followUp:
            "If failing: redact/exclude; switch to “restricted citations” policy for those sources.",
    },
    {
        check: "Is duplication too high causing ambiguous citations?",
        input: "DFA: duplicates_detected",
        key: "dupe",
        followUp:
            "If failing: deduplicate; create single approved knowledge set with citations.",
    },
];

const SAMPLE_DFA = {
    status: "DFA Loaded",
    meta:
        "Source: sharepoint | Location: /Underwriting/Policies | Files scanned: 12450 | Score: 74 | 2026-01-14T06:37:21.276Z",
    readiness: { label: "Not Ready (fix required)", tone: "warning" },
    controls: `{
  "citation_scope": "approved_kb_only",
  "pin_approved_versions": true,
  "exclude_outdated_docs": true,
  "reocr_required": false,
  "dedupe_required": true,
  "pii_citation_restriction": true
}`,
    checks: {
        conflict: "Fail",
        ocr: "Pass",
        outdated: "Warning",
        pii: "Restricted",
        dupe: "Warning",
    },
};

export default function TabCTrainingReadiness() {
    const [dfa, setDfa] = useState(null);
    const [pasteOpen, setPasteOpen] = useState(false);
    const [pasteValue, setPasteValue] = useState("");

    const readinessTone = useMemo(() => {
        if (!dfa) return { color: "default", label: "No DFA loaded" };
        if (dfa.readiness?.tone === "success") return { color: "success", label: dfa.readiness.label };
        if (dfa.readiness?.tone === "warning") return { color: "warning", label: dfa.readiness.label };
        return { color: "default", label: dfa.readiness?.label || "Not Ready" };
    }, [dfa]);

    const loadSampleDFA = () => {
        setDfa(SAMPLE_DFA);
        setPasteValue(JSON.stringify(SAMPLE_DFA, null, 2));
    };

    const applyDfaToRisks = () => {
        if (!dfa) return;
        setDfa((prev) =>
            prev
                ? {
                    ...prev,
                    readiness: { label: "Applied to Risks", tone: "success" },
                }
                : prev
        );
    };

    const handlePasteApply = () => {
        try {
            const parsed = JSON.parse(pasteValue);
            setDfa({
                status: parsed.status || "DFA Loaded",
                meta: parsed.meta || SAMPLE_DFA.meta,
                readiness: parsed.readiness || SAMPLE_DFA.readiness,
                controls:
                    parsed.controls ||
                    JSON.stringify(parsed.auto_controls || SAMPLE_DFA.controls, null, 2),
                checks: parsed.checks || SAMPLE_DFA.checks,
            });
            setPasteOpen(false);
        } catch (err) {
            alert("Invalid JSON. Please check and try again.");
        }
    };

    const getStatusChip = (value) => {
        const val = (value || "").toLowerCase();
        if (val.includes("pass")) return { color: "success", label: value };
        if (val.includes("fail") || val.includes("not ready")) return { color: "error", label: value };
        if (val.includes("warn") || val.includes("restrict")) return { color: "warning", label: value };
        return { color: "default", label: value || "—" };
    };

    return (
        <Card variant="outlined" sx={{ mt: 0 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            C. Training-Time Explainability Readiness (DFA + Config)
                        </Typography>
                        <Typography variant="body2"
                          mt={0.5}>
                            Ingest Data Foundation Analyzer signals and determine whether citations and explanations can be trusted
                            before training. DFA generates risks/actions and constrains policy.
                        </Typography>
                    </Box>


                </Stack>
                <Stack direction={{ xs: "row", sm: "row" }} spacing={1} mt={2}>
                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={loadSampleDFA}>
                        Load Sample DFA
                    </Button>
                    <Button variant="outlined" startIcon={<ContentPasteIcon />} onClick={() => setPasteOpen(true)}>
                        Paste DFA JSON
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PlayCircleOutlineIcon />}
                        disabled={!dfa}
                        onClick={applyDfaToRisks}
                    >
                        Apply DFA → Risks
                    </Button>
                </Stack>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">DFA Snapshot Status</Typography>
                        <Chip
                            label={dfa ? dfa.status : "No DFA loaded"}
                            color={dfa ? "primary" : "default"}
                            sx={{ mt: 0.5 }}
                        />
                        <Typography variant="caption" display="block" mt={0.5}>
                            {dfa?.meta || "Load or paste DFA JSON to assess readiness."}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Training Readiness (Explainability)</Typography>
                        <Chip label={readinessTone.label} color={readinessTone.color} sx={{ mt: 0.5 }} />
                        <Typography variant="caption" display="block" mt={0.5}>
                            Derived from DFA + coverage requirements.
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Auto-Generated Controls</Typography>
                        <Typography
                            variant="caption"
                            component="pre"
                            sx={{
                                mt: 0.5,
                                p: 1,
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.05)' 
                                    : 'grey.50',
                                borderRadius: 1.5,
                                border: "1px solid",
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.1)' 
                                    : 'divider',
                                whiteSpace: "pre-wrap",
                                fontFamily: "monospace",
                                fontSize: 12,
                                color: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.9)' 
                                    : 'rgba(0, 0, 0, 0.9)',
                            }}
                        >
                            {dfa?.controls || "No controls generated."}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight={700} mb={1.5}>
                    Training Readiness Checklist
                </Typography>

                <Box
                    sx={{
                        overflowX: "auto",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        maxHeight: 360,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    }}
                >
                    <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Check</TableCell>
                                <TableCell>Input</TableCell>
                                <TableCell>Result</TableCell>
                                <TableCell>Follow-up</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {CHECKLIST.map((row) => {
                                const status = getStatusChip(dfa?.checks?.[row.key]);
                                return (
                                    <TableRow key={row.key} hover>
                                        <TableCell>{row.check}</TableCell>
                                        <TableCell>{row.input}</TableCell>
                                        <TableCell>
                                            <Chip size="small" color={status.color} label={status.label} />
                                        </TableCell>
                                        <TableCell>{row.followUp}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>

                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderLeft: "4px solid #184ea4",
                        background: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.neutral : "#f8fafc",
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                    }}
                >
                    <InfoOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.25 }} />
                    <Typography variant="body2">
                        Output: This section creates data-driven constraints for citations, and generates risks/actions before
                        SFT/DPO begins.
                    </Typography>
                </Box>
            </CardContent>

            <Dialog open={pasteOpen} onClose={() => setPasteOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Paste DFA JSON</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        multiline
                        minRows={12}
                        value={pasteValue}
                        onChange={(e) => setPasteValue(e.target.value)}
                        placeholder="Paste DFA JSON here"
                        InputProps={{ sx: { fontFamily: "monospace" } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPasteOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handlePasteApply}>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
