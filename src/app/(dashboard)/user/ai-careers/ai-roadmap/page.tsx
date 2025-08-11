'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkle, Loader2, Waypoints } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Roadmap {
  id: number
  data: any
  created_at: string
}

const AiRoadmap = () => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true)

  const router = useRouter()

  // Fetch all roadmaps
  const fetchRoadmaps = async () => {
    try {
      const res = await fetch('/api/roadmap')
      const data = await res.json()
      if (res.ok) {
        console.log(data);
        setRoadmaps(data.roadmaps)
      }
      else {console.error(data.message)}
    } catch (err) {
      console.error('Error fetching roadmaps:', err)
    } finally {
      setLoadingRoadmaps(false)
    }
  }

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const handleCreateRoadmap = async () => {
    if (!title.trim()) return;
    setLoading(true);

    try {
      // 1️⃣ Get user plan + tokens
      const planRes = await fetch('/api/get-user-token', { method: 'GET' });
      if (!planRes.ok) {
        throw new Error(await planRes.text());
      }
      const userData = await planRes.json();

      // 2️⃣ Check token balance for roadmap creation
      if (userData.tokens < userData.plan.ai_career_cost) {
        toast.error("You don’t have enough tokens to create this roadmap.");
        setLoading(false);
        return;
      }

      // 3️⃣ Create roadmap
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Creation failed');

      // 4️⃣ Deduct tokens
      await fetch('/api/update-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: -userData.plan.ai_career_cost }),
      });

      // 5️⃣ Cleanup & navigate
      setTitle('');
      setOpen(false);
      fetchRoadmaps();
      router.push(`/user/ai-careers/ai-roadmap/${data.id}`);
    } catch (err:any) {
      console.error('Roadmap creation failed:', err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">AI Roadmaps</h3>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Roadmap</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New AI Roadmap</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="e.g. Frontend Roadmap"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {
                loading &&
                <p className='m-2 !text-xs'>Generating Roadmap Content it would takes around 30s to 1m</p>
              }

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button className='not-svg' onClick={handleCreateRoadmap} disabled={loading || !title.trim()}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkle className="w-4 h-4 mr-2" />
                  )}
                  Generate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

        <div className="divide-y">
          {loadingRoadmaps ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                {
                    [1,2,3,4,5,6].map((item, index) => (
                    <div className="flex flex-col space-y-3" key={index}>
                        <Skeleton className="h-[125px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                    ))
                }
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="border rounded-md bg-white">
              <p className="p-4 text-black text-center">No roadmaps Found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {roadmaps.map((roadmap) => {
                const parsedData = JSON.parse(roadmap.data)

                return (
                    <div
                      key={roadmap.id}
                      className='h-full'
                    >
                    <Link href={`/user/ai-careers/ai-roadmap/${roadmap.id}`} className="p-4 text-white flex justify-between flex-col gap-3  rounded-lg border border-gray-300 shadow-lg bg-white h-full">
                      <span className="text-primary"><Waypoints size={70} /></span>
                      <h4 className='text-lg text-white font-bold'>{parsedData.roadmapTitle}</h4>
                      <p className='line-clamp-3'>{parsedData.description}</p>
                      <span className='text-black'>Duration: <span className='text-green-500'>{parsedData.duration}</span></span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(roadmap.created_at).toLocaleDateString()}
                      </span>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
    </div>
  )
}

export default AiRoadmap
