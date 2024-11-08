"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import ShowWork from "@/components/ShowWork";
import Footer from "@/components/Footer";
import EditProfileForm from "./Edit/EditProfileForm"; // เรียกใช้ component ใหม่

export default function User_Profile() {
  const supabase = createClient();
  const useuserData = useUser(); // ไม่ destructure ทันที

  const [userData, setUserData] = useState<any>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const useuser = useuserData?.user;
  const isUserLoading = useuserData?.isLoading;
  const userError = useuserData?.error;

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้
  const fetchUserData = async () => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("username, avatar_url")
        .eq("id", useuser.id)
        .limit(1)
        .single(); // ดึงข้อมูลผู้ใช้หนึ่งคน

      if (error) throw error;
      if (userData) {
        setUserData(userData); // บันทึกข้อมูลผู้ใช้
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลงาน
  const fetchWorks = async () => {
    try {
      const { data: works, error } = await supabase
        .from("boards")
        .select("*, users (username, avatar_url)")
        .eq("user_id", useuser.id) // ดึงข้อมูลงานที่สัมพันธ์กับ user_id ของผู้ใช้
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorks(works || []); // บันทึกข้อมูลงาน
    } catch (error) {
      console.error("Error fetching works:", error);
    }
  };

  useEffect(() => {
    if (useuser && !isUserLoading) {
      fetchUserData();
      fetchWorks();
    }
  }, [useuser, isUserLoading]);

  // แสดงสถานะการโหลดหากข้อมูลยังไม่พร้อม
  if (isUserLoading || !useuser) {
    return <div>Loading...</div>;
  }

  // ถ้ามี error ในการดึงข้อมูล user
  if (userError) {
    return <div>Error fetching user: </div>;
  }

  if (!useuser) {
    return <div>User not logged in</div>;
  }

  console.log(userData);

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
              <div className="flex gap-5 ">
                <button className="btn bg-pain border-white text-white px-8 hover:bg-purple-800">
                  <Link href="/User/Article">เพิ่มบทความ</Link>
                </button>
                <button
                  className="btn bg-white border-pain text-pain px-8 hover:bg-gray-200"
                  onClick={() => setIsModalOpen(true)} // Open modal
                >
                  แก้ไขโปรไฟล์
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 max-xl:flex-col h-[50rem]">
          <div className="bg-bg w-3/4 rounded-md max-xl:w-full h-full p-5">
            <h1 className="text-text text-xl">บทความของคุณ</h1>
            <div className="mt-10">
              {works && works.length > 0 ? (
                <div className="grid grid-cols-3 grid-rows-1 gap-4 max-lg:grid-cols-1 mt-8 ">
                  {works.map((work) => (
                    <ShowWork key={work.id} work={work} />
                  ))}
                </div>
              ) : (
                <p>คุณยังไม่มีบทความที่เพิ่มในระบบ</p>
              )}
            </div>
          </div>
          <div className="w-1/4 bg-bg rounded-md max-xl:w-full h-full p-5">
            <h1 className="text-text text-xl">Contact</h1>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal for Edit Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg w-5/6">
            <EditProfileForm user={userData} />
            <div className="flex justify-end mt-4">
              <button
                className="btn bg-bg text-text p-4"
                onClick={() => setIsModalOpen(false)} // Close modal
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
