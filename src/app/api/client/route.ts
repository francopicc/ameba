import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateSession } from "@/lib/auth/validate";
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are not set");
}

const supabase = createClient(
    supabaseUrl as string,
    supabaseKey as string
);

function generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
    const session = await validateSession()

    if (!session?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (name.length < 3 || name.length > 50 || name.trim() === '') {
            return NextResponse.json({ error: 'Name must be at least 3 characters long and less than 50 characters.' }, { status: 400 });
        }

        const regex = /^[a-zA-Z0-9 ]*$/;
        if (!regex.test(name)) {
            return NextResponse.json({ error: 'Name can only contain letters, numbers, and spaces.' }, { status: 400 });
        }

        const { count } = await supabase
            .from('clients')
            .select('*', { count: 'exact' })
            .eq('owner_id', session.id);

        if (count && count >= 3) {
            return NextResponse.json({ error: 'Maximum number of clients reached' }, { status: 400 });
        }

        const clientData = {
            name: name,
            api_key: generateApiKey(),
            owner_id: session.id,
        }
        

        const { data, error } = await supabase
            .from('clients')
            .insert(clientData)
            .select();

        if (error) throw error;
        
        return NextResponse.json(data);
        
    } catch (err) {
        console.error("Error en el proceso:", err);
        return NextResponse.json({ 
            error: 'Invalid request data', 
            details: err instanceof Error ? err.message : String(err) 
        }, { status: 400 });
    }
}