'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import '@xyflow/react/dist/style.css';
import { Background, Controls, MiniMap, ReactFlow} from '@xyflow/react';
import TurboNode from '../components/turbo-node';
import { Skeleton } from '@/components/ui/skeleton';

const nodeTypes = {
  turbo: TurboNode,

}
interface NodeData {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    title: string
    description: string
    link: string
  }
}

interface RoadmapData {
  roadmapTitle: string
  description: string
  duration: string
  initialNodes: NodeData[]
  initialEdges: { id: string; source: string; target: string }[]
}

const RoadmapDetailPage = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [roadmap, setRoadmap] = useState<{
    created_at: string
    data: any
  } | null>(null)

  const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
  ];
  const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/roadmap/${id}`)
        const data = await res.json()

        if (res.ok) {
            // const roadmapData = Array.isArray(data) ? data : [data];
            setRoadmap({
                created_at: data.created_at,
                data: JSON.parse(data.data)
            })
        } else {
          console.error('Failed to fetch roadmap:', data.message)
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchRoadmap()
  }, [id])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-5">
          <Skeleton className="w-full h-60" />
          <Skeleton className="w-full h-60" />
      </div>
    )
  }

  if (!roadmap) {
    return <p className="text-center text-black">Roadmap not found.</p>
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-lg h-fit">
        <h3 className="!text-2xl font-bold text-white">{roadmap.data.roadmapTitle}</h3>
        <p className="text-muted-foreground">{roadmap.data.description}</p>
        <p className="text-sm">Estimated Duration: <span className='text-green-500 font-semibold'>{roadmap.data.duration}</span></p>
        <p className="text-sm text-muted-foreground">
          {new Date(roadmap.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
          })}
        </p>
      </div>

      {/* <div className="border rounded-md p-4 bg-[#101010] col-span-2">
        <h2 className="text-xl font-semibold mb-4">Steps:</h2>
        <div className="space-y-3">
          {roadmap.data.initialNodes.map((node:any) => (
            <div
              key={node.id}
              className="border rounded p-4 bg-[#181818] hover:bg-[#1f1f1f] transition"
            >
              <h3 className="text-white font-medium">{node.data.title}</h3>
              <p className="text-sm text-muted-foreground">{node.data.description}</p>
              <a
                href={node.data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm mt-1 inline-block"
              >
                Learn more
              </a>
            </div>
          ))}
        </div>
      </div> */}
      <div style={{ width: '100%', height: '80vh' }} className='col-span-2 bg-white rounded-lg'>
        <ReactFlow
          nodes={roadmap.data.initialNodes}
          edges={roadmap.data.initialEdges}
          nodeTypes={nodeTypes}
        >
          <Controls/>
          <MiniMap/>
          {/* @ts-ignore */}
          <Background variant='dots' gap={12} size={1}/>
        </ReactFlow>
      </div>
    </div>
  )
}

export default RoadmapDetailPage
