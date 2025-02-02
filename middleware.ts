import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ฟังก์ชันสร้าง Supabase Client
const getSupabaseClient = (req: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: req.headers.get("Authorization") || "" },
    },
  });
};

export async function middleware(req: NextRequest) {
  const supabase = getSupabaseClient(req);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;
  const publicPaths = ["/sign-in", "/sign-up"];

  if (!user) {
    // Redirect to sign-in if the user is not authenticated
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  } else {
    // Redirect authenticated users away from sign-in pages
    if (publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/User_Profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"], // Exclude API routes, Next.js internals, and assets
};

export default middleware;
