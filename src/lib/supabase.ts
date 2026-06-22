import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn("Peringatan: NEXT_PUBLIC_SUPABASE_URL belum dikonfigurasi di file .env");
}

// Menggunakan service role key agar memiliki hak akses penuh (bypass RLS) untuk upload berkas KTM admin/mahasiswa
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});
