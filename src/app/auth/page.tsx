"use client"
import { signWithGoogle } from "@/utils/actions"

export default function LoginPage () {
    return (
        <main>
            <div>
                <form>
                    <button formAction={signWithGoogle} className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign in with Google</button>
                </form>
            </div>
        </main>
    )
}