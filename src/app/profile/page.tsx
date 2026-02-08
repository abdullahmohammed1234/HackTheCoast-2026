'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { User, Settings, ShoppingBag, CreditCard, AlertCircle, ArrowLeft, Package, HeartIcon, BellIcon, Award } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BadgeDisplay, { BadgeCollection } from '@/components/BadgeDisplay';
import AvatarUpload from '@/components/AvatarUpload';
import StarRating from '@/components/StarRating';
import ReviewList from '@/components/ReviewList';
import FavoriteButton from '@/components/FavoriteButton';
import SustainabilityDashboard from '@/components/SustainabilityDashboard';

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
  avatar?: string;
  createdAt: string;
  badges: string[];
  rating: number;
  reviewCount: number;
  followersCount: number;
  followingCount: number;
  sustainableListings: number;
  totalSales: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
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
      setAvatar(data.user.avatar || null);
      setListings(data.listings);
      
      // Fetch reviews for the user
      const reviewsResponse = await fetch(`/api/reviews?userId=${data.user.id}`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews);
        setAverageRating(reviewsData.averageRating || 0);
      }
      
      // Check if user is favorited by current session user
      if (session?.user?.id && session.user.id !== data.user.id) {
        const favResponse = await fetch('/api/favorites');
        if (favResponse.ok) {
          const favData = await favResponse.json();
          setIsFavorited(favData.favorites.some((f: any) => f.favoriteUserId._id === data.user.id));
        }
      }
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatar: string) => {
    setAvatar(newAvatar);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="ubc-gradient p-4 rounded-2xl shadow-lg inline-block mb-4">
            <Package className="h-12 w-12 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-ubc-blue to-ubc-blue opacity-95" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM2djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center text-white">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="ubc-gradient p-4 rounded-2xl shadow-lg">
                  <User className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 ubc-heading">
                Sign In Required
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                Please sign in to view your profile and manage your listings.
              </p>
              <button
                onClick={() => signIn()}
                className="inline-flex items-center gap-2 bg-white text-ubc-blue px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Sign In
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </button>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            </svg>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-ubc-blue to-ubc-blue opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM2djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center gap-6 text-white">
            {/* Profile Avatar */}
            <AvatarUpload
              currentAvatar={avatar || undefined}
              onAvatarUpdate={handleAvatarUpdate}
              size="lg"
            />

            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 ubc-heading">
                {user?.name || 'Student'}
              </h1>
              
              {/* Badges */}
              {user?.badges && user.badges.length > 0 && (
                <div className="mb-2">
                  <BadgeDisplay badges={user.badges} size="sm" />
                </div>
              )}
              
              {/* Rating */}
              {user && user.rating > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={user.rating} readonly size="sm" />
                  <span className="text-sm text-white/90">
                    ({user.reviewCount} review{user.reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-white/80 mb-2">
                <span>{user?.followersCount || 0} followers</span>
                <span>{user?.followingCount || 0} following</span>
              </div>
              
              <p className="text-white/90 mb-2">{user?.email || ''}</p>
              <p className="text-white/70 text-sm">
                Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'listings'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  Listings ({listings.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4 inline mr-2" />
                  Reviews ({reviews.length})
                </button>
              </div>

              {activeTab === 'listings' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      My Listings
                    </h2>
                    <Link
                      href="/listings/create"
                      className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      + Add New
                    </Link>
                  </div>

                  {listings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                      <p className="text-gray-500 mb-4">You haven't listed any items for sale</p>
                      <Link
                        href="/listings/create"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                      >
                        Create your first listing
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {listings.map((item) => (
                        <Link
                          href={`/listings/${item.id}`}
                          key={item.id}
                          className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow block"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                              <p className="text-lg font-bold text-primary">
                                {item.isFree ? 'Free' : item.price ? `$${item.price}` : 'N/A'}
                              </p>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Reviews
                  </h2>
                  <ReviewList
                    reviews={reviews}
                    averageRating={averageRating}
                    totalReviews={reviews.length}
                  />
                </div>
              )}

              {/* Purchase History */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Purchase History
                </h2>
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No purchases yet</p>
                </div>
              </div>
            </div>

            {/* Settings Sidebar */}
            <div>
              <div className="bg-ubc-blue rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </h2>
                <div className="space-y-3">
                  <Link 
                    href="/wishlist"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
                  >
                    <HeartIcon className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                    <span className="flex-1 text-left">My Wishlist</span>
                  </Link>
                  <Link 
                    href="/price-alerts"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
                  >
                    <BellIcon className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                    <span className="flex-1 text-left">Price Alerts</span>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group">
                    <Settings className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                    <span className="flex-1 text-left">Update Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group">
                    <CreditCard className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                    <span className="flex-1 text-left">Purchase History</span>
                  </button>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all duration-200 group"
                  >
                    <ArrowLeft className="h-5 w-5 group-hover:rotate-180 transition-transform" />
                    <span className="flex-1 text-left">Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Sustainability Dashboard */}
              <div className="mt-6">
                <SustainabilityDashboard userId={user?.id} showDetails={true} />
              </div>

              {/* Full Badge Collection */}
              <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Badge Collection
                </h3>
                <BadgeCollection earnedBadges={user?.badges || []} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
