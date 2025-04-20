"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";

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
    const { terminal } = useParams<{terminal: string}>()

    useEffect(() => {
        async function fetchTerminalData() {
            try {
                setLoading(true);
                const response = await fetch(`/api/terminal/${terminal}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error("Error fetching terminal data:", err);
                setError(err instanceof Error ? err.message : "Failed to load terminal data");
            } finally {
                setLoading(false);
            }
        }

        if (terminal) {
            fetchTerminalData();
        }
    }, [terminal]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-t-gray-800 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-base font-normal text-gray-600">Loading payment information...</h2>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full p-6 bg-white rounded-md border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">Error Loading Payment</h2>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    if (!data || !data.success) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full p-6 bg-white rounded-md border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">Payment Not Found</h2>
                    <p className="text-gray-600">We couldn't find the payment information you're looking for.</p>
                </div>
            </main>
        );
    }

    // Format the status for display
    const getStatusDisplay = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    // When data is successfully loaded and valid
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-md border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-medium text-gray-800">Payment Terminal</h1>
                </div>
                
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-medium text-gray-800">{data.product.name}</h2>
                        <p className="text-gray-600 text-sm mt-1">{data.product.description}</p>
                    </div>
                    
                    <div className="py-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <span className="font-medium text-gray-800">
                                {getStatusDisplay(data.data.status)}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Amount</span>
                            <span className="text-lg font-medium text-gray-800">${data.product.amount.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Expires at</span>
                            <span className="text-gray-800 text-sm">
                                {new Date(data.data.expires_at).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        {data.data.status === 'pending' ? (
                            <button className="w-full py-2 px-4 bg-gray-800 hover:bg-black text-white font-medium rounded-md transition-colors">
                                Pay Now
                            </button>
                        ) : data.data.status === 'completed' ? (
                            <div className="text-center p-3 bg-gray-100 text-gray-800 font-medium rounded-md">
                                Payment completed
                            </div>
                        ) : (
                            <div className="text-center p-3 bg-gray-100 text-gray-800 font-medium rounded-md">
                                Payment {data.data.status}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4 text-center text-xs text-gray-500">
                        <p>Transaction ID: {data.data.id.substring(0, 8)}...</p>
                    </div>
                </div>
            </div>
        </main>
    );
}