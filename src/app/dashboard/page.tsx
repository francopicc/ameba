import { getClients } from "@/lib/db/clients"
import ClientSelector from "@/components/ClientSelector"
import Sidebar from "@/components/ui/Sidebar"

export default async function Dashboard() {
  const clients = await getClients()

  return (
    <main className="p-4">
      <Sidebar clients={clients} activePage="home" />
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <ClientSelector clients={clients} />
    </main>
  )
}
