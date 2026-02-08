'use client';

import { ReactNode } from 'react';
import {
  CubeIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface EmptyStateProps {
  type?: 'listings' | 'messages' | 'search' | 'favorites' | 'default';
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  type = 'default',
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps): ReactNode {
  const getIcon = () => {
    const iconClass = "h-20 w-20 text-gray-200";
    switch (type) {
      case 'listings':
        return <CubeIcon className={iconClass} />;
      case 'messages':
        return <ChatBubbleLeftRightIcon className={iconClass} />;
      case 'search':
        return <MagnifyingGlassIcon className={iconClass} />;
      case 'favorites':
        return <HeartIcon className={iconClass} />;
      default:
        return <ShoppingBagIcon className={iconClass} />;
    }
  };

  const defaultTitles: Record<string, string> = {
    listings: 'No listings yet',
    messages: 'No messages yet',
    search: 'No results found',
    favorites: 'No favorites yet',
    default: 'Nothing here yet',
  };

  const defaultDescriptions: Record<string, string> = {
    listings: 'Be the first to list an item and start trading with fellow students!',
    messages: 'Start a conversation by reaching out on a listing you like.',
    search: 'Try adjusting your search or filters to find what you\'re looking for.',
    favorites: 'Save items you love by clicking the heart icon on any listing.',
    default: 'Get started by exploring our marketplace.',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-ubc-blue/10 to-primary/10 rounded-full blur-3xl" />
        <div className="relative bg-white rounded-full p-6 shadow-xl">
          {getIcon()}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title || defaultTitles[type]}
      </h3>
      
      <p className="text-gray-500 max-w-md mb-8 text-lg">
        {description || defaultDescriptions[type]}
      </p>
      
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ubc-blue to-primary text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          {actionLabel}
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
