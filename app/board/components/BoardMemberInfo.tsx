import React from "react";

interface Member {
  users: {
    username: string;
    avatar_url: string;
  };
  user_id: string;
}

interface BoardMemberInfoProps {
  creatorUsername: string;
  members: Member[];
  loading: boolean;
}

const BoardMemberInfo: React.FC<BoardMemberInfoProps> = ({
  creatorUsername,
  members,
  loading,
}) => {
  if (loading) {
    return <div>กำลังโหลดข้อมูลสมาชิก...</div>;
  }

  return (
    <div className="flex flex-col gap-4 text-text">
      {/* Board Creator Info */}
      <div className="creator-info">
        <h3 className="font-semibold text-xl">
          ผู้สร้างบอร์ด: {creatorUsername}
        </h3>
      </div>

      {/* Board Members List */}
      <div className="members-info flex flex-col gap-3">
        <p className="text-gray-500">สมาชิกในบอร์ด: {members.length || 0} คน</p>
        {members.length === 0 ? (
          <div>ไม่มีสมาชิกในบอร์ดนี้</div>
        ) : (
          <ul>
            {members.map((member) => (
              <li
                key={member.user_id}
                
              >
                <div
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 border-b border-light w-full cursor-pointer rounded-md"
                  
                >
                  <img
                    src={member.users.avatar_url || "/De_Profile.jpeg"} // Fallback image if avatar_url is not available
                    alt={member.users.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-lg font-medium text-text max-md:text-sm">
                    {member.users.username}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
    </div>
  );
};

export default BoardMemberInfo;
