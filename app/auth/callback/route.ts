import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("OAuth callback error:", error);
        // Redirect to error page with error message
        return NextResponse.redirect(
          `${origin}/sign-in?error=${encodeURIComponent(error.message)}`
        );
      }

      if (data.session) {
        // Successful login - redirect to intended page
        return NextResponse.redirect(`${origin}/User_Profile`);
      }
    } catch (err) {
      console.error("Unexpected error in OAuth callback:", err);
      return NextResponse.redirect(`${origin}/sign-in?error=unexpected_error`);
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}/sign-in?error=no_code`);
}
