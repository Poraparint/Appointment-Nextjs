import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "./AuthButton";
import SearchUsername from "./SearchUsername";

export default function Navbar() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div>
      <nav className="w-full bg-bg text-text drop-shadow-xl items-center flex justify-between px-5 fixed left-0 top-0 z-50">
        <div className="">
          <Link href="/">
            <div className="relative w-40 h-12 max-sm:w-20 max-sm:h-7">
              <Image
                src="/A-Write.png" // URL ของรูปภาพงาน
                alt="Profile"
                layout="fill" // ใช้ layout fill เพื่อให้รูปภาพเต็มพื้นที่
                objectFit="cover" // ให้รูปภาพเต็มขนาดและครอบคลุม
              />
            </div>
          </Link>
        </div>
        <div className="relative">
          <SearchUsername />
        </div>

        <div className="flex gap-8 items-center p-3 text-base">
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>
    </div>
  );
}
