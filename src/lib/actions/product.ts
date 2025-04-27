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
        throw new Error((error as Error).message)
      }

      return data
}

export async function getProductInformation ({ id } : {id: string}) {
      const cookieStore = await cookies()

      if(!id) {
        throw new Error('Product ID is required')
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
        .eq('id', id)
        .single()

      if(error) {
        console.error("Error: ", error)
        throw new Error((error as Error).message)
      }

      return data
}

export async function deleteProduct ({ owner_id, id }: { owner_id: string, id: string }) {
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
        .delete()
        .eq('owner_id', owner_id)
        .eq('id', id)
        

      if(error) {
        console.error("Error: ", error)
        throw new Error((error as Error).message)
      }

      return data
}

export async function editProduct ({ owner_id, id, name, description, amount }: { owner_id: string; id: string; name: string; description: string; amount: number }) {
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
          .update({ name, description, amount })
          .eq('owner_id', owner_id)
          .eq('id', id)
          .select()
  
        if(error) {
          console.error("Error: ", error)
          throw new Error((error as Error).message)
        }
  
        return data
}

export async function addProduct ({ owner_id, name, description, amount }: { owner_id: string; name: string; description: string; amount: number }) {
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
        .insert({ owner_id, name, description, amount })
        .select()

      if(error) {
        console.error("Error: ", error)
        throw new Error((error as Error).message)
      }

      return data
}