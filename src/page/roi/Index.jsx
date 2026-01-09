import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Paper, Grid, Button } from "@mui/material";

import StepUseCaseForm from "./form/StepUseCaseForm";
import StepBusinessDriverForm from "./form/StepBusinessDriverForm";
import StepInvestmentForm from "./form/StepInvestmentForm";
import RoiResults from "./form/RoiResults";

import { templateDefs, relevanceCheck } from "../../utils/roiMath";

const STEPS = [
    "Use Case",
    "Business Driver",
    "AI Investment",
    "Results"
];

export default function RoiStepperContainer() {
    const [activeStep, setActiveStep] = useState(0);

    const [roiInput, setRoiInput] = useState({
        // Step 1
        role: "Carrier",
        currency: "USD",
        template: "custom",
        evidence: "assumption",
        usecase: "",

        // Step 2
        mode: "existing",
        monthlyCost: "",
        reductionPct: "",
        monthlyVolume: "",
        unitValue: "",
        monthlyUplift: "",

        // Step 3
        capex: 60000,
        opexMonthly: 4000,
        horizonMonths: 36,
        rampType: "linear",
        npvToggle: "off",
        discountRate: 10,

        // Decision thresholds
        roiThreshold: 50,
        paybackThreshold: 24
    });

    const handleStep1Next = (values) => {
        const relevance = relevanceCheck(values.usecase);
        if (relevance.status !== "ok") {
            throw new Error(relevance.message);
        }

        const tpl = templateDefs[values.template] || {};

        setRoiInput((prev) => ({
            ...prev,
            ...values,
            ...tpl
        }));

        setActiveStep(1);
    };

    const handleStep2Next = (values) => {
        setRoiInput((prev) => ({ ...prev, ...values }));
        setActiveStep(2);
    };

    const handleStep3Calculate = (values) => {
        setRoiInput((prev) => ({ ...prev, ...values }));
        setActiveStep(3);
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12,}}>
                <Stepper activeStep={activeStep} sx={{ my: 3 }}>
                    {STEPS.map((label, i) => (
                        <Step key={label}>
                            <StepLabel
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                    setActiveStep(i)
                                }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Paper sx={{ p: 3 }}>
                    {activeStep === 0 && (
                        <StepUseCaseForm initialValues={roiInput} onNext={handleStep1Next} />
                    )}

                    {activeStep === 1 && (
                        <StepBusinessDriverForm
                            initialValues={roiInput}
                            onBack={() => setActiveStep(0)}
                            onNext={handleStep2Next}
                        />
                    )}

                    {activeStep === 2 && (
                        <StepInvestmentForm
                            initialValues={roiInput}
                            onBack={() => setActiveStep(1)}
                            onCalculate={handleStep3Calculate}
                        />
                    )}

                    {activeStep === 3 && <>

                        <RoiResults onBack={() => setActiveStep(2)} input={roiInput} />
                        <Button sx={{ mt: 2 }} variant="contained" onClick={() => setActiveStep(2)}>Back</Button>
                    </>}
                </Paper>
            </Grid>
           

        </Grid>
    );
}
