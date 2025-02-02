"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { SubmitButton } from "@/components/submit-button";

// Helper function to get redirect URL
const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";
  return url.startsWith("http") ? url : `https://${url}`;
};

const SignInForm = () => {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    const isLocalEnv = process.env.NODE_ENV === "development";
    const redirectTo = isLocalEnv
      ? "http://localhost:3000/auth/callback"
      : "https://appointment-dental.vercel.app/auth/callback";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      console.log("Error during sign-in with Google:", error);
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="Page w-full">
      <div className="flex justify-center w-3/6 max-lg:w-5/6 bg-white rounded-3xl py-16 px-10 shadow-lg mx-auto">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-3xl font-bold text-text mb-6 text-center">
            เข้าสู่ระบบ
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
            <label>
              <span>อีเมล</span>
              <input
                type="email"
                className="w-full py-2 px-4 border rounded-md"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              <span>รหัสผ่าน</span>
              <input
                type="password"
                className="w-full py-2 px-4 border rounded-md"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>

            <SubmitButton
              onClick={handleSubmit}
              pendingText="Signing In..."
              className="w-full"
            >
              เข้าสู่ระบบ
            </SubmitButton>
          </form>

          <Link
            href="/sign-up"
            className="text-sm text-text font-bold hover:underline mt-4"
          >
            สมัครสมาชิก
          </Link>

          <div className="py-2 text-third">หรือ</div>

          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-3 px-6 py-3 border rounded-full shadow-sm hover:bg-gray-200 transition"
          >
            <div className="relative w-7 h-7 rounded-full">
              <Image
                className="rounded-full"
                src="/google.png"
                alt="Avatar"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <span className="font-semibold text-sm">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
