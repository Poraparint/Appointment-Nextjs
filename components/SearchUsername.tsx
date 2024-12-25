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

  const supabase = createClient();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, id, avatar_url") // Include avatar_url in the query
        .ilike("username", `%${searchTerm}%`); // Case-insensitive search

      if (error) throw error;
      setResults(data); // Now TypeScript knows that data is of type User[]
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

  return (
    <div className="absolute">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="ใส่ชื่อผู้ใช้"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border bg-bg rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-pain transition duration-300"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="ml-4 px-6 py-3 bg-pain text-white rounded-md hover:bg-purple-900 disabled:bg-gray-400 transition duration-300"
        >
          {loading ? (
            <span className="loader"></span> // Custom loading indicator
          ) : (
            "ค้นหา"
          )}
        </button>
      </div>

      <div>
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((user) => (
              <li key={user.id}>
                <Link
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 border-b border-light"
                  href={`/UserView/${user.username}`}
                >
                  <img
                    src={user.avatar_url || "/De_Profile.jpeg"} // Fallback image if avatar_url is not available
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
        ) : (
          <p className="text-center text-gray-500"></p>
        )}
      </div>
    </div>
  );
}

export default SearchUsername;
