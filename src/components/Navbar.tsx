'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Leaf, LogOut, Plus, MessageCircle, User } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="ubc-header-gradient shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="ubc-gradient p-2 rounded-lg shadow-sm">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white ubc-heading">Exchangify</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/listings/create"
                  className="flex items-center space-x-2 bg-white text-ubc-blue px-4 py-2 rounded-lg hover:bg-ubc-grayLight transition-colors font-medium shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Sell Item</span>
                </Link>
                <Link
                  href="/messages"
                  className="p-2 text-white hover:text-ubc-gold transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-white hover:text-ubc-gold transition-colors"
                >
                  <div className="p-2 bg-white/20 rounded-full">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm hidden sm:block font-medium">
                    {session.user?.name}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-white hover:text-ubc-gold transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-ubc-gold font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-ubc-blue px-4 py-2 rounded-lg hover:bg-ubc-grayLight transition-colors font-medium shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
