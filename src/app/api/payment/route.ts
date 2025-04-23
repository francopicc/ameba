import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { getProducts } from "@/lib/actions/product";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are not set");
}

const supabase = createClient(
    supabaseUrl as string,
    supabaseKey as string
);

interface PaymentRequest {
  client_id: string;
  amount: number;
  callback_url?: string;
  currency?: string;
  product_id?: string;
  email?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: PaymentRequest = await request.json();
    console.log(body)
    if (!body.client_id || !body.amount || !body.callback_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify client exists
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', body.client_id)
      .single();
      
    if (clientError || !clientData) {
      return NextResponse.json(
        { error: "Invalid client_id: Client not found" },
        { status: 404 }
      );
    }

    // Create payment only if the product validation passed
    const { data, error } = await supabase
      .from('payments')
      .insert({
        client_id: body.client_id,
        amount: body.amount,
        status: 'approved', 
        callback_url: body.callback_url,
        currency: body.currency,
        product_id: body.product_id,
        email: body.email,
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating payment:", error);
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: "Payment created successfully",
      payment: data
    }, { status: 201 });
    
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}