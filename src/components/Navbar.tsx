'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Leaf, LogOut, Plus, MessageCircle, User } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ubc-gradient border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white ubc-heading">Exchangify</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-white">
            {session ? (
              <>
                <Link
                  href="/listings/create"
                  className="flex items-center gap-2 bg-white text-ubc-blue px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Sell Item</span>
                </Link>
                <Link
                  href="/messages"
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 hover:bg-white/20 rounded-lg transition-colors p-2"
                >
                  <div className="bg-white/20 rounded-full p-1">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm hidden sm:block font-medium">
                    {session.user?.name}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium hover:text-white/80 transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-ubc-blue px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
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
