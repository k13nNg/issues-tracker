import { NextRequest, NextResponse } from "next/server";
import { updateSession, getSession } from "./app/authentication";


export async function middleware(req: NextRequest) {
    const body = req.headers.get("Authorization");
    const session = await getSession();

    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (session !== null && session.user.role === "ADMIN") {
            return await updateSession(req);
        } else {
            return NextResponse.redirect(`${process.env.BASE_URL}`);
        }
    }


    if (req.nextUrl.pathname.startsWith("/api")){

        if (body === process.env.API_KEY) {
    
            // retrieve the current response
            return await updateSession(req)
    
        } else {

            return NextResponse.json("Unauthorized access", {status: 400})
        }
    }
}

export const config = {
    matcher: ["/api/:path*", "/admin", "/admin/:path*"]
}