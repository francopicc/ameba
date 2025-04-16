"use server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function getProducts ({ owner_id }: { owner_id: string }) {
      const cookieStore = await cookies()

      if(!owner_id) {
        throw new Error('Owner ID is required')
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
    
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', owner_id)
        .order('created_at', { ascending: false })
    
      if(!data) {
        throw new Error('No products found')
      }

      if(error) {
        console.error("Error: ", error)
        throw new Error(error)
      }
      console.log(data)
      return data
}