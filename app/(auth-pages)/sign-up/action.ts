"use server";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
interface FormState {
  success: boolean;
  message: null | string;
}

export const register = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: username,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
      return {
        success: false,
        message: "Could not register user",
      };
    }
    return {
      success: true,
      message: null,
    };
  } catch (error) {
    console.log("server error", error);
    return {
      success: false,
      message: "Server error",
    };
  }
};
