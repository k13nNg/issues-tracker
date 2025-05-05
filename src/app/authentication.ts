"use server"
import axios from "axios";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
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
        .setExpirationTime(payload.expires)
        .sign(signingKey);
}

export async function decrypt(input: string): Promise<any> {
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

export async function authenticateUser(username: string, passwordToCheck: string) {
    try {
      const response = await axios.post(
        `${process.env.BASE_URL}/api/users/login`,
        { username },
        { headers: { Authorization: process.env.API_KEY } }
      );
  
      if (response.data && response.data.password) {
        if (bcrypt.compareSync(passwordToCheck, response.data.password)) {
          await createSession(response.data);
          
          return {success: "Login Successfully!", userRole: response.data.userRole};

        } else {
          return { error: 'Incorrect Password!' };
        }
      } else {
        return { error: 'Login failed: Invalid response from server.' };
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      return { error: error.message || 'An unexpected error occurred.' };
    }
  }

export async function createSession(data: User) {
    const now = Date.now();
    const sessionStart = new Date(now);
    const expires = new Date(now + (1 * 60 * 60 * 1000)); // 1 hour from now

    const user = {
        username: data.username,
        role: data.userRole
    };

    const session = await encrypt({ user, expires, sessionStart });

    (await cookies()).set("session", session, { expires, httpOnly: true });
}

export async function logout() {
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

    let parsed;
    try {
        parsed = await decrypt(session);
    } catch (e) {
        return e;
    }

    const maxSessionDuration = 24 * 60 * 60 * 1000; // 1 day
    const now = Date.now();
    const sessionStart = new Date(parsed.sessionStart).getTime();
    const timeElapsed = now - sessionStart;

    if (timeElapsed > maxSessionDuration) {
        const res = NextResponse.redirect("/login");
        res.cookies.set("session", "", { expires: new Date(0) });
        return res;
    }

    const newExpiry = new Date(now + 60 * 60 * 1000); // extend by 1 hour
    parsed.expires = newExpiry;

    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
    res.headers.set(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: newExpiry,
    });

    return res;
}
