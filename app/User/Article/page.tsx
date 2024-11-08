"use client";
import { addWork } from "./Article"; // นำเข้า function สำหรับการเพิ่มงาน
import Swal from "sweetalert2"; // นำเข้า SweetAlert2 สำหรับการแจ้งเตือน
import { useRouter } from "next/navigation"; // นำเข้า router ของ Next.js สำหรับการนำทาง
import { useState, useRef } from "react"; // นำเข้า React hooks สำหรับจัดการ state และ ref

// ฟังก์ชันคอมโพเนนต์ FreeAddwork: สำหรับจัดการฟอร์มการเพิ่มงานหรือโพสต์งาน
function FreeAddwork() {
  const router = useRouter();
  const [mainImg, setMainImg] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const mainImgInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMainImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMainImg(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDelete = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (mainImg) {
      formData.append("main_img", mainImg);
    }

    files.forEach((file, index) => {
      formData.append(`extra_img${index}`, file); // ทำการเพิ่มไฟล์
    });

    // อาจจะมีการส่งค่าเป็น array ไปยังฐานข้อมูลในฟังก์ชัน addWork
    const newId = await addWork(formData); // ตรวจสอบว่า addWork จัดการไฟล์ได้อย่างถูกต้อง

    if (newId) {
      Swal.fire({
        icon: "success",
        title: "เพิ่มงานสำเร็จ",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      }).then(() => {
        router.push("/User/User_Profile");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเพิ่มงานได้ โปรดลองอีกครั้ง",
      });
    }
  };

  const handleClickMainImg = () => {
    mainImgInputRef.current?.click();
  };

  const handleClickEx = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-center w-full">
      <form className="w-full border p-8" onSubmit={handleSubmit}>
        <div className="flex flex-row gap-4 max-lg:flex-col">
          <div className="w-4/6 max-lg:w-full">
            <div className="bg-bg flex flex-col gap-7 tracking-wider p-5">
              <h1 className="ml-5 text-text text-xl">หัวข้อเรื่อง</h1>
              <input
                name="title"
                type="text"
                placeholder="หัวข้อเรื่อง"
                className="w-full text-text bg-ice border border-light rounded-md p-2 text-lg outline-none"
                required
              />
              <hr className="border-light" />
              <h1 className="ml-5 text-text text-xl">รายละเอียด</h1>
              <textarea
                name="detail"
                placeholder="รายละเอียด"
                className="h-[10rem] w-full outline-none border border-light rounded-md p-3 text-lg text-text bg-ice"
                required
              ></textarea>
              <h1 className="ml-5 text-text text-xl">หัวข้อย่อยที่ 1</h1>
              <input
                name="title1"
                type="text"
                placeholder="หัวข้อย่อยที่ 1"
                className="w-full text-text bg-ice border border-light rounded-md p-2 text-lg outline-none"
                required
              />
              <hr className="border-light" />
              <h1 className="ml-5 text-text text-xl">รายละเอียดย่อยที่ 1</h1>
              <textarea
                name="detail1"
                placeholder="รายละเอียดย่อยที่ 1"
                className="h-[10rem] w-full outline-none border border-light rounded-md p-3 text-lg text-text bg-ice"
                required
              ></textarea>
              <h1 className="ml-5 text-text text-xl">หัวข้อย่อยที่ 2</h1>
              <input
                name="title2"
                type="text"
                placeholder="หัวข้อย่อยที่ 2"
                className="w-full text-text bg-ice border border-light rounded-md p-2 text-lg outline-none"
                required
              />
              <hr className="border-light" />
              <h1 className="ml-5 text-text text-xl">รายละเอียดย่อยที่ 2</h1>
              <textarea
                name="detail2"
                placeholder="รายละเอียดย่อยที่ 2"
                className="h-[10rem] w-full outline-none border border-light rounded-md p-3 text-lg text-text bg-ice"
                required
              ></textarea>
            </div>
          </div>
          <div className="w-2/6 max-lg:w-full">
            <div className="flex flex-col gap-7 p-5 tracking-wider min-[1024px]:sticky top-28 bg-bg rounded-md">
              <div className="flex justify-between gap-9 max-lg:flex-wrap ">
                <div className="w-full flex flex-col gap-5">
                  <h1 className="ml-5 text-text text-xl">รูปภาพหลัก</h1>
                  <div
                    className="cursor-pointer border text-third border-light h-[15rem] rounded-md p-2 text-lg flex items-center justify-center"
                    onClick={handleClickMainImg}
                  >
                    <input
                      type="file"
                      name="main_img"
                      className="hidden"
                      onChange={handleMainImgChange}
                      ref={mainImgInputRef}
                    />
                    <div className="text-center ">
                      {mainImg ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(mainImg)}
                            alt={mainImg.name}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => setMainImg(null)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            x
                          </button>
                        </div>
                      ) : (
                        <i className="fa-solid fa-camera text-9xl"></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-9 max-lg:flex-wrap">
                <div className="w-full flex flex-col gap-5">
                  <h1 className="ml-5 text-text text-xl">
                    รูปภาพเพิ่มเติม (สูงสุดไม่ควรเกิน 5 รูป)
                  </h1>
                  <div
                    className="cursor-pointer border text-third border-light h-[17rem] rounded-md p-2 text-lg flex items-center justify-center"
                    onClick={handleClickEx}
                  >
                    <input
                      type="file"
                      name="extra_img"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      ref={fileInputRef}
                    />
                    <div className="text-center">
                      {files.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {files.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-24 h-24 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={(e) => handleDelete(index, e)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                x
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <i className="fa-solid fa-camera text-9xl"></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mb-14">
                <button
                  type="submit"
                  className="bg-pain px-7 py-4 rounded-lg text-white border-white font-normal text-2xl hover:bg-purple-900 duration-100"
                >
                  ลงบทความ
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FreeAddwork;
