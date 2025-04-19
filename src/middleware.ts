import { NextResponse } from "next/server";
import { validateSession } from "./lib/auth/validate";

export async function middleware (request: Request) {
    const session = await validateSession()
    if (session === null) {
        const url = new URL(request.url)
        if (url.pathname.startsWith('/api')) {
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