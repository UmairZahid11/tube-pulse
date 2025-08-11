'use client';
import { useState } from 'react'
import axios from 'axios';
import { Eye, Loader2, Search, ThumbsUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

type VideoInfo = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishAt: string;
    viewCount: string;
    linkCount: string;
    commentCount: string;
    smartScore:number;
    isOutlier: boolean;
    outlierScore: number;
    engagementRate: number;
    viewsPerDay: number;
}

const Outlier = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
        const [videoList, setVideoList] = useState<VideoInfo[]>([]);
    
    const onSearch = async () => {
        try {
            setLoading(true);

            // 1️⃣ Get user plan + tokens
            const planRes = await fetch('/api/get-user-token', { method: 'GET' });
            if (!planRes.ok) {
            throw new Error(await planRes.text());
            }
            const userData = await planRes.json();

            // 2️⃣ Check if user has enough tokens for outlier search
            if (userData.tokens < userData.plan.thumbnail_search_cost) {
            toast.error("You don’t have enough tokens to perform this search.");
            setLoading(false);
            return;
            }

            // 3️⃣ Perform the search
            const result = await axios.get(`/api/outlier?query=${userInput}`);
            setVideoList(result.data);

            // 4️⃣ Deduct tokens after successful search
            await fetch('/api/update-tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: -userData.plan.thumbnail_search_cost }),
            });

        } catch (error) {
            console.error("Error performing outlier search:", error);
            toast.error("Something went wrong while searching.");
        } finally {
            setLoading(false);
        }
        };

    return (
        <>
            <div className="text-center mb-5">
                <h3>Outlier</h3>
                <p>Search youtube Thumbnails and their Details</p>
            </div>
            <div className="flex gap-2 items-center">
                <input type="text" placeholder='Search Thumbnails' className='bg-white' onChange={(event) => setUserInput(event.target.value)}/>
                <button className="primary-btn disabled:opacity-50 not-svg" disabled={loading || !userInput} onClick={onSearch}>{loading ? <Loader2 className='animate-spin'/> : <Search/>}Search</button>
            </div> 

            {
                loading && 
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

            {
                videoList.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        {videoList.map((video) => (
                            <div key={video.id} className="p-4 bg-white rounded-xl relative">
                                <Tooltip>
                                    <TooltipTrigger className='absolute top-1 right-1 p-1 text-[12px] bg-blue-500 text-white rounded-sm'><div className="">{video.smartScore}</div></TooltipTrigger>
                                    <TooltipContent>
                                        Smart Score
                                    </TooltipContent>
                                </Tooltip>
                                <Image width={300} height={300} src={video.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover rounded mb-2" />
                                <h4 className="text-md font-semibold mb-1">{video.title}</h4>
                                <p className="text-gray-500 text-sm mb-2">Channel: {video.channelTitle}</p>
                                {/* <p className="text-gray-500 text-sm mb-2">Published at: {new Date(video.publishAt).toLocaleDateString()}</p> */}
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500 !text-[12px] flex gap-2 items-center"><Eye className='h-4 w-4'/> {video.viewCount}</p>
                                    <Tooltip>
                                        <TooltipTrigger className='!text-[12px]  bg-red-500 !text-white p-1 rounded-sm'><div className=""><p className="flex gap-2 items-center !text-[12px] !text-white"><ThumbsUp className='h-4 w-4'/> {video.engagementRate}</p></div></TooltipTrigger>
                                        <TooltipContent>
                                            Engagement Rate
                                        </TooltipContent>
                                    </Tooltip>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </>
    )
}

export default Outlier
