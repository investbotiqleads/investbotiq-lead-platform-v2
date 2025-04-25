import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Shared/Button';
import { InputField } from '../Shared/InputField';

// Define validation schema using zod
const formSchema = z.object({
  first_name: z.string().min(2, { message: 'Voornaam moet minimaal 2 karakters bevatten' }),
  last_name: z.string().min(2, { message: 'Achternaam moet minimaal 2 karakters bevatten' }),
  email: z.string().email({ message: 'Ongeldig e-mailadres' }),
  phone: z.string().optional()
});

const LeadFormStep2 = ({ onSubmit, onBack, initialData = {} }) => {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Persoonlijke Informatie</h2>
        <p className="text-gray-600">Vul je persoonlijke gegevens in</p>
      </div>

      <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Voornaam"
            id="first_name"
            placeholder="Voer je voornaam in"
            error={errors.first_name?.message}
            required
            {...register('first_name')}
          />
          
          <InputField
            label="Achternaam"
            id="last_name"
            placeholder="Voer je achternaam in"
            error={errors.last_name?.message}
            required
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
          {...register('email')}
        />

        <InputField
          label="Telefoonnummer"
          id="phone"
          type="tel"
          placeholder="Voer je telefoonnummer in"
          error={errors.phone?.message}
          {...register('phone')}
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

export default LeadFormStep2;
