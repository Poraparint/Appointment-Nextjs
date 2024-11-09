"use client";
import { createClient } from "@/utils/supabase/client";
import { signIn } from "./action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Components
import { SubmitButton } from "@/components/submit-button";

function getURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
}

function SignInPage({ searchParams }: { searchParams: { message: string } }) {
  const signInWithGoogle = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      
      console.log("Error during sign-in with Google:", error);
    } else {
      
      console.log("Sign-in successful, redirecting...", data);
    }
  
  };

  return (
    <div className="Page w-full">
      <div className="flex justify-center w-4/6 grow bg-white backdrop-blur-sm rounded-3xl py-16 px-10 shadow-lg mx-auto">
        {/* Back to Sign-Up Link */}

        {/* Sign-In Form Container */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-3xl font-bold text-text mb-10 text-center">
            เข้าสู่ระบบ
          </h2>

          <form className="flex flex-col gap-6 text-text w-full">
            {/* Email */}
            <label className="block w-full">
              <span>อีเมล</span>
              <div className="mt-1 flex items-center border border-text rounded-md overflow-hidden focus-within:border-primary focus-within:text-pain focus-within:shadow-sm focus-within:shadow-text">
                <i className="fa-solid fa-envelope px-3"></i>
                <input
                  type="email"
                  name="email"
                  className="w-full py-2 px-4 outline-none placeholder:text-light bg-bg border-l border-text"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="block w-full">
              <span className="text-gray-700">รหัสผ่าน</span>
              <div className="mt-1 flex items-center border border-text rounded-md overflow-hidden focus-within:border-primary focus-within:text-pain focus-within:shadow-sm focus-within:shadow-text">
                <i className="fa-solid fa-lock px-3 "></i>
                <input
                  type="password"
                  name="password"
                  className="w-full py-2 px-4 outline-none placeholder:text-light bg-bg border-l border-text"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </label>

            {/* Error Message (if any) */}
            {searchParams?.message && (
              <p className="text-red-500 text-xs px-2 pt-2">
                {searchParams.message}
              </p>
            )}

            {/* Forgot Password & Submit Button */}
            <div className="flex flex-col gap-5">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                ลืมรหัสผ่าน?
              </Link>
              <SubmitButton
                formAction={signIn}
                pendingText="Signing In..."
                className="w-full mt-4 "
              >
                เข้าสู่ระบบ
              </SubmitButton>
            </div>
          </form>

          {/* Create Account */}
          <div className="">
            <Link
              href="/sign-up"
              className="text-sm text-text font-bold hover:underline"
            >
              สมัครสมาชิก <i className="fa-solid fa-arrow-right ml-1"></i>
            </Link>
          </div>

          {/* Divider */}
          <div className="flex flex-col py-2 items-center">
            <span className="mx-4 text-third">หรือ</span>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center">
            <button
              onClick={signInWithGoogle}
              className="flex items-center text-text gap-3 px-6 py-3 bg-white border rounded-full shadow-sm hover:bg-gray-200 transition"
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
    </div>
  );
}

export default SignInPage;
