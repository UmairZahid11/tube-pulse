'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

const PricingSection = () => {

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
        <>
            <section className="md:py-[100px] py-[50px] pricing-main">
                <div className="container">
                <div className="text-center max-w-[800px] mx-auto mb-10">
                    <h2>Pricing Plans</h2>
                    <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est ex
                    molestiae consequatur eligendi exercitationem quisquam perferendis
                    aliquam accusamus enim officia.
                    </p>
                </div>
                {
                    loading ?
                    <div className="text-black p-8 flex justify-center items-center">
                        <Loader2 className='animate-spin h-8 w-8' />
                    </div>
                    :
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan: any, index:number) => (
                        <div key={plan.id} className={`pricing-card bg-white p-[40px] shadow-lg border-2 h-fit border-transparent hover:border-[#A234FD] rounded-xl flex flex-col gap-4 ${index % 2 ? '!border-[#A234FD]' : ''}`}>
                            <div className="text-center">
                                <p>{plan.name}</p>
                                <div className="flex items-end justify-center">
                                    <h1>${plan.price}</h1>
                                    <span className="text-gray-800">/month</span>
                                </div>
                                <p className="text-sm text-gray-600 my-5">{plan.description}</p>        
                                <button onClick={() => handleBuy(plan)} className="primary-btn w-full">Buy Now</button>
                            </div>
                            <ul className='mt-10 flex flex-col gap-2'>
                                <li className='!text-black flex gap-2 items-center'><CheckCircle className='text-primary'/> Lorem ipsum dolor sit amet.</li>
                                <li className='!text-black flex gap-2 items-center'><CheckCircle className='text-primary'/> Lorem ipsum dolor sit amet.</li>
                                <li className='!text-black flex gap-2 items-center'><CheckCircle className='text-primary'/> Lorem ipsum dolor sit amet.</li>
                                <li className='!text-black flex gap-2 items-center'><CheckCircle className='text-primary'/> Lorem ipsum dolor sit amet.</li>
                                <li className='!text-black flex gap-2 items-center'><CheckCircle className='text-primary'/> Tokens {plan.tokens}</li>
                            </ul>
                        </div>
                        ))}
                    </div>
                }
                {
                    plans.length == 0 && !loading ?
                    <p className='text-center !text-black !text-lg py-5'>No Plans Found</p>
                    :
                    ''
                }    
                </div>
            </section>
        </>
    )
}

export default PricingSection
