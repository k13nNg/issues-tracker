"use server"
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const jwtKey = process.env.JWT_KEY;
const signingKey = new TextEncoder().encode(jwtKey);

interface User {
    username: string;
    userRole: string;
}

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("1 hour from now")
        .sign(signingKey);
}

export async function decrypt(input: string): Promise<any> {
    // const {payload} = await jwtVerify(input, signingKey, {
    //     algorithms: ["HS256"],
    // });
    // return payload;
    try {
        const { payload } = await jwtVerify(input, signingKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (err) {
        console.error("JWT verification failed:", err);
        throw new Error("Invalid token");
    }
}

export async function login(data: User) {
    // create a new session
    const user = {
        username: data.username,
        role: data.userRole
    };

    const expires = new Date(Date.now() + (1 * 60 * 60 *1000))

    const session = await encrypt({user, expires});

    // save the session in a cookie
    (await cookies()).set("session", session, { expires, httpOnly: true});

}

export async function logout() {
    // Destroy the session
    (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    
    if (!session) return null;

    return await decrypt(session);
  }
  
export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    
    parsed.expires = new Date(Date.now() + 10 * 1000);
    
    // enable CORS
    const res = NextResponse.next();
    
    // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', '*') 
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });

    return res;
}