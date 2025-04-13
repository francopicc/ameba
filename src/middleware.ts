import { NextResponse } from "next/server";
import { validateSession } from "./lib/validate";

let isLogged = false

export async function middleware (request: Request) {
    const session = await validateSession()
    if (session !== null) {
        isLogged = true
    }
    if (!isLogged) {
        // Check if the path starts with /api
        if (request.url.includes('/api')) {
            return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next()
}

export const config = {
    matcher: ['/api/:path*', '/dashboard/:path*', '/terminal/:path*', '/settings/:path*'],
}