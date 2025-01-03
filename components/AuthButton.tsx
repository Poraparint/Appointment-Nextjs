import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/legacy/image";

export default async function AuthButton() {
  const supabase = await createClient();

  // Fetch the user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Function to handle the sign-out
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
  };

  // If there's no user, display login/signup buttons
  if (!user) {
    return (
      <div className="flex gap-3 text-pain ">
        <Link
          href="/sign-in"
          className="py-2 px-5 flex items-center max-sm:text-[0.6rem] max-sm:px-2 rounded-md border border-pain hover:bg-pain hover:text-bg duration-300"
        >
          Login
        </Link>
        <Link
          href="/sign-up"
          className="py-2 px-5 flex items-center max-sm:text-[0.6rem] max-sm:px-2 rounded-md border border-pain hover:bg-pain hover:text-bg duration-300"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // Fetch the user's profile data (assuming there's a 'users' table with profile pictures)
  const { data: profileData, error } = await supabase
    .from("users")
    .select("avatar_url, username")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  const profileImageUrl = profileData?.avatar_url || "/De_Profile.jpeg"; // Default image if none exists

  return (
    <div className="flex items-center gap-6">
      <Link href="/Createboard">
        <div className="py-2 px-5 rounded-md bg-pain hover:bg-[#5e1778] text-bg duration-300 max-sm:text-xs">
          สร้างบอร์ด
        </div>
      </Link>
      <details className="dropdown dropdown-bottom dropdown-end">
        <summary className="relative rounded-full w-12 h-12 max-sm:w-8 max-sm:h-8 cursor-pointer self-center flex">
          <Image
            src={profileImageUrl}
            alt="Profile"
            className="rounded-full duration-300"
            layout="fill"
            objectFit="cover"
          />
        </summary>
        <ul className="menu dropdown-content shadow-md bg-bg w-72 mt-3 text-secondary rounded-lg rounded-tr-none p-0">
          <li className="hover:bg-gray-100 duration-200 rounded-t-lg ">
            <Link
              href="/User/User_Profile"
              className="flex gap-5 text-pain py-4"
            >
              <div className="relative w-7 h-7 rounded-full">
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  className=" rounded-full"
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              <h1>{profileData.username}</h1>
            </Link>
          </li>
          <hr className="border-[0.5px] border-light rounded-full" />
          
          <li className="text-text">
            <form
              action={signOut}
              className="flex gap-5 hover:bg-gray-100 duration-200 py-4 rounded-b-lg "
            >
              <i className="fa-solid fa-right-from-bracket text-xl"></i>
              <button type="submit" className="w-full text-left">
                ออกจากระบบ
              </button>
            </form>
          </li>
        </ul>
      </details>
    </div>
  );
}
