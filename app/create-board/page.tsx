"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation"; // Use from next/navigation in App Router

const CreateBoard = () => {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleCreateBoard = async () => {
    if (!boardName.trim() || !description.trim()) {
      console.error("Board name or description is empty");
      return;
    }

    const { data, error: authError } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    if (authError) {
      console.error("Error fetching user:", authError.message);
      return;
    }

    if (userId) {
      const { error: insertError } = await supabase.from("boards").insert({
        name: boardName,
        description,
        user_id: userId,
      });

      if (insertError) {
        console.error(
          "Error creating board:",
          insertError.message,
          insertError
        );
      } else {
        router.push("/Profile"); // Redirect to profile page after creating board
      }
    } else {
      console.error("User not authenticated or missing user ID");
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Board</h2>
        <input
          type="text"
          placeholder="Board Name"
          className="border p-2 mb-4 w-full"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <textarea
          placeholder="Board Description"
          className="border p-2 mb-4 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleCreateBoard}
        >
          Create Board
        </button>
      </div>
    </div>
  );
};

export default CreateBoard;
