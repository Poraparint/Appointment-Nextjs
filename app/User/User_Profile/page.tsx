"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import Swal from "sweetalert2";
import ShowWork from "@/components/ShowWork";
import Footer from "@/components/Footer";
import BoardCard from "@/components/BoardCard";

export default function User_Profile() {
  const supabase = createClient();
  const useuserData = useUser();

  const [userData, setUserData] = useState<any>(null);
  const [works, setWorks] = useState<any[]>([]);

  const [boards, setBoards] = useState<any[]>([]);
  const [invitedBoards, setInvitedBoards] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState("/De_Profile.jpeg");
  const [username, setUsername] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useuser = useuserData?.user;
  const isUserLoading = useuserData?.isLoading;
  const userError = useuserData?.error;

  // ดึงข้อมูลผู้ใช้
  const fetchUserData = async () => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("username, avatar_url")
        .eq("id", useuser.id)
        .limit(1)
        .single();
      if (error) throw error;
      if (userData) {
        setUserData(userData);
        setUsername(userData.username);
        setProfileImage(userData.avatar_url || "/De_Profile.jpeg");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // ดึงข้อมูลบทความของผู้ใช้
  const fetchWorks = async () => {
    try {
      const { data: works, error } = await supabase
        .from("article")
        .select("*, users (username, avatar_url)")
        .eq("user_id", useuser.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setWorks(works || []);
    } catch (error) {
      console.error("Error fetching works:", error);
    }
  };

  // ดึงข้อมูลบอร์ดของผู้ใช้
  const fetchBoards = async () => {
    try {
      const { data: boards, error } = await supabase
        .from("boards")
        .select("*")
        .eq("creator_id", useuser.id);
      // หรือใช้เงื่อนไขที่เหมาะสมกับข้อมูลของคุณ

      if (error) throw error;
      console.log(boards);
      setBoards(boards || []);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  // ดึงข้อมูลบอร์ดที่ผู้ใช้ได้รับเชิญ
  const fetchInvitedBoards = async () => {
    try {
      const { data: invitedBoards, error } = await supabase
        .from("board_members") // เปลี่ยนเป็นชื่อของตารางที่เก็บข้อมูลเชิญ
        .select("*, boards(*)")
        .eq("user_id", useuser.id); // ใช้ user_id เพื่อดึงข้อมูลบอร์ดที่ผู้ใช้ได้รับเชิญ

      if (error) throw error;
      setInvitedBoards(invitedBoards.map((item) => item.boards) || []);
    } catch (error) {
      console.error("Error fetching invited boards:", error);
    }
  };

  const handleProfileUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("username", username);
    if (newImage) {
      formData.append("profile", newImage);
    }

    try {
      const response = await supabase
        .from("users")
        .update({
          username,
          avatar_url: newImage
            ? URL.createObjectURL(newImage)
            : userData.avatar_url,
        })
        .eq("id", useuser.id);

      if (response.error) {
        setError(response.error.message);
      } else {
        Swal.fire({
          icon: "success",
          title: "อัปเดตโปรไฟล์สำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (err) {
      setError("Error updating profile: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useuser && !isUserLoading) {
      fetchUserData();
      fetchWorks();
      fetchBoards();
      fetchInvitedBoards();
    }
  }, [useuser, isUserLoading]);

  if (isUserLoading || !useuser) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error fetching user: </div>;
  }

  return (
    <div className="w-full">
      <div className="px-10 flex flex-col gap-5 max-sm:px-3">
        <div className="bg-bg flex p-10 gap-5 rounded-md max-sm:flex-col items-center">
          {userData?.avatar_url ? (
            <div className="relative w-24 h-24 max-sm:w-16 max-sm:h-16 rounded-full">
              <Image
                className="rounded-full"
                src={userData.avatar_url}
                alt="Avatar"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <div className="relative w-24 h-24 max-sm:w-16 max-sm:h-16 rounded-full">
              <Image
                className="rounded-full"
                src="/De_Profile.jpeg"
                alt="Avatar"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          <div className="flex flex-col justify-between tracking-wide max-sm:items-center max-sm:gap-5">
            {userData?.username ? (
              <p className="text-text text-2xl flex text-center max-sm:text-lg">
                {userData.username}
              </p>
            ) : (
              <p className="text-text text-2xl flex text-center max-sm:text-lg">
                ไม่มีชื่อ
              </p>
            )}
            <div className="flex gap-5 ">
              <button className="btn bg-pain border-white text-white px-8 hover:bg-purple-800 max-sm:text-sm max-sm:px-2">
                <Link href="/User/Article">เพิ่มบทความ</Link>
              </button>
              <button
                className="btn bg-white border-pain text-pain px-8 hover:bg-gray-200 max-sm:text-sm max-sm:px-2"
                onClick={() => setIsModalOpen(true)}
              >
                แก้ไขโปรไฟล์
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-5 max-lg:flex-col">
          <div className="bg-bg w-3/4 rounded-md max-lg:w-full p-5">
            <h1 className="text-text text-xl">บทความของคุณ</h1>
            <div className="mt-10">
              {works && works.length > 0 ? (
                <div className="grid grid-cols-4 grid-rows-1 gap-5 max-lg:grid-cols-3 max-md:grid-cols-1 mt-8 ">
                  {works.map((work) => (
                    <ShowWork key={work.id} work={work} />
                  ))}
                </div>
              ) : (
                <p>คุณยังไม่มีบทความที่เพิ่มในระบบ</p>
              )}
            </div>
          </div>
          <div className="flex gap-5 flex-col w-1/4 max-lg:w-full">
            <div className="w-full bg-bg rounded-md h-full p-5">
              <h1 className="text-text text-xl">บอร์ดของคุณ</h1>
              <div className="mt-10">
                {boards && boards.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5">
                    {boards.map((board) => (
                      <BoardCard key={board.id} board={board} />
                    ))}
                  </div>
                ) : (
                  <p>คุณยังไม่ได้สร้างบอร์ด</p>
                )}
              </div>
            </div>
            <div className="bg-bg rounded-md  h-full p-5">
              <h1 className="text-text text-xl">บอร์ดที่คุณได้รับเชิญ</h1>
              <div className="mt-10">
                {invitedBoards && invitedBoards.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5">
                    {invitedBoards.map((board) => (
                      <BoardCard key={board.id} board={board} />
                    ))}
                  </div>
                ) : (
                  <p>คุณยังไม่ได้รับเชิญเข้าบอร์ด</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal for Edit Profile */}
      {isModalOpen && (
        <div
          className="modal modal-open"
          onClick={() => setIsModalOpen(false)} // Close on background click
        >
          <div
            className="modal-box bg-bg text-text"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <form onSubmit={handleProfileUpdate}>
              <div className="flex flex-col gap-3">
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input w-full bg-bg border-text"
                  required
                />
              </div>
              <div className="flex flex-col gap-3 mt-5">
                <label className="block text-sm font-medium ">
                  Profile Image
                </label>
                <div className="relative w-24 h-24 rounded-full hover:opacity-90 hover:scale-105 duration-150">
                  <Image
                    className="rounded-full"
                    src={profileImage}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                  />
                  <input
                    type="file"
                    className="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setNewImage(file);
                      if (file) {
                        setProfileImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button type="submit" className="btn bg-pain text-bg border-bg">
                  บันทึก
                </button>
              </div>
            </form>
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
