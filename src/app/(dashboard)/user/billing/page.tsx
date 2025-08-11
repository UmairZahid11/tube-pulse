'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BillingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setloading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    axios.get('/api/admin/plans').then((res) => setPlans(res.data)).finally(()=>setloading(false));
  }, []);

  const handleBuy = async (plan: any) => {
    if (!userId) {
      redirect('/login');
    }

    const res = await axios.post('/api/checkout', {
      plan,
      userId,
    });

    window.location.href = res.data.url;
  };

  return (
    <div className="">
        <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold mb-10">Billing Plans</h3>
        </div>
        {
          loading ?
          <div className="grid md:grid-cols-3 gap-5">
            <Skeleton className="w-full h-60" />
            <Skeleton className="w-full h-60" />
            <Skeleton className="w-full h-60" />
          </div>
          :
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan: any) => (
              <div key={plan.id} className="border rounded-lg p-4 shadow text-center bg-white">
                <h2 className="font-bold mt-2 text-2xl">${plan.price}</h2>
                <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                <p className="text-sm text-gray-600">{plan.description}</p>
                <ul className='my-4'>
                  <li>Feature 1</li>
                  <li>Feature 2</li>
                  <li>Feature 3</li>
                  <li>Feature 4</li>
                  <li>Feature 5</li>
                  <li>Tokens {plan.tokens}</li>
                </ul>
                <Button onClick={() => handleBuy(plan)} className='w-full'>Buy Now</Button>
              </div>
            ))}
          </div>
        }
    </div>
  );
}