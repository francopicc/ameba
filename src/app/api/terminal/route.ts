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

export async function POST(request: NextRequest) {

    try {
        
        const data = await request.json();
        
        const { name } = data;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        
        const terminalData = {
            name,
            status: 'active',
            client_id: "48d41a5b-c5bf-436a-8f30-b16e2ee0bb38",
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