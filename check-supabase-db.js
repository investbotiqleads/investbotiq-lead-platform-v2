import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  const tables = [
    'leads_member',
    'leads_freelancer',
    'leads_parent',
    'leads_student',
    'leads_affiliated',
    'blog_posts'
  ];

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Table ${table}: ERROR -`, error.message);
    } else {
      console.log(`Table ${table}: ${count} rows`);
    }
  }
}

checkTables().then(() => process.exit(0));
