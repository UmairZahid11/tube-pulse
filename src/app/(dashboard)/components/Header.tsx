'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <header className="flex justify-end p-4">
        <div className="w-10 h-10 rounded-full bg-[#101010] animate-pulse"></div>
      </header>
    );
  }

  if (!user) return null;

  const userInitial = user.name?.[0]?.toUpperCase() || 'U';

  return (
    <header className="w-full flex justify-end p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {user.image ? (
            <img
              src={user.image}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover cursor-pointer border"
            />
          ) : (
            <Button
              variant="ghost"
              className="rounded-full bg-[#101010] text-white w-10 h-10 flex items-center justify-center font-bold text-lg p-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            >
              {userInitial}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: '/' })}
            className="cursor-pointer"
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
