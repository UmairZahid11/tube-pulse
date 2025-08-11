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
import { Sparkle, Loader2, File } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Resume {
  id: number
  filename: string
  fileUrl: string
  status: string
  created_at: string
}

const ResumeAnalyze = () => {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [data, setData] = useState(null);

  const [resumes, setResumes] = useState<Resume[]>([])

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resume/upload', { method: 'GET' })
      const data = await res.json()
      if (res.ok) {
        setResumes(data.resumes)
      } else {
        console.error('Failed to fetch resumes:', data.message)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoadingResumes(false)
    }
  }
  useEffect(() => {
    fetchResumes()
  }, [])

  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  // const handleAnalyze = async () => {
  //   if (!selectedFile) return
  //   setLoading(true)

  //   try {
  //     async function getUserPlanAndTokens() {
  //     const res = await fetch('/api/get-user-token', {
  //       method: 'GET',
  //     });

  //     if (!res.ok) {
  //       throw new Error(await res.text());
  //     }

  //     return res.json();
  //   }

  //     getUserPlanAndTokens()
  //     .then(setData)
  //     .catch(err => console.error(err));
  //   } catch (error) {
  //     console.error(error);
  //   }
    

  //   try {
  //     const formData = new FormData()
  //     formData.append('file', selectedFile)
  //     formData.append('filename', selectedFile.name)

  //     const res = await fetch('/api/resume/upload', {
  //       method: 'POST',
  //       body: formData,
  //     })

  //     const data = await res.json()

  //     if (!res.ok) throw new Error(data.message || 'Upload failed')

  //     await fetchResumes()

  //     setSelectedFile(null)
  //     setOpen(false)
  //     router.push(`/user/ai-careers/analyze-resume/${data.id}`)
  //   } catch (err) {
  //     console.error('Upload failed:', err)
  //     // Add toast here if needed
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {
      // 1️⃣ Get user plan + tokens
      const res = await fetch('/api/get-user-token', { method: 'GET' });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const userData = await res.json();

      // 2️⃣ Check if tokens are enough
      if (userData.tokens < userData.plan.ai_career_cost) {
        toast.error("You don’t have enough tokens to create this.");
        setLoading(false);
        return;
      }

      // 3️⃣ Upload file
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filename', selectedFile.name);

      const uploadRes = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');

      // 4️⃣ Deduct tokens (generic API)
      await fetch('/api/update-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: -userData.plan.ai_career_cost }),
      });

      // 5️⃣ Refresh data + redirect
      await fetchResumes();
      setSelectedFile(null);
      setOpen(false);
      router.push(`/user/ai-careers/analyze-resume/${uploadData.id}`);
    } catch (err:any) {
      console.error('Error:', err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Uploaded Resumes</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Upload Resume</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Your Resume</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                className="h-auto"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">📄 {selectedFile.name}</p>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button className='not-svg' onClick={handleAnalyze} disabled={!selectedFile || loading}>
                  {loading ? (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  ) : (
                    <Sparkle className="w-3 h-3 mr-2" />
                  )}
                  Analyze
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {
          loadingResumes && 
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
              {
                  [1,2,3,4,5,6,7,8,9].map((item, index) => (
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
      }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(resumes.length === 0 && !loadingResumes) ? (
          <div className='col-span-full'>
            <p className="p-4 text-gray-300">No resumes uploaded yet.</p>
          </div>
        ) : (
          resumes.map((resume) => (
            <Link href={`/user/ai-careers/analyze-resume/${resume.id}`}
              key={resume.id}
              className="p-4 gap-3 flex justify-between flex-col shadow-sm rounded-md text-black bg-white"
            >
              <span className='text-primary'><File size={60}/></span>
              <span>{resume.filename}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(resume.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default ResumeAnalyze
