import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // ตรวจสอบว่าได้ค่า environment variables มาถูกต้องไหม
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(
    "Supabase ANON KEY:",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 4) + "..."
  );


  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
