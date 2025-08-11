'use client'
import { ArrowUpRight, ImagePlus, Loader2, User, X } from 'lucide-react'
import React, { useState } from 'react'
import Axios from 'axios'
import axios from 'axios'
import { RunStatus } from '../../../../../services/globalApi'
import ThumbnailList from './components/thumbnail-list'
import { toast } from 'sonner'

const ThumbnailGenerator = () => {
  const [userInput, setUserInput] = useState('')
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [faceImage, setFaceImage] = useState<File | null>(null)

  const [referencePreview, setReferencePreview] = useState<string | null>(null)
  const [facePreview, setFacePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [outputThumbnail, setOutputThumbnail] = useState<string | null>(null)

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'reference' | 'face'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)

    if (type === 'reference') {
      setReferenceImage(file)
      setReferencePreview(previewUrl)
    } else {
      setFaceImage(file)
      setFacePreview(previewUrl)
    }
  }

  const removeImage = (type: 'reference' | 'face') => {
    if (type === 'reference') {
      setReferenceImage(null)
      setReferencePreview(null)
    } else {
      setFaceImage(null)
      setFacePreview(null)
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('userInput', userInput);
    if (referenceImage) formData.append('refImage', referenceImage);
    if (faceImage) formData.append('faceImage', faceImage);

    try {
      // 1️⃣ Get user plan & tokens
      const planRes = await fetch('/api/get-user-token', { method: 'GET' });
      if (!planRes.ok) {
        throw new Error(await planRes.text());
      }
      const userData = await planRes.json();

      // 2️⃣ Token check
      if (userData.tokens < userData.plan.thumbnail_cost) {
        toast.error("You don’t have enough tokens to generate a thumbnail.");
        setLoading(false);
        return;
      }

      // 3️⃣ Call the thumbnail generation API
      const result = await axios.post('/api/generate-thumbnail', formData);

      // 4️⃣ Poll for status
      while (true) {
        const runStatus = await RunStatus(result.data.result.ids);
        console.log(
          'Run status:',
          runStatus,
          'status',
          runStatus[0]?.status,
          'output',
          runStatus[0]?.output?.data.imageUrl
        );

        if (runStatus[0]?.status === 'Completed') {
          setLoading(false);
          toast.success('Thumbnail generated successfully!');
          setUserInput('');
          setReferenceImage(null);
          setFaceImage(null);
          setOutputThumbnail(runStatus?.output?.data.imageUrl);

          // ✅ Deduct tokens after successful generation
          await fetch('/api/update-tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: -userData.plan.thumbnail_cost }),
          });

          break;
        } else if (
          runStatus[0]?.status === 'Cancelled' ||
          runStatus[0]?.status === 'Failed'
        ) {
          setLoading(false);
          toast.error('Thumbnail generation failed or was cancelled.');
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setUserInput('');
      setReferenceImage(null);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      setLoading(false);
    }
  };

  return (
    <div className='lg:max-w-5xl mx-auto'>
      <div className="text-center">
        <h3 className="mb-3">AI Thumbnail Generator</h3>
        <p className="text-sm text-gray-400">
          Generate thumbnails by providing your video details and optional images.
        </p>
      </div>

      <div className='mb-5'>
        {loading && (
          <div className="flex items-center justify-center p-10 rounded-lg bg-gray-600">
            <Loader2 className="animate-spin text-black"/>
            <span className="ml-2 text-black">Generating thumbnail...</span>
          </div>
        )}
      </div>
      {
        outputThumbnail && (
          <div className="mb-5">
            <h4 className="text-lg font-semibold mb-2">Generated Thumbnail</h4>
            <div className="relative">
              <img src={outputThumbnail} alt="Generated Thumbnail" className="w-full h-auto rounded-lg" />
              <a href={outputThumbnail} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black">
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        )
      }

      <div className="mt-5">
        <div className="flex gap-3 items-start">
          <textarea
            className="flex-1 p-2 rounded border text-sm"
            placeholder="Enter your YouTube video title or description"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={2}
          ></textarea>
          <button onClick={handleSubmit} className="primary-btn disabled:opacity-50 disabled:cursor-no-drop not-svg" disabled={!userInput}>
            Generate <ArrowUpRight />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <label htmlFor="referenceImageUpload" className="w-full">
            <div className="flex gap-2 items-center p-4 border border-gray-400 bg-white w-full text-primary text-center justify-center cursor-pointer rounded-xl">
              <ImagePlus />
              Reference Image
            </div>
          </label>
          <input
            type="file"
            id="referenceImageUpload"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, 'reference')}
          />

          {/* <label htmlFor="faceImage" className="w-full">
            <div className="flex gap-2 items-center p-4 border border-primary w-full text-white text-center justify-center cursor-pointer rounded-xl">
              <User />
              Include Face
            </div>
          </label>
          <input
            type="file"
            id="faceImage"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, 'face')}
          /> */}
        </div>

        {/* Preview Section */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {referencePreview && (
            <div className="relative rounded-xl overflow-hidden">
              <img src={referencePreview} alt="Reference" className="w-full h-40 object-cover rounded-xl" />
              <button
                onClick={() => removeImage('reference')}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
              >
                <X size={16} />
              </button>
              <p className="text-xs text-center mt-1 text-gray-400">Reference Image</p>
            </div>
          )}
          {facePreview && (
            <div className="relative rounded-xl overflow-hidden">
              <img src={facePreview} alt="Face" className="w-full h-40 object-cover rounded-xl" />
              <button
                onClick={() => removeImage('face')}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
              >
                <X size={16} />
              </button>
              <p className="text-xs text-center mt-1 text-gray-400">Face Image</p>
            </div>
          )}
        </div>
      </div>
      
      <ThumbnailList/>
    </div>
  )
}

export default ThumbnailGenerator
