import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link"; // สำหรับการทำลิงก์ไปหน้าอื่น

export default async function ProtectedPage() {
  const supabase = await createClient();

  // ตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ถ้ายังไม่ได้ล็อกอิน จะเปลี่ยนเส้นทางไปหน้า sign-in
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-12">
      <h1 className="text-2xl font-bold">Welcome to the Protected Page</h1>

      {/* ปุ่ม Next ที่จะไปหน้า Calendar */}
      <Link href="/Appointment">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-3xl">
          Calendar
        </button>
      </Link>
    </div>
  );
}
