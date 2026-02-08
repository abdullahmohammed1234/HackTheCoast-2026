'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  TagIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import MeetupScheduler from './MeetupScheduler';
import LocationPicker from './LocationPicker';
import { UBCLocation } from '@/lib/ubcLocations';

interface Transaction {
  _id: string;
  listingId: {
    _id: string;
    title: string;
    imageUrl?: string;
  };
  buyerId: {
    _id: string;
    name: string;
  };
  sellerId: {
    _id: string;
    name: string;
  };
  finalPrice: number;
  type: 'sale' | 'purchase' | 'trade';
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'disputed';
  meetupLocation?: {
    name: string;
    address: string;
  };
  meetupDate?: string;
  completedAt?: string;
  createdAt: string;
}

export default function TransactionHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sales' | 'purchases'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchTransactions();
    }
  }, [session, filter]);

  const fetchTransactions = async () => {
    try {
      const typeParam = filter === 'sales' ? 'seller' : filter === 'purchases' ? 'buyer' : 'all';
      const res = await fetch(`/api/transactions?type=${typeParam}`);
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTransaction = async (transactionId: string) => {
    try {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (res.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Failed to complete transaction:', error);
    }
  };

  const handleScheduleMeetup = async (date: any, location: UBCLocation) => {
    if (!selectedTransaction) return;
    
    try {
      const res = await fetch(`/api/transactions/${selectedTransaction._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetupDate: date.date,
          meetupLocation: location,
          status: 'scheduled',
        }),
      });
      if (res.ok) {
        fetchTransactions();
        setShowScheduler(false);
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error('Failed to schedule meetup:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-700',
      disputed: 'bg-red-100 text-red-700',
      scheduled: 'bg-blue-100 text-blue-700',
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: <ClockIcon className="h-4 w-4" />,
      completed: <CheckCircleIcon className="h-4 w-4" />,
      cancelled: <XCircleIcon className="h-4 w-4" />,
      disputed: <XCircleIcon className="h-4 w-4" />,
      scheduled: <CalendarIcon className="h-4 w-4" />,
    };
    return icons[status] || icons.pending;
  };

  const isSeller = (transaction: Transaction) => {
    return transaction.sellerId._id === session?.user?.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageHeader
        title="Transaction History"
        description="View and manage your completed sales and purchases"
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8 mt-6">
        {/* Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All', icon: CurrencyDollarIcon },
            { id: 'sales', label: 'Sales', icon: TagIcon },
            { id: 'purchases', label: 'Purchases', icon: ShoppingBagIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === item.id
                  ? 'bg-ubc-blue text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <EmptyState
            type="default"
            title="No transactions yet"
            description={filter === 'all' 
              ? "When you complete sales or purchases, they'll appear here"
              : filter === 'sales' 
              ? "Your completed sales will appear here"
              : "Your completed purchases will appear here"}
          />
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Listing Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {transaction.listingId.imageUrl ? (
                        <img
                          src={transaction.listingId.imageUrl}
                          alt={transaction.listingId.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBagIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {transaction.listingId.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {isSeller(transaction) 
                              ? `Sold to ${transaction.buyerId.name}`
                              : `Purchased from ${transaction.sellerId.name}`}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="capitalize">{transaction.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-bold text-xl text-gray-900">
                          ${transaction.finalPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
                          {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>

                      {transaction.meetupDate && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(new Date(transaction.meetupDate), 'MMM d, yyyy h:mm a')}</span>
                          {transaction.meetupLocation && (
                            <>
                              <span>•</span>
                              <MapPinIcon className="h-4 w-4" />
                              <span>{transaction.meetupLocation.name}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                  {['pending', 'scheduled'].includes(transaction.status) && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowScheduler(true);
                        }}
                        className="px-4 py-2 bg-ubc-blue text-white text-sm font-medium rounded-lg hover:bg-ubc-blue/90 transition-colors"
                      >
                        Schedule Meetup
                      </button>
                      {isSeller(transaction) && (
                        <button
                          onClick={() => handleCompleteTransaction(transaction._id)}
                          className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </>
                  )}
                  {transaction.status === 'scheduled' && (
                    <button
                      onClick={() => handleCompleteTransaction(transaction._id)}
                      className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Confirm Completed
                    </button>
                  )}
                  {transaction.status === 'completed' && (
                    <button className="px-4 py-2 text-ubc-blue text-sm font-medium hover:underline">
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meetup Scheduler Modal */}
      {showScheduler && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <MeetupScheduler
              listingTitle={selectedTransaction.listingId.title}
              otherPartyName={isSeller(selectedTransaction) 
                ? selectedTransaction.buyerId.name 
                : selectedTransaction.sellerId.name}
              onSchedule={handleScheduleMeetup}
              onCancel={() => {
                setShowScheduler(false);
                setSelectedTransaction(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
