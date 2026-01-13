
import { createClient } from '@supabase/supabase-js';

// Na Vercel, configure estas variáveis em Settings > Environment Variables
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://koulerqjvcmfrtnkjqhh.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Pz5KfivA1Hncsk-cGiDAqw_Lw5ZamrF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
