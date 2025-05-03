import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag to determine if we're in development mode
const isDevelopment = false; // Set to false in production

// Mock Supabase client for development
const mockSupabase = {
  auth: {
    signInWithPassword: async () => ({ data: { user: { email: 'admin@example.com', app_metadata: { role: 'admin' } } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: { user: { email: 'admin@example.com', app_metadata: { role: 'admin' } } } }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (table) => {
    let query = { table, filters: [], selected: null };
    return {
      select: function (columns) {
        query.selected = columns;
        return this;
      },
      eq: function (column, value) {
        query.filters.push({ column, value });
        return this;
      },
      maybeSingle: async function () {
        // Simuleer filteren op email (voor leads)
        let dataArr = mockData[query.table] || [];
        for (const f of query.filters) {
          dataArr = dataArr.filter(row => row[f.column] === f.value);
        }
        return { data: dataArr.length > 0 ? dataArr[0] : null, error: null };
      },
      single: async function () {
        let dataArr = mockData[query.table] || [];
        for (const f of query.filters) {
          dataArr = dataArr.filter(row => row[f.column] === f.value);
        }
        return { data: dataArr.length > 0 ? dataArr[0] : null, error: null };
      },
      insert: function (insertData) {
        // Simuleer insert chaining zoals Supabase: insert().select() of insert().select().single()
        const chain = {
          select: function () {
            return {
              single: async function () {
                // Voeg toe aan mockData
                if (!mockData[query.table]) mockData[query.table] = [];
                const newRow = { id: String(mockData[query.table].length + 1), ...insertData[0], created_at: new Date().toISOString() };
                mockData[query.table].push(newRow);
                return { data: newRow, error: null };
              },
              async then(resolve) { // allow await insert().select()
                if (!mockData[query.table]) mockData[query.table] = [];
                const newRow = { id: String(mockData[query.table].length + 1), ...insertData[0], created_at: new Date().toISOString() };
                mockData[query.table].push(newRow);
                resolve({ data: [newRow], error: null });
              }
            };
          },
          async then(resolve) { // allow await insert() directly
            if (!mockData[query.table]) mockData[query.table] = [];
            const newRow = { id: String(mockData[query.table].length + 1), ...insertData[0], created_at: new Date().toISOString() };
            mockData[query.table].push(newRow);
            resolve({ data: [newRow], error: null });
          }
        };
        return chain;
      },
      order: function () { return this; },
    };
  },
};

// Mock data for development
const mockData = {
  all_leads: [
    { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '+31612345678', birth_date: '1990-01-01', city: 'Amsterdam', role: 'member', referral_code: 'REF123', extra_data: { investment_experience: 'intermediate' }, created_at: new Date().toISOString() },
    { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', phone: '+31687654321', birth_date: '1985-05-15', city: 'Rotterdam', role: 'freelancer', referral_code: '', extra_data: { expertise: 'development' }, created_at: new Date().toISOString() },
    { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', phone: '+31698765432', birth_date: '1995-10-20', city: 'Utrecht', role: 'parent', referral_code: 'REF456', extra_data: { child_age: '6_to_12' }, created_at: new Date().toISOString() },
  ],
  leads_member: [
    { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '+31612345678', birth_date: '1990-01-01', city: 'Amsterdam', role: 'member', referral_code: 'REF123', extra_data: { investment_experience: 'intermediate' }, created_at: new Date().toISOString() },
  ],
  leads_freelancer: [
    { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', phone: '+31687654321', birth_date: '1985-05-15', city: 'Rotterdam', role: 'freelancer', referral_code: '', extra_data: { expertise: 'development' }, created_at: new Date().toISOString() },
  ],
  leads_parent: [
    { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', phone: '+31698765432', birth_date: '1995-10-20', city: 'Utrecht', role: 'parent', referral_code: 'REF456', extra_data: { child_age: '6_to_12' }, created_at: new Date().toISOString() },
  ],
};

// Helper function to get the appropriate table name based on role
export const getLeadTableName = (role) => {
  const validRoles = ['member', 'freelancer', 'parent', 'student', 'affiliated'];
  if (!validRoles.includes(role.toLowerCase())) {
    throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
  }
  return `leads_${role.toLowerCase()}`;
};

// Function to insert a new lead
export const insertLead = async (leadData) => {
  const { role, ...data } = leadData;
  const tableName = getLeadTableName(role);
  
  const { data: result, error } = await supabase
    .from(tableName)
    .insert([{ ...data, role }]);
    
  if (error) {
    console.error('Error inserting lead:', error);
    throw error;
  }
  
  return result;
};

// Function to get all leads (admin only)
export const getAllLeads = async () => {
  const { data, error } = await supabase
    .from('all_leads')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
  
  return data;
};

// Function to get leads by role (admin only)
export const getLeadsByRole = async (role) => {
  const tableName = getLeadTableName(role);
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Error fetching ${role} leads:`, error);
    throw error;
  }
  
  return data;
};

// Function to get a lead by ID (admin only)
export const getLeadById = async (role, id) => {
  const tableName = getLeadTableName(role);
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching ${role} lead with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

// Use mock client in development, real client in production
export const supabase = isDevelopment ? mockSupabase : createClient(supabaseUrl, supabaseAnonKey);
