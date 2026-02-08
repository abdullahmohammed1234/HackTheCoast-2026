'use client';

import { useState } from 'react';
import { UserMinusIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface BlockButtonProps {
  userId: string;
  userName?: string;
  variant?: 'button' | 'text' | 'icon';
  onBlock?: () => void;
}

export default function BlockButton({ userId, userName, variant = 'button', onBlock }: BlockButtonProps) {
  const [isBlocking, setIsBlocking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleBlock = async () => {
    setIsBlocking(true);
    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedId: userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to block user');
      }

      setShowConfirm(false);
      router.refresh();
      if (onBlock) onBlock();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsBlocking(false);
    }
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Block user"
        >
          <UserMinusIcon className="h-5 w-5" />
        </button>

        {showConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div 
                className="fixed inset-0 bg-gray-500/75 transition-opacity" 
                onClick={() => setShowConfirm(false)}
              />
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Block User</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to block {userName || 'this user'}? 
                    They won't be able to message you or see your listings.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBlock}
                      disabled={isBlocking}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isBlocking ? 'Blocking...' : 'Block'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (variant === 'text') {
    return (
      <>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
        >
          <UserMinusIcon className="h-4 w-4" />
          Block User
        </button>

        {showConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div 
                className="fixed inset-0 bg-gray-500/75 transition-opacity" 
                onClick={() => setShowConfirm(false)}
              />
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Block User</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to block {userName || 'this user'}?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBlock}
                      disabled={isBlocking}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isBlocking ? 'Blocking...' : 'Block'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        <UserMinusIcon className="h-5 w-5" />
        Block User
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500/75 transition-opacity" 
              onClick={() => setShowConfirm(false)}
            />
            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Block User</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to block {userName || 'this user'}? 
                  They won't be able to message you or see your listings.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBlock}
                    disabled={isBlocking}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isBlocking ? 'Blocking...' : 'Block'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
