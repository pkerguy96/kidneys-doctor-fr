import { useState } from "react";
import StepperComponant from "../../components/StepperComponant";
import RadioPage from "./radioPage";
import AddOrdonance from "../AddOrdonance";
import BloodTest from "../OperationPages/BloodTest";
import DocumentPage from "../OperationPages/DocumentPage";
import AppointmentStepPage from "../OperationPages/AppointmentStepPage";
import VisiteValidation from "../OperationPages/VisiteValidation";
import ExamenDemander from "./ExamenDemander";
import Cliniquerensignement from "./Cliniquerensignement";

const ParentOperationPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (newStep: any) => {
    setActiveStep(newStep);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <StepperComponant activeStep={activeStep} />
      {activeStep === 0 && (
        <Cliniquerensignement
          onNext={() => {
            handleStepChange(1);
          }}
        />
      )}
      {activeStep === 1 && (
        <RadioPage
          onNext={() => {
            handleStepChange(2);
          }}
        />
      )}
      {activeStep === 2 && (
        <ExamenDemander
          onNext={() => {
            handleStepChange(3);
          }}
        />
      )}

      {activeStep === 3 && (
        <AddOrdonance
          onNext={() => {
            handleStepChange(4);
          }}
        />
      )}
      {activeStep === 4 && <BloodTest onNext={() => handleStepChange(5)} />}

      {activeStep === 5 && (
        <AppointmentStepPage onNext={() => handleStepChange(6)} />
      )}
      {activeStep === 6 && (
        <VisiteValidation
          onNext={() => {
            handleStepChange(7);
          }}
        />
      )}
    </div>
  );
};

export default ParentOperationPage;
