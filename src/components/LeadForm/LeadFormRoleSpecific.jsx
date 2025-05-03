import React from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import * as z from 'zod';
import { getQuestionsForRole } from '../../utils/roleBasedQuestions';
import { Button } from '../Shared/Button';
import { InputField } from '../Shared/InputField';
import { SelectField } from '../Shared/SelectField';

const LeadFormRoleSpecific = ({ role, onSubmit, onBack, initialData = {} }) => {
  // Get all questions for this role (common + specific)
  let roleQuestions = [];
  try {
    roleQuestions = getQuestionsForRole(role);
  } catch (e) {
    return (
      <div className="text-center py-12 text-red-600 font-bold">
        Er is iets mis met de rol-instellingen. Neem contact op met support.
      </div>
    );
  }

  // Only show role-specific questions (filter out common fields)
  const specificQuestions = roleQuestions.filter(q => !q.common);

  // Dynamically build validation schema based on role-specific questions
  const schemaObj = {};
  specificQuestions.forEach(question => {
    let validator = z.string();
    if (question.validation?.pattern) {
      validator = validator.regex(
        question.validation.pattern.value,
        { message: question.validation.pattern.message }
      );
    }
    if (question.validation?.minLength) {
      validator = validator.min(
        question.validation.minLength.value,
        { message: question.validation.minLength.message }
      );
    }
    if (question.required) {
      validator = validator.min(1, { message: question.validation?.required || 'Dit veld is verplicht' });
    } else {
      validator = validator.optional();
    }
    schemaObj[question.id] = validator;
  });
  const formSchema = z.object(schemaObj);

  const { register, formState: { errors, isSubmitting } } = useFormContext();

  // If there are no specific questions, show a message
  if (specificQuestions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        Geen specifieke vragen voor deze rol. <br /> Klik op "Voltooien" om verder te gaan.
        <div className="flex justify-end pt-8">
          <Button type="button" variant="outline" onClick={onBack}>Terug</Button>
          <Button type="button" className="ml-4" onClick={() => onSubmit({})}>Voltooien</Button>
        </div>
      </div>
    );
  }

  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{roleTitle} Specifieke Informatie</h2>
        <p className="text-gray-600">Vul de specifieke gegevens in voor je rol</p>
      </div>
      <div className="space-y-6">
        {specificQuestions.map((question) => {
          if (question.type === 'select') {
            return (
              <SelectField
                key={question.id}
                label={question.label}
                id={question.id}
                options={question.options}
                placeholder={question.placeholder || "Selecteer een optie"}
                error={errors[question.id]?.message}
                required={question.required}
                className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
                {...register(question.id)}
              />
            );
          } else {
            return (
              <InputField
                key={question.id}
                label={question.label}
                id={question.id}
                type={question.type || 'text'}
                placeholder={question.placeholder}
                error={errors[question.id]?.message}
                required={question.required}
                className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
                {...register(question.id)}
              />
            );
          }
        })}
        {/* Navigatie en submit worden nu centraal geregeld in het hoofdformulier */}
      </div>
    </motion.div>
  );
};

export default LeadFormRoleSpecific;
