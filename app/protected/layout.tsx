import { createClient } from "@/utils/supabase/server";
import { log } from "console";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");

  }
  console.log(user);

  return <>{children}</>;
  
}
