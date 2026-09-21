/**
 * File task: Global app shell for the Next.js application. It sets the HTML body styling,
 * root metadata, and shared font configuration for all routes.
 * Used by: All pages under app/ via Next.js app router loading.
 * Important code snippets:
 *   1. Metadata export for the application title and description.
 *   2. Inter font setup and body class styling.
 *   3. Root layout wrapping children for every route.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StockSync - Real-Time Inventory Management System',
  description: 'StockSync gives inventory managers a simple, reliable way to monitor stock, make updates, and track every inventory change with concurrency safety and audit logging.',
};

// Task: Global application shell and metadata setup for all pages.
// Used by: Used by every route in the Next.js app router.
// Important code snippets:
// 1. Application metadata configuration
// 2. Shared font and body styling
// 3. Root layout wrapper for child pages

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
