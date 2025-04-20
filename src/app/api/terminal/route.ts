import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getProductInformation } from "@/lib/actions/product";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are not set");
}

const supabase = createClient(
    supabaseUrl as string,
    supabaseKey as string
);

export async function POST(request: NextRequest) {

    try {
        
        const data = await request.json();

        if (!data) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const { id } = data;

        const { owner_id } = await getProductInformation({ id });
        
        if (!owner_id) {
            return NextResponse.json({ error: 'Product not found or owner not found.' }, { status: 404 });
        }


        if (!id) {
            return NextResponse.json({ error: 'Data Error' }, { status: 400 });
        }
        
        const terminalData = {
            product_id: id,
            client_id: owner_id,
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        };
        
        const { data: insertedData, error } = await supabase
            .from('terminals')
            .insert(terminalData)
            .select();

        if (error) {
            console.error("Error: ", error);
            return NextResponse.json({ error: error.message, details: error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: insertedData });
    } catch (error) {
        console.error("Error en el proceso:", error);
        return NextResponse.json({ 
            error: 'Invalid request data', 
            details: error instanceof Error ? error.message : String(error) 
        }, { status: 400 });
    }
}