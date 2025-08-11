'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendHorizonal, Loader2, Divide, PackageOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: number
  sender: 'user' | 'agent'
  text: string
}

export default function CareerChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage: Message = { id: Date.now(), sender: 'user', text: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const agentMessage: Message = { id: Date.now() + 1, sender: 'agent', text: '' }
    setMessages((prev) => [...prev, agentMessage])

    try {
      const res = await fetch('/api/career-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let done = false
      let fullText = ''

      while (!done && reader) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        fullText += chunkValue

        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, text: fullText } : msg
          )
        )
      }
    } catch (err) {
      console.error('Streaming error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-5">
        <h3>AI Career Chat</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum
          excepturi quibusdam repudiandae error dolores voluptas!
        </p>
      </div>

      <div className="flex items-center justify-center p-4">
        <Card className="w-full flex flex-col h-[75vh] bg-foreground">
          <CardContent className="flex-1 overflow-y-auto scroll-0 space-y-2 p-4">
            {messages.length <= 0 && (
              <div className='flex flex-col gap-3 items-center justify-center py-10'>
                <PackageOpen className='text-gray-600' size={70} />
                <h4 className='text-center !text-gray-600'>Start Chating to get career advice</h4>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] chat-msg ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-600 !text-white rounded-bl-none'
                  }`}
                >
                  {msg.sender !== 'user' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {/* Invisible element to scroll to */}
            <div ref={bottomRef} />
          </CardContent>

          <div className="flex items-center p-4 border-t border-gray-300 gap-2">
            <Input
              placeholder="Ask a career question..."
              className="flex-1 h-auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <Button
              variant={'ghost'}
              className='w-[50px] h-[50px] p-1 bg-primary text-white hover:bg-primary'
              onClick={handleSend}
              size="icon"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={30} />
              ) : (
                <SendHorizonal size={30} />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}