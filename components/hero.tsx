import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import SearchUsername from "./SearchUsername";

export default function Header() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%] border bg-bg border-light shadow-2xl p-7 rounded-xl tracking-wider">
        <SearchUsername />
      </div>
    </div>
  );
}
