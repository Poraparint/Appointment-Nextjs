import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";

// Components
import {
  Message,
  FormMessage,
} from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  const forgotPassword = async (formData: FormData) => {
    "use server";

    const email = formData.get("email")?.toString();
    const supabase = createClient();
    const origin = headers().get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
      return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
    });

    if (error) {
      console.error(error.message);
      return encodedRedirect(
        "error",
        "/forgot-password",
        "Could not reset password"
      );
    }

    if (callbackUrl) {
      return redirect(callbackUrl);
    }

    return encodedRedirect(
      "success",
      "/forgot-password",
      "Check your email for a link to reset your password."
    );
  };

  return (
    <>
      <Link
        href="/sign-in"
        className="absolute top-3 left-3 border z-[2] btn btn-ghost"
      >
        <i className="fa-solid fa-arrow-left"></i> Back
      </Link>
      <div className="grow bg-white/10 backdrop-blur-sm rounded-3xl py-16 px-10 min-h-[38rem] relative">
        <h2 className="text-3xl font-bold text-white mb-10">Forgot Password</h2>
        <form className="flex-1 flex flex-col w-full justify-center gap-6">
          {/* Email */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-white">Enter your email</span>
            </div>
            <label className="input rounded-3xl flex items-center px-6 gap-4 bg-white text-black text-md">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="text"
                name="email"
                className="grow"
                placeholder="Email"
                required
              />
            </label>
          </label>
          <FormMessage message={searchParams} />
          <div className="flex justify-end">
            <div className="w-40">
              <SubmitButton formAction={forgotPassword}>
                Reset Password
              </SubmitButton>
            </div>
          </div>
        </form>
        <div className="absolute bottom-5 right-5">
          <Image src="/Mascot.svg" alt="Mascot" height={120} width={120} />
        </div>
      </div>
    </>
  );
}
