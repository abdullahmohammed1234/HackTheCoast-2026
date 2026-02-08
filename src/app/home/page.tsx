'use client';

import { useState, useEffect } from 'react';
import { Search, Leaf, Users, MapPin } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import MoveOutToggle from '@/components/MoveOutToggle';
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
    { value: '500+', label: 'Active Students' },
    { value: '200+', label: 'Items Listed' },
    { value: '8', label: 'Residences Covered' },
    { value: '50kg+', label: 'Waste Saved' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-ubc-blue to-ubc-blue opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM2djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="ubc-gradient p-3 rounded-xl shadow-lg">
                <Leaf className="h-10 w-10 text-white" />
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 ubc-heading">
              UBC Student Marketplace
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Buy, sell, and trade with fellow UBC students. Sustainable. Local. Trusted.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {moveOutMode ? 'Move-Out Bundles' : 'Latest Listings'}
              </h2>
              <p className="text-gray-600 mt-1">
                {moveOutMode 
                  ? 'Great deals on dorm essentials during move-out season'
                  : 'Discover items from students across campus'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No listings found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
