import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMultiStepForm } from '../../hooks/useMultiStepForm';
import { useSupabaseDb } from '../../hooks/useSupabaseClient';
import { getFormStepsForRole } from '../../utils/roleBasedQuestions';
import { sendConfirmationEmail, sendNotificationEmail } from '../../lib/resendClient';

import FormProgressBar from './FormProgressBar';
import LeadFormStep1 from './LeadFormStep1';
import LeadFormStep2 from './LeadFormStep2';
import LeadFormStep3 from './LeadFormStep3';
import LeadFormRoleSpecific from './LeadFormRoleSpecific';
import LeadFormSuccess from './LeadFormSuccess';

const LeadForm = () => {
  // State for form data
  const [formData, setFormData] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Get Supabase database methods
  const { submitLeadForm, loading, error } = useSupabaseDb();
  
  // Define form steps based on selected role
  const getSteps = () => {
    if (!selectedRole) {
      return [{ id: 'role-selection', title: 'Rol Selectie' }];
    }
    
    return [
      { id: 'role-selection', title: 'Rol Selectie' },
      { id: 'personal-info', title: 'Persoonlijke Info' },
      { id: 'additional-info', title: 'Aanvullende Info' },
      { id: 'role-specific', title: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Info` }
    ];
  };
  
  // Initialize multi-step form
  const { 
    currentStepIndex, 
    currentStep, 
    steps, 
    isFirstStep, 
    isLastStep, 
    goToStep, 
    nextStep, 
    prevStep, 
    progress 
  } = useMultiStepForm(getSteps());
  
  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    nextStep();
  };
  
  // Handle form step submission
  const handleStepSubmit = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    
    if (isLastStep) {
      handleFormSubmit();
    } else {
      nextStep();
    }
  };
  
  // Handle complete form submission
  const handleFormSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Submit form data to Supabase
      const result = await submitLeadForm(formData);
      
      // Send confirmation email to user
      await sendConfirmationEmail(
        formData.email,
        formData.first_name,
        formData.role
      );
      
      // Send notification email to admin
      await sendNotificationEmail(
        'investbotiq@gmail.com',
        formData
      );
      
      // Show success message
      setIsSuccess(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form to start
  const handleReset = () => {
    setFormData({});
    setSelectedRole(null);
    setIsSuccess(false);
    goToStep(0);
  };
  
  // Render current form step
  const renderStep = () => {
    if (isSuccess) {
      return <LeadFormSuccess userData={formData} onReset={handleReset} />;
    }
    
    switch (currentStepIndex) {
      case 0:
        return <LeadFormStep1 onSelectRole={handleRoleSelect} />;
      case 1:
        return (
          <LeadFormStep2 
            onSubmit={handleStepSubmit} 
            onBack={prevStep} 
            initialData={formData}
          />
        );
      case 2:
        return (
          <LeadFormStep3 
            onSubmit={handleStepSubmit} 
            onBack={prevStep} 
            initialData={formData}
          />
        );
      case 3:
        return (
          <LeadFormRoleSpecific 
            role={selectedRole}
            onSubmit={handleStepSubmit} 
            onBack={prevStep} 
            initialData={formData}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Show progress bar only after role selection */}
      {selectedRole && !isSuccess && (
        <FormProgressBar 
          progress={progress} 
          steps={steps} 
          currentStepIndex={currentStepIndex}
          onStepClick={(index) => {
            // Only allow going back to previous steps
            if (index < currentStepIndex) {
              goToStep(index);
            }
          }}
        />
      )}
      
      {/* Form error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Render current step with animation */}
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default LeadForm;
