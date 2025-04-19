'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function setActiveClient(clientId: string) {
  if (!clientId) throw new Error('Client ID is required')

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  // Set the client ID cookie
  cookieStore.set("active_client_id", clientId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user?.id) {
    throw new Error('No active session found - Please log in first')
  }

  // Check if owner_id of clients coincides with user_id it needs to return true or false
  const { data } = await supabase
    .from('clients')
    .select('owner_id')
    .eq('id', clientId)
    .single()
  
  if(!data) {
    throw new Error('Client not found')
  }
  
  const { error } = await supabase.auth.admin.updateUserById(session.user.id, {
    user_metadata: { active_client_id: clientId }
  })

  if (error) {
    throw new Error(`Failed to update user session: ${error.message}`)
  }
  
  return { success: true }
}

export async function getActiveClient() {
  const cookieStore = await cookies()
  const activeClientId = cookieStore.get('active_client_id')?.value

  if (!activeClientId) {
    throw new Error('No active client ID found')
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('id', activeClientId)
    .single()

  return data.name
}