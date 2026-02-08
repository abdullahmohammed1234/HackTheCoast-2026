'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserMinusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface BlockedUser {
  _id: string;
  blockedId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function BlockedUsersList() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch('/api/blocks');
      const data = await response.json();
      if (response.ok) {
        setBlockedUsers(data.blocks || []);
      }
    } catch (error) {
      console.error('Failed to fetch blocked users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblock = async (blockedUserId: string) => {
    setUnblockingId(blockedUserId);
    try {
      const response = await fetch(`/api/blocks?userId=${blockedUserId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlockedUsers((prev) => prev.filter((u) => u.blockedId._id !== blockedUserId));
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('Failed to unblock user:', error);
    } finally {
      setUnblockingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-100 rounded-xl">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blockedUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Blocked Users</h3>
        <p className="text-gray-500">
          You haven't blocked any users yet. Blocked users won't appear in your messages or searches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blockedUsers.map((block) => (
        <div
          key={block._id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {block.blockedId.avatar ? (
                <img
                  src={block.blockedId.avatar}
                  alt={block.blockedId.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{block.blockedId.name}</p>
              <p className="text-sm text-gray-500">
                Blocked on {new Date(block.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleUnblock(block.blockedId._id)}
            disabled={unblockingId === block.blockedId._id}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-ubc-blue hover:text-ubc-blue/80 font-medium transition-colors disabled:opacity-50"
          >
            <UserMinusIcon className="h-4 w-4" />
            {unblockingId === block.blockedId._id ? 'Unblocking...' : 'Unblock'}
          </button>
        </div>
      ))}
    </div>
  );
}
