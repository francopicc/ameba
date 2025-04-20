"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Bitcoin, CreditCard, DollarSign } from "lucide-react"

interface TerminalData {
  success: boolean;
  data: {
    id: string;
    url_id: string;
    expires_at: string;
    status: string;
    created_at: string;
    client_id: string;
    product_id: number;
  };
  product: {
    id: number;
    created_at: string;
    owner_id: string;
    name: string;
    amount: number;
    category: string | null;
    description: string;
    status: string;
  };
}

export default function TerminalPage() {
  const [data, setData] = useState<TerminalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [method, setMethod] = useState("mercadopago")
  const { terminal } = useParams<{ terminal: string }>()

  useEffect(() => {
    async function fetchTerminalData() {
      try {
        setLoading(true)
        const res = await fetch(`/api/terminal/${terminal}`)
        if (!res.ok) throw new Error("Not found")
        const result = await res.json()
        setData(result)
      } catch (err) {
        setError("Terminal not found.")
      } finally {
        setLoading(false)
      }
    }

    if (terminal) {
      fetchTerminalData()
    }
  }, [terminal])

  const isExpired = (expires_at: string) => {
    return new Date(expires_at).getTime() < Date.now()
  }

  const showNotFound =
    !data?.success || isExpired(data.data.expires_at) || data.data.status === "completed"

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        <span className="animate-pulse text-sm">Loading terminal...</span>
      </main>
    )
  }

  if (error || showNotFound) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-gray-700 p-6">
        <div className="max-w-sm w-full border border-gray-300 rounded-lg p-6 text-center">
          <h1 className="text-lg font-semibold mb-2">Terminal not found</h1>
          <p className="text-sm text-gray-500">The payment link might be expired or does not exist.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-gray-800 p-6">
      <div className="max-w-md w-full border border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-medium">Payment</h1>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">{data.product.name}</h2>
            <p className="text-sm text-gray-500">{data.product.description}</p>
            <p className="text-md font-medium mt-1">${data.product.amount.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`border p-2 rounded-md flex flex-col items-center text-xs ${
                    method === "mercadopago"
                      ? "border-black bg-gray-100"
                      : "border-gray-300"
                  }`}
                  onClick={() => setMethod("mercadopago")}
                >
                  <DollarSign size={18} />
                  MercadoPago
                </button>
                <button
                  className={`border p-2 rounded-md flex flex-col items-center text-xs ${
                    method === "bitcoin" ? "border-black bg-gray-100" : "border-gray-300"
                  }`}
                  onClick={() => setMethod("bitcoin")}
                >
                  <Bitcoin size={18} />
                  Bitcoin
                </button>
                <button
                  className={`border p-2 rounded-md flex flex-col items-center text-xs ${
                    method === "stripe" ? "border-black bg-gray-100" : "border-gray-300"
                  }`}
                  onClick={() => setMethod("stripe")}
                >
                  <CreditCard size={18} />
                  Stripe
                </button>
              </div>
            </div>
          </div>

          <button
            disabled={!email}
            className="w-full py-2 bg-black text-white text-sm font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
          >
            Pay ${data.product.amount.toFixed(2)}
          </button>

          <p className="text-center text-xs text-gray-400">
            Transaction ID: {data.data.id.slice(0, 8)}...
          </p>
        </div>
      </div>
    </main>
  )
}
