"use server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

// ฟังก์ชันช่วยสำหรับการจัดการข้อผิดพลาด
const handleError = (error: any, message: string) => {
  console.error(message, error);
  return null;
};

// ฟังก์ชัน addWork: สำหรับเพิ่มงานใหม่ในฐานข้อมูล
export const addWork = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const detail = formData.get("detail") as string;
  const title1 = formData.get("title1") as string;
  const detail1 = formData.get("detail1") as string;
  const title2 = formData.get("title2") as string;
  const detail2 = formData.get("detail2") as string;
  const title3 = formData.get("title2") as string;
  const detail3 = formData.get("detail2") as string;
  const supabase = createClient();

  // รับข้อมูลผู้ใช้
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return handleError(userError, "Error getting user");
  }

  const postFolder = uuidv4();
  const userFolder = user.id;
  const fileUrls: string[] = [];

  // Handle main image upload separately
  const mainImgFile = formData.get("main_img") as File;
  let mainImgUrl = "";

  const uploadPromises = [];

  if (mainImgFile) {
    const mainImgFileName = `${uuidv4()}${mainImgFile.name.substring(
      mainImgFile.name.lastIndexOf(".")
    )}`;
    const mainImgFilePath = `${userFolder}/${postFolder}/${mainImgFileName}`;

    uploadPromises.push(
      supabase.storage
        .from("main_img")
        .upload(mainImgFilePath, mainImgFile)
        .then(() => {
          const { data: publicUrlData } = supabase.storage
            .from("main_img")
            .getPublicUrl(mainImgFilePath);
          mainImgUrl = publicUrlData.publicUrl;
        })
    );
  }

  // Handle example files
  const fileKeys = Array.from(formData.keys()).filter((key) =>
    key.startsWith("extra_img")
  );

  fileKeys.forEach((key) => {
    const file = formData.get(key) as File;
    const uniqueFileName = `${uuidv4()}${file.name.substring(
      file.name.lastIndexOf(".")
    )}`;
    const filePath = `${userFolder}/${postFolder}/${uniqueFileName}`;

    uploadPromises.push(
      supabase.storage
        .from("extra_img")
        .upload(filePath, file)
        .then(() => {
          const { data: publicUrlData } = supabase.storage
            .from("extra_img")
            .getPublicUrl(filePath);
          fileUrls.push(publicUrlData.publicUrl);
        })
    );
  });

  try {
    await Promise.all(uploadPromises);
  } catch (uploadError) {
    return handleError(uploadError, "Upload error");
  }

  // Insert work into database
  const { data, error } = await supabase
    .from("boards")
    .insert([
      {
        title,
        detail,
        extra_img: fileUrls,
        main_img: mainImgUrl,
        title1,
        detail1,
        title2,
        detail2,
        title3,
        detail3,
        user_id: user.id,
      },
    ])
    .select("id")
    .single();

  if (error) {
    return handleError(error, "Error inserting work");
  }

  return data.id;
};
