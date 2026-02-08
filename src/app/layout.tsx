import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';
import SessionTimeout from '@/components/SessionTimeout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Exchangify - UBC Student Marketplace',
  description: 'Buy, sell, and trade dorm items with fellow UBC students. Sustainable campus marketplace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster position="top-right" />
          <SessionTimeout />
          <div className="min-h-screen bg-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
