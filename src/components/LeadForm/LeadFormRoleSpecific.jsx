import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Shared/Button';
import { InputField } from '../Shared/InputField';
import { SelectField } from '../Shared/SelectField';
import { roleBasedQuestions } from '../../utils/roleBasedQuestions';

const LeadFormRoleSpecific = ({ role, onSubmit, onBack, initialData = {} }) => {
  // Get role-specific questions
  const roleQuestions = roleBasedQuestions[role] || [];
  
  // Dynamically build validation schema based on role questions
  const schemaObj = {};
  roleQuestions.forEach(question => {
    if (question.required) {
      schemaObj[question.id] = z.string().min(1, { message: question.validation?.required || 'Dit veld is verplicht' });
      
      // Add additional validation if specified
      if (question.validation?.pattern) {
        schemaObj[question.id] = schemaObj[question.id].regex(
          question.validation.pattern.value,
          { message: question.validation.pattern.message }
        );
      }
      
      if (question.validation?.minLength) {
        schemaObj[question.id] = schemaObj[question.id].min(
          question.validation.minLength.value,
          { message: question.validation.minLength.message }
        );
      }
    } else {
      schemaObj[question.id] = z.string().optional();
      
      // Add additional validation for optional fields if specified
      if (question.validation?.pattern) {
        schemaObj[question.id] = schemaObj[question.id].regex(
          question.validation.pattern.value,
          { message: question.validation.pattern.message }
        ).optional();
      }
    }
  });
  
  const formSchema = z.object(schemaObj);

  // Initialize form with react-hook-form and zod validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  // Handle form submission
  const processSubmit = (data) => {
    onSubmit(data);
  };

  // Get role title for display
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

      <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        {roleQuestions.map((question) => {
          // Render different input types based on question type
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
                {...register(question.id)}
              />
            );
          }
        })}

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
          >
            Terug
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Bezig...' : 'Voltooien'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default LeadFormRoleSpecific;
