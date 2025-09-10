import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'


export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl


    // Public Routes 
    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') || 
        url.pathname.startsWith('/forget-password') 
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Protecting routes    
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    return NextResponse.next();
}


export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/forget-password',
        '/verify/:path*',
        '/dashboard/:path*',
        '/',
    ],
}