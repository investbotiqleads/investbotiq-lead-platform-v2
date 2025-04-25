import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Shared/Button';
import { InputField } from '../Shared/InputField';

// Define validation schema using zod
const formSchema = z.object({
  birth_date: z.string().optional(),
  city: z.string().optional(),
  referral_code: z.string().optional()
});

const LeadFormStep3 = ({ onSubmit, onBack, initialData = {} }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Aanvullende Informatie</h2>
        <p className="text-gray-600">Vul aanvullende gegevens in (optioneel)</p>
      </div>

      <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        <InputField
          label="Geboortedatum"
          id="birth_date"
          type="date"
          error={errors.birth_date?.message}
          {...register('birth_date')}
        />

        <InputField
          label="Woonplaats"
          id="city"
          placeholder="Voer je woonplaats in"
          error={errors.city?.message}
          {...register('city')}
        />

        <InputField
          label="Referral Code (optioneel)"
          id="referral_code"
          placeholder="Heb je een referral code?"
          error={errors.referral_code?.message}
          {...register('referral_code')}
        />

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
            {isSubmitting ? 'Bezig...' : 'Volgende'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default LeadFormStep3;
