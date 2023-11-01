import { PromptTemplate } from "langchain"
import { OpenAI } from "langchain/llms/openai"
import { StructuredOutputParser } from "langchain/output_parsers"
import z from "zod"

// Engineer prompt using the zod js schema lib
// Tells OpenAI what/how to format its response for consisentcy.
const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        mood: z
            .string()
            .describe("the mood of the person who wrote the journal entry."),
        subject: z.string().describe("the subject of the entry"),
        summary: z.string().describe("quick summary of the entire entry."),
        color: z
            .string()
            .describe(
                "A hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
            ),
        negative: z
            .boolean()
            .describe(
                "is the journal entry negative? (i.e. does it contain negative emotions?)"
            ),
    })
)

const getPrompt = async (content) => {
    // use the parser to get formatting instructions
    const format_instructions = parser.getFormatInstructions()

    // Preemptively feed langchain a template for the prompt
    const prompt = new PromptTemplate({
        template:
            "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n {format_instructions}\n{entry}",
        inputVariables: ["entry"],
        partialVariables: { format_instructions },
    })

    // format the prompt using user-generated content and return result
    const input = await prompt.format({
        entry: content,
    })
    console.log("Input was:", input)

    return input
}

// Feed the prompt to OpenAI and grab/log/do something to the result.
// temperature = 'silliness' level. Level of accepted deviation from 'accepted' or 'accurate' responses in reality.
export const analyze = async (entry) => {
    const input = await getPrompt(entry.content)
    const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" }) // default modelName 4 costs $$
    const result = await model.call(input)

    // console.log("Prompt Result", result)

    try {
        return parser.parse(result)
    } catch (e) {
        console.log("There was a problem: ", e)
    }
}
