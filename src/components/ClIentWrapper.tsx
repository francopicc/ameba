"use client"
import { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { ReactNode } from 'react';

export default function ClientSideDashboard({ 
  children, 
  clients 
}: { 
  children: ReactNode, 
  clients: any[] 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <div className="flex">
      <Sidebar 
        clients={clients}
        activePage="home" 
        openModal={openModal}
      />
      <main className="flex-grow">
        {children}
      </main>
      
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h1>Hola</h1>
        </Modal>
      )}
    </div>
  );
}