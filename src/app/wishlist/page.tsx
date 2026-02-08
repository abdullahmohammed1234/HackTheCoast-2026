'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HeartIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import EmptyState from '@/components/EmptyState';
import { SkeletonCard } from '@/components/Skeleton';

interface WishlistItem {
  _id: string;
  listingId: {
    _id: string;
    title: string;
    description: string;
    price: number | null;
    isFree: boolean;
    isTrade: boolean;
    category: string;
    location: string;
    availableDate: Date;
    imageUrl: string;
    isMoveOutBundle: boolean;
    userId?: { name: string };
  };
  createdAt: Date;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      setWishlist(data.wishlist?.items || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (listingId: string) => {
    try {
      const res = await fetch(`/api/wishlist?listingId=${listingId}`, { method: 'DELETE' });
      if (res.ok) {
        setWishlist((prev) => prev.filter((item) => item.listingId._id !== listingId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid-listings">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 bg-gradient-to-br from-ubc-blue via-ubc-blue to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Items you've saved and are interested in. Connect with sellers to make a deal!
          </p>
          <div className="mt-4 text-white/60">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </div>
        </div>
      </section>

      {/* Wishlist Items */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {wishlist.length === 0 ? (
            <EmptyState
              type="favorites"
              title="No items in your wishlist"
              description="Start browsing and save items you're interested in by clicking the heart icon."
              actionLabel="Browse Listings"
              actionHref="/home"
            />
          ) : (
            <div className="grid-listings">
              {wishlist.map((item) => (
                <div key={item._id} className="relative group">
                  <ListingCard listing={item.listingId} isFavorite={true} />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFromWishlist(item.listingId._id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    title="Remove from wishlist"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
