"use client"
import { getProducts, deleteProduct, editProduct } from "@/lib/actions/product"
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth/session";
import { Plus, MoreVertical, Edit, Trash, Link } from "lucide-react";
import { Modal } from "./ui/Modal";
import { addProduct } from "@/lib/actions/product";
import { Toast } from "./ui/Toast";
import QRCode from "react-qr-code";

interface Product {
    id: string;
    url_id: string;
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
    const [isOpen, setIsOpen] = useState(false);
    const [modalProposal, setModalProposal] = useState<string | null>(null);
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; isVisible: boolean; type: 'success' | 'error' }>({
        message: "",
        isVisible: false,
        type: 'success'
    });
    const [paymentLink, setPaymentLink] = useState<string | null>(null);
    
    // Add form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        amount: ""
    });

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

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, isVisible: true, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, isVisible: false }));
        }, 3000); // Adjust duration as needed
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    // Handle form submission for adding a product
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const owner_id = session?.user?.user_metadata?.active_client_id;
            
            if (!owner_id) {
                setError("No active client found. Please try again later.");
                return;
            }
            
            // Parse amount to number
            const amount = formData.amount ? parseFloat(formData.amount) : undefined;
            
            // Call addProduct with the form data
            const newProduct = await addProduct({
                owner_id,
                name: formData.name,
                description: formData.description || "",
                amount: amount ?? 0
            });
            
            // Add the new product to the products state
            setProducts(prevProducts => [...prevProducts, newProduct[0]]);
            
            // Reset form and close modal
            setFormData({ name: "", description: "", amount: "" });
            setIsOpen(false);
            showToast("Product added successfully!", 'success');
        } catch (err) {
            console.error("Error adding product:", err);
            setError("Failed to add product. Please try again later.");
            showToast("Failed to add product. Please try again later.", 'error');
        }
    };

    // Handle form submission for editing a product
    const handleSubmitEditProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const owner_id = session?.user?.user_metadata?.active_client_id;
            
            if (!owner_id || !currentProductId) {
                setError("No active client or product found. Please try again later.");
                return;
            }
            
            // Parse amount to number
            const amount = formData.amount ? parseFloat(formData.amount) : undefined;
            
            // Call editProduct with the form data
            const updatedProduct = await editProduct({
                owner_id,
                id: currentProductId,
                name: formData.name,
                description: formData.description || "",
                amount: amount ?? 0
            });
            
            // Update the product in the products state
            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product.id === currentProductId 
                        ? { ...product, name: formData.name, description: formData.description, amount: amount ?? 0 }
                        : product
                )
            );
            
            // Reset form, current product ID, and close modal
            setFormData({ name: "", description: "", amount: "" });
            setCurrentProductId(null);
            setIsOpen(false);
            showToast("Product updated successfully!", 'success');
        } catch (err) {
            console.error("Error updating product:", err);
            setError("Failed to update product. Please try again later.");
            showToast("Failed to update product. Please try again later.", 'error');
        }
    };

    // Load product data for editing
    const handleEditProduct = (productId: string): void => {
        // Find the product by ID
        const productToEdit = products.find(product => product.id === productId);
        
        if (productToEdit) {
            // Set the form data with product values
            setFormData({
                name: productToEdit.name,
                description: productToEdit.description || "",
                amount: productToEdit.amount?.toString() || ""
            });
            
            // Set the current product ID for the edit operation
            setCurrentProductId(productId);
        }
        
        setOpenMenuId(null);
    };

    const handleDeleteProduct = async (productId: string): Promise<void> => {
        try {
            const product = await deleteProduct({
                owner_id: session?.user?.user_metadata?.active_client_id,
                id: productId
            });
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
            setOpenMenuId(null);
            showToast("Product deleted successfully!", 'success');
        } catch (err) {
            console.error("Error deleting product:", err);
            showToast("Failed to delete product. Please try again later.", 'error');
        }
    };

    const handleCreateLink = async ({ name, description, amount, id } : { name: string, description: string, amount: number, id: string }) => {
        const res = await fetch('/api/terminal', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, id }),
        });
        return res.json();
    }

    const handleModalContent = ({ content }: { content: string }) => {
        if(content === "add-product") {
            return (
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Add Product</h2>
                    <form className="space-y-4" onSubmit={handleAddProduct}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-stone-700">Product Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                placeholder="Product Name" 
                                className="mt-1 p-2 block w-full border-1 border-stone-300 rounded-md" 
                                value={formData.name}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description</label>
                            <textarea 
                                id="description" 
                                placeholder="Product Description" 
                                className="mt-1 p-2 block w-full border-1 border-stone-300 rounded-md"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-stone-700">Amount</label>
                            <input 
                                type="text" 
                                id="amount" 
                                placeholder="Total Price" 
                                className="mt-1 p-2 block w-full border-1 border-stone-300 rounded-md" 
                                value={formData.amount}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="bg-stone-800 text-[12.5px] text-white px-4 py-2 w-full rounded-md">Add Product</button>
                    </form>
                </div>
            );
        } else if(content === "edit-product") {
            return (
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                    <form className="space-y-4" onSubmit={handleSubmitEditProduct}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-stone-700">Product Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                placeholder="Product Name" 
                                className="mt-1 p-2 block w-full border-1 border-stone-300 rounded-md" 
                                value={formData.name}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description</label>
                            <textarea 
                                id="description" 
                                placeholder="Product Description" 
                                className="mt-1 p-2 block w-full border-1 border-stone-300 rounded-md"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-stone-700">Amount</label>
                            <input 
                                type="text" 
                                id="amount" 
                                placeholder="Total Price" 
                                className="mt-1 p-2 block w-full border-1 border-stone-300 rounded-md" 
                                value={formData.amount}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="bg-stone-800 text-[12.5px] text-white px-4 py-2 w-full rounded-md">Update Product</button>
                    </form>
                </div>
            );
        } else if (content === "payment-link") {
            return (
                <div className="p-6 text-center flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4">Payment Link</h2>
                    <p className="text-sm -mt-3 text-stone-500">Your payment link has been created successfully.</p>
                    <QRCode
                        value={paymentLink || ""}
                        size={200}
                        className="mt-6"
                    />
                    <p className="text-sm text-stone-500 mt-4">Scan the QR code to access your payment link.</p>
                </div>
            );
        } else {
            return (
                <div className="p-6">
                    <p>No content available</p>
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-7 w-32 bg-stone-200 rounded-md animate-pulse"></div>
                    <div className="h-10 w-40 bg-stone-200 rounded-md animate-pulse"></div>
                </div>
                
                <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="border border-stone-200 rounded-lg p-4 flex flex-row">
                            <div className="flex-1">
                                <div className="h-5 w-32 bg-stone-200 rounded-md animate-pulse mb-2"></div>
                                <div className="h-4 w-48 bg-stone-100 rounded-md animate-pulse"></div>
                                <div className="h-4 w-16 bg-stone-200 rounded-md animate-pulse mt-2"></div>
                            </div>
                            <div>
                                <div className="h-8 w-8 bg-stone-200 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="bg-stone-50 text-stone-600 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="space-y-4">
            <Modal isOpen={isOpen} onClose={() => {
                setIsOpen(false);
                setFormData({ name: "", description: "", amount: "" });
                setCurrentProductId(null);
            }}>
                {handleModalContent({ content: modalProposal || "add-product" })}
            </Modal>
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-stone-800">Your Products</h2>
                    <span className="text-stone-400 text-xs">All the prices are listed in ARS (Argentinian Pesos)</span>
                </div>
                <button 
                    onClick={() => {
                        setModalProposal("add-product");
                        setFormData({ name: "", description: "", amount: "" });
                        setCurrentProductId(null);
                        setIsOpen(true);
                    }}
                    className="flex cursor-pointer items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-md transition-colors"
                >
                    <Plus size={18} />
                    <span>Add product</span>
                </button>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 rounded-lg">
                    <p className="text-stone-500">You don't have products on your actual business.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {products.map((product: Product) => (
                        <div 
                            key={product.id} 
                            className="flex flex-row border border-stone-200 rounded-lg p-4"
                        >
                            <div className="flex-1">
                                <h3 className="font-medium text-stone-800">{product.name}</h3>
                                {product.description && (
                                    <p className="text-sm text-stone-500 line-clamp-1 mt-1">{product.description}</p>
                                )}
                                <div className="mt-2 text-sm font-medium text-stone-700">
                                    ${product.amount?.toFixed(2) || "0.00"}
                                </div>
                            </div>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => toggleMenu(product.id)}
                                    className="p-2 text-stone-500 hover:bg-stone-100 rounded-full"
                                >
                                    <MoreVertical size={18} />
                                </button>
                                
                                {openMenuId === product.id && (
                                    <div className="absolute right-0 mt-1 bg-white rounded-md border border-stone-200 z-10 w-48">
                                        <button 
                                            onClick={() => {
                                                handleEditProduct(product.id);
                                                setModalProposal("edit-product");
                                                setIsOpen(true);
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-stone-50 text-sm text-stone-700"
                                        >
                                            <Edit size={14} />
                                            <span>Edit Product</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                handleCreateLink({
                                                    name: product.name, 
                                                    description: product.description ?? '', 
                                                    amount: product.amount ?? 0, 
                                                    id: product.id
                                                }).then((response) => {
                                                    
                                                    if (response.success) {
                                                        // La API devuelve { success: true, data: insertedData }
                                                        // donde insertedData es un array con los registros insertados
                                                        const terminalData = response.data[0]; // Asumiendo que es el primer elemento del array
                                                        
                                                        if (terminalData && terminalData.url_id) {
                                                            setPaymentLink(`${window.location.origin}/terminal/${terminalData.url_id}`);
                                                        } else if (terminalData && terminalData.id) {
                                                            // Si no hay url_id pero sí hay id
                                                            setPaymentLink(`${window.location.origin}/terminal/${terminalData.id}`);
                                                        } else {
                                                            setPaymentLink(`${window.location.origin}/terminal/`);
                                                        }
                                                        
                                                        setModalProposal("payment-link");
                                                        setIsOpen(true);
                                                    } else {
                                                        console.error("Error in API response:", response.error);
                                                        setError("Failed to create payment link. Please try again later.");
                                                        showToast("Failed to create payment link. Please try again later.", 'error');
                                                    }
                                                }).catch(error => {
                                                    console.error("Error handling payment link:", error);
                                                    showToast("Failed to create payment link. Please try again later.", 'error');
                                                });
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-stone-50 text-sm text-stone-700"
                                        >
                                            <Link size={14} />
                                            <span>Create Payment Link</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 text-sm"
                                        >
                                            <Trash size={14} />
                                            <span>Delete Product</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {toast.isVisible && (
                <Toast 
                    message={toast.message} 
                    isVisible={toast.isVisible} 
                    onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
                    duration={3000}
                />
            )}
        </div>
    );
}