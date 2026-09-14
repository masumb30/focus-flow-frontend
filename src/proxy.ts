import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the 'token' cookie attached by your Express backend
    const token = request.cookies.get('token')?.value;

    // 1. Authentication Check: If no token cookie, redirect to login
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Target all sub-routes of /dashboard and /createpost
    matcher: [
        // "/dashboard/:path*", 
        // "/createpost"
    ], 
};