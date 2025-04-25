-- Create tables for different types of leads
CREATE TABLE IF NOT EXISTS leads_member (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  birth_date DATE,
  city TEXT,
  role TEXT DEFAULT 'member',
  referral_code TEXT,
  extra_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads_freelancer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  birth_date DATE,
  city TEXT,
  role TEXT DEFAULT 'freelancer',
  referral_code TEXT,
  extra_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads_parent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  birth_date DATE,
  city TEXT,
  role TEXT DEFAULT 'parent',
  referral_code TEXT,
  extra_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads_student (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  birth_date DATE,
  city TEXT,
  role TEXT DEFAULT 'student',
  referral_code TEXT,
  extra_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads_affiliated (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  birth_date DATE,
  city TEXT,
  role TEXT DEFAULT 'affiliated',
  referral_code TEXT,
  extra_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a view that combines all leads for easier querying
CREATE OR REPLACE VIEW all_leads AS
  SELECT id, first_name, last_name, email, phone, birth_date, city, role, referral_code, extra_data, created_at FROM leads_member
  UNION ALL
  SELECT id, first_name, last_name, email, phone, birth_date, city, role, referral_code, extra_data, created_at FROM leads_freelancer
  UNION ALL
  SELECT id, first_name, last_name, email, phone, birth_date, city, role, referral_code, extra_data, created_at FROM leads_parent
  UNION ALL
  SELECT id, first_name, last_name, email, phone, birth_date, city, role, referral_code, extra_data, created_at FROM leads_student
  UNION ALL
  SELECT id, first_name, last_name, email, phone, birth_date, city, role, referral_code, extra_data, created_at FROM leads_affiliated;

-- Create RLS policies
-- Enable RLS on all tables
ALTER TABLE leads_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads_freelancer ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads_parent ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads_student ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads_affiliated ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all leads
CREATE POLICY admin_view_all_leads_member ON leads_member
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_view_all_leads_freelancer ON leads_freelancer
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_view_all_leads_parent ON leads_parent
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_view_all_leads_student ON leads_student
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_view_all_leads_affiliated ON leads_affiliated
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy for inserting leads (anyone can insert)
CREATE POLICY insert_own_lead_member ON leads_member
  FOR INSERT WITH CHECK (true);

CREATE POLICY insert_own_lead_freelancer ON leads_freelancer
  FOR INSERT WITH CHECK (true);

CREATE POLICY insert_own_lead_parent ON leads_parent
  FOR INSERT WITH CHECK (true);

CREATE POLICY insert_own_lead_student ON leads_student
  FOR INSERT WITH CHECK (true);

CREATE POLICY insert_own_lead_affiliated ON leads_affiliated
  FOR INSERT WITH CHECK (true);
