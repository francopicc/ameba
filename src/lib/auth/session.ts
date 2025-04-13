'use server'
import { createClient } from "@/utils/supabase/server";

export async function getSession() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}