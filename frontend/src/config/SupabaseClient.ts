import { createClient } from '@supabase/supabase-js';
export const supabaseClient= createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
);

console.log("👉 URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("👉 URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("👉 URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("👉 URL:", import.meta.env.VITE_SUPABASE_URL);