"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const errorMessages: Record<string, string> = {
      email_not_confirmed: "กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ",
      user_banned: "บัญชีนี้ถูกระงับ กรุณาติดต่อฝ่ายสนับสนุน",
      user_not_found: "ไม่พบผู้ใช้ โปรดตรวจสอบอีเมลและรหัสผ่าน",
    };

    const message =
      error.code && errorMessages[error.code]
        ? errorMessages[error.code]
        : error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่";
    return redirect(
      `/sign-in?message=${encodeURIComponent(message)}&type=warning`
    );
  }

  return redirect("/User_Profile");
};
