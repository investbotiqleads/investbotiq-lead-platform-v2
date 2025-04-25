import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Progress bar component for multi-step forms
 * @param {number} progress - Current progress percentage (0-100)
 * @param {Array} steps - Array of step objects with titles
 * @param {number} currentStepIndex - Index of the current active step
 * @param {Function} onStepClick - Optional callback when a step is clicked
 */
const FormProgressBar = ({ 
  progress, 
  steps, 
  currentStepIndex,
  onStepClick
}) => {
  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <motion.div 
          className="h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between items-center w-full">
        {steps.map((step, index) => {
          // Determine if this step is active, completed, or upcoming
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isClickable = isCompleted && onStepClick;
          
          return (
            <div 
              key={index} 
              className={cn(
                "flex flex-col items-center space-y-2",
                isClickable && "cursor-pointer"
              )}
              onClick={() => isClickable && onStepClick(index)}
            >
              {/* Step circle */}
              <div 
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                  isActive && "bg-blue-600 text-white",
                  isCompleted && "bg-green-500 text-white",
                  !isActive && !isCompleted && "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Step title */}
              <span 
                className={cn(
                  "text-xs font-medium text-center",
                  isActive && "text-blue-600",
                  isCompleted && "text-green-500",
                  !isActive && !isCompleted && "text-gray-500"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgressBar;
