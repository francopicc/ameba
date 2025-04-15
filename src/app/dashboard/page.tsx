import { getClients } from "@/lib/db/clients"
import ClientSelector from "@/components/ClientSelector"
import Sidebar from "@/components/ui/Sidebar"

export default async function DashboardHome() {
  const clients = await getClients()
  
  // Obtener la fecha actual en español
  const today = new Date()
  const fecha = today.getDate()
  const mes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(today)

  return (
    <main className="min-h-screen p-4">
      <Sidebar clients={clients} activePage="home" />
      <div className="ml-[20em] mt-10 max-w-4xl">
        <h1 className="text-2xl font-bold mb-1">
          Tu menú personal
        </h1>
        <p className="text-stone-400 text-[12.5px]">
          Te presentamos el resumen al día {fecha} de {mes} de tu empresa.
        </p>
        
        <div className="mt-8 grid gap-3 grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-white rounded-xl border-1 border-stone-200">
            <h3 className="font-medium mb-2">Total Sales</h3>
            <p className="text-2xl font-semibold">$0</p>
          </div>
          <div className="p-6 bg-white rounded-xl border-1 border-stone-200">
            <h3 className="font-medium mb-2">Total Products Sales</h3>
            <p className="text-2xl font-semibold">0</p>
          </div>

        </div>
      </div>
    </main>
  )
}
