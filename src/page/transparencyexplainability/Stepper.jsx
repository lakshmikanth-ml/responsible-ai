import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Chip,
    Tabs,
    Tab,
    Divider,
} from "@mui/material";
import { useState } from "react";
import TabAObjective from "./StepA";
import TabBCoverage from "./StepB";
import TabCTrainingReadiness from "./StepC";
import TabDEvaluation from "./StepD";
import TabERisks from "./StepE";
import TabFMitigation from "./StepF";
import TabGEvidenceAudit from "./StepG";
import TabHLifecycleMonitoring from "./StepH";

const TABS = [
    "A. Objective",
    "B. Coverage",
    "C. Training Readiness (DFA)",
    "D. Evaluation",
    "E. Gaps & Risks",
    "F. Mitigation",
    "G. Evidence",
    "H. Gates & Monitoring",
];

function TabPanel({ value, index, children }) {
    return (
        <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
            {value === index && children}
        </Box>
    );
}

export default function TransparencyExplainabilityHeader() {
    const [tab, setTab] = useState(0);

    return (
        <>
            <Card sx={{ mt: 2 }}>
                <CardContent sx={{ p: 2 }}>
                    {/* Header */}
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                        spacing={2}
                    >
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Transparency & Explainability
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={0.5}
                                maxWidth={720}
                            >
                                Control whether AI outputs are explainable, defensible, and
                                audit-ready across Pre-Training, Release, and Production.
                            </Typography>

                            <Stack direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                mt={1.5}
                                flexWrap="wrap">
                                <Chip label="Lifecycle Controlled" color="primary" size="small" />
                                <Chip label="Coverage: 100%" variant="outlined" size="small" />
                                <Chip label="Evidence: 0/4 approved" variant="outlined" size="small" />
                                <Chip label="Risks: 0 critical open" variant="outlined" size="small" />
                            </Stack>
                        </Box>


                    </Stack>
                    <Stack
                        mt={2}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems={{ xs: "stretch", sm: "center" }}
                    >
                        <Button variant="outlined">Generate Policy Pack (for Guardian)</Button>
                        <Button variant="outlined">Export Snapshot</Button>
                        <Button variant="contained">Recompute Gates</Button>
                    </Stack>

                    {/* <Divider sx={{ my: 2 }} /> */}



                </CardContent>
            </Card>
            {/* Sections */}
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Tabs
                        sx={{
                            marginLeft: "-40px",
                        }}
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                    >
                        {TABS.map((label) => (
                            <Tab key={label} label={label} />
                        ))}
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        <TabAObjective />
                    </TabPanel>

                    <TabPanel value={tab} index={1}>
                        <TabBCoverage />
                    </TabPanel>

                    <TabPanel value={tab} index={2}>
                        <TabCTrainingReadiness />
                    </TabPanel>

                    <TabPanel value={tab} index={3}>
                        <TabDEvaluation />
                    </TabPanel>

                    <TabPanel value={tab} index={4}>
                        <TabERisks />
                    </TabPanel>

                    <TabPanel value={tab} index={5}>
                        <TabFMitigation />
                    </TabPanel>

                    <TabPanel value={tab} index={6}>
                        <TabGEvidenceAudit />
                    </TabPanel>

                    <TabPanel value={tab} index={7}>
                        <TabHLifecycleMonitoring />
                    </TabPanel>
                </CardContent>
            </Card>



        </>
    );
}
