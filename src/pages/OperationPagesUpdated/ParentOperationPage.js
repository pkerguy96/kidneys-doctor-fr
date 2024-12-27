import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import StepperComponant from "../../components/StepperComponant";
import RadioPage from "./radioPage";
import BloodTest from "../OperationPages/BloodTest";
import AppointmentStepPage from "../OperationPages/AppointmentStepPage";
import VisiteValidation from "../OperationPages/VisiteValidation";
import ExamenDemander from "./ExamenDemander";
import Cliniquerensignement from "./Cliniquerensignement";
import OperationOrdonance from "./OperationOrdonance";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_OperationBloodTest, CACHE_KEY_operationNote, CACHE_KEY_OrdonanceId, CACHE_KEY_XraysWithCategoryBACK, } from "../../constants";
const ParentOperationPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const queryClient = useQueryClient();
    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    };
    if (activeStep === 0) {
        queryClient.invalidateQueries(CACHE_KEY_operationNote);
        queryClient.invalidateQueries({
            queryKey: ["Waitinglist"],
            exact: false,
        });
        queryClient.invalidateQueries(CACHE_KEY_XraysWithCategoryBACK);
        queryClient.invalidateQueries(CACHE_KEY_OperationBloodTest);
        queryClient.invalidateQueries(CACHE_KEY_OrdonanceId);
    }
    return (_jsxs("div", { className: "flex flex-col w-full gap-2", children: [_jsx(StepperComponant, { activeStep: activeStep }), activeStep === 0 && (_jsx(Cliniquerensignement, { onNext: handleNext, onBack: handleBack })), activeStep === 1 && (_jsx(RadioPage, { onNext: handleNext, onBack: handleBack })), activeStep === 2 && (_jsx(ExamenDemander, { onNext: handleNext, onBack: handleBack })), activeStep === 3 && (_jsx(BloodTest, { onNext: handleNext, onBack: handleBack })), activeStep === 4 && (_jsx(OperationOrdonance, { onNext: handleNext, onBack: handleBack })), activeStep === 5 && (_jsx(AppointmentStepPage, { onNext: handleNext, onBack: handleBack })), activeStep === 6 && (_jsx(VisiteValidation, { onNext: handleNext, onBack: handleBack }))] }));
};
export default ParentOperationPage;
