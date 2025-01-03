"use client"; // ใช้ client component

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Footer from "./Footer";

interface UserViewProps {
  username: string; // Explicitly define the type of username
}

export default function UserView({ username }: UserViewProps) {
  const supabase = createClient();

  const [userData, setUserData] = useState<any>(null);
  

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
      
    } catch (error) {
      console.error("Error fetching user data:", error);
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
        
      </div>
      <Footer />
    </div>
  );
}
