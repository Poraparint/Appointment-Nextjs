"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

// Define the type for the user object structure
type User = {
  username: string;
  id: number;
  avatar_url: string; // Add avatar_url field
};

function SearchUsername() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<User[]>([]); // Set the type of results as an array of User objects
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const supabase = createClient();

  const handleSearch = async () => {

    if (!searchTerm.trim()) {
      setResults([]); // ล้างผลลัพธ์
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, id, avatar_url") // Include avatar_url in the query
        .ilike("username", `%${searchTerm}%`); // Case-insensitive search

      if (error) throw error;
      
      setResults(data);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error searching for username:", error.message);
      } else {
        console.error("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false); // Delay hiding the dropdown to allow link clicks
    }, 200);
  };

  return (
    <div className="relative max-md:text-sm">
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="ใส่ชื่อผู้ใช้"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)} // แสดง dropdown เมื่อ focus
          // ซ่อน dropdown เมื่อ blur
          className="p-2 border border-gray-300 bg-bg rounded-md w-80 max-lg:w-52 max-sm:w-24 focus:outline-none focus:ring-2 focus:ring-pain transition duration-300"
        />
        <button
          onClick={handleSearch}
          onBlur={handleBlur}
          disabled={loading}
          className="ml-1 px-4 py-2 bg-pain text-white rounded-md hover:bg-purple-900 disabled:bg-gray-400 transition duration-300 "
        >
          
          <i className="fa-solid fa-magnifying-glass "></i>
        </button>
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-md w-full max-h-60 overflow-y-auto mt-1">
          {results.map((user) => (
            <li key={user.id}>
              <Link
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 border-b border-light"
                href={`/UserView/${user.username}`}
              >
                <img
                  src={user.avatar_url || "/De_Profile.jpeg"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-lg font-medium text-text max-md:text-sm">
                  {user.username}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchUsername;
