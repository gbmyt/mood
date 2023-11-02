import { analyze } from "@/utils/ai"
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

    const analysis = await analyze(updatedEntry)
    const updatedAnalysis = await prisma.analysis.upsert({
        where: {
            entryId: updatedEntry.id,
        },
        create: {
            entryId: updatedEntry.id,
            ...analysis,
        },
        update: analysis,
    })
    console.log("New Analysis?", updatedAnalysis)

    return NextResponse.json({ data: updatedEntry })
}
