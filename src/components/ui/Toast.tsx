"use client"
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastProps = {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
};

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: 50 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -50, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-4 right-4 z-99 p-4 rounded-md text-black border-1 border-stone-300 shadow-lg max-w-md`}
                >
                    <div className="flex justify-between items-center">
                        <p>{message}</p>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}