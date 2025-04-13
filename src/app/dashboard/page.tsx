// Dashboard.tsx (componente del lado del servidor)
import { getClients } from "@/lib/db/clients"
import ClientSelector from "@/components/ClientSelector"

export default async function Dashboard() {
  const clients = await getClients()

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <ClientSelector clients={clients} />
    </main>
  )
}
