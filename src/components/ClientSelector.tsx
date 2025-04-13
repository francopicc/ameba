// ClientSelector.tsx (componente del lado del cliente)
"use client" // Esto asegura que este componente se ejecute en el lado del cliente

import { setActiveClient } from "@/lib/actions/clientSession"
import { useTransition } from "react"

export default function ClientSelector({ clients }: { clients: any[] }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div>
      <h2 className="font-bold mb-2">Elegí un comercio</h2>
      <ul className="space-y-2">
        {clients.map(client => (
          <li key={client.id}>
            <button
              className="p-2 bg-blue-600 text-white rounded"
              disabled={isPending}
              onClick={() => {
                startTransition(() => {
                  setActiveClient(client.id)
                })
              }}
            >
              {client.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
