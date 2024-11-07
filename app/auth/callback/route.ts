import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = "/protected"; // Path ที่ต้องการ redirect หลังจาก login สำเร็จ

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const origin =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_SITE_URL ||
            request.headers.get("x-forwarded-host") ||
            new URL(request.url).origin
          : "http://localhost:3000";

      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Error exchanging code for session:", error);
    }
  }

  // กรณีที่ไม่สามารถแลกเปลี่ยน code ได้หรือไม่มี code
  return NextResponse.json(
    { message: "Something went wrong during authentication" },
    { status: 500 }
  );
}
