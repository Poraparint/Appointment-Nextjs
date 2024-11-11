"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";
import AutoResizingTextarea from "@/components/AutoResizingTextArea";
import Swal from "sweetalert2";
import ProfileButton from "@/components/ProfileButtonProps";

// Correct the type definition for PageProps
type PageProps = {
  params: Promise<{ id: string }>;
};

export default function WorkDetail({ params }: PageProps) {
  const [work, setWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const fetchWorkDetails = async (id: string) => {
    const { data, error } = await supabase
      .from("article")
      .select("*, users (username, avatar_url, id)")
      .eq("id", id)
      .single();

    if (data) {
      if (typeof data.extra_img === "string") {
        try {
          data.extra_img = JSON.parse(data.extra_img);
        } catch (error) {
          console.error("Error parsing extra_img JSON", error);
          data.extra_img = []; // กำหนดให้เป็นอาร์เรย์ว่างหากเกิดข้อผิดพลาด
        }
      }

      // กรองข้อมูล extra_img ให้อยู่ในรูปแบบของ URL ที่ถูกต้อง
      const validImages = Array.isArray(data.extra_img)
        ? data.extra_img.filter(
            (img: string) => typeof img === "string" && img.trim() !== ""
          )
        : [];

      setWork({
        ...data,
        extra_img: validImages, // ใช้เฉพาะภาพที่มีอยู่จริง
      });
    } else {
      console.error("Error fetching work details:", error);
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id); // ดึง UID ของผู้ใช้ปัจจุบัน
    }
  };

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params; // Ensure params is resolved
      if (resolvedParams?.id) {
        fetchWorkDetails(resolvedParams.id);
        fetchUser();
      }
    };
    fetchParams();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const nextImage = () => {
    if (work.extra_img && currentImageIndex < work.extra_img.length - 3) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const openModal = (img: string) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  // ตรวจสอบว่าเป็นเจ้าของงานหรือไม่
  const isOwner = work?.users?.id === userId;

  const handleDelete = async () => {
    const { error } = await supabase.from("article").delete().eq("id", work.id);

    if (!error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: "ลบงานสำเร็จ",
      }).then(() => {
        router.push("/User/User_Profile");
      });
    } else {
      console.error("Error deleting work:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบได้ โปรดลองอีกครั้ง",
      });
    }
  };

  const confirmDelete = () => {
    handleDelete();
    setShowDeleteModal(false);
  };

  return (
    <div className="w-full">
      {work && (
        <div className="flex justify-center">
          <div className="w-full flex flex-row-reverse px-5 gap-4 max-lg:flex-col max-sm:px-3">
            <div className="flex flex-col gap-5 w-4/12 max-lg:w-full">
              <div className="w-full bg-bg rounded-md shadow-md p-5 flex flex-col gap-7 tracking-wider min-[1024px]:sticky top-20">
                <div className="w-full flex flex-col gap-4 bg-transparent ">
                  <div className="relative w-full h-[27rem] rounded-md max-lg:h-80">
                    <Image
                      src={work.main_img}
                      alt={work.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>

                  {/* Additional Images */}
                  {Array.isArray(work.extra_img) &&
                    work.extra_img.length > 0 && (
                      <div>
                        <div className="relative flex w-full gap-2 transition-transform duration-500 ease-in-out">
                          {work.extra_img
                            .slice(currentImageIndex, currentImageIndex + 3) // แสดง 3 ภาพในแต่ละรอบ
                            .map((img: string, index: number) => (
                              <div
                                key={index}
                                className="relative w-full h-44 max-lg:h-32 cursor-pointer"
                                onClick={() => openModal(img)}
                              >
                                <Image
                                  src={img}
                                  alt={`Additional Image ${index + 1}`}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-md"
                                />
                              </div>
                            ))}
                          {/* Navigation Buttons */}

                          <button
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-full bg-gray-800 bg-opacity-50 text-white p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity duration-300"
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                          >
                            &lt;
                          </button>

                          <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-full bg-gray-800 bg-opacity-50 text-white p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity duration-300"
                            onClick={nextImage}
                            disabled={
                              currentImageIndex >= work.extra_img.length - 3
                            }
                          >
                            &gt;
                          </button>
                        </div>
                      </div>
                    )}

                  {/* Modal for displaying the selected image */}
                  {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                      <div className="relative w-3/6 rounded-lg bg-bg max-lg:w-5/6 h-[40rem] mt-9">
                        <button
                          className="absolute text-bg text-4xl z-[1] top-2 right-6 hover:text-primary duration-300"
                          onClick={closeModal}
                        >
                          &times;
                        </button>
                        <div className="relative w-full h-full z-[0]">
                          <Image
                            src={selectedImage}
                            alt="Profile"
                            className="rounded-md"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-8/12 max-lg:w-full flex flex-col gap-5 tracking-wider text-text px-5 py-10 bg-bg rounded-md shadow-md">
              <h1 className="text-text text-4xl font-semibold max-sm:text-2xl">
                {work.title}
              </h1>
              <hr className="border-light my-3" />

              <AutoResizingTextarea detail={work.detail} />
              <hr className="border-light my-3" />
              <h1 className="text-text text-2xl font-semibold ">
                {work.title1}
              </h1>

              <AutoResizingTextarea detail={work.detail1} />
              <hr className="border-light my-3" />
              <h1 className="text-primary text-2xl font-semibold ">
                {work.title2}
              </h1>

              <AutoResizingTextarea detail={work.detail2} />
              <hr className="border-light my-3" />
              <h1 className="text-primary text-2xl font-semibold ">
                {work.title3}
              </h1>

              <AutoResizingTextarea detail={work.detail3} />

              <ProfileButton
                username={work.users.username}
                avatarUrl={work.users.avatar_url}
                userDetails={work.users.userdetails}
              />
              {/* แสดงปุ่มลบถ้าผู้ใช้ปัจจุบันเป็นเจ้าของงาน */}
              {isOwner && (
                <div className="flex justify-end">
                  <button
                    className="btn bg-danger text-white w-2/4 hover:bg-red-900 border-bg"
                    onClick={() => setShowDeleteModal(true)} // เปิด modal เมื่อคลิก
                  >
                    ลบงานนี้
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal สำหรับยืนยันการลบ */}
      {showDeleteModal && (
        <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-box bg-white p-5 rounded shadow-lg text-secondary">
            <h2 className="text-xl font-semibold text-danger mb-4">
              ยืนยันการลบงานนี้
            </h2>
            <p className="my-4 ">
              คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?
              คุณจะไม่สามารถกู้คืนโพสต์งานนี้ได้!
            </p>
            <div className="flex justify-end">
              <button
                className="btn bg-danger mr-2 text-bg hover:bg-red-900"
                onClick={confirmDelete}
              >
                ยืนยัน
              </button>
              <button
                className="btn bg-bg"
                onClick={() => setShowDeleteModal(false)} // ปิด modal เมื่อคลิก
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
