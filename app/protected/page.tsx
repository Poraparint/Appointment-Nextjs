"use client"
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ProtectedPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/sign-in";
      } else {
        setLoading(false); // แสดงเนื้อหาเมื่อมี session
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // แสดงสถานะการโหลดระหว่างการตรวจสอบ
  }

  return <div>Protected Content</div>; // แสดงเนื้อหาหลังจากตรวจสอบเสร็จสิ้น
}
