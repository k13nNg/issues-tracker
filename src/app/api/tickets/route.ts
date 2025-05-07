import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import prisma from "../../../../prisma/client";

const createNewIssueSchema = z.object({
    title : z.string().min(1, "Title cannot be empty").max(255, "Title cannot exceed 255 characters"),
    desc: z.string().min(1, "Description cannot be empty"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"], {message: "Priority must be one of 'LOW', 'MEDIUM', or 'HIGH'"}),
})

const updateIssueSchema = z.object({
    id: z.string(),
    title : z.string().min(1, "Title cannot be empty").max(255, "Title cannot exceed 255 characters"),
    desc: z.string().min(1, "Description cannot be empty"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"], {message: "Priority must be one of 'LOW', 'MEDIUM', or 'HIGH'"}),
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"], {message: "Priority must be one of 'OPEN', 'IN_PROGRESS', or 'CLOSED'"})
})

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createNewIssueSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400});
    } else {
        try {
            const newIssue = await prisma.ticket.create({
                data: {
                    title: body.title,
                    desc: body.desc,
                    priority: body.priority,
                    author: body.author,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }
            })
    
            return NextResponse.json(newIssue, {status: 201});
        } catch (error) {
            return NextResponse.json(error, {status: 400})
        }
    }

}

export async function GET() {
    const allIssues = await prisma.ticket.findMany();

    return NextResponse.json(allIssues, {status: 200});
}

export async function PUT(request: NextRequest) {
    const body = await request.json();

    const validation = updateIssueSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400});
    } else {
        const updatedIssue = await prisma.ticket.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                desc: body.desc,
                status: body.status,
                priority: body.priority,
                updatedAt: Date.now(),
            }
        })

        return NextResponse.json(updatedIssue, {status: 200});
    }

}

export async function DELETE(request: NextRequest) {
    const data = await request.json();

    const deletedTicket = await prisma.ticket.delete({
        where: {
            id: data.ticket.id
        }
    })



    return NextResponse.json(deletedTicket, {status: 200});
}