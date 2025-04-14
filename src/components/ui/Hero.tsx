"use client"
import { useEffect, useState } from "react"

export default function Hero () {
    const words = ['producto', 'software', 'servicio', 'solucion']
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
          setIsAnimating(true);
          setTimeout(() => {
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
            setIsAnimating(false);
          }, 500); // La mitad de la duración total para que cambie en medio de la animación
        }, 2000);
    
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mx-auto flex flex-col items-center justify-center h-screen -mt-[5em] -tracking-[0.75px]">
            <h1 className="text-4xl font-semibold w-[90%] md:w-[60%] text-center leading-[1]">
                Una forma eficiente de vender tu{' '}
                <span className="inline-block relative">
                    <span className="invisible">{words.reduce((a, b) => a.length > b.length ? a : b)}</span>
                    <span 
                        className={`absolute left-0 top-0 bg-gradient-to-r from-stone-400 to-stone-600 bg-clip-text text-transparent transition-opacity duration-500 ${
                        isAnimating ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        {words[currentWordIndex]}
                    </span>
                </span>
            </h1>
            <span className="text-stone-300 font-light w-[90%] md:w-[60%] text-center leading-[1] mt-3">Ameba es un proyecto que permite a freelancers y comercios vender comodamente sus productos.</span>
            <div className="flex items-center justify-center mt-6 w-[90%] md:w-[60%] space-x-3">
                <button className="bg-black text-sm text-white px-4 py-2 rounded-full hover:bg-stone-800 transition-all cursor-pointer">
                    Iniciar Sesión
                </button>
                <button className="bg-white border-1 border-black text-black text-sm px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all cursor-pointer">
                    Conocer mas
                </button>
            </div>
        </div>
    )
}