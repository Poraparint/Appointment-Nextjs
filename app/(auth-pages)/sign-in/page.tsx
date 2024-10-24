"use client";
import { createClient } from "@/utils/supabase/client";
import { signIn } from "./action";
import Image from "next/image";
import Link from "next/link";
import Authimg from "@/components/Authimg";

// Components
import { SubmitButton } from "@/components/submit-button";

function SignInPage({ searchParams }: { searchParams: { message: string } }) {
  const signInWithGoogle = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error(error);
    }
  };

  return (
    <div className="Page w-full">
      <div className="flex justify-center w-5/6 grow bg-white backdrop-blur-sm rounded-3xl py-16 px-10 shadow-lg mx-auto">
        {/* Back to Sign-Up Link */}

        <Authimg />
        {/* Sign-In Form Container */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-3xl font-bold text-secondary mb-10 text-center">
            เข้าสู่ระบบ
          </h2>

          <form className="flex flex-col gap-6 text-third w-full">
            {/* Email */}
            <label className="block w-full">
              <span className="text-gray-700">อีเมล</span>
              <div className="mt-1 flex items-center text-third border border-light rounded-md overflow-hidden focus-within:border-primary focus-within:text-primary focus-within:shadow-sm focus-within:shadow-primary">
                <i className="fa-solid fa-envelope px-3"></i>
                <input
                  type="email"
                  name="email"
                  className="w-full py-2 px-4 outline-none placeholder:text-light"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="block w-full">
              <span className="text-gray-700">รหัสผ่าน</span>
              <div className="mt-1 flex items-center text-third border border-light rounded-md overflow-hidden focus-within:border-primary focus-within:text-primary focus-within:shadow-sm focus-within:shadow-primary">
                <i className="fa-solid fa-lock px-3 "></i>
                <input
                  type="password"
                  name="password"
                  className="w-full py-2 px-4 outline-none placeholder:text-light"
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
                className="w-full mt-4"
              >
                เข้าสู่ระบบ
              </SubmitButton>
            </div>
          </form>

          {/* Create Account */}
          <div className="">
            <Link
              href="/sign-up"
              className="text-sm text-secondary font-bold hover:underline"
            >
              สมัครสมาชิก <i className="fa-solid fa-arrow-right ml-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
