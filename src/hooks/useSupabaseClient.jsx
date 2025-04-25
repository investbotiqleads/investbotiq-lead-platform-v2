import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Custom hook for Supabase authentication and user management
 * @returns {Object} - Authentication methods and user state
 */
export const useSupabaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for user session on mount
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Get initial session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has admin role
  const isAdmin = user && user.app_metadata && user.app_metadata.role === 'admin';

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAdmin,
  };
};

/**
 * Custom hook for Supabase database operations
 * @returns {Object} - Database methods
 */
export const useSupabaseDb = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Submit lead form data
  const submitLeadForm = async (formData) => {
    try {
      setLoading(true);
      
      const { role, ...leadData } = formData;
      const tableName = `leads_${role.toLowerCase()}`;
      
      // Extract role-specific data into extra_data field
      const commonFields = [
        'first_name', 'last_name', 'email', 'phone', 
        'birth_date', 'city', 'referral_code'
      ];
      
      const extraData = {};
      Object.keys(leadData).forEach(key => {
        if (!commonFields.includes(key)) {
          extraData[key] = leadData[key];
          delete leadData[key];
        }
      });
      
      // Insert into appropriate table
      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          ...leadData,
          role,
          extra_data: extraData
        }]);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all leads (admin only)
  const getAllLeads = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('all_leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get leads by role (admin only)
  const getLeadsByRole = async (role) => {
    try {
      setLoading(true);
      
      const tableName = `leads_${role.toLowerCase()}`;
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get lead by ID (admin only)
  const getLeadById = async (role, id) => {
    try {
      setLoading(true);
      
      const tableName = `leads_${role.toLowerCase()}`;
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitLeadForm,
    getAllLeads,
    getLeadsByRole,
    getLeadById,
  };
};
