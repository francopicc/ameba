"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Check, ArrowRight, Loader2, XCircle } from "lucide-react"
import { getProductInformation } from "@/lib/actions/product"

interface Product {
    name: string;
    email: string;
    amount: number;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [redirecting, setRedirecting] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [loading, setLoading] = useState(true)
  const [productData, setProductData] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Get transaction ID from GET parameters
  const transactionId = searchParams.get("transactionId") || ""
  const productId = searchParams.get("productId") || ""
  const redirectUrl = searchParams.get("redirectUrl") || ""
  
  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true)
        // Get product details using the imported function
        const data = await getProductInformation({ id: productId })
        setProductData(data)
      } catch (err) {
        console.error("Error al obtener información del producto:", err)
        setError("No se pudo cargar la información del producto")
      } finally {
        setLoading(false)
      }
    }
    
    if (productId) {
      fetchProductData()
    } else {
      setLoading(false)
      setError("Información de producto no disponible")
    }
  }, [productId])
  
  useEffect(() => {
    // If there's a redirect URL, start countdown
    if (redirectUrl) {
      setRedirecting(true)
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.href = redirectUrl
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [redirectUrl])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-stone-800 p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
          <p className="mt-2 text-stone-600">Cargando información del pago...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-stone-800 p-4">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center text-center">
        {/* Circle with check mark */}
        <div className="mb-6 relative">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-stone-100 flex items-center justify-center">
            <Check size={32} className="text-stone-800 sm:hidden" strokeWidth={2.5} />
            <Check size={40} className="text-stone-800 hidden sm:block" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Title and details */}
        <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-stone-800">Pago Exitoso</h1>
        
        <div className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
          {error ? (
            <div className="text-stone-600 text-center py-4">
              {error}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-between mb-3">
                <span className="text-stone-600 text-sm sm:text-base">Producto:</span>
                <span className="font-medium text-sm sm:text-base ml-auto">{productData?.name || "Producto"}</span>
              </div>
              
              <div className="flex flex-wrap justify-between mb-3">
                <span className="text-stone-600 text-sm sm:text-base">Email:</span>
                <span className="font-medium text-sm sm:text-base ml-auto break-all">{productData?.email || "No disponible"}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between mb-4 mt-4">
                <span className="text-stone-600 text-sm sm:text-base mb-1 sm:mb-0">ID Transacción:</span>
                <span className="text-xs font-medium break-all">{transactionId}</span>
              </div>
              
              <div className="flex justify-between border-t border-stone-200 pt-3">
                <span className="text-stone-600 font-medium text-sm sm:text-base">Total:</span>
                <span className="text-lg font-bold">${productData?.amount?.toFixed(2) || "0.00"}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Redirect message if redirectUrl exists */}
        {redirecting ? (
          <div className="flex items-center gap-2 text-stone-600 mt-2 text-sm">
            <span>Redirigiendo en {countdown} segundos</span>
            <ArrowRight size={16} className="animate-pulse" />
          </div>
        ) : (
          <p className="text-stone-600 text-sm sm:text-base">Gracias por tu compra. Pronto te llegará un correo del vendedor con el producto.</p>
        )}
      </div>
    </main>
  )
}