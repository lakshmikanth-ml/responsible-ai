import { Grid, TextField, Button, MenuItem } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  mode: Yup.string().required(),

  // Cost reduction path
  monthlyCost: Yup.number().when("mode", {
    is: "existing",
    then: s => s.required().positive()
  }),
  reductionPct: Yup.number().when("mode", {
    is: "existing",
    then: s => s.required().min(1).max(95)
  }),

  // Incremental value path
  monthlyVolume: Yup.number().when("mode", {
    is: "new",
    then: s => s.required().positive()
  }),
  unitValue: Yup.number().when("mode", {
    is: "new",
    then: s => s.required().positive()
  })
});

export default function StepBusinessDriverForm({ initialValues, onNext, onBack }) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values) => {
        // Derive monthly uplift exactly like HTML
        const monthlyUplift =
          values.mode === "new"
            ? values.monthlyVolume * values.unitValue
            : undefined;

        onNext({ ...values, monthlyUplift });
      }}
    >
      {({ values, handleChange }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                name="mode"
                label="ROI Pathway"
                fullWidth
                value={values.mode}
                onChange={handleChange}
              >
                <MenuItem value="existing">Cost Reduction</MenuItem>
                <MenuItem value="new">Incremental Value</MenuItem>
              </TextField>
            </Grid>

            {values.mode === "existing" && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="monthlyCost"
                    value={values.monthlyCost}
                    label="Baseline monthly cost (all-in)"
                    placeholder="e.g., 45000"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="reductionPct"
                    value={values.reductionPct}
                    label="Reduction %"
                    placeholder="e.g., 15"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {values.mode === "new" && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="monthlyVolume"
                    value={values.monthlyVolume}
                    label="Monthly Volume"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="unitValue"
                    value={values.unitValue}
                    label="Value per Unit"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            <Grid size={{ xs: 12 }} display="flex" gap={1}>
              <Button onClick={onBack}>Back</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
