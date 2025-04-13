import { NextResponse } from "next/server";

interface PaymentRequest {
    // Add properties based on your request body structure
}

export async function POST(request: Request): Promise<NextResponse> {
    return NextResponse.json({ message: "Success" });
}