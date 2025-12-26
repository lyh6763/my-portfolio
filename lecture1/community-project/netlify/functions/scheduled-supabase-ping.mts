import type { Config } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export default async (req: Request) => {
  try {
    const supabaseUrl = Netlify.env.get('SUPABASE_URL');
    const supabaseKey = Netlify.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('health_check')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase ping failed:', error.message);
      return;
    }

    const timestamp = new Date().toISOString();
    console.log(`Supabase ping successful: ${timestamp}`);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

export const config: Config = {
  schedule: '0 9 * * 1,3,5',
};
