import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain"
import { StructuredOutputParser } from "langchain/output_parsers"
import z from "zod"

// Engineer prompt using the zod js schema lib
// Tells OpenAI what/how to format its response for consisentcy.
const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        mood: z
            .string()
            .describe("the mood of the person who wrote the journal entry."),
        subject: z.string().describe("the subject of the journal entry."),
        negative: z
            .boolean()
            .describe(
                "is the journal entry negative? (i.e. does it contain negative emotions?)."
            ),
        summary: z.string().describe("quick summary of the entire entry."),
        color: z
            .string()
            .describe(
                "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
            ),
        sentimentScore: z
            .number()
            .describe(
                "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
            ),
    })
)

const getPrompt = async (content) => {
    const format_instructions = parser.getFormatInstructions()

    const prompt = new PromptTemplate({
        template:
            "Analyze the following journal entry. Follow the intrusctions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
        inputVariables: ["entry"],
        partialVariables: { format_instructions },
    })

    const input = await prompt.format({
        entry: content,
    })

    return input
}

// Feed the prompt to OpenAI and grab/log/do something to the result.
// temperature = 'silliness' level. Level of accepted deviation from 'accepted' or 'accurate' responses in reality.
export const analyze = async (entry) => {
    console.log("Entry from analyze", entry)
    const input = await getPrompt(entry.content)
    const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" })
    const output = await model.call(input)

    console.log("Prompt Output", output)

    try {
        return parser.parse(output)
    } catch (e) {
        console.log("There was a problem: ", e)
    }
}
