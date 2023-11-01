import { getUserByClerkId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

// handle post requests to api/journal
export const POST = async () => {
    const user = await getUserByClerkId()
    const entry = await prisma.journalEntry.create({
        data: {
            userId: user.id,
            content: "Write about your day",
        },
    })
    revalidatePath("/journal") // auto refresh UI on create new entry action
    return NextResponse.json({ data: entry })
}
