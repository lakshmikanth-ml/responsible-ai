import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  capex: Yup.number().required().positive(),
  opexMonthly: Yup.number().required().min(0),
  horizonMonths: Yup.number().required(),
  rampType: Yup.string().required(),
  npvToggle: Yup.string().required(),
  discountRate: Yup.number().when("npvToggle", {
    is: "on",
    then: s => s.required().min(0)
  }),
  roiThreshold: Yup.number().required().min(0),
  paybackThreshold: Yup.number().required().min(1)
});

export default function StepInvestmentForm({ initialValues, onBack, onCalculate }) {
  return (
    <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={schema} onSubmit={onCalculate}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="capex"
                label="CapEx (one-time implementation)"
                value={values.capex}
                placeholder="60000"
                type="number"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="opexMonthly"
                value={values.opexMonthly}
                label="OpEx (monthly run cost)"
                placeholder="4000"
                type="number"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                name="horizonMonths"
                value={values.horizonMonths}
                label="Projection horizon"
                placeholder="12 months"
                fullWidth
                onChange={handleChange}
              >
                {[12, 24, 36].map((m) => (
                  <MenuItem key={m} value={m}>{m} months</MenuItem>
                ))}
              </TextField>
            </Grid>



            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.npvToggle === "on"}
                    onChange={(e) =>
                      setFieldValue("npvToggle", e.target.checked ? "on" : "off")
                    }
                  />
                }
                label="NPV toggle"
                title="NPV discounts future savings to today’s value using the discount rate. ON is CFO-ready."
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="discountRate"
                value={values.discountRate}
                label="Annual discount rate (%)"
                placeholder="10"
                title="Used only when NPV is ON. Typical enterprise rate: 8–12%."
                type="number"
                fullWidth
                onChange={handleChange}

              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                name="rampType"
                value={values.rampType}
                label="Adoption Ramp"
                placeholder="Adoption ramp"
                fullWidth
                onChange={handleChange}
                title="Benefits ramp up over time (training + rollout). Linear is realistic; flat is optimistic."
              >
                <MenuItem value="linear">Linear</MenuItem>
                <MenuItem value="flat">Flat</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="roiThreshold"
                value={values.roiThreshold}
                label="Decision threshold — Annual ROI (net) %"
                placeholder="Decision threshold — Annual ROI (net) %"
                type="number"
                fullWidth
                title="Minimum acceptable ROI to recommend proceeding (common default: 50%)."
                onChange={handleChange}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="paybackThreshold"
                value={values.paybackThreshold}
                label="Decision threshold — Payback (months)"
                placeholder="Decision threshold — Payback (months)"
                title="Maximum acceptable 24 months"
                type="number"
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }} display="flex" gap={1}>
              <Button onClick={onBack}>Back</Button>
              <Button type="submit" variant="contained">
                Calculate ROI
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
