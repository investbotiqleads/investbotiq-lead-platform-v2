import React from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Button } from '../Shared/Button';
import { InputField } from '../Shared/InputField';

const LeadFormStep3 = () => {
  const { register, formState: { errors, isSubmitting } } = useFormContext();

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

      <div className="space-y-6">
        <InputField
          label="Geboortedatum"
          id="birth_date"
          type="date"
          error={errors.birth_date?.message}
          className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
          {...register('birth_date')}
        />

        <InputField
          label="Woonplaats"
          id="city"
          placeholder="Voer je woonplaats in"
          error={errors.city?.message}
          className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
          {...register('city')}
        />

        <InputField
          label="Referral Code"
          id="referral_code"
          placeholder="Heb je een referral code?"
          error={errors.referral_code?.message}
          className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
          {...register('referral_code')}
        />

        {/* Navigatieknoppen worden nu centraal in het hoofdformulier geregeld */}
      </div>
    </motion.div>
  );
};

export default LeadFormStep3;
