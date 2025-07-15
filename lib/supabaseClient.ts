import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import { Database } from './database.types';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
