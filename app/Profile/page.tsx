"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data", error);
      } else {
        setUserData(data.user);
        fetchUserBoards(data.user.id); // Fetch boards after getting user data
      }
    };

    const fetchUserBoards = async (userId: string) => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", userId); // Fetch boards created by the user
      if (error) {
        console.error("Error fetching boards", error);
      } else {
        setBoards(data || []);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="container mx-auto mt-6">
      {userData ? (
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Welcome, {userData.email}</h2>

          {/* Button to create board */}
          <Link href="/create-board">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Create Board
            </button>
          </Link>

          {/* Search Users */}
          <Link href="/search-users">
            <button className="bg-green-500 text-white px-4 py-2 ml-4 rounded-md hover:bg-green-700 transition">
              Search Users
            </button>
          </Link>

          {/* Display User Boards */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Your Boards</h3>
            {boards.length > 0 ? (
              <ul>
                {boards.map((board) => (
                  <li key={board.id} className="mb-2">
                    
                      <div className="text-blue-600 hover:underline">
                        {board.name}
                      </div>
                    
                  </li>
                ))}
              </ul>
            ) : (
              <p>No boards found. Create one above!</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
