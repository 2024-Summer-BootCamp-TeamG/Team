import { useState } from 'react';
import ProgressSteps from '../components/ProcessSteps';

const starTest = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1));
  };

  return (
    <div>
      <ProgressSteps currentStep={currentStep} />
      <button className="bg-white" onClick={nextStep}>
        Next Step
      </button>
    </div>
  );
};

export default starTest;
