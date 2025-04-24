"use client";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/session";
import { getPayments } from "@/lib/actions/payments";
import { User } from "@supabase/supabase-js";

interface Payment {
    id: string;
    order_id: string;
    date: string;
    client: string;
    amount: number;
    description: string;
    status: string;
    name: string;
    payment_method: string;
    email: string;
}

export default function PaymentList() {
    const [session, setSession] = useState<{ user: User } | null>(null);
    const [products, setProducts] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // First effect to fetch the session
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const currentSession = await getSession();
                setSession(currentSession);
            } catch (err) {
                setError("Failed to fetch session");
                console.error("Error fetching session:", err);
            }
        };
        
        fetchSession();
    }, []);

    // Second effect to fetch products when session is available
    useEffect(() => {
        const fetchProducts = async () => {
            if (session?.user?.user_metadata?.active_client_id) {
                try {
                    setIsLoading(true);
                    const clientId = session.user.user_metadata.active_client_id;

                    
                    const { data } = await getPayments({ 
                        owner_id: clientId 
                    });
                    
                    setProducts(data || []);
                } catch (err) {
                    setError("Error fetching products");
                    console.error("Error fetching products:", err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchProducts();
        }
    }, [session]);

    // Skeleton loading component
    const PaymentSkeleton = () => (
        <div className="animate-pulse overflow-x-auto border border-stone-200 rounded-lg">
            {/* Table header skeleton */}
            <div className="min-w-full bg-white">
                <div className="bg-stone-100 h-12 flex">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex-1 px-6 py-3">
                            <div className="h-3 bg-stone-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
                
                {/* Table rows skeleton */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex border-t border-stone-200">
                        {[...Array(8)].map((_, j) => (
                            <div key={j} className="flex-1 px-6 py-4">
                                {j === 5 ? (
                                    // Special style for status column
                                    <div className="h-6 bg-stone-200 rounded-full w-16"></div>
                                ) : (
                                    <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4">Payments</h1>
            
            {isLoading ? (
                <div className="space-y-4">
                    {/* Title skeleton */}
                    <div className="animate-pulse h-8 bg-stone-200 rounded w-1/4 mb-6"></div>
                    
                    {/* Table skeleton */}
                    <PaymentSkeleton />
                </div>
            ) : products.length === 0 ? (
                <p className="text-stone-500 p-4 bg-stone-50 rounded">No payment records found.</p>
            ) : (
                <div className="overflow-x-auto border border-stone-200 rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-stone-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stone-200">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{product.order_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{product.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">${product.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`p-1 px-3 text-xs ${product.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} rounded-full`}>{product.status.toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{product.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}