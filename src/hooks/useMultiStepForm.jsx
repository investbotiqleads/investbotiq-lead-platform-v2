import { useState } from 'react';

/**
 * Custom hook for managing multi-step forms
 * @param {Array} steps - Array of form steps
 * @returns {Object} - Form navigation methods and state
 */
export const useMultiStepForm = (steps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Function to go to the next step
  const nextStep = () => {
    setCurrentStepIndex(i => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  };
  
  // Function to go to the previous step
  const prevStep = () => {
    setCurrentStepIndex(i => {
      if (i <= 0) return i;
      return i - 1;
    });
  };
  
  // Function to go to a specific step
  const goToStep = (index) => {
    setCurrentStepIndex(index);
  };
  
  // Calculate progress percentage
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  return {
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goToStep,
    nextStep,
    prevStep,
    progress
  };
};
