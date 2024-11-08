import UserView from "@/components/UserView";


interface Params {
  params: {
    username: string;
  };
}


export default function UserViewPage({ params }: Params) {
  const { username } = params; // รับค่า username จาก params
  return <UserView username={username} />; // ส่ง username ให้กับ UserView
}
