"use client"
import Navbar from "@/components/ui/Navbar"
import { signWithGoogle } from "@/utils/actions"

export default function LoginPage() {
    return (
        <main>
            <Navbar />
            <div className="flex flex-col items-center min-h-screen mt-[15em] -tracking-[0.75px]">
                <div className="w-full max-w-md">
                    <form>
                        <button 
                            formAction={signWithGoogle} 
                            className="w-full px-4 py-3 border border-stone-200 rounded-lg cursor-pointer text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                        >
                            Continuar con Google
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}