import { motion } from 'framer-motion';

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[100]"
        >
            <div 
                className="fixed inset-0 z-[50] bg-black/50" 
                onClick={onClose}
            />
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative z-[90] bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};