import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import Image from "next/image";

// Components
import { Message, FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  const resetPassword = async (formData: FormData) => {
    "use server";
    const supabase = createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
      encodedRedirect(
        "error",
        "/protected/reset-password",
        "Password and confirm password are required"
      );
    }

    if (password !== confirmPassword) {
      encodedRedirect(
        "error",
        "/protected/reset-password",
        "Passwords do not match"
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      encodedRedirect(
        "error",
        "/protected/reset-password",
        "Password update failed"
      );
    }

    return redirect("/protected");
  };

  return (
    <div className="grow bg-white/10 backdrop-blur-sm rounded-3xl py-16 px-10 min-h-[38rem] relative">
      <h2 className="text-3xl font-bold text-white mb-10">Reset Password</h2>
      <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
        <label className="input rounded-3xl flex items-center px-6 gap-4 bg-white text-black text-md">
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            name="password"
            className="grow"
            placeholder="New Password"
          />
        </label>

        <label className="input rounded-3xl flex items-center px-6 gap-4 bg-white text-black text-md">
          <i className="fa-solid fa-key"></i>
          <input
            type="password"
            name="confirmPassword"
            className="grow"
            placeholder="Confirm Password"
          />
        </label>
        <FormMessage message={searchParams} />
        <div className="flex justify-end">
          <div className="w-40">
            <SubmitButton formAction={resetPassword}>
              Reset Password
            </SubmitButton>
          </div>
        </div>
      </form>
      <div className="absolute bottom-5 right-5">
        <Image src="/Mascot.svg" alt="Mascot" height={120} width={120} />
      </div>
    </div>
  );
}
