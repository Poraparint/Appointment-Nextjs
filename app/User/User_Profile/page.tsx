"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import Swal from "sweetalert2";
import ShowWork from "@/components/ShowWork";
import Footer from "@/components/Footer";

export default function User_Profile() {
  const supabase = createClient();
  const useuserData = useUser();

  const [userData, setUserData] = useState<any>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/De_Profile.jpeg");
  const [username, setUsername] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useuser = useuserData?.user;
  const isUserLoading = useuserData?.isLoading;
  const userError = useuserData?.error;

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

  const fetchWorks = async () => {
    try {
      const { data: works, error } = await supabase
        .from("boards")
        .select("*, users (username, avatar_url)")
        .eq("user_id", useuser.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setWorks(works || []);
    } catch (error) {
      console.error("Error fetching works:", error);
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
    }
  }, [useuser, isUserLoading]);

  if (isUserLoading || !useuser) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error fetching user: </div>;
  }

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
                  onClick={() => setIsModalOpen(true)}
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
        <div
          className="modal modal-open"
          onClick={() => setIsModalOpen(false)} // Close on background click
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
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
              <div className="flex justify-end mt-4">
                <button type="submit" className="btn bg-pain text-white">
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
