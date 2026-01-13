
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://koulerqjvcmfrtnkjqhh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Pz5KfivA1Hncsk-cGiDAqw_Lw5ZamrF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
