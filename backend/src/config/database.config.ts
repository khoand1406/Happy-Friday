import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';

dotenv.config();
const supabaseUrl= process.env.SUPABASE_URL ?? '';
const supabaseAnonKey= process.env.SUPABASE_ANON_KEY ?? '';
const supabaseAdminKey= process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey || !supabaseAdminKey) {
  throw new Error('Missing Supabase env variables');
}

export const supabase= createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin= createClient(supabaseUrl, supabaseAdminKey);