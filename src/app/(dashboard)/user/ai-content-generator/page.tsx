'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowUpRight, Loader2, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RunStatus } from '../../../../../services/globalApi';
import { toast } from 'sonner';
import AiContentList from './content-list/page';

type ContentType = {
  titles: { title: string; seo_score: number }[];
  description: string;
  tags: string[];
  image_prompts: { heading: string; prompt: string }[];
};

const ContentGenerator = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<ContentType | null>(null);
  const [thumbnailImage, setthumbnailImage] = useState<any | null>(null);


  // const onGenerate = async () => {
  //   const formData = new FormData()
  //   formData.append('userInput', userInput);
  //   try {
  //     setLoading(true);
  //     const result = await axios.post('/api/ai-content-generator', formData);
  //     console.log('Thumbnail generation result:', result.data.result.ids);

  //       while(true){
  //       const runStatus = await RunStatus(result.data.result.ids)
  //       // console.log('Run status:', runStatus, 'status', runStatus[0]?.status, 'output', runStatus[0]?.output?.data.imageUrl);
        
  //       if(runStatus[0]?.status === 'Completed'){
  //           setLoading(false);
  //           toast.success('Thumbnail generated successfully!')
  //           setUserInput('')
  //           console.log('Thumbnail URL:', runStatus?.output);
  //           setthumbnailImage(runStatus?.output?.data?.imageUrl);
  //           setContent(runStatus?.output?.data?.AiContent);
          
  //       //   setOutputThumbnail(runStatus?.output?.data.imageUrl);
  //         break;
  //       }else if(runStatus[0]?.status === 'Cancelled' || runStatus.status === 'Failed'){
  //         setLoading(false);
  //         toast.error('Thumbnail generation failed or was cancelled.')
  //         break;
  //       }
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //     }
  //     setUserInput('')
  //   } catch (error) {
  //     console.error('Error generating SEO content:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onGenerate = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get user plan + tokens
      const planRes = await fetch('/api/get-user-token', { method: 'GET' });
      if (!planRes.ok) {
        throw new Error(await planRes.text());
      }
      const userData = await planRes.json();

      // 2️⃣ Check token balance for thumbnail generation
      if (userData.tokens < userData.plan.thumbnail_cost) {
        toast.error("You don’t have enough tokens to generate a thumbnail.");
        setLoading(false);
        return;
      }

      // 3️⃣ Send generation request
      const formData = new FormData();
      formData.append('userInput', userInput);

      const result = await axios.post('/api/ai-content-generator', formData);
      console.log('Thumbnail generation result:', result.data.result.ids);

      // 4️⃣ Poll until generation is complete
      while (true) {
        const runStatus = await RunStatus(result.data.result.ids);

        if (runStatus[0]?.status === 'Completed') {
          setLoading(false);
          toast.success('Thumbnail generated successfully!');
          setUserInput('');
          console.log('Thumbnail URL:', runStatus?.output);
          setthumbnailImage(runStatus?.output?.data?.imageUrl);
          setContent(runStatus?.output?.data?.AiContent);

          // 5️⃣ Deduct tokens after success
          await fetch('/api/update-tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: -userData.plan.thumbnail_cost }),
          });

          break;
        } else if (runStatus[0]?.status === 'Cancelled' || runStatus.status === 'Failed') {
          setLoading(false);
          toast.error('Thumbnail generation failed or was cancelled.');
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error generating SEO content:', error);
      toast.error('Something went wrong while generating the thumbnail.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="text-center mb-5">
        <h3>AI Content Generator</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum
          excepturi quibusdam repudiandae error dolores voluptas!
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Enter value to generate content for videos"
          onChange={(event) => setUserInput(event.target.value)}
        />
        <button
          className="primary-btn disabled:opacity-50 not-svg"
          disabled={loading || !userInput}
          onClick={onGenerate}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Settings />}
          Generate
        </button>
      </div>

      {/* Only show when content exists */}
      {
        loading && 
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
            {
                [1,2,3,4].map((item, index) => (
                <div className="flex flex-col space-y-3" key={index}>
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
                ))
            }
        </div>
      }
      {content && (
        <div className="bg-white p-3 rounded-lg my-5">
            <div className="grid grid-cols-4 gap-4">    
                {content.titles?.length > 0 && (
                    <div className="my-5">
                    <h4>Top Titles:</h4>
                    <ul className="flex flex-col gap-3 my-3">
                        {content.titles.map((t, index) => (
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

                {content.description && (
                    <>
                    <h4>Description:</h4>
                    <p>{content.description}</p>
                    </>
                )}

                {content.tags?.length > 0 && (
                    <>
                    <h4>Tags:</h4>
                    <div className="flex flex-wrap gap-2 my-3">
                        {content.tags.map((tag) => (
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
                {
                    thumbnailImage && (
                    <div className="">
                        <h4 className="text-lg font-semibold mb-2">Generated Thumbnail</h4>
                        <div className="relative">
                            <img src={thumbnailImage} alt="Generated Thumbnail" className="w-full h-auto rounded-lg" />
                            <a href={thumbnailImage} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black">
                                <ArrowUpRight size={16} />
                            </a>
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
      )}

      <div className='mt-10'>
        <h3 className='mb-5'>Previously Created Content</h3>
        <AiContentList/>
      </div>
    </>
  );
};

export default ContentGenerator;
