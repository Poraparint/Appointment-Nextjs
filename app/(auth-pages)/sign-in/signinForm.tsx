"use client";
import { createClient } from "@/utils/supabase/client";
import { signIn } from "./action";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { SubmitButton } from "@/components/submit-button";

// Helper function to get redirect URL with better production handling
function getURL(): string {
  // For production, prioritize NEXT_PUBLIC_SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `${process.env.NEXT_PUBLIC_SITE_URL}/`;
  }

  // For Vercel deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/`;
  }

  // Fallback for development
  return "http://localhost:3000/";
}

interface SignInFormProps {
  searchParams: { message?: string };
}

const SignInForm: React.FC<SignInFormProps> = ({ searchParams }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Memoize redirect URL to avoid recalculation
  const redirectURL = useMemo(() => `${getURL()}User_Profile`, []);

  const signInWithGoogle = useCallback(async () => {
    if (isGoogleLoading) return; // Prevent double clicks

    setIsGoogleLoading(true);

    try {
      const supabase = createClient();

      // More robust OAuth configuration for production
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectURL,
          queryParams: {
            access_type: "offline",
            prompt: "select_account", // Changed from "consent" for better UX
          },
          // Add skipBrowserRedirect for better control in some cases
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error("Google sign-in error:", error.message);
        // You might want to show user-friendly error message here
      }

      // Note: successful OAuth will redirect, so this won't execute
    } catch (err) {
      console.error("Unexpected error during Google sign-in:", err);
    } finally {
      // Reset loading state (though this might not execute due to redirect)
      setIsGoogleLoading(false);
    }
  }, [redirectURL, isGoogleLoading]);

  return (
    <div className="Page w-full">
      <div className="flex justify-center w-5/6 grow bg-white backdrop-blur-sm rounded-3xl py-16 px-10 shadow-lg mx-auto">
        {/* Sign-In Form Container */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-3xl font-bold text-text mb-10 text-center">
            เข้าสู่ระบบ
          </h2>

          <form className="flex flex-col gap-6 text-text w-full">
            {/* Email */}
            <label className="block w-full">
              <span className="text-gray-700">อีเมล</span>
              <div className="mt-1 flex items-center text-text border border-light rounded-md overflow-hidden focus-within:border-pain focus-within:text-pain focus-within:shadow-sm focus-within:shadow-pain">
                <i className="fa-solid fa-envelope px-3" aria-hidden="true"></i>
                <input
                  type="email"
                  name="email"
                  className="w-full py-2 px-4 bg-transparent outline-none placeholder:text-light"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="block w-full">
              <span className="text-gray-700">รหัสผ่าน</span>
              <div className="mt-1 flex items-center text-text border border-light rounded-md overflow-hidden focus-within:border-pain focus-within:text-pain focus-within:shadow-sm focus-within:shadow-pain">
                <i className="fa-solid fa-lock px-3" aria-hidden="true"></i>
                <input
                  type="password"
                  name="password"
                  className="w-full py-2 px-4 bg-transparent outline-none placeholder:text-light"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            {/* Error Message (if any) */}
            {searchParams?.message && (
              <div
                className="text-red-500 text-xs px-2 pt-2"
                role="alert"
                aria-live="polite"
              >
                {searchParams.message}
              </div>
            )}

            {/* Forgot Password & Submit Button */}
            <div className="flex flex-col gap-5">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                ลืมรหัสผ่าน?
              </Link>
              <SubmitButton
                formAction={signIn}
                pendingText="กำลังเข้าสู่ระบบ..."
                className="w-full mt-4"
              >
                เข้าสู่ระบบ
              </SubmitButton>
            </div>
          </form>

          {/* Create Account */}
          <div className="mt-4">
            <Link
              href="/sign-up"
              className="text-sm text-text font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              สมัครสมาชิก{" "}
              <i
                className="fa-solid fa-arrow-right ml-1"
                aria-hidden="true"
              ></i>
            </Link>
          </div>

          {/* Divider */}
          <div className="flex flex-col py-6 items-center">
            <span className="mx-4 text-light">หรือ</span>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center">
            <button
              onClick={signInWithGoogle}
              disabled={isGoogleLoading}
              className={`
                flex items-center text-text gap-3 px-6 py-3 bg-white border rounded-full shadow-sm 
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  isGoogleLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-gray-100 hover:shadow-md active:scale-95"
                }
              `}
              type="button"
              aria-label="Sign in with Google"
            >
              <div className="relative w-7 h-7 rounded-full">
                <Image
                  className="rounded-full"
                  src="/google.png"
                  alt="Google logo"
                  fill
                  sizes="28px"
                  style={{ objectFit: "cover" }}
                  priority={false} // Not critical for initial load
                />
              </div>
              <span className="font-semibold text-sm">
                {isGoogleLoading ? "กำลังโหลด..." : "Sign in with Google"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SignInForm);
