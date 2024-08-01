import { useState } from 'react';
import ProgressSteps from '../components/ProgressSteps';

const StarTest = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : 4));
  };

  return (
    <div>
      <ProgressSteps currentStep={currentStep} />
      <button className="bg-white" onClick={prevStep}>
        Before Step
      </button>
      <button className="bg-white" onClick={nextStep}>
        Next Step
      </button>
    </div>
  );
};

export default StarTest;
