import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { GoogleSpreadsheet } from 'google-spreadsheet';

// Supabase setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRole || supabaseAnonKey);
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey); // For auth

// Google Sheets setup
const sheetId = process.env.GOOGLE_SHEET_ID;
const googleEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

async function testSupabaseSignUp() {
  // Use a more standard test email format
  const email = `testuser+${Date.now()}@example.com`;
  const password = 'securepassword';
  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Sign up error:', error.message);
  } else {
    console.log('User signed up:', data);
  }
  return { email, password };
}

async function testSupabaseInsert() {
  // Insert a test row into a table (use leads as example)
  const response = await supabase
    .from('leads')
    .insert([
      {
        first_name: 'Test',
        last_name: 'User',
        email: `testuser_${Date.now()}@example.com`,
        phone_text: '1234567890',
        role: 'member',
        status: 'new',
      }
    ])
    .select();
  console.log('Supabase insert response:', response);
  const { data, error, status } = response;
  if (error) {
    console.error('Supabase insert error:', error);
    return null;
  } else {
    console.log('Inserted row into Supabase:', data[0]);
    return data[0];
  }
}

async function testSupabaseSelect() {
  const response = await supabase
    .from('leads')
    .select('*')
    .limit(1);
  console.log('Supabase select response:', response);
}

async function testGoogleSheetInsert(row) {
  try {
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: googleEmail,
      private_key: googlePrivateKey
    });
    await doc.loadInfo();
    console.log('Google Sheet Title:', doc.title);
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow(row);
    console.log('Inserted row into Google Sheet:', row);
  } catch (err) {
    console.error('Google Sheets error:', err);
  }
}

async function testLeadFlow(role, roleData) {
  const baseEmail = `testlead+${role}_${Date.now()}@example.com`;
  // Algemene velden
  const generalData = {
    first_name: 'Test',
    last_name: 'User',
    email: baseEmail,
    phone_text: '0612345678',
    role,
  };
  // Combineer algemene en rol-specifieke data
  const payload = { ...generalData, ...roleData };
  // Insert via Supabase
  const response = await supabase
    .from('leads')
    .insert([generalData])
    .select()
    .single();
  if (response.error) {
    console.error(`[${role}] Insert general error:`, response.error);
    return;
  }
  const leadId = response.data.id;
  let roleTable = '';
  let roleInsert = {};
  switch (role) {
    case 'student':
      roleTable = 'leads_student';
      roleInsert = {
        lead_id: leadId,
        education_level: roleData.education_level,
        study_direction: roleData.study_direction,
        investment_knowledge: roleData.investment_knowledge,
        investment_amount: roleData.investment_amount,
      };
      break;
    case 'ouder':
      roleTable = 'leads_ouder';
      roleInsert = {
        lead_id: leadId,
        child_age: roleData.child_age,
        child_education_status: roleData.child_education_status,
        investment_intent: roleData.investment_intent,
      };
      break;
    case 'member':
      roleTable = 'leads_member';
      roleInsert = {
        lead_id: leadId,
        investment_goal: roleData.investment_goal,
        investment_horizon: roleData.investment_horizon,
        investment_experience: roleData.investment_experience,
      };
      break;
    case 'freelancer':
      roleTable = 'leads_freelancer';
      roleInsert = {
        lead_id: leadId,
        kvk_number: roleData.kvk_number,
        business_type: roleData.business_type,
        income_streams: roleData.income_streams,
      };
      break;
    case 'ondernemer':
      roleTable = 'leads_ondernemer';
      roleInsert = {
        lead_id: leadId,
        company_name: roleData.company_name,
        business_stage: roleData.business_stage,
        team_size: roleData.team_size,
      };
      break;
    case 'affiliated':
      roleTable = 'leads_affiliated';
      roleInsert = {
        lead_id: leadId,
        network_size: roleData.network_size,
        preferred_commission_model: roleData.preferred_commission_model,
      };
      break;
    default:
      console.error('Onbekende rol:', role);
      return;
  }
  // Insert rol-specifiek
  const roleResp = await supabase.from(roleTable).insert([roleInsert]);
  if (roleResp.error) {
    // Rollback
    await supabase.from('leads').delete().eq('id', leadId);
    console.error(`[${role}] Insert role error (rollback):`, roleResp.error);
    return;
  }
  console.log(`[${role}] Lead succesvol aangemaakt (lead_id: ${leadId})`);
}

async function main() {
  // Testcases per rol
  await testLeadFlow('student', {
    education_level: 'HBO',
    study_direction: 'Informatica',
    investment_knowledge: 'Beginner',
    investment_amount: '1000',
  });
  await testLeadFlow('ouder', {
    child_age: '6-12',
    child_education_status: 'Basisschool',
    investment_intent: 'Sparen voor studie',
  });
  await testLeadFlow('member', {
    investment_goal: 'Vermogensgroei',
    investment_horizon: '5 jaar',
    investment_experience: 'Gemiddeld',
  });
  await testLeadFlow('freelancer', {
    kvk_number: '12345678',
    business_type: 'IT',
    income_streams: 'Consultancy',
  });
  await testLeadFlow('ondernemer', {
    company_name: 'Test BV',
    business_stage: 'Startup',
    team_size: '3',
  });
  await testLeadFlow('affiliated', {
    network_size: '100+',
    preferred_commission_model: 'Revenue share',
  });
}

main();
