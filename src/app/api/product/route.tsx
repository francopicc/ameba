import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are not set");
}

const supabase = createClient(
    supabaseUrl as string,
    supabaseKey as string
);

export async function POST (request: Request) {
    try {
        const { name, price, description, amount, category, owner_id } = await request.json();
        if (!name || !price || !description || !amount || !category || !owner_id) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('products')
            .insert({
                name,
                price,
                description,
                amount,
                category,
                owner_id,
                status : 'active'
            })
            .select();
        
        if (error) {
            console.error("Error: ", error);
            return NextResponse.json({ error: error.message, details: error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });

    } catch (err) {
        console.error("Error en el proceso:", err);
        return NextResponse.json({ 
            error: 'Invalid request data', 
            details: err instanceof Error ? err.message : String(err) 
        }, { status: 400 });
    }
}