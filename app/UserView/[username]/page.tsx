"use client"

import { useState, useEffect } from "react";

import UserView from "@/components/UserView";

// Define the expected Params type with async resolution
interface Params {
  params: Promise<{ username: string }>;
}

export default function UserViewPage({ params }: Params) {
  const [resolvedParams, setResolvedParams] = useState<{
    username: string;
  } | null>(null);

  // Resolve the params asynchronously
  useEffect(() => {
    const fetchParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };

    fetchParams();
  }, [params]);

  // Ensure the params are resolved before rendering
  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  const { username } = resolvedParams;

  return <UserView username={username} />; // Pass the username to the UserView component
}
