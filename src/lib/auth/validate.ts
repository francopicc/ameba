
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function validateSession() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  return user
}
