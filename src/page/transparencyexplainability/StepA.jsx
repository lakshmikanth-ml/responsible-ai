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
} from "@mui/material";
import { useState } from "react";

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

export default function TabAObjective() {
    const [purpose, setPurpose] = useState(null);
    const [jurisdiction, setJurisdiction] = useState("");
    const [owner, setOwner] = useState("");
    const [useCase, setUseCase] = useState("");
    const [failure, setFailure] = useState("");
    const [contract, setContract] = useState("");
    const [risks, setRisks] = useState({});

    const toggleRisk = (key) =>
        setRisks((p) => ({ ...p, [key]: !p[key] }));

    const loadSampleObjective = () => {
        setPurpose(PURPOSES[0]);
        setJurisdiction("US – multi-state, CA/NY focus");
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
                    <Button variant="outlined" disabled={!canSave}>
                        Save A
                    </Button>
                </Stack>
                <Divider sx={{ my: 2 }} />

                {/* GRID 3 */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Autocomplete
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
                            placeholder="e.g., US – multi-state, CA/NY focus"
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
                            value={failure}
                            onChange={(e) => setFailure(e.target.value)}
                        />
                    </Grid>
                </Grid>

                {/* RISK DRIVERS */}
                <Box mt={2}>
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
                </Box>

                {/* CONTRACT */}
                <Box mt={2}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Minimum Explanation Standard (Contract Summary)"
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
                </Box>
            </CardContent>
        </Card>
    );
}
