import { createClient } from "@/utils/supabase/server";

// Obtener todos los comercios del usuario
export async function getClients({ owner_id }: { owner_id: string }) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq('owner_id', owner_id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

