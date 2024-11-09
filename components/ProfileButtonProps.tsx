// components/ProfileButton.tsx

import Link from "next/link";
import Image from "next/image";

interface ProfileButtonProps {
  username: string;
  avatarUrl: string;
  userDetails: string;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  username,
  avatarUrl,
  userDetails,
}) => {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5 my-5">
          <div className="relative w-14 h-14 max-sm:w-8 max-sm:h-8 rounded-full">
            <Image
              src={avatarUrl || "/De_Profile.jpeg"}
              alt={username}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <h1 className="text-lg font-semibold text-text max-sm:text-sm">{username}</h1>
        </div>
        <Link href={`/UserView/${username}`}>
          <button className="btn bg-white text-text border-text hover:bg-gray-50 ">
            <p className="max-sm:hidden">ดูโปรไฟล์</p> <i className="fa-solid fa-up-right-from-square ml-3"></i>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileButton;
