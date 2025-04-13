'use server'

import { cookies } from 'next/headers'

export async function setActiveClient(clientId: string) {
  const cookieStore = await cookies()
  cookieStore.set("active_client_id", clientId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    httpOnly: false, // true si no querés que se lea del frontend
  })
}
