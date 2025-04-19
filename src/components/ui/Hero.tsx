"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Hero() {
    const words = ['producto', 'software', 'servicio', 'solución']
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }, 2500)
    
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="mx-auto flex flex-col items-center justify-center h-screen -mt-20 -tracking-[0.75px]">
            <motion.h1 
                className="text-4xl font-semibold w-[90%] md:w-[60%] text-center leading-[1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Una forma eficiente de vender tu{' '}
                <span className="inline-block relative">
                    <span className="invisible">{words.reduce((a, b) => a.length > b.length ? a : b)}</span>
                    <AnimatePresence mode="wait">
                        <motion.span 
                            key={words[currentWordIndex]}
                            className="absolute left-0 top-0 bg-gradient-to-r from-stone-400 to-stone-600 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            {words[currentWordIndex]}
                        </motion.span>
                    </AnimatePresence>
                </span>
            </motion.h1>
            
            <motion.span 
                className="text-stone-300 font-light w-[90%] md:w-[60%] text-center leading-[1] mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                Ameba es un proyecto que permite a freelancers y comercios vender cómodamente sus productos.
            </motion.span>
            
            <motion.div 
                className="flex items-center justify-center mt-6 w-[90%] md:w-[60%] space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <motion.button 
                    className="bg-black text-sm text-white px-4 py-2 rounded-full hover:bg-stone-800 transition-all cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Iniciar Sesión
                </motion.button>
                
                <motion.button 
                    className="bg-white border border-black text-black text-sm px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Conocer más
                </motion.button>
            </motion.div>
        </div>
    )
}