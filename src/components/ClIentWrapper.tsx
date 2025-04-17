"use client"
import { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { ReactNode } from 'react';
import { setActiveClient } from '@/lib/actions/client';

type ModalContent = {
  type: 'new-business' | 'edit-client' | 'delete-client';
  data?: any;
}

type ToastState = {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

export default function ClientSideDashboard({ 
  children, 
  clients 
}: { 
  children: ReactNode, 
  clients: any[] 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para el toast
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Función para mostrar toast
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  // Función para cerrar toast
  const closeToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const openModal = (content: ModalContent) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const renderModalContent = () => {
    if (!modalContent) return null;

    switch (modalContent.type) {
      case 'new-business':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Create a New Business</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder="Business Name"
                className="w-full p-2 border rounded"
                onChange={(e) => setName(e.target.value)}
              />
              <button 
                className="w-full text-[13.5px] cursor-pointer bg-stone-800 text-white p-2 rounded disabled:opacity-50"
                onClick={async (e) => {
                  setIsLoading(true);
                  try {
                    const response = await fetch('/api/client', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ name }),
                    });
                    
                    if (!response.ok) throw new Error('Network response was not ok');
                    
                    const data = await response.json();
                    closeModal();
                    await setActiveClient(data[0].id);
                    
                    // Mostrar toast de éxito
                    showToast(`Business "${name}" created successfully!`, 'success');
                    
                    // Recargar después de un breve retraso para que se vea el toast
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                    
                  } catch (error) {
                    console.error('Error:', error);
                    // Mostrar toast de error
                    showToast(`Error creating business: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Business'}
              </button>
            </form>
          </div>
        );

      case 'edit-client':
        return (
          <div>
            <h2 className="text-xl font-semibold">Editar cliente</h2>
            <pre>{JSON.stringify(modalContent.data, null, 2)}</pre>
          </div>
        );

      case 'delete-client':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-red-600">Eliminar cliente</h2>
            <p>¿Estás seguro que deseas eliminar este cliente?</p>
            <div className="flex space-x-2">
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  // Lógica para eliminar
                  showToast('Cliente eliminado correctamente', 'success');
                  closeModal();
                }}
              >
                Eliminar
              </button>
              <button 
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="flex">
      <Sidebar 
        clients={clients}
        activePage="home" 
        openModal={() => openModal({ type: 'new-business' })}
      />
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Modal */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
        >
          {renderModalContent()}
        </Modal>
      )}
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={closeToast}
        duration={5000}
      />
    </div>
  );
}