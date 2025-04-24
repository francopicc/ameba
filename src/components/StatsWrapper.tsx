"use client"

import { useEffect, useState } from "react"
import { getTotalPaymentStats } from "@/lib/actions/payments"
import { getSession } from "@/lib/auth/session"
import { User } from "@supabase/supabase-js"

interface Client {
  id: string
  name: string
}

interface Stats {
  totalSales: number
  totalRevenue: number
}

export default function DashboardClientWrapper({ clients }: { clients: Client[] }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [session, setSession] = useState<{ user: User } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Obtener sesión
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const currentSession = await getSession()
        setSession(currentSession)
      } catch (err) {
        setError("Failed to fetch session")
        console.error("Error fetching session:", err)
      }
    }

    fetchSession()
  }, [])

  // Obtener estadísticas una vez que tengamos sesión
  useEffect(() => {
    if (!session?.user?.user_metadata?.active_client_id) return

    const fetchStats = async () => {
      try {
        const stats = await getTotalPaymentStats({
          owner_id: session.user.user_metadata.active_client_id,
        })
        if (stats && stats.stats) {
          setStats(stats.stats)
        } else {
          setError(stats.message || "Error fetching stats")
        }
        

      } catch (err) {
        setError("Failed to fetch stats")
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [session])

  const today = new Date()
  const fecha = today.getDate()
  const mes = new Intl.DateTimeFormat("en-ES", { month: "long" }).format(today)

  if (loading) {
    return (
      <div className="mt-[3em] max-w-4xl mx-auto animate-pulse">
        <div className="h-6 bg-stone-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-stone-200 rounded w-2/3 mb-6"></div>

        <div className="mt-8 grid gap-3 grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-white rounded-xl border border-stone-200">
            <div className="h-4 bg-stone-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-stone-300 rounded w-1/3"></div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-stone-200">
            <div className="h-4 bg-stone-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-stone-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">You don't have active business</h1>
          <p className="text-stone-400 text-[12.5px]">
            Add a client to start managing your business.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="md:mt-[3em] max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Your personal dashboard</h1>
      <p className="text-stone-400 text-[12.5px]">
        We present the summary of your company for today {mes} {fecha}.
      </p>

      <div className="mt-8 grid gap-3 grid-cols-1 md:grid-cols-2">
        <div className="p-6 bg-white rounded-xl border border-stone-200">
          <h3 className="font-medium mb-2">Total Sales</h3>
          <p className="text-2xl font-semibold">
            ARS${stats?.totalRevenue?.toFixed(2) ?? 0}
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-stone-200">
          <h3 className="font-medium mb-2">Total Products Sales</h3>
          <p className="text-2xl font-semibold">
            {stats?.totalSales ?? 0}
          </p>
        </div>
      </div>
    </div>
  )
}
