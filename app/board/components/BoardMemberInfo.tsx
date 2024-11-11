import React from "react";

interface Member {
  users: {
    username: string;
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
        <h3 className="font-semibold text-xl">ผู้สร้างบอร์ด: {creatorUsername}</h3>
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
                className="flex justify-between items-center text-gray-500"
              >
                <span>- {member.users.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <hr className="border-light my-2" />
    </div>
  );
};

export default BoardMemberInfo;
