import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import {z} from "zod";


enum userRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

const updateUserSchema = z.object({
    username: z.string().min(1, "Username cannot be empty").max(255, "Username is too long"),
    password: z.string(),
    role: z.enum(Object.keys(userRole) as [keyof typeof userRole], {message: "User role must be either 'admin' or 'user'"})
})

export async function GET() {

    try {
        const response = await prisma.user.findMany();
    
        return NextResponse.json(response, {status: 201});
    } catch (e) {
        return NextResponse.json(e, {status: 400});
    }
    
}

export async function PUT(request: NextRequest) {
    const body = await request.json();

    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400});
    } else {
        const updatedUser = await prisma.user.update({
            where: {
                id: body.id
            },
            data: {
                password: body.password
            }
        })

        return NextResponse.json(updatedUser, {status: 200});
    }

}