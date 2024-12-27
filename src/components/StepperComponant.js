import { jsx as _jsx } from "react/jsx-runtime";
//@ts-nocheck
import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
const steps = [
    "Clinique",
    "Paraclinique",
    "Examen demandé",
    "Bilan",
    "Ordonance",
    "Rendez-vous",
    "Paiement",
];
const StepperComponant = ({ activeStep }) => {
    // Use React.FC and provide StepperComponentProps
    const [skipped, setSkipped] = React.useState(new Set());
    const isStepOptional = (step) => {
        return null;
    };
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };
    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        setSkipped(newSkipped);
    };
    const handleBack = () => {
        // Handle back logic here if needed
    };
    const handleSkip = () => {
        // Handle skip logic here if needed
    };
    const handleReset = () => {
        // Handle reset logic here if needed
    };
    return (_jsx(Box, { sx: { width: "100%" }, children: _jsx(Stepper, { activeStep: activeStep, children: steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                    labelProps.optional = (_jsx(Typography, { variant: "caption", children: "Optional" }));
                }
                if (isStepSkipped(index)) {
                    stepProps.completed = false;
                }
                return (_jsx(Step, { ...stepProps, children: _jsx(StepLabel, { ...labelProps, children: label }) }, label));
            }) }) }));
};
export default StepperComponant;
