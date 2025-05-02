import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import prisma from "../../../../../prisma/client";
import { UserLock } from "lucide-react";


enum userRole {
    ADMIN = "ADMIN",
    USER = "USER"
  }

const createNewUserSchema = z.object({
    username: z.string().min(1, "Username cannot be empty").max(255, "Username is too long"),
    password: z.string(),
    role: z.enum(Object.keys(userRole) as [keyof typeof userRole], {message: "User role must be either 'admin' or 'user'"})
})

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createNewUserSchema.safeParse(body);
  const existUser = await prisma.user.findFirst({where: {username: body.username}});

  if (existUser !== null) {
    return NextResponse.json("User exists", {status: 400});
  }

  if (!validation.success) {

    return NextResponse.json(validation.error.errors, {status: 400});
  } else {
    const password = body.password;
    try {
      const newUser = await prisma.user.create({
          data: {
              username: body.username,
              password: password,
              role: body.role
          }
      })
  
      return NextResponse.json(newUser, {status: 201});
    } catch (error) {

      return NextResponse.json(error, {status:400})
      
    }
  }

}
