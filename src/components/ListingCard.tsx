'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
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
    ? 'bg-green-100 text-green-700' 
    : listing.isTrade 
    ? 'bg-purple-100 text-purple-700' 
    : 'bg-ubc-blue text-white';

  const badgeColor = listing.isMoveOutBundle 
    ? 'bg-gradient-to-r from-ubc-red to-red-600' 
    : 'bg-gradient-to-r from-ubc-blue to-blue-500';

  return (
    <Link href={`/listings/${listing._id}`}>
      <div className="card-modern group h-full">
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          {listing.imageUrl ? (
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <CubeIcon className="h-16 w-16 text-gray-300" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Move-Out Badge */}
          {listing.isMoveOutBundle && (
            <div className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md`}>
              <span className="flex items-center gap-1">
                <CubeIcon className="h-3 w-3" />
                Bundle
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1">
              <TagIcon className="h-3 w-3 text-ubc-blue" />
              {listing.category}
            </span>
          </div>
          
          {/* Price Badge */}
          <div className={`absolute bottom-3 right-3 ${priceColor} text-sm font-bold px-4 py-2 rounded-xl shadow-md`}>
            {priceDisplay}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-ubc-blue transition-colors text-lg">
            {listing.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <MapPinIcon className="h-4 w-4 text-ubc-blue" />
              <span className="truncate max-w-[100px]">{listing.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <CalendarIcon className="h-4 w-4 text-ubc-blue" />
              <span>{format(new Date(listing.availableDate), 'MMM d')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
