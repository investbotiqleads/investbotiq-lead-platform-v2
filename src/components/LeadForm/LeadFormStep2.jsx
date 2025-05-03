import React from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Button } from '../Shared/Button';
import { InputField } from '../Shared/InputField';

const LeadFormStep2 = () => {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Persoonlijke Informatie</h2>
        <p className="text-gray-600">Vul je persoonlijke gegevens in</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Voornaam"
            id="first_name"
            placeholder="Voer je voornaam in"
            error={errors.first_name?.message}
            required
            className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
            {...register('first_name')}
          />
          
          <InputField
            label="Achternaam"
            id="last_name"
            placeholder="Voer je achternaam in"
            error={errors.last_name?.message}
            required
            className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
            {...register('last_name')}
          />
        </div>

        <InputField
          label="E-mailadres"
          id="email"
          type="email"
          placeholder="Voer je e-mailadres in"
          error={errors.email?.message}
          required
          className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
          {...register('email')}
        />

        <InputField
          label="Telefoonnummer"
          id="phone"
          type="tel"
          placeholder="Voer je telefoonnummer in"
          error={errors.phone?.message}
          className="transition-all hover:shadow-md focus:shadow-lg active:scale-[0.98] border hover:border-blue-400 focus:border-blue-500"
          {...register('phone')}
        />

        {/* Navigation handled at main form level */}
      </div>
    </motion.div>
  );
};

export default LeadFormStep2;
