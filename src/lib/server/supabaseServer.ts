
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"
import { SUPABASE_SERVICE } from '$env/static/private'

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = SUPABASE_SERVICE;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
