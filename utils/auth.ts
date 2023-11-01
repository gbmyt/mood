import { auth } from "@clerk/nextjs"
import { prisma } from "./db"

export const getUserByClerkId = async (opts = {}) => {
    const { userId } = await auth()

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            clerkId: userId,
        },
        select: opts.select || undefined,
        includes: opts.includes || undefined,
    })

    return user
}
