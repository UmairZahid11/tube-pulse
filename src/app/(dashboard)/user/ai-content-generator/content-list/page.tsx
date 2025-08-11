'use client'

import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'

type ContentType = {
  titles: { title: string; seo_score: number }[]
  description: string
  tags: string[]
  image_prompts: { heading: string; prompt: string }[]
}

interface RawAiContent {
  id: number
  userId: number
  prompt: string
  content: string
  image_url: string
  created_at: string
}

interface AiContent extends Omit<RawAiContent, 'content'> {
  content: ContentType
}

const AiContentList = () => {
  const [data, setData] = useState<AiContent[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()

  const userId = session?.user?.id

  useEffect(() => {
    const fetchAiContent = async () => {
      try {
        const res = await axios.get(`/api/ai-content-generator/${userId}`)
        const rawData: RawAiContent[] = res.data.data

        // Safely parse each content string to JSON
        const parsedData: AiContent[] = rawData.map((item) => ({
          ...item,
          content: JSON.parse(item.content),
        }))

        setData(parsedData)
      } catch (error) {
        console.error('Error fetching AI content:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated' && userId) {
      fetchAiContent()
    }
  }, [status, userId])

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <div className="flex flex-col space-y-3" key={index}>
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )

  if (data.length === 0) return <p className="text-center p-4">No content found.</p>

  return (
    <div className="grid gap-4 grid-cols-1">
        <Accordion type="single" collapsible>
        {data.map((item, index) => (
            <AccordionItem value={`item-${index+ 1}`} key={item.id} className='!bg-white'>
                <AccordionTrigger className='bg-white'>{item.prompt}</AccordionTrigger>
                <AccordionContent>
                    <div className="">
                        <Link href={item.image_url} target="_blank" rel="noopener noreferrer">
                            <img
                                src={item.image_url}
                                alt="Generated thumbnail"
                                className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                        </Link>
                        <h4 className="font-semibold text-lg mb-1"><span className='text-primary'>Prompt:</span> {item.prompt}</h4>

                        {item.content.titles?.length > 0 && (
                            <div className="my-5">
                            <h4>Top Titles:</h4>
                            <ul className="flex flex-col gap-3 my-3">
                                {item.content.titles.map((t, index) => (
                                <li
                                    key={index}
                                    className="bg-[#101010] p-2 rounded-lg flex justify-between !text-white"
                                >
                                    {t.title}
                                    <span className="bg-primary p-1 rounded-sm !text-white">
                                    SEO Score: {t.seo_score}
                                    </span>
                                </li>
                                ))}
                            </ul>
                            </div>
                        )}

                        {item.content.description && (
                            <>
                            <h4>Description:</h4>
                            <p>{item.content.description}</p>
                            </>
                        )}

                        {item.content.tags?.length > 0 && (
                            <>
                            <h4>Tags:</h4>
                            <div className="flex flex-wrap gap-2 my-3">
                                {item.content.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-primary-gradiant text-white py-1 px-3 rounded-3xl mr-2 mb-2"
                                >
                                    {tag}
                                </span>
                                ))}
                            </div>
                            </>
                        )}

                        <p className="text-xs text-gray-400">
                            Created: {new Date(item.created_at).toLocaleString()}
                        </p>
                    </div>
                </AccordionContent>
            </AccordionItem>
      ))}
      </Accordion>
    </div>
  )
}

export default AiContentList
