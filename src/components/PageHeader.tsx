'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  showBackButton = false,
  onBack,
  action,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`bg-gradient-to-br from-ubc-blue via-ubc-blue to-primary pt-20 pb-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={onBack}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-white/80 mt-1 text-base md:text-lg">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}
