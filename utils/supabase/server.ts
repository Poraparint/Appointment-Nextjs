import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  // ตรวจสอบว่าได้ค่า environment variables ถูกต้องไหมในฝั่ง Server
  console.log("Supabase URL (Server):", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(
    "Supabase ANON KEY (Server):",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // ignore error for setting cookies
          }
        },
      },
    }
  );
};
