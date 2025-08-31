import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'

if(process.env.NODE_ENV === "production") {
    dotenv.config()
}
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)