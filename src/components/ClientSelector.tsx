'use client'

import { useState } from 'react'
import { setActiveClient } from '@/lib/actions/client'

interface Client {
  id: string
  name: string
}

function useClientSelector() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectClient = async (clientId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await setActiveClient(clientId)
      // Opcional: Actualizar estado local o revalidar datos si es necesario
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al seleccionar cliente')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    selectClient,
    isLoading,
    error
  }
}

export default function ClientSelector({ clients }: { clients: Client[] }) {
  const { selectClient, isLoading, error } = useClientSelector()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelectClient = async (clientId: string) => {
    try {
      setSelectedId(clientId)
      await selectClient(clientId)
    } catch (error) {
      // El error ya está manejado en el hook
      setSelectedId(null)
    }
  }

  return (
    <div>
      <h2 className="font-bold mb-2">Elegí un comercio</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <ul className="space-y-2">
        {clients.map(client => (
          <li key={client.id}>
            <button
              className={`p-2 ${
                selectedId === client.id ? 'bg-blue-800' : 'bg-blue-600'
              } text-white rounded hover:bg-blue-700 disabled:opacity-50`}
              disabled={isLoading}
              onClick={() => handleSelectClient(client.id)}
            >
              {client.name}
              {isLoading && selectedId === client.id && ' ...'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}