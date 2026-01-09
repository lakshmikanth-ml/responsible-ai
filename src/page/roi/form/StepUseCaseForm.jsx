import { Grid, TextField, Button, MenuItem } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  role: Yup.string().required(),
  currency: Yup.string().required(),
  evidence: Yup.string().required(),
  usecase: Yup.string()
    .min(20, "Describe an insurance workflow clearly")
    .required("Use case is required")
});

export default function StepUseCaseForm({ initialValues, onNext }) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onNext}
    >
      {({ values, errors, touched, handleChange }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                name="role"
                label="Organization Type"
                fullWidth
                value={values.role}
                onChange={handleChange}
              >
                {["Carrier", "MGA", "Broker", "Reinsurer", "TPA"].map(r => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                name="currency"
                label="Currency"
                fullWidth
                value={values.currency}
                onChange={handleChange}
              >
                {["USD", "EUR", "GBP", "INR"].map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                select
                name="evidence"
                label="Evidence Level"
                placeholder="Evidence Level"
                fullWidth
                title="Haircut reduces projected benefits based on evidence: Assumption 0.70×, Pilot 0.85×, Production 1.00×."
                value={values.evidence}
                onChange={handleChange}
              >
                <MenuItem value="assumption">Assumption (0.70×)</MenuItem>
                <MenuItem value="pilot">Pilot (0.85×)</MenuItem>
                <MenuItem value="production">Production (1.00×)</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                name="usecase"
                label="Describe Insurance Use Case"
                placeholder="Example: Automate FNOL triage + document extraction for 3,000 claims/month to reduce adjuster admin time by 25% and reduce leakage..."
                multiline
                rows={4}
                fullWidth
                value={values.usecase}
                onChange={handleChange}
                error={touched.usecase && Boolean(errors.usecase)}
                helperText={touched.usecase && errors.usecase}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button type="submit" variant="contained">
                Next
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
