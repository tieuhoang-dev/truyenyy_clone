// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    // Không có token => chuyển về login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Decode token để lấy role (giả sử JWT chứa role)
    try {
        const payload = verifyToken(token)

        const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
        if (isAdminRoute && payload.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        // Cho phép đi tiếp
        return NextResponse.next()
    } catch (err) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

// Chỉ áp dụng middleware với các route sau:
export const config = {
    matcher: [
        '/profile/:path*',
        '/admin/:path*',
        '/create-story/:path*',
        '/edit-story/:path*',
    ],
}
