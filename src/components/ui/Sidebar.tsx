"use client"
import { useState, useEffect } from 'react';
import { setActiveClient } from '@/lib/actions/client';
import { getSession } from '@/lib/auth/session';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  CreditCard, 
  ShoppingBag, 
  Settings, 
  Building, 
  PlusCircle,
  Menu,
  X 
} from 'lucide-react';

interface Client {
    id: string
    name: string
}

export default function Sidebar({ 
  clients, 
  activePage, 
  openModal
}: { 
  clients: Client[], 
  activePage: string,
  openModal: () => void 
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [session, setSession] = useState<{ user: User } | null>(null);
    const [activeClientName, setActiveClientName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const currentSession = await getSession();
                setSession(currentSession);
                
                if (currentSession?.user?.user_metadata?.active_client_id && clients.length > 0) {
                    const activeClient = clients.find(
                        client => client.id === currentSession.user.user_metadata.active_client_id
                    );
                    
                    if (activeClient) {
                        setSelectedClient(activeClient);
                        setActiveClientName(activeClient.name);
                    } else if (clients.length > 0) {
                        setSelectedClient(clients[0]);
                        setActiveClientName(clients[0].name);
                    }
                } else if (clients.length > 0) {
                    setSelectedClient(clients[0]);
                    setActiveClientName(clients[0].name);
                }
            } catch (error) {
                console.error("Error initializing sidebar:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        initialize();
    }, [clients]);

    // Cerrar el sidebar cuando cambia la página en móvil
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [activePage]);

    // Cerrar el sidebar cuando cambia el tamaño de la ventana a desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClientSelect = async (client: Client) => {
        if (selectedClient?.id === client.id) {
            setIsDropdownOpen(false);
            return;
        }
        
        try {
            setSelectedClient(client);
            setActiveClientName(client.name);
            setIsDropdownOpen(false);

            if (session?.user) {
                await setActiveClient(client.id);
            }
        } catch (error) {
            console.error("Error setting active client:", error);

            if (selectedClient) {
                setActiveClientName(selectedClient.name);
            }
        }
    };

    const navItems = [
        { name: 'Home', icon: <Home size={18} />, href: '/dashboard', id: 'home' },
        { name: 'Customers', icon: <Users size={18} />, href: '/dashboard/customers', id: 'customers' },
        { name: 'Payments', icon: <CreditCard size={18} />, href: '/dashboard/payments', id: 'payments' },
        { name: 'Products', icon: <ShoppingBag size={18} />, href: '/dashboard/products', id: 'products' },
        { name: 'Settings', icon: <Settings size={18} />, href: '/dashboard/settings', id: 'settings' },
    ];

    // Variantes para las animaciones
    const sidebarVariants = {
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        }
    };

    const overlayVariants = {
        open: {
            opacity: 1,
            pointerEvents: "auto" as "auto",
            transition: { duration: 0.2 }
        },
        closed: {
            opacity: 0,
            pointerEvents: "none" as "none",
            transition: { duration: 0.2 }
        }
    };

    return (
        <>
            {/* Botón de menú móvil */}
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-4 left-4 z-30 bg-white p-2 rounded-md shadow-md md:hidden flex items-center justify-center"
                aria-label="Toggle navigation menu"
            >
                <Menu size={20} />
            </button>

            {/* Overlay para cerrar el sidebar en móvil */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={overlayVariants}
                        className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar para desktop - siempre visible */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-stone-100 text-black z-10 flex-col hidden md:flex">
                <nav className="p-4 flex-grow">
                    <ul className="space-y-1 text-[14px]">
                        {navItems.map((item) => (
                            <Link 
                                key={item.id} 
                                href={item.href} 
                                className={`block p-2 hover:bg-stone-200 transition-all rounded ${activePage === item.id ? 'bg-stone-200' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        ))}
                    </ul>
                </nav>

                <div className="relative p-4 border-t border-stone-200">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full p-2 flex items-center justify-between rounded hover:bg-stone-200 cursor-pointer transition-all"
                        disabled={isLoading}
                    >
                        <div className="flex items-center gap-2">
                            <Building size={16} />
                            <span className="font-medium text-sm">
                                {isLoading ? 'Loading...' : activeClientName || 'Select a client'}
                            </span>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute bottom-full left-0 w-[85%] ml-4 bg-white border border-stone-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-10">
                            <div
                                className="block w-full p-2 text-[13px] font-medium text-stone-600 hover:bg-stone-100 transition-all border-b border-stone-100 cursor-pointer"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    openModal();
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <PlusCircle size={14} />
                                    <span>Create new business</span>
                                </div>
                            </div>
                            {clients.length === 0 ? (
                                <div className="p-2 text-stone-500 text-sm">
                                    No clients available
                                </div>
                            ) : (
                                clients
                                    .filter(client => client.id !== selectedClient?.id)
                                    .map((client) => (
                                        <button
                                            key={client.id}
                                            onClick={() => handleClientSelect(client)}
                                            className="w-full p-2 cursor-pointer text-left text-sm hover:bg-stone-100 transition-all"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Building size={14} />
                                                <span>{client.name}</span>
                                            </div>
                                        </button>
                                    ))
                            )}
                            {clients.length > 0 && 
                                clients.filter(client => client.id !== selectedClient?.id).length === 0 && (
                                <div className="p-2 text-stone-500 text-sm">
                                    No other clients available
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {/* Sidebar móvil con animación */}
            <AnimatePresence>
                <motion.aside 
                    className="fixed left-0 top-0 h-screen w-64 bg-stone-100 text-black z-50 flex flex-col md:hidden"
                    initial="closed"
                    animate={isSidebarOpen ? "open" : "closed"}
                    variants={sidebarVariants}
                    custom={isSidebarOpen}
                >
                    {/* Botón de cierre (solo visible en móvil) */}
                    <div className="flex justify-end p-2">
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 rounded-full hover:bg-stone-200"
                            aria-label="Close navigation menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="p-4 flex-grow">
                        <ul className="space-y-1 text-[14px]">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.id} 
                                    href={item.href} 
                                    className={`block p-2 hover:bg-stone-200 transition-all rounded ${activePage === item.id ? 'bg-stone-200' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    </nav>

                    <div className="relative p-4 border-t border-stone-200">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full p-2 flex items-center justify-between rounded hover:bg-stone-200 cursor-pointer transition-all"
                            disabled={isLoading}
                        >
                            <div className="flex items-center gap-2">
                                <Building size={16} />
                                <span className="font-medium text-sm">
                                    {isLoading ? 'Loading...' : activeClientName || 'Select a client'}
                                </span>
                            </div>
                            <svg
                                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute bottom-full left-0 w-[85%] ml-4 bg-white border border-stone-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-10">
                                <div
                                    className="block w-full p-2 text-[13px] font-medium text-stone-600 hover:bg-stone-100 transition-all border-b border-stone-100 cursor-pointer"
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        openModal();
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <PlusCircle size={14} />
                                        <span>Create new business</span>
                                    </div>
                                </div>
                                {clients.length === 0 ? (
                                    <div className="p-2 text-stone-500 text-sm">
                                        No clients available
                                    </div>
                                ) : (
                                    clients
                                        .filter(client => client.id !== selectedClient?.id)
                                        .map((client) => (
                                            <button
                                                key={client.id}
                                                onClick={() => handleClientSelect(client)}
                                                className="w-full p-2 cursor-pointer text-left text-sm hover:bg-stone-100 transition-all"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Building size={14} />
                                                    <span>{client.name}</span>
                                                </div>
                                            </button>
                                        ))
                                )}
                                {clients.length > 0 && 
                                    clients.filter(client => client.id !== selectedClient?.id).length === 0 && (
                                    <div className="p-2 text-stone-500 text-sm">
                                        No other clients available
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.aside>
            </AnimatePresence>
            
            {/* Espacio para compensar el sidebar en escritorio */}
            <div className="hidden"></div>
        </>
    );
}