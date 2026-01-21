import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.warn(
        "Supabase credentials missing. Check .env.local. Features requiring backend will fail."
    );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
