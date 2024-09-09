import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import UserDetailForm from "../widgets/UserDetailForm";
import PlanForm from "../widgets/PlanForm";
import SelectPlan from "../widgets/SelectPlan";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import VerifyAccountForm from "../widgets/VerifyAccountForm";

const steps = ["Get Started", "Verify", "Joining", "Select Plan"];

export default function Steppers() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [lastCompletedStep, setLastCompletedStep] = useState(null);

  const totalSteps = steps.length;
  const completedSteps = Object.keys(completed).length;
  const isLastStep = activeStep === totalSteps - 1;
  const allStepsCompleted = completedSteps === totalSteps;

  const handleNext = () => {
    const newActiveStep =
      isLastStep && !allStepsCompleted
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const handleStep = (step) => () => {
    if (step < lastCompletedStep) {
      // Add this line
      setActiveStep(step);
    } // Add this line
  };

  const handleFormSubmit = (stepFormData) => {
    const newFormData = { ...completed };
    newFormData[activeStep] = stepFormData;
    setCompleted(newFormData);

    handleNext();
  };

  const renderActiveStepForm = () => {
    switch (activeStep) {
      case 0:
        return <UserDetailForm onSubmit={handleFormSubmit} />;
      case 1:
        return <VerifyAccountForm onSubmit={handleFormSubmit} />;
      case 2:
        return <PlanForm onSubmit={handleFormSubmit} />;
      case 3:
        return <SelectPlan onSubmit={handleFormSubmit} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar isRegistrationPage={true} />
      <Box sx={{ width: "100%" }}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you are finished!
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button>
                  <Link to="/login">Login</Link>
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                {renderActiveStepForm()}
              </Typography>
              {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : null)}
            </Box> */}
            </>
          )}
        </div>
      </Box>
    </>
  );
}
