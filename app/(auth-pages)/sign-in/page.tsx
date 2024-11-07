"use client";
import { createClient } from "@/utils/supabase/client";
import { signIn } from "./action";
import Image from "next/image";
import Link from "next/link";
import Authimg from "@/components/Authimg";

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

    console.log("OAuth sign-in response data:", data);
    if (error) {
      console.error("Error during sign-in with Google:", error);
    } else {
      console.log("Sign-in successful, redirecting...");
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

          {/* Divider */}
          <div className="flex flex-col py-2 items-center">
            <span className="mx-4 text-third">หรือ</span>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center">
            <button
              onClick={signInWithGoogle}
              className="flex items-center text-secondary gap-3 px-6 py-3 bg-white border rounded-full shadow-sm hover:bg-gray-100 transition"
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
