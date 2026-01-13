import { useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
    Paper,
    TableContainer,
    Grid,
    Button
} from "@mui/material";

const tabs = [
    "A. Objective",
    "B. Coverage",
    "C. Readiness",
    "D. Evaluation",
    "E. Risks",
    "F. Mitigation",
    "G. Evidence",
    "H. Monitoring"
];

export default function EnvironmentalSustainabilityTabs() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Environmental Sustainability
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Lightweight, declarative sustainability governance for AI systems
            </Typography>

            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">Lifecycle</Typography>
                            <Typography fontWeight={600}>Baseline</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">Coverage</Typography>
                            <Typography fontWeight={600}>Limited</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">Evidence</Typography>
                            <Typography fontWeight={600}>1</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">Risk</Typography>
                            <Typography fontWeight={600} color="success.main">Low</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Button variant="contained">Generate Policy Pack</Button>
                <Button variant="outlined">Export Snapshot</Button>
                <Button variant="outlined">Recompute Gates</Button>
            </Box>

            <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
            >
                {tabs.map(label => (
                    <Tab key={label} label={label} />
                ))}
            </Tabs>

            {activeTab === 0 && <ObjectiveTab />}
            {activeTab === 1 && <CoverageTab />}
            {activeTab === 2 && <ReadinessTab />}
            {activeTab === 3 && <EvaluationTab />}
            {activeTab === 4 && <RisksTab />}
            {activeTab === 5 && <MitigationTab />}
            {activeTab === 6 && <EvidenceTab />}
            {activeTab === 7 && <MonitoringTab />}
        </Paper>
    );
}

function ObjectiveTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Objective</Typography>
            <TableContainer component={Paper} >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Selection</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Sustainability Maturity</TableCell>
                            <TableCell>
                                <Select size="small" fullWidth defaultValue="Baseline">
                                    <MenuItem value="Baseline">Baseline (Declared)</MenuItem>
                                    <MenuItem value="Estimated">Estimated (Cloud-level)</MenuItem>
                                    <MenuItem value="Measured">Measured (Advanced)</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>Declared</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Primary Intent</TableCell>
                            <TableCell>
                                <Select size="small" fullWidth defaultValue="Minimize">
                                    <MenuItem value="Minimize">Minimize unnecessary compute</MenuItem>
                                    <MenuItem value="Cost">Cost & efficiency alignment</MenuItem>
                                    <MenuItem value="Carbon">Carbon reduction commitment</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>Declared</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function CoverageTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Coverage</Typography>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Area</TableCell>
                            <TableCell>Included</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {["Model Training", "Inference", "Cloud Infrastructure"].map(area => (
                            <TableRow key={area}>
                                <TableCell>{area}</TableCell>
                                <TableCell>
                                    <Select size="small" defaultValue="Yes">
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function ReadinessTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Readiness</Typography>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Metric</TableCell>
                            <TableCell>Current State</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow><TableCell>Energy Tracking</TableCell><TableCell>Not Measured</TableCell></TableRow>
                        <TableRow><TableCell>Carbon Accounting</TableCell><TableCell>Not Measured</TableCell></TableRow>
                        <TableRow><TableCell>Cloud Sustainability Claims</TableCell><TableCell>Estimated</TableCell></TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function EvaluationTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Evaluation</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                No quantitative sustainability testing required at baseline maturity.
            </Typography>
            <Select size="small" defaultValue="Accepted">
                <MenuItem value="Accepted">Accepted as Baseline</MenuItem>
                <MenuItem value="Planned">Improvement Planned</MenuItem>
            </Select>
        </Card>
    );
}

function RisksTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Risks</Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Risk</TableCell>
                            <TableCell>Severity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>No direct sustainability measurement</TableCell>
                            <TableCell>Low</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function MitigationTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Mitigation</Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Action</TableCell>
                            <TableCell>Owner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Annual sustainability posture review</TableCell>
                            <TableCell>
                                <Select size="small" defaultValue="Platform">
                                    <MenuItem value="Platform">Platform Lead</MenuItem>
                                    <MenuItem value="Cloud">Cloud Operations</MenuItem>
                                </Select>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function EvidenceTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Evidence</Typography>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Cloud provider sustainability statement</TableCell>
                            <TableCell>Approved</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}

function MonitoringTab() {
    return (
        <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>Monitoring</Typography>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Area</TableCell>
                            <TableCell>Approach</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow><TableCell>Compute usage</TableCell><TableCell>Indirect (cost dashboards)</TableCell></TableRow>
                        <TableRow><TableCell>Carbon reporting</TableCell><TableCell>Not enabled</TableCell></TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>
    );
}
