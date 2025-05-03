import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMultiStepForm } from '../../hooks/useMultiStepForm';
import { useSupabaseDb } from '../../hooks/useSupabaseClient';
import { getFormStepsForRole } from '../../utils/roleBasedQuestions';
import { sendConfirmationEmail, sendNotificationEmail } from '../../lib/resendClient';
import ErrorBoundary from '../Shared/ErrorBoundary';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import LeadFormRoleSpecific from './LeadFormRoleSpecific';
import FormProgressBar from './FormProgressBar';
import LeadFormStep1 from './LeadFormStep1';
import LeadFormStep2 from './LeadFormStep2';
import LeadFormStep3 from './LeadFormStep3';
import LeadFormSuccess from './LeadFormSuccess';

const LeadForm = () => {
  // Centralized form state
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { submitLeadForm, loading, error: dbError } = useSupabaseDb();

  // Step schemas
  const stepSchemas = {
    step1: z.object({
      role: z.string().min(2, { message: 'Rol is verplicht' }),
    }),
    step2: z.object({
      first_name: z.string().min(2, { message: 'Voornaam moet minimaal 2 karakters bevatten' }),
      last_name: z.string().min(2, { message: 'Achternaam moet minimaal 2 karakters bevatten' }),
      email: z.string().email({ message: 'Ongeldig e-mailadres' }),
      phone: z.string().optional(),
    }),
    step3: z.object({
      birth_date: z.string().optional(),
      city: z.string().optional(),
      referral_code: z.string().optional(),
    })
  };
  // Merge alles zodat role altijd wordt gevalideerd
  const fullSchema = stepSchemas.step1.merge(stepSchemas.step2).merge(stepSchemas.step3);

  // Centralized react-hook-form
  const methods = useForm({
    resolver: zodResolver(fullSchema),
    mode: 'onBlur',
    defaultValues: { role: null }, 
  });

  // Steps definition
  const steps = useMemo(() => {
    if (!selectedRole) {
      return [{ id: 'role-selection', title: 'Rol Selectie' }];
    }
    return [
      { id: 'personal-info', title: 'Persoonlijke Info' },
      { id: 'additional-info', title: 'Aanvullende Info' },
      { id: 'role-specific', title: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Info` },
    ];
  }, [selectedRole]);

  const {
    currentStepIndex,
    isLastStep,
    goToStep,
    nextStep,
    prevStep,
    progress
  } = useMultiStepForm(steps);

  // Handlers
  const handleRoleSelect = useCallback((role) => {
    setSelectedRole(role);
    methods.setValue('role', role, { shouldValidate: true, shouldDirty: true }); 
  }, [methods]);

  const handleStepSubmit = useCallback(async (data) => {
    if (isLastStep) {
      await handleFormSubmit(data);
    } else {
      nextStep();
    }
  }, [isLastStep, nextStep]);

  const handleFormSubmit = useCallback(async (data) => {
    try {
      setIsSubmitting(true);
      await submitLeadForm(data);
      await sendConfirmationEmail(data.email, data.first_name, data.role);
      await sendNotificationEmail('investbotiq@gmail.com', data);
      setIsSuccess(true);
    } catch (error) {
      setError(error.message || 'Er is een onbekende fout opgetreden bij het verzenden van het formulier.');
    } finally {
      setIsSubmitting(false);
    }
  }, [submitLeadForm]);

  const handleReset = useCallback(() => {
    methods.reset();
    setSelectedRole(null);
    setIsSuccess(false);
    setError(null);
    goToStep(0);
  }, [methods, goToStep]);

  // Render step
  const renderStep = () => {
    if (isSuccess) {
      return <LeadFormSuccess userData={methods.getValues()} onReset={handleReset} />;
    }
    switch (currentStepIndex) {
      case 0:
        if (!selectedRole) {
          return <LeadFormStep1 onSelectRole={handleRoleSelect} />;
        } else {
          return <LeadFormStep2 />;
        }
      case 1:
        return <LeadFormStep3 />;
      case 2:
        return (
          <ErrorBoundary>
            <LeadFormRoleSpecific role={selectedRole} />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-4xl mx-auto px-2 py-10 md:px-10 md:py-14 bg-white/80 rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-lg relative overflow-hidden">
        {/* Soft gradient highlight */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100 opacity-40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-100 opacity-30 rounded-full blur-2xl" />
        </div>
        {/* Show progress bar only after role selection */}
        <div className="relative z-10">
        {selectedRole && !isSuccess && (
          <FormProgressBar 
            progress={progress} 
            steps={steps} 
            currentStepIndex={currentStepIndex}
            onStepClick={(index) => {
              if (index < currentStepIndex) {
                goToStep(index);
              }
            }}
          />
        )}
        {(dbError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{dbError || error}</p>
          </div>
        )}
        <AnimatePresence mode="wait">
          <form onSubmit={methods.handleSubmit(handleStepSubmit)}>
            {renderStep()}
            {/* Show navigation buttons for all steps except role selection */}
            {steps[currentStepIndex].id !== 'role-selection' && (
              <div className="flex justify-between pt-8">
                {currentStepIndex > 1 && (
                  <button
                    type="button"
                    className="px-6 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition"
                    onClick={prevStep}
                  >
                    Terug
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition ml-auto"
                  disabled={isSubmitting || loading}
                >
                  {isLastStep ? (isSubmitting ? 'Verzenden...' : 'Verzenden') : (isSubmitting ? 'Bezig...' : 'Volgende')}
                </button>
              </div>
            )}
          </form>
        </AnimatePresence>
        </div>
      </div>
    </FormProvider>
  );
};

export default LeadForm;
