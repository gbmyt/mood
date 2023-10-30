import { prisma } from "@/utils/db"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const createNewUser = async () => {
    // Get the clerk user
    const user = await currentUser()

    // check if the user exists in our db already
    const match = await prisma.user.findUnique({
        where: {
            clerkId: user.id as string,
        },
    })

    // Create one if not
    if (!match) {
        await prisma.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
            },
        })
    }
    redirect("/journal")
}

const NewUser = async () => {
    await createNewUser()
    return <>new user</>
}

export default NewUser
