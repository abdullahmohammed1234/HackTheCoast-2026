'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CubeIcon, AcademicCapIcon, MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import ListingCard from '@/components/ListingCard';
import MoveOutToggle from '@/components/MoveOutToggle';
import Navbar from '@/components/Navbar';
import { SkeletonCard } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

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
  userId?: { name: string };
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [moveOutMode, setMoveOutMode] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [moveOutMode, category, location]);

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      if (moveOutMode) params.set('moveOutMode', 'true');
      if (category !== 'all') params.set('category', category);
      if (location !== 'all') params.set('location', location);
      if (search) params.set('search', search);

      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Dorm', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Appliances', 'Other'];
  const locations = ['all', 'Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird'];

  const stats = [
    { value: '500+', label: 'Active Students', icon: AcademicCapIcon },
    { value: '200+', label: 'Items Listed', icon: CubeIcon },
    { value: '8', label: 'Residences', icon: MapPinIcon },
    { value: '50kg+', label: 'Waste Saved', icon: GlobeAltIcon }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ubc-blue via-ubc-blue to-primary opacity-95" />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM2djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="relative w-12 h-12">
                  <Image
                    src="/logo.webp"
                    alt="Exchangify Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              UBC Student Marketplace
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Buy, sell, and trade with fellow UBC students. Sustainable. Local. Trusted.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-white/80" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
                    className="input-modern pl-12"
                  />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-modern"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-modern"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'all' ? 'All Locations' : loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <MoveOutToggle isEnabled={moveOutMode} onToggle={setMoveOutMode} />
              </div>
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

      {/* Listings Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-2">
                {moveOutMode ? 'Move-Out Bundles' : 'Latest Listings'}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {moveOutMode 
                  ? 'Great deals on dorm essentials during move-out season'
                  : 'Discover items from students across campus'}
              </p>
            </div>
          </div>

          {/* Loading State with Skeletons */}
          {loading ? (
            <div className="grid-listings">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              type="listings"
              title="No listings found"
              description={
                search || category !== 'all' || location !== 'all'
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Be the first to list an item and start trading with fellow students!'
              }
              actionLabel="Create a Listing"
              actionHref="/listings/create"
            />
          ) : (
            <div className="grid-listings">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
