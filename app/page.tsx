import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import Header from "@/components/hero";
import UserProfile from "./(User)/User_Profile/page";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-20">
        {isSupabaseConnected ? (
          user ? (
            <UserProfile />
          ) : (
            <Header />
          )
        ) : (
          <ConnectSupabaseSteps />
        )}
      </div>
    </div>
  );
}
