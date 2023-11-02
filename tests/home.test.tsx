import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import Home from "../app/page.tsx"

vi.mock("@clerk/nextjs", () => {
    return {
        auth: () =>
            new Promise((resolve) =>
                resolve({ userId: "rastes_aidenarsietndsre" })
            ),
        ClerkProvider: ({ children }) => <>{children}</>,
        useUser: () => ({
            isSignedIn: true,
            user: {
                id: "rastes_aidenarsietndsre",
                fullName: "Charles Harris",
            },
        }),
    }
})

test("Home", async function () {
    render(await Home())
    expect(screen.getByText("get started")).toBeTruthy()
})
