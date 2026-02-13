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
    Checkbox,
    FormControlLabel,
    Divider,
    Alert,
} from "@mui/material";
import { useEffect, useState } from "react";

const PURPOSES = [
    { label: "Audit defensibility", value: "audit_defensibility" },
    { label: "Customer disputes", value: "customer_dispute" },
    { label: "Regulatory reporting", value: "regulatory_reporting" },
    { label: "Internal controls", value: "internal_control" },
];

const RISK_GROUPS = [
    {
        title: "Audit / Regulator",
        items: ["Required evidence", "Traceability"],
    },
    {
        title: "Customer Outcomes",
        items: ["Disputes", "Complaints"],
    },
    {
        title: "Operational Risk",
        items: ["SLA impact", "Override rate"],
    },
];

const STORAGE_KEY = "transparency_stepA_objective";

export const clearStepAObjectiveStorage = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error("Unable to clear transparency objective storage", e);
    }
};

export default function TabAObjective() {
    const [purpose, setPurpose] = useState(null);
    const [jurisdiction, setJurisdiction] = useState("");
    const [owner, setOwner] = useState("");
    const [useCase, setUseCase] = useState("");
    const [failure, setFailure] = useState("");
    const [contract, setContract] = useState("");
    const [risks, setRisks] = useState({});
    const [statusMessage, setStatusMessage] = useState("");
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                setPurpose(
                    PURPOSES.find((p) => p.value === data.purposeValue) || null
                );
                setJurisdiction(data.jurisdiction || "");
                setOwner(data.owner || "");
                setUseCase(data.useCase || "");
                setFailure(data.failure || "");
                setContract(data.contract || "");
                setRisks(data.risks || {});
            }
        } catch (e) {
            console.error("Unable to load saved objective", e);
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        const handleLogout = () => {
            clearStepAObjectiveStorage();
            setPurpose(null);
            setJurisdiction("");
            setOwner("");
            setUseCase("");
            setFailure("");
            setContract("");
            setRisks({});
            setStatusMessage("");
        };
        window.addEventListener("app:logout", handleLogout);
        return () => window.removeEventListener("app:logout", handleLogout);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    purposeValue: purpose?.value || null,
                    jurisdiction,
                    owner,
                    useCase,
                    failure,
                    contract,
                    risks,
                })
            );
        } catch (e) {
            console.error("Unable to persist objective", e);
        }
    }, [purpose, jurisdiction, owner, useCase, failure, contract, risks, hydrated]);

    const toggleRisk = (key) =>
        setRisks((p) => ({ ...p, [key]: !p[key] }));

    const loadSampleObjective = () => {
        setPurpose(PURPOSES[0]);
        setJurisdiction("US - multi-state, CA/NY focus");
        setOwner("Head of Data Science");
        setUseCase(
            "AI assists claim triage by recommending next actions based on historical claims."
        );
        setFailure(
            "A recommendation without source citation or explanation understandable by a business user."
        );
        setContract(
            "All outputs must include citations and plain-English reasoning. Low confidence routes to SME."
        );
        setRisks({
            "Audit / Regulator-Required evidence": true,
            "Audit / Regulator-Traceability": true,
            "Operational Risk-SLA impact": true,
        });
    };

    const canSave =
        purpose && jurisdiction && owner && useCase && failure;

    const handleSave = () => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    purposeValue: purpose?.value || null,
                    jurisdiction,
                    owner,
                    useCase,
                    failure,
                    contract,
                    risks,
                })
            );
            setStatusMessage("Objective saved (persists locally until reset)");
            setTimeout(() => setStatusMessage(""), 2000);
        } catch (e) {
            setStatusMessage("Unable to save objective");
        }
    };

    return (
        <Card className="tabPanel" variant="outlined">
            <CardContent>
                {/* HEADER */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            A. Objective & Risk Intent
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Define why explainability is required, what failure looks like,
                            and who is accountable. Missing objectives can block training for
                            decision-influencing use cases.
                        </Typography>
                    </Box>


                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} alignItems={"baseline"}
                    rowGap={2} mt={2}
                    spacing={2}>

                    <Button variant="outlined" onClick={loadSampleObjective}>
                        Load Sample
                    </Button>
                    <Button variant="outlined" disabled={!canSave} onClick={handleSave}>
                        Save A
                    </Button>
                </Stack>
                {statusMessage && (
                    <Alert
                        severity={statusMessage.toLowerCase().startsWith("unable") ? "error" : "success"}
                        sx={{ mt: 1 }}
                    >
                        {statusMessage}
                    </Alert>
                )}
                <Divider sx={{ my: 2 }} />

                {/* GRID 3 */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={PURPOSES}
                            value={purpose}
                            onChange={(_, v) => setPurpose(v)}
                            renderInput={(p) => (
                                <TextField {...p} size="small" label="Primary Purpose" />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            size="small"
                            fullWidth
                            label="Jurisdiction / Market"
                            value={jurisdiction}
                            onChange={(e) => setJurisdiction(e.target.value)}
                            placeholder="e.g., US - multi-state, CA/NY focus"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            size="small"
                            fullWidth
                            label="Explainability Owner (Accountable)"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            placeholder="e.g., Head of Data Science"
                        />
                    </Grid>
                </Grid>

                {/* GRID 2 – TEXTAREAS */}
                <Grid container spacing={2} mt={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            size="small"
                            fullWidth
                            multiline
                            minRows={4}
                            label="Use Case Narrative (Plain English)"
                            placeholder="Describe what the AI does and where it is used."
                            value={useCase}
                            onChange={(e) => setUseCase(e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            size="small"
                            fullWidth
                            multiline
                            minRows={4}
                            label="What is Unacceptable (Failure Definition)"
                            placeholder="Example: A claim triage recommendation without a source citation or an explanation that a business user cannot understand."
                            value={failure}
                            onChange={(e) => setFailure(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} mt={2}>
                    {/* LEFT — RISK DRIVERS */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box>
                            <Typography variant="subtitle2" mb={1} sx={{ color: "black" }} >
                                Risk Drivers (Check all that apply)
                            </Typography>

                            <Grid container spacing={2}>
                                {RISK_GROUPS.map((g) => (
                                    <Grid key={g.title} size={{ xs: 12, sm: 6, md: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                p: 1.5,
                                                borderRadius: "14px",
                                                height: "100%",
                                                transition: "0.2s",
                                                "&:hover": {
                                                    boxShadow: 2,
                                                },
                                            }}
                                        >
                                            <Typography fontWeight={600} mb={0.5}>
                                                {g.title}
                                            </Typography>

                                            {g.items.map((i) => {
                                                const key = `${g.title}-${i}`;
                                                return (
                                                    <FormControlLabel
                                                        key={key}
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={!!risks[key]}
                                                                onChange={() => toggleRisk(key)}
                                                            />
                                                        }
                                                        label={i}
                                                    />
                                                );
                                            })}
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>

                    {/* RIGHT — CONTRACT */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                position: { md: "sticky" },
                                top: 16,
                            }}
                        >
                            <Typography variant="subtitle2" mb={1} sx={{ color: "black" }}>
                                Explainability Contract
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                label="Minimum Explanation Standard"
                                placeholder="Example: Mandatory outputs must include citations + business-readable reasoning. If confidence is low, system must route to SME review." value={contract}
                                onChange={(e) => setContract(e.target.value)}
                            />

                            <Box
                                sx={{
                                    mt: 2,
                                    p: 1.5,
                                    borderRadius: "14px",
                                    border: "1px solid #d0d7e2",
                                    borderLeft: "4px solid #184ea4",
                                    background: "#f8fafc",
                                }}
                            >
                                <Typography variant="body2">
                                    This becomes the “Explainability Contract” for the model version.
                                    It is used in governance gates and Guardian policy pack.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* RISK DRIVERS */}
                {/* <Box mt={2}>
                    <Typography variant="subtitle2" mb={1}>
                        Risk Drivers (Check all that apply)
                    </Typography>

                    <Grid container spacing={2}>
                        {RISK_GROUPS.map((g) => (
                            <Grid key={g.title} size={{ xs: 12, md: 4 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        p: 1.5,
                                        borderRadius: "14px",
                                        height: "100%",
                                    }}
                                >
                                    <Typography fontWeight={600} mb={0.5}>
                                        {g.title}
                                    </Typography>

                                    {g.items.map((i) => {
                                        const key = `${g.title}-${i}`;
                                        return (
                                            <FormControlLabel
                                                key={key}
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={!!risks[key]}
                                                        onChange={() => toggleRisk(key)}
                                                    />
                                                }
                                                label={i}
                                            />
                                        );
                                    })}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box> */}

                {/* CONTRACT */}
                {/* <Box mt={2}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Minimum Explanation Standard (Contract Summary)"
                        placeholder="Example: Mandatory outputs must include citations + business-readable reasoning. If confidence is low, system must route to SME review."
                        value={contract}
                        onChange={(e) => setContract(e.target.value)}
                    />

                    <Box
                        sx={{
                            mt: 1.5,
                            p: 1.5,
                            borderRadius: "14px",
                            border: "1px solid #d0d7e2",
                            borderLeft: "4px solid #184ea4",
                            background: "#f8fafc",
                        }}
                    >
                        <Typography variant="body2">
                            This becomes the “Explainability Contract” for the model version.
                            It is used in the gates and in the Guardian policy pack.
                        </Typography>
                    </Box>
                </Box> */}
            </CardContent>
        </Card>
    );
}
