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
    <div className="fixed left-0 top-4 z-50 w-full flex items-center justify-center ">
      <nav className="w-10/12 bg-bg text-text drop-shadow-xl items-center flex justify-between px-5 p-1 rounded-2xl ">
        <div className="">
          <Link href="/">
            <i className="fa-solid fa-house text-pain text-3xl"></i>
          </Link>
        </div>

        <div className="flex gap-8 items-center p-3 text-base">
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>
    </div>
  );
}
