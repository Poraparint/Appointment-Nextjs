"use server";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(formData: FormData) {
  try {
    const username = formData.get("username") as string | null;
    const avatar = formData.get("profile") as File | null;

    const supabase = createClient();

    // ดึงข้อมูลผู้ใช้จาก Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting user:", userError?.message);
      return { message: "User not authenticated", error: userError };
    }

    // จัดเตรียมข้อมูลที่จะอัปเดต
    const updates: { [key: string]: string | null } = {};
    if (username) updates.username = username;

    // อัปโหลดรูปโปรไฟล์ถ้ามีการเลือกไฟล์
    if (avatar) {
      const filePath = `${user.id}/avatar`;

      const { error: uploadError } = await supabase.storage
        .from("User_Profile")
        .upload(filePath, avatar, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError.message);
        return { message: "Cannot upload avatar", error: uploadError };
      }

      // รับ URL ของรูปภาพที่อัปโหลด
      const { data: publicUrlData } = supabase.storage
        .from("User_Profile")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;
      updates.avatar_url = avatarUrl;
    }

    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล Supabase
    if (Object.keys(updates).length > 0) {
      const { data: updateData, error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select();

      if (updateError) {
        console.error("Error updating profile:", updateError.message);
        return { message: "Cannot update profile", error: updateError };
      }

      console.log("Profile updated successfully", updateData);
      return { message: "Profile updated successfully", data: updateData };
    } else {
      return { message: "Nothing to update" };
    }
  } catch (error) {
    console.log("Server error:", error);
    return { message: "Server error", error };
  }
}
