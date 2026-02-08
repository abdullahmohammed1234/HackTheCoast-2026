'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface ListingCardProps {
  listing: {
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
}

export default function ListingCard({ listing }: ListingCardProps) {
  const priceDisplay = listing.isFree 
    ? 'FREE' 
    : listing.isTrade 
    ? 'Trade' 
    : `$${listing.price}`;

  const priceColor = listing.isFree 
    ? 'text-green-600' 
    : listing.isTrade 
    ? 'text-purple-600' 
    : 'text-gray-900';

  return (
    <Link href={`/listings/${listing._id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all hover:border-ubc-blue/30">
        <div className="relative h-48 bg-gray-100">
          {listing.imageUrl ? (
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Tag className="h-12 w-12 text-gray-400" />
            </div>
          )}
          {listing.isMoveOutBundle && (
            <div className="absolute top-2 right-2 bg-ubc-red text-white text-xs font-semibold px-2 py-1 rounded-full">
              Move-Out Bundle
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className={`font-bold ${priceColor}`}>{priceDisplay}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-3 w-3 text-ubc-blue" />
            <span className="text-xs text-ubc-blue font-medium uppercase tracking-wide">{listing.category}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(listing.availableDate), 'MMM d')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
