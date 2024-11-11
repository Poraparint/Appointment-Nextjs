"use sever"
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/protected";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const isLocalEnv = process.env.NODE_ENV === "development";
      const redirectUrl = isLocalEnv
        ? `http://localhost:3000${next}`
        : `https://appointment-dental.vercel.app${next}`;

      return NextResponse.redirect(redirectUrl);
    }
  }

  // ถ้าไม่สามารถเปลี่ยนเส้นทางได้ให้แสดงข้อผิดพลาด
  return NextResponse.json(
    { message: "Something went wrong" },
    { status: 500 }
  );
}
