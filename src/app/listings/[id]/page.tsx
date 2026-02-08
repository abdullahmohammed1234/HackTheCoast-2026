'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MapPin, Calendar, User, ArrowLeft, MessageCircle, Package, Leaf, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';

interface Listing {
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
  userId: { _id: string; name: string; email: string };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();
      setListing(data.listing);
    } catch (error) {
      console.error('Failed to fetch listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (!listing) return;

    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: listing.userId._id,
          listingId: listing._id,
          content: `Hi! I'm interested in your listing "${listing.title}". Is this still available?`,
        }),
      });

      if (res.ok) {
        router.push('/messages');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const priceDisplay = listing.isFree 
    ? 'FREE' 
    : listing.isTrade 
    ? 'Trade' 
    : `$${listing.price}`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-ubc-blue to-ubc-blue opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM2djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to listings
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Image */}
            <div className="relative w-full md:w-1/2">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {listing.isMoveOutBundle && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <Package className="h-5 w-5" />
                  <span className="font-semibold">Move-Out Bundle</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="text-center md:text-left text-white">
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {listing.category}
                </span>
                {listing.isMoveOutBundle && (
                  <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1">
                    <Leaf className="h-4 w-4" />
                    Sustainable
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{listing.title}</h1>
              
              <div className="text-5xl font-bold mb-6">
                <span className={listing.isFree ? 'text-green-300' : listing.isTrade ? 'text-purple-300' : 'text-white'}>
                  {priceDisplay}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <MapPin className="h-5 w-5 text-white/80" />
                  <span>Pickup at <strong>{listing.location}</strong></span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Calendar className="h-5 w-5 text-white/80" />
                  <span>Available until <strong>{format(new Date(listing.availableDate), 'MMMM d, yyyy')}</strong></span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <User className="h-5 w-5 text-white/80" />
                  <span>Seller: <strong>{listing.userId.name}</strong></span>
                </div>
              </div>

              <button
                onClick={handleMessageSeller}
                disabled={sendingMessage || (session?.user?.id === listing.userId._id)}
                className="inline-flex items-center gap-2 bg-white text-ubc-blue px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="h-5 w-5" />
                {sendingMessage ? 'Sending...' : 'Message Seller'}
              </button>

              {session?.user?.id === listing.userId._id && (
                <p className="mt-4 text-white/70 text-sm">
                  This is your listing
                </p>
              )}
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

      {/* Description Section */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified Seller</h3>
                <p className="text-sm text-gray-600">UBC student verified</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="p-2 bg-blue-100 rounded-full">
                <Leaf className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sustainable</h3>
                <p className="text-sm text-gray-600">Reduce waste</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
              <div className="p-2 bg-purple-100 rounded-full">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Local Pickup</h3>
                <p className="text-sm text-gray-600">On campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
