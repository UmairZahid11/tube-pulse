'use client';
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"

type Thumbnail = {
  id: string;
  thumbnail_url: string;
  updated_at: string;
};

const ThumbnailList = () => {
    const { data: session, status } = useSession();
    const id = session?.user.id;
    console.log('userId', id);

    const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

    const [loading, setLoading] = useState(true)


    // Fetch thumbnails from the database
    const fetchThumbnails = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/generate-thumbnail/${id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch thumbnails');
            }
            const data = await res.json();
            setThumbnails(data.thumbnails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching thumbnails:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (status === "authenticated" && session?.user.id) {
            fetchThumbnails();
        }
    }, [session?.user.id, status]);

  return (
    <>
      <div>
        <h4 className="text-lg font-bold mb-4">Previously Created Thumbnails</h4>
        {
            loading && 
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
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
            {thumbnails.map((thumbnail:any) => (
                <div key={thumbnail.id} className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow">
                    <img src={thumbnail.thumbnail_url} alt="Thumbnail" className="w-full h-40 object-cover rounded mb-2" />
                    {/* <h2 className="text-lg font-semibold mb-1">{thumbnail.prompt}</h2> */}
                    <p className="text-sm mb-2 text-gray-600">
                        {new Date(thumbnail.updated_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                        {/* {new Date(thumbnail.updated_at).toLocaleDateString()} */}
                    </p>
                    <a href={thumbnail.thumbnail_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Full Image
                    </a>
                </div>
            ))}     
        </div>
      </div>
    </>
  )
}

export default ThumbnailList
