import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const storage = typeof window !== "undefined" ? localStorage : undefined;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storage: storage, // Only use localStorage in the client-side
      },
    }
  );
};
