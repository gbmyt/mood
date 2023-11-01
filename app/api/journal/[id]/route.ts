import { getUserByClerkId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, { params }) => {
    const { content } = await request.json() // get the request body from web standard Request obj
    const user = await getUserByClerkId()

    const updatedEntry = await prisma.journalEntry.update({
        where: {
            userId_id: {
                userId: user.id,
                id: params.id,
            },
        },
        data: {
            content,
        },
    })
    return NextResponse.json({ data: updatedEntry })
}
