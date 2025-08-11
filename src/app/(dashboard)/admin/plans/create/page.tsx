'use client'
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CreatePlanPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [tokens, setTokens] = useState(0);

  const [thumbnailCost, setThumbnailCost] = useState(0);
  const [thumbnailSearchCost, setThumbnailSearchCost] = useState(0);
  const [aiCareerCost, setAiCareerCost] = useState(0);
  const [contentGenerationCost, setContentGenerationCost] = useState(0);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !name.trim() ||
      price <= 0 ||
      !description.trim() ||
      tokens <= 0 ||
      thumbnailCost <= 0 ||
      thumbnailSearchCost <= 0 ||
      aiCareerCost <= 0 ||
      contentGenerationCost <= 0
    ) {
      toast.error('Please fill out all fields with valid values');
      setLoading(false);
      return;
    }

    if (name.toLowerCase() === 'free') {
      toast.error('You cannot create more than one free plan');
      setLoading(false);
      return;
    }

    await axios.post('/api/admin/plans', {
      name,
      price,
      description,
      tokens,
      thumbnailCost,
      thumbnailSearchCost,
      aiCareerCost,
      contentGenerationCost
    });

    setLoading(false);
    toast.success('Plan created successfully');
    router.push('/admin/plans');
  };

  return (
    <div className="p-5 mx-auto bg-white rounded-2xl">
      <h3 className="text-2xl font-semibold mb-4">Create Plan</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        
        <label className="text-sm font-semibold">Plan Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <label className="text-sm font-semibold">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 rounded"
          required
        />

        <label className="text-sm font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <label className="text-sm font-semibold">Tokens</label>
        <input
          type="number"
          value={tokens}
          onChange={(e) => setTokens(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <label className="text-sm font-semibold">Thumbnail Cost</label>
        <input
          type="number"
          value={thumbnailCost}
          onChange={(e) => setThumbnailCost(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <label className="text-sm font-semibold">Thumbnail Search & Outlier Cost</label>
        <input
          type="number"
          value={thumbnailSearchCost}
          onChange={(e) => setThumbnailSearchCost(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <label className="text-sm font-semibold">AI Career Cost</label>
        <input
          type="number"
          value={aiCareerCost}
          onChange={(e) => setAiCareerCost(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <label className="text-sm font-semibold">Content Generation Cost</label>
        <input
          type="number"
          value={contentGenerationCost}
          onChange={(e) => setContentGenerationCost(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <Button type="submit" className="w-full not-svg" disabled={loading}>
          {loading ? <Loader2 /> : 'Create'}
        </Button>
      </form>
    </div>
  );
}
