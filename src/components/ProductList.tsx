"use client"
import { getProducts } from "@/lib/actions/product"
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth/session";
import { Plus, MoreVertical, Edit, Trash } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description?: string;
    amount?: number;
}

export default function ProductList() {
    const [session, setSession] = useState<{ user: User } | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

    interface ToggleMenu {
        (productId: string): void;
    }

    const toggleMenu: ToggleMenu = (productId) => {
        if (openMenuId === productId) {
            setOpenMenuId(null);
        } else {
            setOpenMenuId(productId);
        }
    };

    const handleAddProduct = () => {
        // Implementar lógica para añadir producto
        console.log("Añadir producto");
    };

    const handleEditProduct= (productId: string): void => {
        console.log("Editar producto:", productId);
        setOpenMenuId(null);
    };

    const handleDeleteProduct = (productId: string): void => {
        console.log("Eliminar producto:", productId);
        setOpenMenuId(null);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-7 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                
                <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="border border-gray-200 rounded-lg p-4 flex flex-row">
                            <div className="flex-1">
                                <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                                <div className="h-4 w-48 bg-gray-100 rounded-md animate-pulse"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse mt-2"></div>
                            </div>
                            <div>
                                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="bg-gray-50 text-gray-600 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Products</h2>
                <button 
                    onClick={handleAddProduct}
                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors"
                >
                    <Plus size={18} />
                    <span>Add product</span>
                </button>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You don't have products on your actual business.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {products.map((product: Product) => (
                        <div 
                            key={product.id} 
                            className="flex flex-row border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-800">{product.name}</h3>
                                {product.description && (
                                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                                )}
                                <div className="mt-2 text-sm font-medium text-gray-700">
                                    ${product.amount?.toFixed(2) || "0.00"}
                                </div>
                            </div>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => toggleMenu(product.id)}
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                >
                                    <MoreVertical size={18} />
                                </button>
                                
                                {openMenuId === product.id && (
                                    <div className="absolute right-0 mt-1 bg-white rounded-md border border-gray-200 z-10 w-36">
                                        <button 
                                            onClick={() => handleEditProduct(product.id)}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                                        >
                                            <Edit size={14} />
                                            <span>Editar</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                                        >
                                            <Trash size={14} />
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}