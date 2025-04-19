import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 w-[90%] md:w-[50%] max-w-7xl bg-white border-1 border-stone-200 z-50 rounded-full px-4 md:px-6 py-3 md:py-4">
            <div className="flex justify-between items-center">
                <div className="text-base md:text-lg font-semibold">Ameba</div>
                <div className="flex items-center space-x-4 md:space-x-6">
                    <Link href={'/login'} className="bg-black text-xs md:text-sm text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-stone-800 transition-all cursor-pointer">
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        </nav>
    )
}
