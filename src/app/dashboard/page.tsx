import { Modal } from "@/components/ui/Modal"
import { getClients } from "@/lib/db/clients"

export default async function DashboardHome() {
  const clients = await getClients()
  
  // Obtener la fecha actual en español
  const today = new Date()
  const fecha = today.getDate()
  const mes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(today)

  return (
    <main className="min-h-screen md:mr-[20em] p-3">
      {
        clients.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-1">You don't have active bussiness</h1>
              <p className="text-stone-400 text-[12.5px]">
                Add a client to start managing your business.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-[5em] max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">
              Your personal dashboard
            </h1>
            <p className="text-stone-400 text-[12.5px]">
              We present the summary of your company for today {fecha} of {mes}.
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
        )
      }
    </main>
  )
}
