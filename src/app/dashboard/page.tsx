"use client"
import { getClients } from "@/lib/db/clients"
import { useEffect, useState } from "react"

export default function Dashboard () {
    const [clients, setClients] = useState<any[]>([])

    useEffect(() => {
        async function fetchClients() {
            const clientsData = await getClients({ owner_id: "42c5911f-278f-4069-a5ab-24834ccf7892" })
            setClients(clientsData || [])
        }
        fetchClients()
    }, [])

    return (
       <main className="p-4">
           <h1 className="text-2xl font-bold mb-4">Clients</h1>
           <div className="grid gap-4">
               {clients?.map((client) => (
                   <div 
                       key={client.id} 
                       className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
                   >
                       <h2 className="font-semibold">{client.name}</h2>
                       <p className="text-gray-600">{client.email}</p>
                   </div>
               ))}
               {clients?.length === 0 && (
                   <p className="text-gray-500">No clients found.</p>
               )}
           </div>
       </main> 
    )
}