"use client";
import { useState } from "react";
import { updateProfile } from "./action";
import Image from "next/image";
import Swal from "sweetalert2";

interface User {
  avatar_url?: string;
  username?: string;
}

export default function EditProfileForm({ user }: { user: User }) {
  const [profileImage, setProfileImage] = useState(
    user.avatar_url || "/De_Profile.jpeg"
  );
  const [username, setUsername] = useState(user.username || "");
  const [newImage, setNewImage] = useState<File | null>(null); // State สำหรับเก็บไฟล์รูปใหม่
  const [newBg, setNewBg] = useState<File | null>(null); // State สำหรับเก็บไฟล์รูปใหม่
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await updateProfile(formData);
      if (response.error) {
        setError(response.message);
      } else {
        Swal.fire({
          icon: "success",
          title: "อัปเดตโปรไฟล์สำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload(); // โหลดหน้าใหม่เมื่อทำการอัปเดตเสร็จสิ้น
        });
      }
    } catch (err) {
      setError("Error updating profile: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  console.log(user);

  return (
    <div className=" ">
      <form
        className="flex relative pt-20 justify-between tracking-wide"
        onSubmit={handleProfileUpdate}
      >
        <h1 className="font-semibold text-2xl text-text absolute top-0 left-0">
          ข้อมูลบัญชี
        </h1>
        <div className="flex flex-col gap-3 w-full p-5 text-text">
          <label htmlFor="username" className="block text-lg ml-5">
            ชื่อที่แสดงในระบบ
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={user.username || "แก้ไขชื่อของคุณ"} // แสดง placeholder เป็นค่าปัจจุบัน
            className="w-full bg-bg border-text border-[0.5px] py-3 rounded-md px-4 outline-none text-text"
          />
          
        </div>
        <div className="w-full flex max-lg:flex-col text-text">
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex flex-col gap-5 items-center w-full p-5">
            <label htmlFor="profileImage" className="block text-lg">
              รูปโปรไฟล์
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
                name="profileImage"
                className="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setNewImage(file);
                  if (file) {
                    setProfileImage(URL.createObjectURL(file)); // แสดงภาพใหม่
                  }
                }}
              />
            </div>
          </div>
          
        </div>

        <div className="absolute right-0 top-0">
          <button
            type="submit"
            className="btn bg-bg border-pain text-pain hover:border-white hover:text-white hover:bg-pain duration-300 px-6"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </div>
  );
}
