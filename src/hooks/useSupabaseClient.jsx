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
    setLoading(true);
    const session = supabase.auth.session ? supabase.auth.session() : supabase.auth.getSession?.();
    if (session && session.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    setLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session && session.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe && authListener.unsubscribe();
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

  // Helper: Log to lead_logs table (new schema)
  async function logLeadEventV2({ lead_id = null, role = null, event_type, message, metadata = {} }) {
    try {
      await supabase.from('lead_logs').insert({
        lead_id,
        role,
        event_type,
        message,
        metadata: JSON.stringify(metadata),
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      // fallback: log to console
      console.error('Lead log insert failed', e, message, metadata);
    }
  }

  // Submit lead form data (with improved logging)
  const submitLeadForm = async (formData, { userIp = null, userAgent = null } = {}) => {
    setError(null);
    try {
      setLoading(true);

      // 0. Check for missing role
      if (!formData.role) {
        const msg = 'Rol ontbreekt';
        await logLeadEventV2({ event_type: 'validation_error', message: msg, metadata: { input: formData, ip: userIp, browser: userAgent } });
        throw new Error(msg);
      }
      const role = formData.role;

      // 1. Validate required general fields
      const generalFields = ['first_name', 'last_name', 'email', 'role'];
      for (const field of generalFields) {
        if (!formData[field]) {
          const msg = `Veld ontbreekt: ${field}`;
          await logLeadEventV2({ role, event_type: 'validation_error', message: msg, metadata: { input: formData, ip: userIp, browser: userAgent } });
          throw new Error(msg);
        }
      }

      // 2. Validate required role fields
      // const requiredRoleFields = requiredFieldsByRole[role];
      // if (!requiredRoleFields) {
      //   const msg = `Onbekende rol: ${role}`;
      //   await logLeadEventV2({ role, event_type: 'validation_error', message: msg, metadata: { input: formData, ip: userIp, browser: userAgent } });
      //   throw new Error(msg);
      // }
      // for (const field of requiredRoleFields) {
      //   if (!formData[field]) {
      //     const msg = `Rol-specifiek veld ontbreekt: ${field}`;
      //     await logLeadEventV2({ role, event_type: 'validation_error', message: msg, metadata: { input: formData, ip: userIp, browser: userAgent } });
      //     throw new Error(msg);
      //   }
      // }

      // 3. Check if email already exists
      const { data: existingEmail, error: emailError } = await supabase
        .from('leads')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();
      if (emailError) {
        await logLeadEventV2({ role, event_type: 'system_error', message: 'Email check error', metadata: { email: formData.email, error: emailError, ip: userIp, browser: userAgent } });
        throw new Error('Fout bij controleren van e-mailadres');
      }
      if (existingEmail) {
        const msg = 'E-mailadres bestaat al';
        await logLeadEventV2({ role, event_type: 'validation_error', message: msg, metadata: { input: formData, ip: userIp, browser: userAgent } });
        throw new Error(msg);
      }

      // 4. Insert general info
      const generalData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role: formData.role
      };
      const { data: generalLead, error: leadError } = await supabase
        .from('leads')
        .insert([generalData])
        .select()
        .single();
      if (leadError) {
        await logLeadEventV2({ role, event_type: 'insert_error', message: 'Insert leads error', metadata: { error: leadError, data: generalData, ip: userIp, browser: userAgent } });
        throw leadError;
      }

      // 5. Insert role-specific info
      let roleTable = '';
      let roleSpecificData = { lead_id: generalLead.id };
      switch (role) {
        case 'student':
          Object.assign(roleSpecificData, {
            education_level: formData.education_level,
            field_of_study: formData.field_of_study,
            investment_knowledge: formData.investment_knowledge,
            start_amount: formData.start_amount,
          });
          roleTable = 'leads_student';
          break;
        case 'ouder':
          Object.assign(roleSpecificData, {
            child_age: formData.child_age,
            investment_timeframe: formData.investment_timeframe,
          });
          roleTable = 'leads_ouder';
          break;
        case 'member':
          Object.assign(roleSpecificData, {
          });
          roleTable = 'leads_member';
          break;
        case 'freelancer':
          Object.assign(roleSpecificData, {
            kvk_number: formData.kvk_number,
            business_type: formData.business_type,
            income_streams: formData.income_streams,
          });
          roleTable = 'leads_freelancer';
          break;
        case 'ondernemer':
          Object.assign(roleSpecificData, {
            company_name: formData.company_name,
            business_stage: formData.business_stage,
            team_size: formData.team_size,
          });
          roleTable = 'leads_ondernemer';
          break;
        case 'affiliated':
          Object.assign(roleSpecificData, {
            network_size: formData.network_size,
            preferred_commission_model: formData.preferred_commission_model,
          });
          roleTable = 'leads_affiliated';
          break;
        default:
          throw new Error('Onbekende rol: ' + role);
      }
      const { error: roleError } = await supabase
        .from(roleTable)
        .insert([roleSpecificData]);
      if (roleError) {
        // Rollback: verwijder de general lead
        await supabase.from('leads').delete().eq('id', generalLead.id);
        await logLeadEventV2({ lead_id: generalLead.id, role, event_type: 'rollback', message: 'Rol-insert error, rollback uitgevoerd', metadata: { error: roleError, generalLead, roleSpecificData, ip: userIp, browser: userAgent } });
        throw new Error('Fout bij opslaan van rol-specifieke gegevens. Probeer opnieuw.');
      }

      await logLeadEventV2({ lead_id: generalLead.id, role, event_type: 'insert_success', message: `Lead succesvol opgeslagen (${role})`, metadata: { input: formData, generalLead, roleSpecificData, ip: userIp, browser: userAgent } });
      return generalLead;
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
