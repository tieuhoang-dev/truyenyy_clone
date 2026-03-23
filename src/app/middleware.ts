// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const payload = verifyToken(token)

        const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
        if (isAdminRoute && payload.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        return NextResponse.next()
    } catch (err) {
        console.error(err);
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/admin/:path*',
        '/create-story/:path*',
        '/edit-story/:path*',
    ],
}
