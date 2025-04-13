"use server"

import { redirect } from "next/navigation"
import { createClient } from "./supabase/server"

const signWithGoogle = async () => {
        const supabase = await createClient()

        const auth_callback_url = `${process.env.NEXT_PUBLIC_URL}/api/auth/callback`
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: auth_callback_url,
                scopes: 'email',
            },
        })

        if (!data.url) {
            throw new Error('Authentication URL is missing');
        }

        redirect(data.url)
}

export { signWithGoogle }