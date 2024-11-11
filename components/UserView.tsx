"use client"; // ใช้ client component

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import ShowWork from "./ShowWork";
import Footer from "./Footer";

interface UserViewProps {
  username: string; // Explicitly define the type of username
}

export default function UserView({ username }: UserViewProps) {
  const supabase = createClient();

  const [userData, setUserData] = useState<any>(null);
  const [userWorks, setUserWorks] = useState<any[]>([]); // สร้าง state สำหรับงานของผู้ใช้

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้
  const fetchUserData = async () => {
    try {
      const decodedUsername = decodeURIComponent(username); // Decode the username
      const { data: userData, error } = await supabase
        .from("users")
        .select(
          "id, username, avatar_url"
        )
        .eq("username", decodedUsername) // Use the decoded username
        .single();

      if (error) throw error;
      setUserData(userData);
      // หลังจากดึงข้อมูลผู้ใช้แล้ว ให้ดึงงานของผู้ใช้คนนี้
      fetchUserWorks(userData.id); // เรียกใช้งานฟังก์ชันนี้เพื่อดึงงานของผู้ใช้ที่เลือก
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // ฟังก์ชันสำหรับดึงงานของผู้ใช้
  const fetchUserWorks = async (userId: string) => {
    try {
      // ใช้ userId ที่ได้จาก fetchUserData เพื่อดึงงานของผู้ใช้ที่เลือก
      const { data: works, error } = await supabase
        .from("article") // ชื่อ table ที่เก็บงานของผู้ใช้
        .select("*")
        .eq("user_id", userId); // ตรวจสอบว่า user_id ตรงกับ ID ของผู้ใช้ที่เลือก

      if (error) throw error;
      setUserWorks(works || []); // กำหนดค่าเป็น array ว่างถ้าไม่มีงาน
    } catch (error) {
      console.error("Error fetching user works:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserData(); // ดึงข้อมูลผู้ใช้
    }
  }, [username]);

  if (!userData) return <div className="Page">Loading...</div>; // สถานะการโหลด

  return (
    <div className="w-full mt-14">
      <div className="px-10 flex flex-col gap-5">
        <div className="">
          <div className="bg-bg flex p-10 gap-5 rounded-md">
            {userData?.avatar_url ? (
              <div className="relative w-24 h-24 rounded-full">
                <Image
                  className="rounded-full"
                  src={userData.avatar_url}
                  alt="Avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="relative w-24 h-24 rounded-full">
                <Image
                  className="rounded-full"
                  src="/De_Profile.jpeg"
                  alt="Avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="flex flex-col justify-between tracking-wide">
              {userData?.username ? (
                <p className="text-text text-2xl flex text-center">
                  {userData.username}
                </p>
              ) : (
                <p>ไม่มีชื่อ</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-5 max-xl:flex-col">
          <div className="bg-bg rounded-md w-full p-5">
            <h1 className="text-text text-xl">บทความ</h1>
            <div>
              {userWorks.length > 0 ? ( // แสดงงานของผู้ใช้
                <div className="grid grid-cols-4 grid-rows-1 gap-5 max-lg:grid-cols-3 max-md:grid-cols-1 mt-8 ">
                  {userWorks.map((work) => (
                    <ShowWork key={work.id} work={work} />
                  ))}
                </div>
              ) : (
                <p>ผู้ใช้นี้ยังไม่มีงานที่เพิ่มในระบบ</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
