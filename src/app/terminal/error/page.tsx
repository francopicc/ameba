"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { XCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react"
import { getProductInformation } from "@/lib/actions/product"

interface Product {
    name: string;
    email: string;
    amount: number;
}

export default function PaymentErrorPage() {
  const searchParams = useSearchParams()
  const [redirecting, setRedirecting] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [loading, setLoading] = useState(true)
  const [productData, setProductData] = useState<Product | null>(null)
  
  // Get parameters from URL
  const errorCode = searchParams.get("errorCode") || "unknown"
  const productId = searchParams.get("productId") || ""
  const redirectUrl = searchParams.get("redirectUrl") || ""
  
  // Map error codes to user-friendly messages
  const errorMessages: {[key: string]: string} = {
    "declined": "Tu pago ha sido rechazado por el banco. Por favor, intenta con otro método de pago.",
    "insufficient_funds": "Fondos insuficientes en la cuenta. Por favor, utiliza otro método de pago.",
    "expired_card": "La tarjeta ha expirado. Por favor, utiliza una tarjeta vigente.",
    "invalid_card": "Los datos de la tarjeta no son válidos. Por favor, verifica la información.",
    "processing_error": "Error al procesar el pago. Por favor, intenta nuevamente más tarde.",
    "unknown": "Ha ocurrido un error inesperado. Por favor, intenta nuevamente."
  }
  
  const errorMessage = errorMessages[errorCode] || errorMessages.unknown
  
  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true)
        if (productId) {
          // Get product details using the imported function
          const data = await getProductInformation({ id: productId })
          setProductData(data)
        }
      } catch (err) {
        console.error("Error al obtener información del producto:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProductData()
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

  const handleRetry = () => {
    // Redirect to previous page (typically checkout page)
    window.history.back()
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-stone-800 p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
          <p className="mt-2 text-stone-600">Verificando información del pago...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-stone-800 p-4">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center text-center">
        {/* Circle with X icon */}
        <div className="mb-6 relative">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle size={32} className="text-red-500 sm:hidden" strokeWidth={2} />
            <XCircle size={40} className="text-red-500 hidden sm:block" strokeWidth={2} />
          </div>
        </div>
        
        {/* Title and details */}
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 text-stone-800">Error en el Pago</h1>
        
        <p className="text-stone-600 mb-6 text-sm sm:text-base">{errorMessage}</p>
        
        <div className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6">
          {productData ? (
            <>
              <div className="flex flex-wrap justify-between mb-3">
                <span className="text-stone-600 text-sm sm:text-base">Producto:</span>
                <span className="font-medium text-sm sm:text-base ml-auto">{productData.name}</span>
              </div>
              
              {productData.email && (
                <div className="flex flex-wrap justify-between mb-3">
                  <span className="text-stone-600 text-sm sm:text-base">Email:</span>
                  <span className="font-medium text-sm sm:text-base ml-auto break-all">{productData.email}</span>
                </div>
              )}
              
              <div className="flex justify-between border-t border-stone-200 pt-3 mt-2">
                <span className="text-stone-600 font-medium text-sm sm:text-base">Total:</span>
                <span className="text-lg font-bold">${productData.amount.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div className="text-stone-600 text-center py-2 text-sm">
              Información del producto no disponible
            </div>
          )}
        </div>
        
        {/* Retry button */}
        <button 
          onClick={handleRetry}
          className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2 mb-4"
        >
          <RefreshCw size={16} />
          <span>Intentar de nuevo</span>
        </button>
        
        {/* Redirect message if redirectUrl exists */}
        {redirecting && (
          <div className="flex items-center gap-2 text-stone-600 mt-2 text-sm">
            <span>Redirigiendo en {countdown} segundos</span>
            <ArrowRight size={16} className="animate-pulse" />
          </div>
        )}
      </div>
    </main>
  )
}