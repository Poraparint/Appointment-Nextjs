"use client"
import React from 'react'
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';



export default function ShowWork({ work }: { work: any }) {

    
  return (
    <Link key={work.id} href={`/ArticleID/${work.id}`}>
      <div className="card shadow-md w-full h-full hover:shadow-xl duration-150 bg-bg">
        <figure>
          {/* รูปภาพหลักของงาน */}
          <div className="relative w-full h-52">
            <Image
              src={work.main_img} // URL ของรูปภาพงาน
              alt="Profile"
              layout="fill" // ใช้ layout fill เพื่อให้รูปภาพเต็มพื้นที่
              objectFit="cover" // ให้รูปภาพเต็มขนาดและครอบคลุม
            />
          </div>
        </figure>
        <div className="card-body p-4">
          {/* ชื่อของงาน */}
          <h1 className="card-title text-text text-lg">{work.title}</h1>
          {/* หมวดหมู่ของงาน */}
          <p className="text-third text-sm">
            {work.detail.length > 200
              ? `${work.detail.substring(0, 200)}...`
              : work.detail}
          </p>
        </div>
      </div>
    </Link>
  );
}
