import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Variables de entorno del lado del servidor
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Verifica si están definidas antes de crear el cliente
if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are not set");
}

// Crear cliente Supabase
const supabase = createClient(
    supabaseUrl as string,
    supabaseKey as string
);

export async function POST(request: NextRequest) {
    try {
        // Agregamos logging para depurar
        console.log("Iniciando solicitud POST");
        
        const data = await request.json();
        console.log("Datos recibidos:", data);
        
        const { name } = data;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        
        // Creamos el objeto de inserción
        const terminalData = {
            name,
            status: 'active',
            client_id: "48d41a5b-c5bf-436a-8f30-b16e2ee0bb38",
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        };
        
        console.log("Datos a insertar:", terminalData);
        
        const { data: insertedData, error } = await supabase
            .from('terminals')
            .insert(terminalData)
            .select(); // Agregamos select para ver los datos insertados

        if (error) {
            console.error("Error de Supabase:", error);
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