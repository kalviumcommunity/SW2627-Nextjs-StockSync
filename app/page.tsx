/**
 * File task: Public landing page for StockSync with marketing content and sign-up calls to action.
 * Used by: Next.js route / mapped directly from app/page.tsx.
 * Important code snippets:
 *   1. Navbar and Footer layout placement for the landing page.
 *   2. Hero section with CTA buttons to /register and /login.
 *   3. Feature cards describing inventory management capabilities.
 */

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  BarChart3,
  Zap,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react';

// Public landing page: hero section, feature cards, and CTA links.

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* 1. Header Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
                Inventory management, simplified
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Manage Inventory. <br />
                <span className="text-brand-600">Stay in Control.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                StockSync gives inventory managers a simple, reliable way to monitor stock,
                make updates, and track every inventory change.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-md shadow-brand-500/25 transition-all hover:gap-3 active:scale-[0.98]"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 shadow-sm transition-all"
                >
                  Log In
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-slate-700">Free to start</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-slate-700">No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-slate-700">Real-time sync</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Mockup Window */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900 p-5 shadow-2xl border border-slate-800 text-white">
                {/* Window Controls */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>

                {/* Metric Quick Preview */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50">
                    <div className="text-xs text-slate-400">Total Products</div>
                    <div className="text-2xl font-bold text-indigo-400 mt-1">12</div>
                  </div>
                  <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50">
                    <div className="text-xs text-slate-400">Total Managers</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">3</div>
                  </div>
                  <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50">
                    <div className="text-xs text-slate-400">Out of Stock</div>
                    <div className="text-2xl font-bold text-rose-400 mt-1">1</div>
                  </div>
                  <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50">
                    <div className="text-xs text-slate-400">Today's Updates</div>
                    <div className="text-2xl font-bold text-purple-400 mt-1">47</div>
                  </div>
                </div>

                {/* Product items preview */}
                <div className="space-y-2.5">
                  <div className="bg-slate-800/90 rounded-xl p-3 flex items-center justify-between border border-slate-700/60">
                    <div>
                      <div className="text-sm font-semibold">Maggi Noodles</div>
                      <div className="text-xs text-slate-400">60 units</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        In Stock
                      </span>
                      <button className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-6 h-6 rounded bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 flex items-center justify-between border border-slate-700/60">
                    <div>
                      <div className="text-sm font-semibold">Pasta (500g)</div>
                      <div className="text-xs text-slate-400">55 units</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        In Stock
                      </span>
                      <button className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-6 h-6 rounded bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 flex items-center justify-between border border-slate-700/60">
                    <div>
                      <div className="text-sm font-semibold">Olive Oil</div>
                      <div className="text-xs text-slate-400">0 units</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium">
                        Out of Stock
                      </span>
                      <button className="w-6 h-6 rounded bg-emerald-600/40 cursor-not-allowed flex items-center justify-center text-white">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-6 h-6 rounded bg-rose-600/40 cursor-not-allowed flex items-center justify-center text-white">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything you need to manage stock
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm card-hover flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Inventory</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Monitor current stock quantities across all products instantly, with live
                updates across your team.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm card-hover flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fast Stock Updates</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add or remove stock independently for each product with just a few clicks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm card-hover flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Complete Audit History</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every change records the responsible manager, quantity, previous stock, new
                stock, and timestamp.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm card-hover flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Safe Concurrent Updates</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Multiple managers can update inventory simultaneously without silently
                overwriting valid changes.
              </p>
            </div>
          </div>
        </section>

        {/* 4. How It Works Section */}
        <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Three steps to full control
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md shadow-brand-500/30">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Login</h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                Access the secure manager dashboard with your credentials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md shadow-brand-500/30">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">Update Stock</h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                Choose a product, enter a quantity, and select Add or Remove.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md shadow-brand-500/30">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Track Changes</h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                Every successful update appears in inventory history with full audit details.
              </p>
            </div>
          </div>
        </section>

        {/* 5. CTA Banner */}
        <section className="bg-brand-600 text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take control of your inventory?
            </h2>
            <p className="text-brand-100 text-base sm:text-lg max-w-2xl mx-auto">
              Join managers who trust StockSync to keep their stock accurate and auditable.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 font-bold px-8 py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
