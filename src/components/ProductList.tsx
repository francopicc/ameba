"use client"
import { getProducts } from "@/lib/actions/product"
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth/session";

export default function ProductList() {
    const [session, setSession] = useState<{ user: User } | null>(null);
    const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                // First fetch the session
                const currentSession = await getSession();
                setSession(currentSession);

                // Only fetch products if we have a session with an active client
                if (currentSession?.user?.user_metadata?.active_client_id) {
                    const fetchedProducts = await getProducts({ 
                        owner_id: currentSession.user.user_metadata.active_client_id 
                    });
                    setProducts(fetchedProducts);
                }
            } catch (err) {
                console.error("Error loading products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return <div className="p-4">Loading products...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="py-4">
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid gap-4">
                    {products.map((product: any) => (
                        <div key={product.id} className="p-4 border rounded-lg bg-white shadow-sm relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-semibold text-lg">{product.name}</h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}