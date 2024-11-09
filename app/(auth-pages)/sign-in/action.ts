"use server"

import { createClient } from "@/utils/supabase/server";
import { isAuthApiError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error(error);

    if (isAuthApiError(error)) {
      return redirect(`/sign-in?message=${encodeURIComponent(error.message)}&type=warning`);
    }

    switch (error.code) {
      case "email_not_confirmed":
        return redirect(
          `/sign-in?message=${encodeURIComponent("This email address has not been verified. Please Check your email")}&type=warning`
        );
      case "user_banned":
        return redirect(
          `/sign-in?message=${encodeURIComponent("This user has been banned. Please contact support if you think this is an error.")}&type=warning`
        );
      case "user_not_found":
        return redirect(
          `/sign-in?message=${encodeURIComponent("The user was not found. Please sign up for an account first.")}&type=warning`
        );
      default:
        return redirect(
          `/sign-in?message=${encodeURIComponent("An unknown error occurred. Please try again.")}&type=danger`
        );
    }
    
  }

  return redirect("/protected");
};
