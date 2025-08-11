// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error('Failed to send reset link.');
      } else {
        toast.success('Email Sent')
        setEmail('');
      }
    } catch (err) {
      console.error('Forgot password request error:', err);
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-main px-3">
      <div className="grid lg:grid-cols-2 max-w-[1200px] w-full items-center gap-4 my-[20px] p-3 md:p-8 space-y-6 bg-[#fff] rounded-2xl shadow-lg">
          <div className='lg:block hidden'>
            <Image src="/assets/imgs/slider-img5.webp" alt='img' className='w-full h-full rounded-2xl' width={1000} height={1000}/>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-center">
              <h3>Forgot Password</h3>
              <p className="text-gray-600">Enter your email to receive a password reset link.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-xl"
                />
              </div>

              <Button
                onClick={handleSubmit}
                variant={'default'}
                className="w-full"
                disabled={loading || !email}
              >
                {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
              </Button>
            </div>

            <p className="mt-4 text-center">
              Remembered your password?{' '}
              <Link className="text-primary font-semibold underline" href="/login">
                Login
              </Link>
            </p>
          </div>
      </div>
        
    </div>
  );
}