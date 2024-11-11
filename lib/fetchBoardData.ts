// lib/fetchBoardData.ts

import { createClient } from "@/utils/supabase/client";

// Function to fetch board metadata (title)
export const fetchBoardMetadata = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boards")
    .select("board_name")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching board metadata:", error);
    return { title: "Appointment Board" }; // Default title in case of error
  }

  return { title: data?.board_name || "Appointment Board" };
};

// Function to fetch board data
export const fetchBoardData = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boards")
    .select("*, users (username, avatar_url, id)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching board data:", error);
    return null;
  }

  return data;
};
