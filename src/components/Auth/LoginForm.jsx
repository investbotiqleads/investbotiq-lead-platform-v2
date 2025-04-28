import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '../Shared/Button';
import { InputField } from '../Shared/InputField';
import { useSupabaseAuth } from '../../hooks/useSupabaseClient';
import { supabase } from '../../lib/supabaseClient';

// Define validation schema using zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Ongeldig e-mailadres' }),
  password: z.string().min(6, { message: 'Wachtwoord moet minimaal 6 karakters bevatten' }),
});

const LoginForm = () => {
  const [error, setError] = useState(null);
  const { signIn } = useSupabaseAuth();
  const navigate = useNavigate();

  // Initialize form with react-hook-form and zod validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);
      const { email, password } = data;
      
      // In development mode, use 'admin@example.com' with any password
      if (email === 'admin@example.com') {
        // Simuleer login met admin rol
        await signIn(email, password);
        window.location.href = '/admin';
        return;
      }
      
      // Voor echte authenticatie
      const result = await signIn(email, password);
      if (result.error) {
        if (result.error.message && result.error.message.toLowerCase().includes('invalid login credentials')) {
          setError('Ongeldig e-mailadres of wachtwoord. Probeer het opnieuw.');
        } else {
          setError(result.error.message || 'Er is een fout opgetreden bij het inloggen.');
        }
        return;
      }
      // Haal de user opnieuw op zodat app_metadata zeker klopt (Supabase-js v2.x)
      try {
        const { data, error: getUserError } = await supabase.auth.getUser();
        if (getUserError) {
          setError(getUserError.message || 'Kon gebruiker niet ophalen na inloggen.');
          return;
        }
        const user = data?.user;
        const userRole = user?.app_metadata?.role || 'member';
        console.log('Na login, userRole:', userRole, user);
        if (userRole === 'admin') {
          window.location.href = '/admin';
        } else {
          navigate('/'); // Later: naar eigen dashboard
        }
      } catch (err) {
        setError('Kon gebruiker niet ophalen na inloggen.');
      }
    } catch (err) {
      setError(err.message || 'Er is een fout opgetreden bij het inloggen.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
        <p className="text-gray-600">Log in om toegang te krijgen tot je dashboard</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          label="Wachtwoord"
          id="password"
          type="password"
          placeholder="Voer je wachtwoord in"
          error={errors.password?.message}
          required
          {...register('password')}
        />

        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Bezig met inloggen...' : 'Inloggen'}
          </Button>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Voor demo: gebruik admin@example.com met een willekeurig wachtwoord</p>
          <p>Je wordt na inloggen doorgestuurd naar het juiste dashboard op basis van je rol.</p>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;
