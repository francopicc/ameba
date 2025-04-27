"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Bitcoin, CreditCard, DollarSign } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

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

interface PaymentResponse {
  message: string;
  payment: {
    id: string;
    status: string;
  };
  redirect_url?: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TerminalPage() {
  const [data, setData] = useState<TerminalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [method, setMethod] = useState("mercadopago")
  const { terminal } = useParams<{ terminal: string }>()
  const router = useRouter()

  useEffect(() => {
    async function fetchTerminalData() {
      try {
        setLoading(true)
        const res = await fetch(`/api/terminal/${terminal}`)
        if (!res.ok) throw new Error("Not found")
        const result = await res.json()
        
        // If terminal status is already "approved", redirect to not found
        if (result.data.status === "approved") {
          setError("Terminal already used")
          return
        }
        
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

  const updateTerminalStatus = async (terminalId: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('terminals')
        .update({ status: status })
        .eq('id', terminalId)
      
      console.log(data)

      if (error) {
        console.error("Error updating terminal status:", error)
        return false
      }
      
      return true
    } catch (err) {
      console.error("Failed to update terminal status:", err)
      return false
    }
  }

  const handlePayment = async () => {
    if (!data || !email) return;
    
    try {
      setPaymentLoading(true)
      setPaymentError(null)
      
      // Create the payment request payload
      const paymentData = {
        client_id: data.data.client_id,
        amount: data.product.amount,
        callback_url: window.location.origin + "/payment/success",
        currency: "ARS",
        product_id: data.product.id.toString(),
        email: email,
        payment_method: method,
        terminal_id: data.data.id,
      }
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })
      
      const result: PaymentResponse = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || "Payment processing failed")
      }
      
      // Check if the payment status is approved
      if (result.payment && result.payment.status === "approved") {
        // Update status in Supabase
        await updateTerminalStatus(data.data.id, "approved")
        
        // Redirect to success page with transaction ID
        router.push(`/terminal/success?transactionId=${result.payment.id}&productId=${data.product.id}`)
        return
      }
      
      // If there's a redirect URL in the response, navigate to it
      if (result.redirect_url) {
        window.location.href = result.redirect_url
      } else {
        // For sandbox mode, update the terminal status in Supabase
        await updateTerminalStatus(data.data.id, "approved")
        
        // Redirect to success page with transaction ID
        router.push(`/terminal/success?transactionId=${data.data.id}&productId=${data.product.id}`)
        
        if (data) {
          setData({
            ...data,
            data: {
              ...data.data,
              status: "approved"
            }
          })
        }
      }
    } catch (err) {
      console.error("Payment error:", err)
      setPaymentError(err instanceof Error ? err.message : "Payment processing failed")
    } finally {
      setPaymentLoading(false)
    }
  }

  const showNotFound =
    !data?.success || 
    isExpired(data.data.expires_at) || 
    data.data.status === "completed" ||
    data.data.status === "approved"

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-stone-700">
        <span className="animate-pulse text-sm">Loading terminal...</span>
      </main>
    )
  }

  if (error || showNotFound) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-stone-700 p-6">
        <div className="max-w-sm w-full border border-stone-300 rounded-lg p-6 text-center">
          <h1 className="text-lg font-semibold mb-2">Terminal not found</h1>
          <p className="text-sm text-stone-500">
            {error || "The payment link might be expired, already used, or does not exist."}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-stone-800 p-6">
      <div className="max-w-md w-full border border-stone-300 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-200">
          <h1 className="text-xl font-medium">Payment</h1>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">{data.product.name}</h2>
            <p className="text-sm text-stone-500">{data.product.description}</p>
            <p className="text-md font-medium mt-1">${data.product.amount.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-600">Your email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="text-xs text-stone-500">You'll receive the product on the email you have introduced.</span>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-stone-600">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`border p-2 rounded-md flex flex-col items-center text-xs ${
                    method === "mercadopago"
                      ? "border-black bg-stone-100"
                      : "border-stone-300"
                  }`}
                  onClick={() => setMethod("mercadopago")}
                >
                  <DollarSign size={18} />
                  MercadoPago
                </button>
                <button
                  className={`border p-2 rounded-md flex flex-col items-center text-xs ${
                    method === "bitcoin" ? "border-black bg-stone-100" : "border-stone-300"
                  }`}
                  onClick={() => setMethod("bitcoin")}
                >
                  <Bitcoin size={18} />
                  Bitcoin
                </button>
                <button
                  className={`border p-2 rounded-md flex flex-col items-center text-xs ${
                    method === "stripe" ? "border-black bg-stone-100" : "border-stone-300"
                  }`}
                  onClick={() => setMethod("stripe")}
                >
                  <CreditCard size={18} />
                  Stripe
                </button>
              </div>
            </div>
          </div>
          
          {paymentError && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {paymentError}
            </div>
          )}
          
          <button
            disabled={!email || paymentLoading}
            className="w-full py-2 bg-black text-white text-sm font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
            onClick={handlePayment}
          >
            {paymentLoading ? "Processing..." : `Pay ARS$${data.product.amount.toFixed(2)}`}
          </button>
          
          <div className="flex items-center justify-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <p className="text-center text-xs text-stone-500">
              Sandbox Mode Active
            </p>
          </div>
          
          <p className="text-center text-xs text-stone-400">
            Transaction ID: {data.data.id}
          </p>
        </div>
      </div>
    </main>
  )
}