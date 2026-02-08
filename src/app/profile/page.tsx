'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { User, Settings, ShoppingBag, CreditCard, AlertCircle } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | null;
  isFree: boolean;
  category: string;
  imageUrl: string;
  isMoveOutBundle: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile();
    }
  }, [status, session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setUser(data.user);
      setListings(data.listings);
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen ubc-gradient-subtle flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ubc-blue mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen ubc-gradient-subtle flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-ubc-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ubc-blue mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile and manage your listings.
          </p>
          <button
            onClick={() => signIn()}
            className="w-full bg-ubc-blue text-white py-3 px-6 rounded-xl font-semibold hover:bg-ubc-blue/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ubc-gradient-subtle">
      {error && (
        <div className="max-w-4xl mx-auto pt-4 px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Top Profile Card */}
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/10 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-ubc-blue p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-ubc-grayLight flex items-center justify-center">
                  <User className="w-14 h-14 text-ubc-blue" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-ubc-red text-white text-xs px-2 py-0.5 rounded-full font-medium border-2 border-white">
                UBC
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-ubc-blue mb-2">
                {user?.name || 'Student'}
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-xl">
                {user?.email || ''}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Items for Sale (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-ubc-blue mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                My Listings ({listings.length})
              </h2>

              {listings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>You haven't listed any items yet</p>
                  <a
                    href="/listings/create"
                    className="text-ubc-blue hover:underline mt-2 inline-block"
                  >
                    Create your first listing
                  </a>
                </div>
              ) : (
                /* Item Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-ubc-grayLight rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg hover:border-ubc-blue/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-ubc-blue/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-8 h-8 text-ubc-blue" />
                          )}
                        </div>
                        <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-lg font-bold text-ubc-blue">
                          {item.isFree ? 'Free' : item.price ? `$${item.price}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Settings (1 col) */}
          <div>
            <div className="bg-ubc-blue rounded-2xl p-6 shadow-lg border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </h2>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group">
                  <Settings className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                  <span className="flex-1 text-left">Update Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group">
                  <CreditCard className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                  <span className="flex-1 text-left">Purchase History</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Purchase History */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-ubc-blue mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Purchase History
            </h2>

            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No purchases yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8" />
    </div>
  );
}
