import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Custom Hook สำหรับจัดการข้อมูลผู้ใช้ (user) จาก Supabase
export const useUser = () => {
  // สถานะผู้ใช้ (user) ที่จะใช้ในการบันทึกข้อมูลของผู้ใช้ที่ล็อกอิน
  const [user, setUser] = useState<any>(null);

  // สถานะการโหลดข้อมูล (isLoading) เพื่อบอกว่ากำลังโหลดข้อมูลผู้ใช้อยู่หรือไม่
  const [isLoading, setIsLoading] = useState(true);

  // สถานะข้อผิดพลาด (error) เพื่อจัดเก็บข้อมูลข้อผิดพลาดถ้ามีปัญหาในการดึงข้อมูล
  const [error, setError] = useState<Error | null>(null); // Type the error state

  // สร้าง client ของ Supabase เพื่อใช้ในการทำงานกับ API ของ Supabase
  const supabase = createClient();

  // useEffect จะทำงานเมื่อ component ที่ใช้ hook นี้ mount ขึ้นมา
  useEffect(() => {
    // ฟังก์ชัน fetchUser ใช้ในการดึงข้อมูลผู้ใช้
    const fetchUser = async () => {
      setIsLoading(true); // เริ่มโหลดข้อมูลผู้ใช้

      try {
        // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
        const { data, error } = await supabase.auth.getUser();

        // ถ้ามี error ให้โยน error ไปจัดการใน catch
        if (error) {
          throw error;
        }

        // ถ้าดึงข้อมูลสำเร็จ จะบันทึกข้อมูลผู้ใช้ลงใน state
        setUser(data.user);
      } catch (err) {
        // ถ้ามีข้อผิดพลาด จะบันทึก error ลงใน state (cast err to Error)
        setError(err as Error);
      } finally {
        // ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด ให้เปลี่ยนสถานะ isLoading เป็น false
        setIsLoading(false);
      }
    };

    // เรียกใช้ฟังก์ชัน fetchUser เมื่อ component mount
    fetchUser();
  }, [supabase]);

  // คืนค่าผู้ใช้ (user), สถานะการโหลด (isLoading), และข้อผิดพลาด (error) ออกมา
  return { user, isLoading, error };
};
