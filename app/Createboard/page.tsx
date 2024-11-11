"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { createBoard } from "./createboard";
import { createClient } from "@/utils/supabase/client"; // เชื่อมต่อกับ Supabase

const CreateBoard = () => {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]); // รายชื่อผู้ใช้ที่เชิญเข้าบอร์ด
  const [searchQuery, setSearchQuery] = useState(""); // คำค้นหาจากช่อง input
  const [searchResults, setSearchResults] = useState<any[]>([]); // ผลลัพธ์การค้นหา
  const [usernames, setUsernames] = useState<any>({}); // เก็บข้อมูล username ของผู้ใช้ที่ถูกเชิญ
  const router = useRouter();

  // ฟังก์ชันค้นหาผู้ใช้จาก Supabase
  const searchUsers = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar_url")
      .ilike("username", `%${query}%`); // ค้นหาผู้ใช้โดยใช้ ilike เพื่อค้นหาจากคำที่พิมพ์

    if (error) {
      console.error("Error searching users:", error);
      return;
    }
    setSearchResults(data || []);
  };

  // ฟังก์ชันดึงข้อมูล username ของผู้ใช้ที่เชิญ
  const fetchUsernames = async (userIds: string[]) => {
    if (userIds.length === 0) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar_url")
      .in("id", userIds);

    if (error) {
      console.error("Error fetching usernames:", error);
      return;
    }

    // สร้างอ็อบเจ็กต์ที่เก็บข้อมูล username ตาม userId
    const userObj: { [key: string]: string } = {};
    data?.forEach((user) => {
      userObj[user.id] = user.username;
    });

    setUsernames(userObj);
  };

  // ฟังก์ชันเพิ่มผู้ใช้ที่เลือกเข้าในรายการ
  const handleAddUser = (userId: string) => {
    if (userId && !invitedUsers.includes(userId)) {
      setInvitedUsers((prevUsers) => [...prevUsers, userId]);
      setSearchQuery(""); // เคลียร์ช่องค้นหาหลังจากเลือก
      setSearchResults([]); // เคลียร์ผลลัพธ์การค้นหา
    }
  };

  const handleRemoveUser = (userId: string) => {
    setInvitedUsers((prevUsers) => prevUsers.filter((user) => user !== userId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!boardName) {
      Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const formData = new FormData();
    formData.append("board_name", boardName);
    formData.append("description", description);

    try {
      const boardId = await createBoard(formData, invitedUsers);
      Swal.fire({
        icon: "success",
        title: "สร้างบอร์ดสำเร็จ",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      }).then(() => {
        router.push("/User/User_Profile");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถสร้างบอร์ดได้ โปรดลองอีกครั้ง",
      });
    }
  };

  useEffect(() => {
    fetchUsernames(invitedUsers); // ดึงข้อมูล username ของผู้ใช้ที่ถูกเชิญ
  }, [invitedUsers]);

  return (
    <div className="flex justify-center w-full">
      <form className="w-full p-8 max-sm:px-3" onSubmit={handleSubmit}>
        <div className="bg-bg p-5 rounded-md flex flex-col gap-5 text-text">
          <h2 className="text-xl">สร้างบอร์ดใหม่</h2>
          <hr className="border-light" />

          <div className="flex flex-col gap-3">
            <label htmlFor="board_name" className="text-lg">
              ชื่อบอร์ด
            </label>
            <input
              id="board_name"
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full p-2 rounded-md bg-ice"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="description" className="text-lg">
              รายละเอียดบอร์ด (ไม่จำเป็นต้องกรอก)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-ice"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="users" className="text-lg">
              เชิญผู้ใช้เข้าบอร์ด
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchUsers(e.target.value);
              }}
              className="w-full p-2 rounded-md bg-ice"
              placeholder="ค้นหา..."
            />

            {searchResults.length > 0 && (
              <div className="border border-gray-300 rounded-lg p-4 mt-4 bg-white shadow-sm">
                <ul className="space-y-3">
                  {searchResults.map((user) => (
                    <li key={user.id}>
                      <button
                        type="button"
                        onClick={() => handleAddUser(user.id)}
                        className="flex justify-between items-center p-3 bg-gray-200 rounded-lg hover:bg-gray-400 transition-all w-full"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <img
                            src={user.avatar_url || "/De_Profile.jpeg"}
                            alt={`${user.username}'s avatar`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-lg font-medium text-gray-700">
                            {user.username}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="invited-users">
              <hr className="border-light my-5" />
              <h3 className="text-xl my-5">ผู้ใช้ที่เชิญ</h3>
              <ul>
                {invitedUsers.map((userId) => (
                  <li key={userId} className="">
                    <div className="flex items-center gap-3 justify-between">
                      {/* Avatar image or default image */}
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            usernames[userId]?.avatar_url || "/De_Profile.jpeg"
                          }
                          alt={`${usernames[userId]?.username}'s avatar`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-lg font-medium text-text">
                          {usernames[userId]}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveUser(userId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ลบ
                      </button>
                    </div>

                    <hr className="border-light my-5" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-pain text-white rounded-md mt-4"
          >
            สร้างบอร์ด
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBoard;
