import { Grid, Typography, Divider } from "@mui/material";

const Row = ({ label, value }) => (
    <Grid container>
        <Grid size={{ xs: 7 }}>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
        </Grid>
        <Grid size={{ xs: 5 }}>
            <Typography variant="body2" fontWeight={600}>
                {value ?? "—"}
            </Typography>
        </Grid>
    </Grid>
);

export default function InputsSnapshot({ input }) {
    return (
        <>
            <Typography fontWeight={700} gutterBottom>
                Inputs Snapshot
            </Typography>

            <Divider sx={{ mb: 1 }} />
            <Row label="Use case" value={input.usecase} />
            <Row label="ROI Pathway" value={input.mode} />
            <Row label="Evidence Level" value={input.evidence} />
            <Row label="CapEx" value={input.capex} />
            <Row label="OpEx / Month" value={input.opexMonthly} />
            <Row label="Horizon (months)" value={input.horizonMonths} />
            <Row label="Ramp Type" value={input.rampType} />
            <Row label="NPV Enabled" value={input.npvToggle} />
            <Row label="Annual Discount Rate (%)" value={input.annualDiscountRate} />
            <Row label="ROI Threshold (%)" value={input.roiThreshold} />
            <Row label="Payback Threshold (months)" value={input.paybackThreshold} />
        </>
    );
}
