import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  console.log("GET request received:", request.url); // Log URL ที่ได้รับ

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  console.log("OAuth code received:", code); // Log code ที่ได้รับจาก OAuth

  const next = "/protected"; // Redirect to protected path after login

  if (code) {
    const supabase = createClient();
    console.log("Attempting to exchange code for session..."); // Log ก่อนแลกเปลี่ยน code

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log(
        "Session exchange successful, redirecting to:",
        `${origin}${next}`
      );
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Error during session exchange:", error); // Log ข้อผิดพลาดหากมี
    }
  } else {
    console.warn("No code found in the request."); // Log หากไม่มี code ในคำขอ
  }

  return NextResponse.json(
    { message: "Something went wrong" },
    { status: 500 }
  );
}
