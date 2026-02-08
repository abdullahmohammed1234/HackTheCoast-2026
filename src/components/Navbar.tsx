'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  HomeIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Ensure session is properly cleared when not authenticated
  const isAuthenticated = status === 'authenticated' && session?.user;
  const isLoading = status === 'loading';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.webp"
                  alt="Exchangify Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold ubc-gradient-text hidden sm:block">
                Exchangify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Show loading state */}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/listings/create"
                  className="flex items-center gap-2 bg-gradient-to-r from-ubc-blue to-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>Sell Item</span>
                </Link>
                
                <div className="flex items-center gap-1 ml-4 border-l border-gray-200 pl-4">
                  <Link
                    href="/messages"
                    className="p-2.5 text-gray-600 hover:text-ubc-blue hover:bg-ubc-blue/5 rounded-xl transition-colors"
                    title="Messages"
                  >
                    <ChatBubbleLeftRightIcon className="h-6 w-6" />
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-ubc-blue hover:bg-ubc-blue/5 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-ubc-blue to-primary rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">
                      {session.user?.name?.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-1"
                    title="Sign Out"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium text-gray-700 hover:text-ubc-blue px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-ubc-blue to-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
            {/* End of auth check */}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {/* Show loading state */}
            {isLoading ? (
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ) : isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-ubc-blue/5 to-primary/5 rounded-xl mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-ubc-blue to-primary rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{session.user?.name}</p>
                    <p className="text-gray-500 text-sm">{session.user?.email}</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <Link
                  href="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-ubc-blue hover:bg-ubc-blue/5 rounded-xl transition-colors"
                >
                  <HomeIcon className="h-6 w-6" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link
                  href="/listings/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-ubc-blue hover:bg-ubc-blue/5 rounded-xl transition-colors"
                >
                  <PlusCircleIcon className="h-6 w-6" />
                  <span className="font-medium">Sell Item</span>
                </Link>
                <Link
                  href="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-ubc-blue hover:bg-ubc-blue/5 rounded-xl transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-6 w-6" />
                  <span className="font-medium">Messages</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-ubc-blue hover:bg-ubc-blue/5 rounded-xl transition-colors"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="font-medium">Profile</span>
                </Link>

                {/* Sign Out */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center bg-gradient-to-r from-ubc-blue to-primary text-white font-medium rounded-xl shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
            {/* End of auth check */}
          </div>
        </div>
      )}
    </nav>
  );
}
