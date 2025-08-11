'use client'

import { AppDataTable } from '@/components/dataTable';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    plan: string;
    image:string;
    tokens: number;
}

type UserPlan = {
  id: number;
  user_id: number;
  plan_id: number;
  plan_name: string;
  created_at: Date;
  updated_at: Date;
  user_name: string;
};

export default function Dashboard() {
  const [data, setData] = useState<User>();
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  
  const {data:session} = useSession();  

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/user');
      const stats = await res.json();
      setData(stats);
    };
    fetchStats();
  }, []);

  useEffect(() => {
  
      if(session?.user.id !== undefined){

        fetch(`/api/admin/user-plans/${session?.user.id}`)
          .then((res) => res.json())
          .then((data) => {
            setPlans(data? [data] : []);
            setLoadingPlans(false);
          });
      }
    }, [session?.user.id]);

  const columns = [
    { name: 'ID', selector: (row: UserPlan) => row.id, sortable: true },
    { name: 'User Name', selector: (row: UserPlan) => row.user_name, sortable: true },
    { name: 'Plan Name', selector: (row: UserPlan) => row.plan_name, sortable: true },
    { name: 'Purchased At', selector: (row: UserPlan) => new Date(row.updated_at).toLocaleString(), sortable: true },
  ];

  return (
    <>
      <div className="">
        <h3 className="mb-6">👋 Welcome, {data?.name || 'User'}</h3>
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <Card title="Remaing Tokens" value={data?.tokens || 0} />
          <Card title="Plan" value={data?.plan || 0} />
        </div>
      </div>
      <div className='mt-4'>
          <AppDataTable
            title="Transaction  History"
            columns={columns}
            data={plans}
            loading={loadingPlans}
            searchableFields={['id', 'user_name', 'plan_name']}
          />
        </div>
    </>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <>
      <div className="bg-background shadow-md rounded-2xl p-6 text-center">
        <h4 className="text-xl font-semibold text-white">{title}</h4>
        <p className="!text-3xl !font-semibold text-primary mt-2">{value}</p>
      </div>
    </>
  );
}
