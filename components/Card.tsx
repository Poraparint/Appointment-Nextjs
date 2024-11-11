"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Note {
  id: string; // Assuming it's a string
  title: string;
  main_img: string;
  users: {
    username: string;
  };
}

export default function Card() {
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12); // จำนวนงานที่จะแสดงในแต่ละหน้า

  const fetch = async () => {
    const supabase = createClient();
    let { data: Freework } = await supabase
      .from("article")
      .select("*, users (username)")
      .order("created_at", { ascending: false });

    setData(Freework);
  };

  useEffect(() => {
    fetch();
  }, []);

  // การคำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // การจัดการการเปลี่ยนหน้า
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // การเลือกข้อมูลที่จะแสดงตามหน้า
  const currentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  // การแสดงปุ่ม Pagination
  const renderPagination = () => {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5; // จำนวนปุ่มที่จะแสดงในแต่ละครั้ง

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // แสดงหน้าแรก
        i === totalPages || // แสดงหน้าสุดท้าย
        (i >= currentPage - 1 && i <= currentPage + 1) // แสดงหน้าใกล้เคียงกับหน้าปัจจุบัน
      ) {
        pageNumbers.push(i);
      }
    }

    return (
      <div className="flex justify-center my-6">
        {currentPage > 1 && (
          <button
            className="mx-1 px-4 py-2 border rounded text-primary"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ก่อนหน้า
          </button>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`mx-1 px-4 py-2 border rounded ${
              currentPage === number
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            className="mx-1 px-4 py-2 border rounded text-primary"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ถัดไป
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-4 grid-rows-1 gap-6 max-lg:grid-cols-1">
        {currentData() && currentData().length > 0 ? (
          currentData()
            .map((note: Note, index: number) => (
              <Link key={note.id} href={`/ArticleID/${note.id}`}>
                <div className="card bg-bg shadow-md w-full h-full hover:shadow-xl duration-150">
                  <figure>
                    <div className="relative w-full h-52">
                      <Image
                        src={note.main_img}
                        alt="Profile"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <h1 className="card-title text-text text-base">
                      {note.title}
                    </h1>
                    
                    <div className="card-actions mt-5 flex justify-between">
                      <div className="text-pain text-xs flex gap-2 items-center w-40">
                        <p>{note.users.username}</p>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </Link>
            ))
        ) : (
          <div className="text-center p-3 text-lg w-full">
            ไม่มีการเพิ่มงานเข้ามา
          </div>
        )}
      </div>
      {/* เรียกใช้ฟังก์ชันเพื่อแสดงปุ่ม Pagination */}
      {renderPagination()}
    </div>
  );
}
