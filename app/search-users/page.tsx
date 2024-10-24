"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default async function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const supabase = createClient();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const { data, error } = await supabase
      .from("users")
      .select("id, username")
      .ilike("username", `%${searchTerm}%`); // Search for users with matching usernames

    if (error) {
      console.error("Error searching users", error);
    } else {
      setSearchResults(data || []);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>

        <input
          type="text"
          placeholder="Search by username"
          className="border p-2 mb-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleSearch}
        >
          Search
        </button>

        {/* Search Results */}
        <div className="mt-6">
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((user) => (
                <li key={user.id} className="mb-2">
                  
                    <div className="text-blue-600 hover:underline">
                      {user.username}
                    </div>
                  
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};


