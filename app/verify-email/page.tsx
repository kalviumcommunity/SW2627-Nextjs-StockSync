'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setMessage('This verification link is missing its token.');
      setError(true);
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Email verification failed.');
        setMessage(data.message);
      })
      .catch((verificationError: Error) => {
        setMessage(verificationError.message);
        setError(true);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
        <Logo className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          {error ? 'Verification failed' : 'Email verification'}
        </h1>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        {!error && <Link href="/login" className="text-brand-600 font-semibold hover:underline">Continue to login</Link>}
        {error && <Link href="/register" className="text-brand-600 font-semibold hover:underline">Create a new account</Link>}
      </div>
    </div>
  );
}