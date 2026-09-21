/**
 * File task: Registration form for creating new manager accounts and verification emails.
 * Used by: Public onboarding flow from landing page CTA and navigation links.
 * Important code snippets:
 *   1. Full name, email, password, and confirmation validation.
 *   2. call to /api/auth/register and success messaging.
 *   3. Redirect flow to verify-email or login after registration.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// Task: Manager registration page for account creation.
// Used by: Used by the public onboarding flow and landing page CTA.
// Important code snippets:
// 1. Registration form state and validation
// 2. API request to create the manager account
// 3. Success and verification flow messaging

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    setGeneralError('');

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address (must contain @ and .).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setGeneralError('Please fix the missing or invalid fields below.');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGeneralError(data.error || 'Failed to create manager account.');
        setLoading(false);
        return;
      }

      setSuccessMessage(data.message || 'Account created. Check your email to verify your account.');
      setLoading(false);
    } catch {
      setGeneralError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Logo className="mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Start managing inventory with confidence.
          </p>
        </div>

        {/* Top Error Banner */}
        {generalError && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-sm text-rose-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
            {successMessage} <Link href="/login" className="font-semibold underline">Go to login</Link>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder="Manager B"
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100 bg-slate-50/50 focus:bg-white'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="manager@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100 bg-slate-50/50 focus:bg-white'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm pr-11 transition-all focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100 bg-slate-50/50 focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100 bg-slate-50/50 focus:bg-white'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-500/25 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Terms */}
        <p className="text-[11px] text-slate-500 text-center mt-4">
          By creating an account you agree to our{' '}
          <span className="text-slate-700 underline cursor-pointer">Terms</span> and{' '}
          <span className="text-slate-700 underline cursor-pointer">Privacy Policy</span>.
        </p>

        {/* Footer Link */}
        <p className="text-xs text-slate-500 text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
