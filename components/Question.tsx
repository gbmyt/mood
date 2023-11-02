"use client"

import { askQuestion } from "@/utils/api"
import { useState } from "react"

const Question = () => {
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const answer = await askQuestion(value)

        setValue("")
        setLoading(false)
        setResponse(answer)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    disabled={loading}
                    onChange={(e) => setValue(e.target.value)}
                    className="border border-black/20 px-4 py-2 mr-2 text-lg rounded-lg"
                    value={value}
                    type="text"
                    placeholder="Ask a question"
                />
                <button
                    disabled={loading}
                    type="submit"
                    className="bg-blue-400 px-4 py-2 rounded-lg text-lg"
                >
                    Ask
                </button>
            </form>
            {loading && <>Loading...</>}
            {response && <>{response}</>}
        </>
    )
}

export default Question
