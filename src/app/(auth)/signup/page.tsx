'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);  
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true)
    setError('');
    if (!name || !email || !password || !confirm) {
      setError('All fields are required');
      return;
    }
    if (name.length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message);
        setLoading(false);
        return;
      }

      toast("Registered successfully!")
      setLoading(false);
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast("Something went wrong")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 login-main">
      <div className="grid lg:grid-cols-2 max-w-[1200px] w-full items-center gap-4 my-[20px] p-3 md:p-8 space-y-6 bg-[#fff] rounded-2xl shadow-lg">
        <div className='lg:block hidden'>
          <Image src="/assets/imgs/slider-img5.webp" alt='img' className='w-full h-full rounded-2xl' width={1000} height={1000}/>
        </div>
        <div className="flex flex-col gap-3">
          
        <div className="text-center">
          <h3 >Create a new account</h3>
          <p>Sign Up to get started</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              name="email"
              type="email"
              required
              className="mt-1 "
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              name="password"
              type="password"
              required
              className="mt-1 "
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              name="confirm"
              type="password"
              required
              className="mt-1 "
            />
          </div>
          {
            error !== '' &&
            <p className='my-2 text-sm text-red-500'>{error}</p>
          }
          <Button 
          variant={'default'}
          onClick={handleRegister}
          className='w-full not-svg'
          >
            {loading ? <Loader2 className='animate-spin'/> : 'Sign Up'}
          </Button>
        </div>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
