import {
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider, Button,
    CardHeader
} from "@mui/material";

import {
    computeROI,
    recommendROI,
    findBreakEvenMonth
} from "../../../utils/roiMath";

import D3AlignedLineChart from "../chart/D3LineChart";
import InputsSnapshot from "../InputsSnapshot";

function KpiCard({ label, value, sub }) {
    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="caption">{label}</Typography>
                <Typography fontWeight={800}>{value ?? ""}</Typography>
                {sub && (
                    <Typography variant="caption" color="text.secondary">
                        {sub}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}


export default function RoiResults({ input }) {
    const base = computeROI(input, false);
    const adj = computeROI(input, true);
    const rec = recommendROI(input, adj);
    const breakEven = findBreakEvenMonth(adj.cumProfit);

    return (
        <Grid container spacing={2}>
            {/* Recommendation */}
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardHeader title="Results" subheader="Shows Base ROI and Risk-Adjusted ROI (haircut applied). Break-even month is annotated on cumulative profit." />
                    <CardContent sx={{ display: "flex", gap: 2 }}>
                        <div>
                            <Typography fontWeight={700}>
                                Risk-Adjusted Recommendation
                            </Typography>
                            <Typography variant="caption">
                                Break-even month: {breakEven ?? ""}
                            </Typography>
                        </div>

                        {/* <Chip
                            sx={{ ml: "auto" }}
                            color={rec?.level}
                            label={rec?.label}
                        /> */}
                    </CardContent>
                </Card>
            </Grid>

            {/* KPIs */}
            <Grid container spacing={2} alignItems="stretch">
                <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                    <KpiCard
                        label="Base monthly benefit (net)"
                        value={`$${base?.netAvg3?.toLocaleString() || "0"}`}
                        sub="avg months 1–3"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                    <KpiCard
                        label="Risk-adj monthly benefit (net)"
                        value={`$${adj?.netAvg3?.toLocaleString() || "0"}`}
                        sub="haircut applied"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                    <KpiCard
                        label="Base payback"
                        value={`${base?.payback?.toFixed(1) || "0"} mo`}
                        sub="months"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                    <KpiCard
                        label="Risk-adj payback"
                        value={`${adj?.payback?.toFixed(1) || "0"} mo`}
                        sub="months"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                    <KpiCard
                        label="Base annual ROI (net)"
                        value={`${base?.roiAnnualNet?.toFixed(1) || "0"}%`}
                        sub="12-month / CapEx"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                    <KpiCard
                        label="Risk-adj annual ROI (net)"
                        value={`${adj?.roiAnnualNet?.toFixed(1) || "0"}%`}
                        sub="haircut applied"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                    <KpiCard
                        label="Base 3-year profit"
                        value={`$${base?.netProfit?.toLocaleString() || "0"}`}
                        sub="after CapEx"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                    <KpiCard
                        label="Risk-adj 3-year profit"
                        value={`$${adj?.netProfit?.toLocaleString() || "0"}`}
                        sub="after CapEx"
                    />
                </Grid>
            </Grid>


            {/* Charts */}
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Typography fontWeight={700} gutterBottom>
                            Monthly Net Benefit
                        </Typography>


                        <D3AlignedLineChart
                            title="Risk-Adjusted Cumulative Profit"
                            data={adj?.cumProfit}
                            breakEvenMonth={breakEven}
                            color="#059669"
                        />

                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Typography fontWeight={700} gutterBottom>
                            Cumulative Profit
                        </Typography>
                        <D3AlignedLineChart
                            title="Risk-Adjusted Cumulative Profit"
                            data={adj?.cumProfit}
                            breakEvenMonth={breakEven}
                            color="#059669"
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Typography fontWeight={700}>
                            Methodology (Base vs Risk-Adjusted):
                        </Typography>

                        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                            {`Haircut factor (evidence): ${adj?.hf?.toFixed(2)}×
Base gross savings = baseline_monthly_cost × (reduction%/100)
Risk-adj gross savings = Base gross savings × haircut
Net monthly benefit = gross_month_t − OpEx_monthly
Payback = CapEx / avg(net_month_1..3)
Annual ROI (net) = sum(net_month_1..12)/CapEx × 100
3-year profit = sum(net_month_1..N) − CapEx
NPV = −CapEx + Σ(net_t/(1+r)^(t/12)), r=${input?.annualDiscountRate}%
Risk-adj NPV ≈ $${adj?.npv?.toLocaleString()}

Break-even month (risk-adjusted): Month ${breakEven}
Recommendation: ${rec?.label}
Meets thresholds under risk adjustment.`}
                        </Typography>
                    </CardContent>
                </Card>

            </Grid>

            {/* Inputs Snapshot */}
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <InputsSnapshot input={input} />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
