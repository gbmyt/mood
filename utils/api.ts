import { OpenAI } from "langchain"
import { Document } from "langchain/document"
import { loadQARefineChain } from "langchain/chains"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"

const createURL = (path: string) => {
    return window.location.origin + path
}

export const updateEntry = async (id, content) => {
    const res = await fetch(
        new Request(createURL(`/api/journal/${id}`), {
            method: "PATCH",
            body: JSON.stringify({ content }),
        })
    )

    if (res.ok) {
        const data = await res.json()
        return data.data
    }
}

// Request args are the url, and then a config or 'options' object
export const createNewEntry = async () => {
    const res = await fetch(
        new Request(createURL("/api/journal"), {
            method: "POST",
        })
    )

    if (res.ok) {
        const data = await res.json()
        return data.data
    }

    // handle errors todo
}

export const qa = async (question: string, entries) => {
    const docs = entries.map((entry) => {
        return new Document({
            pageContent: entry.content,
            metadata: {
                id: entry.id,
                createdAt: entry.createdAt,
            },
        })
    })

    const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" })
    const chain = loadQARefineChain(model)
    const embeddings = new OpenAIEmbeddings() // group of vectors
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
    const relevantDocs = await store.similaritySearch(question)

    const res = await chain.call({
        input_documents: relevantDocs,
        question,
    })

    return res.output_text
}

export const askQuestion = async (question) => {
    const res = await fetch(new Request(createURL("/api/question")), {
        method: "POST",
        body: JSON.stringify({ question }),
    })
    if (res.ok) {
        const data = await res.json()
        return data.data
    }
}
