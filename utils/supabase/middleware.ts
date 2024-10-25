import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    console.log("Request Path:", request.nextUrl.pathname);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            console.log("Setting Cookies:", cookiesToSet);
          },
        },
      }
    );

    const user = await supabase.auth.getUser();
    console.log("User:", user);

    if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
      console.log("User not authenticated, redirecting to /sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && !user.error) {
      console.log("User authenticated, redirecting to /protected");
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    return NextResponse.next();
  } catch (e) {
    console.error("Error in updateSession:", e);
    return NextResponse.next();
  }
};
