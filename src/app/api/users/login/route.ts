import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function POST (request: NextRequest){
    const body = await request.json();

    const user = await prisma.user.findFirst({where: {username: body.username}})
    console.log("asdf")
    if (!user) {
        return NextResponse.json("User does not exist!", {status: 400})
    }
    else {

        const response = {
            username: user.username,
            userRole: user.role,
            password: user.password
        }
        return NextResponse.json(response, {status: 200})
    }
   
}