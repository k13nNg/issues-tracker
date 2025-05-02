import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcryptjs";

export async function POST (req: NextRequest) {
    const body = await req.json();

    const user = await prisma.user.findUnique({ where:
        {username: body.username}
    })

    if (user === null) {
        return NextResponse.json("User does not exist", {status: 400});
    } else {
        return NextResponse.json(user, {status: 201});
    }
}

export async function PUT (req: NextRequest) {
    const body = await req.json();

    const user = await prisma.user.findUnique({ where:
        {username: body.username}
    })

    if (user === null) {
        return NextResponse.json("User does not exist", {status: 400});
    } else {
      

        try {
            const newUser = await prisma.user.update(
                {where: {
                    username: body.username
                },
                data: {
                    password: body.password
                }}
            )
        
            return NextResponse.json(newUser, {status: 201});
        } catch (error) {

            return NextResponse.json(error, {status:400})
            
            }

    }
}