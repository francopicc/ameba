"use client"
import { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { ReactNode } from 'react';

type ModalContent = {
  type: 'new-business' | 'edit-client' | 'delete-client';
  data?: any;
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
            <h2 className="text-xl font-semibold">Crear nuevo comercio</h2>
            {/* Aquí va tu formulario de nuevo negocio */}
            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="Nombre del comercio"
                className="w-full p-2 border rounded"
              />
              {/* Más campos según necesites */}
              <button 
                className="w-full bg-stone-800 text-white p-2 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  // Lógica para crear negocio
                }}
              >
                Crear Negocio
              </button>
            </form>
          </div>
        );

      case 'edit-client':
        return (
          <div>
            <h2 className="text-xl font-semibold">Editar cliente</h2>
            {/* Formulario de edición con los datos del cliente */}
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
      
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
        >
          {renderModalContent()}
        </Modal>
      )}
    </div>
  );
}