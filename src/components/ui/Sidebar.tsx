"use client"
import { useState, useEffect } from 'react';
import { setActiveClient } from '@/lib/actions/client';
import { getSession } from '@/lib/auth/session';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface Client {
    id: string
    name: string
}

export default function Sidebar({ 
  clients, 
  activePage, 
  openModal // Nuevo prop para abrir el modal
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

    return (
        <aside 
            className="fixed left-0 top-0 h-screen w-64 bg-stone-100 text-black transition-transform duration-300 ease-in-out translate-x-0 flex flex-col"
        >
            <nav className="p-4 flex-grow">
                <ul className="space-y-1 text-[14px]">
                    <Link href="/dashboard" className={`block p-2 hover:bg-stone-200 transition-all rounded ${activePage === 'home' ? 'bg-stone-200' : ''}`}>
                            Home
                    </Link>
                    <Link href="/dashboard/customers" className={`block p-2 hover:bg-stone-200 transition-all rounded ${activePage === 'customers' ? 'bg-stone-200' : ''}`}>
                            Customers
                    </Link>
                    <Link href="/dashboard/payments" className={`block p-2 hover:bg-stone-200 transition-all rounded ${activePage === 'payments' ? 'bg-stone-200' : ''}`}>
                            Payments
                    </Link>
                    <Link href="/dashboard/products" className={`block p-2 hover:bg-stone-200 transition-all rounded ${activePage === 'products' ? 'bg-stone-200' : ''}`}>
                            Products
                    </Link>
                    <Link href="/dashboard/settings" className={`block p-2 hover:bg-stone-200 transition-all rounded ${activePage === 'settings' ? 'bg-stone-200' : ''}`}>
                            Settings
                    </Link>
                </ul>
            </nav>

            <div className="relative p-4 border-t border-stone-200">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full p-2 flex items-center justify-between rounded hover:bg-stone-200 cursor-pointer transition-all"
                    disabled={isLoading}
                >
                    <span className="font-medium text-sm">
                        {isLoading ? 'Loading...' : activeClientName || 'Select a client'}
                    </span>
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
                        <p
                            className="block w-full p-2 text-[13px] font-medium text-stone-600 hover:bg-stone-100 transition-all border-b border-stone-100"
                            onClick={() => {
                                setIsDropdownOpen(false);
                                openModal(); // Usar la función recibida como prop
                            }}
                        >
                            Create new business
                        </p>
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
                                        {client.name}
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
    );
}