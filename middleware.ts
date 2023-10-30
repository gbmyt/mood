import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
    publicRoutes: ["/"], // routes to NOT protect with auth
})

export const config = {
    matcher: ["/((?!.*\\..*|next).*)", "/", "/(api|trpc)(.*)"],
}
