import { createClient } from "@/utils/supabase/server"

export async function getClients() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error("Unauthorized")

  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('*')
    .eq('owner_id', user.id)

  if (clientsError) throw clientsError
  console.log('Clientes:', clients)

  return clients
}
