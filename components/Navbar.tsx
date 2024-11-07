import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "./AuthButton";

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
      <nav className="BoxShadow w-full bg-bg text-text drop-shadow-xl items-center flex justify-between px-5 fixed left-0 top-0 z-50">
        <div className="Nav-one h-[100%] flex">
          <Link href="/">
            <Image src="/A-dental-white.png" width={150} height={100} alt="Logo" />
          </Link>
        </div>
        <div className="flex gap-5 items-center p-3 text-sm">
          <Link href="/Appointment">
            <button className="py-2 px-4 rounded-md bg-pain hover:bg-[#5e1778] text-bg mr-5 duration-300 max-lg:text-sm">
              Board
            </button>
          </Link>
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>
    </div>
  );
}


