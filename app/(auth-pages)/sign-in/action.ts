"use server";

import { createClient } from "@/utils/supabase/server"; // Make sure this is the correct import for server-side Supabase client
import { isAuthApiError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Initialize the Supabase client for server-side use
  const supabase = await createClient();

  // Perform the sign-in operation with email and password
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // If there's an error, handle it based on the error type
  if (error) {
    console.error("Error signing in:", error);

    // Check if the error is from the Supabase API
    if (isAuthApiError(error)) {
      return redirect(
        `/sign-in?message=${encodeURIComponent(error.message)}&type=warning`
      );
    }

    // Switch-case for more specific errors
    switch (error.code) {
      case "email_not_confirmed":
        return redirect(
          `/sign-in?message=${encodeURIComponent("This email address has not been verified. Please check your email.")}&type=warning`
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

  // If no error, redirect to the protected page
  return redirect("/protected");
};
