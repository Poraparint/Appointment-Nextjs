import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient(); // สร้าง Supabase client

  const {
    data: { user },
  } = await supabase.auth.getUser(); // ตรวจสอบผู้ใช้

  // ถ้าไม่มีผู้ใช้ ให้ redirect ไปยังหน้า login
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div>
      <h1>Welcome to the Protected Page</h1>
    </div>
  );
}
