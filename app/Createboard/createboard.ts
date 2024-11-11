"use server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

// ฟังก์ชันช่วยสำหรับการจัดการข้อผิดพลาด
const handleError = (error: any, message: string) => {
  console.error(message, error);
  return null;
};

// ฟังก์ชัน createBoard: สำหรับการสร้างบอร์ดใหม่ในฐานข้อมูล
export const createBoard = async (
  formData: FormData,
  invitedUsers: string[]
) => {
  const boardName = formData.get("board_name") as string;
  const description = formData.get("description") as string;
  const supabase = await createClient();

  // รับข้อมูลผู้ใช้ที่สร้างบอร์ด (ผู้สร้างบอร์ด)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return handleError(userError, "Error getting user");
  }

  const boardId = uuidv4(); // สร้าง ID สำหรับบอร์ด

  // สร้างบอร์ดในฐานข้อมูล
  const { data: boardData, error: boardError } = await supabase
    .from("boards")
    .insert([
      {
        board_name: boardName,
        description,
        creator_id: user.id, // กำหนดให้ผู้สร้างบอร์ดเป็นแอดมิน
      },
    ])
    .select("id")
    .single();

  if (boardError) {
    return handleError(boardError, "Error creating board");
  }

  // เชิญผู้ใช้เข้าบอร์ด
  const invites = invitedUsers.map((userId) => ({
    board_id: boardData.id,
    user_id: userId,
    role: "member", // ผู้ที่ได้รับเชิญจะเป็นสมาชิก (member)
  }));

  console.log("Invites Data:", invites);

  // บันทึกผู้ใช้ที่ถูกเชิญเข้าบอร์ด
  const { data: inviteData, error: inviteError } = await supabase
    .from("board_members")
    .insert(invites);

  if (inviteError) {
    console.error("Error adding invited users:", inviteError);
    return handleError(inviteError, "Error adding invited users");
  }

 console.log("Invite Data:", inviteData);

  return boardData.id; // คืนค่าบอร์ด ID เพื่อใช้งานต่อ
};
