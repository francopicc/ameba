"use client"
import { getSession } from "@/lib/session";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [session, setSession] = useState<{ user: User } | null>(null);
  console.log(session)

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      setSession(session);
    }
    fetchSession();
  }, []);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>Welcome {session?.user?.email}</p>
    </div>
  );
}
