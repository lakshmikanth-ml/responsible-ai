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
    return (

        <>
            {/* Header */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
            >
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        A. Objective & Risk Intent
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={720}>
                        Define why explainability is required, what failure looks like, and who is accountable.
                        Missing objectives can block training for decision-influencing use cases.
                    </Typography>
                </Box>


            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
                <Button variant="outlined">Load Sample</Button>
                <Button variant="contained">Save A</Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Grid 3 */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Autocomplete
                        size="small"
                        options={[
                            "Audit defensibility",
                            "Customer disputes",
                            "Regulatory reporting",
                            "Internal controls",
                        ]}
                        renderInput={(params) => (
                            <TextField {...params} label="Primary Purpose" fullWidth />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        size="small"
                        fullWidth
                        label="Jurisdiction / Market"
                        placeholder="e.g., US – multi-state, CA/NY focus"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        size="small"
                        fullWidth
                        label="Explainability Owner (Accountable)"
                        placeholder="e.g., Head of Data Science"
                    />
                </Grid>
            </Grid>

            {/* Grid 2 - Textareas */}
            <Grid container spacing={2} mt={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        minRows={4}
                        label="Use Case Narrative (Plain English)"
                        placeholder="Describe what the AI does and where it is used."
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, }}>
                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        minRows={4}
                        label="What is Unacceptable (Failure Definition)"
                        placeholder="Example: A claim triage recommendation without a source citation or an explanation that a business user cannot understand."
                    />
                </Grid>
            </Grid>

            {/* Grid 2 - Risk Drivers (Pill Cards) */}
            <Grid container spacing={2} mt={2}>
                <Grid size={{ xs: 12, }}>
                    <Typography variant="subtitle2" color="black">
                        Risk Drivers (Check all that apply)
                    </Typography>
                </Grid>

                {RISK_GROUPS.map((group) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group.title}>
                        <Card
                            variant="outlined"
                            sx={{
                                p: 1.5,
                                height: "100%",
                            }}
                        >
                            <Typography variant="subtitle2" mb={0.5}>
                                {group.title}
                            </Typography>
                            <Stack >
                                {group.items.map((item) => (
                                    <FormControlLabel
                                        key={item}
                                        control={<Checkbox size="small" />}
                                        label={item}
                                    />
                                ))}
                            </Stack>
                        </Card>
                    </Grid>
                ))}



                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Minimum Explanation Standard (Contract Summary)"
                        placeholder="Example: Mandatory outputs must include citations + business-readable reasoning. If confidence is low, system must route to SME review."
                    />
                    <Box sx={{
                        marginTop: "12px",
                        padding: "12px",
                        borderRadius: "14px",
                        background: "#f8fafc",
                        border: "1px solid lightgray",
                        borderLeft: "4px solid #184ea4"
                    }}>
                        <Typography variant="body2" color="black" mt={0.5} display="block">
                            This becomes the Explainability Contract for the model version. It is used in the gates and in the Guardian policy pack.
                        </Typography>
                    </Box>
                </Grid>
            </Grid >
        </>

    );
}
