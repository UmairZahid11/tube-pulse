'use client';

import { AppDataTable } from '@/components/dataTable';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

type User = {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
};

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
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });

    fetch('/api/admin/user-plans')
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
      });
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length;

  const columns = [
    { name: 'ID', selector: (row: UserPlan) => row.id, sortable: true },
    { name: 'User Name', selector: (row: UserPlan) => row.user_name, sortable: true },
    { name: 'Plan ID', selector: (row: UserPlan) => row.plan_id, sortable: true },
    { name: 'Plan Name', selector: (row: UserPlan) => row.plan_name, sortable: true },
    { name: 'Purchased At', selector: (row: UserPlan) => new Date(row.updated_at).toLocaleString(), sortable: true },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="w-full h-40 bg-white opacity-50" />
          <Skeleton className="w-full h-40 bg-white opacity-50" />
          <Skeleton className="w-full h-40 bg-white opacity-50" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
          <Card className="p-5 rounded-2xl">
            <h4 className="text-lg font-semibold">Total Users</h4>
            <p className="!text-3xl !text-primary !font-semibold">{totalUsers}</p>
          </Card>
          <Card className="p-5 rounded-2xl">
            <h4 className="text-lg font-semibold">Active Users</h4>
            <p className="!text-3xl !text-primary !font-semibold">{activeUsers}</p>
          </Card>
          <Card className="p-5 rounded-2xl">
            <h4 className="text-lg font-semibold">Inactive Users</h4>
            <p className="!text-3xl !text-primary !font-semibold">{inactiveUsers}</p>
          </Card>
        </div>
      )}
        <AppDataTable
          title="Transaction  History"
          columns={columns}
          data={plans}
          loading={loading}
          searchableFields={['id', 'user_name', 'plan_name']}
        />
    </div>
  );
}
