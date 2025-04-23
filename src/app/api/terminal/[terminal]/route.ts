import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getProductInformation } from "@/lib/actions/product";

export async function GET(request: Request, { params }: { params: { terminal: string } }) {
    const { terminal } = await params

    if (!terminal) {
        return new Response("Terminal ID is required", { status: 400 })
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase environment variables are not set")
    }

    const supabase = createClient(
        supabaseUrl as string,
        supabaseKey as string
    )

    const { data, error } = await supabase
        .from('terminals')
        .select('*')
        .eq('url_id', terminal)
        .single()


    if(!data) {
        return new Response("Terminal not found", { status: 404 })
    }

    if (error) {
        console.error("Error: ", error)
        return new Response(error.message, { status: 400 })
    }

    const product = await getProductInformation({ id: data.product_id })

    if (!product) {
        return new Response("Product not found", { status: 404 })
    }


    return NextResponse.json({ success: true, data, product })
}