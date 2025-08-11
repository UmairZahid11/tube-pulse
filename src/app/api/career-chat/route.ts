import { NextRequest } from 'next/server'
import { streamCareerChat } from '../openai'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = await streamCareerChat(messages)

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          controller.enqueue(encoder.encode(content))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
