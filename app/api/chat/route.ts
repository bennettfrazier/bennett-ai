import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if we have the required API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY is not set" }), { status: 500 })
    }

    // Stream the response from Claude
    const result = streamText({
      model: anthropic("claude-3-7-sonnet-20250219"),
      messages,
      // Claude-specific options
      providerOptions: {
        anthropic: {
          thinking: { type: "enabled", budgetTokens: 12000 },
        },
      },
    })

    // Return the response as a stream with reasoning
    return result.toDataStreamResponse({
      sendReasoning: true,
    })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return new Response(JSON.stringify({ error: "An error occurred processing your request" }), { status: 500 })
  }
}
