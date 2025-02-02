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
    <div className="bg-bg p-8 rounded-lg shadow-xl ">
      <form
        className="flex flex-col pt-10 gap-8"
        onSubmit={handleProfileUpdate}
      >
        <h1 className="font-semibold text-3xl text-text text-center">
          ข้อมูลบัญชี
        </h1>

        {/* Username Input */}
        <div className="flex flex-col gap-4">
          <label htmlFor="username" className="text-lg font-medium text-text">
            ชื่อที่แสดงในระบบ
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={user.username || "แก้ไขชื่อของคุณ"}
            className="w-full bg-bg border-text border-2 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-pain transition duration-300"
          />
        </div>

        {/* Profile Image Input */}
        <div className="flex flex-col gap-6">
          <label
            htmlFor="profileImage"
            className="text-lg font-medium text-text"
          >
            รูปโปรไฟล์
          </label>
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg hover:opacity-90 transition duration-200">
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
                  setProfileImage(URL.createObjectURL(file)); // Show new image preview
                }
              }}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn bg-pain text-white hover:bg-purple-900 hover:scale-105 py-2 px-8 rounded-md transition duration-300 flex items-center justify-center border-bg"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </div>
  );
}
