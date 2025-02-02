import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/User_Profile";

    if (!code) {
      return NextResponse.json(
        { message: "Authorization code is missing" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.json(
        { message: "Failed to exchange code for session", error },
        { status: 500 }
      );
    }

    // กำหนด URL สำหรับ redirect ตาม environment
    const isLocalEnv = process.env.NODE_ENV === "development";
    const redirectUrl = isLocalEnv
      ? `http://localhost:3000${next}`
      : `https://appointment-dental.vercel.app${next}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unexpected server error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
