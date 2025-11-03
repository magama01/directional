import {auth} from './auth'
import {NextResponse} from "next/server";


export default auth(async function proxy(req) {
    const isLoggedIn = !!req.auth;
    if (!isLoggedIn) {
        const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;
        const url = new URL(`/sign`, req.nextUrl.origin);
        url.searchParams.set('callbackUrl', callbackUrl);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
})

export const config = {
    matcher: [
        '/board/:path*',
    ],
};
