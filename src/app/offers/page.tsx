'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DollarSign, MessageSquare, CheckCircle, X, Clock, Send, ArrowLeft, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

interface Offer {
  _id: string;
  listingId: {
    _id: string;
    title: string;
    price: number;
    imageUrl?: string;
  };
  buyerId: {
    _id: string;
    name: string;
    email: string;
  };
  sellerId: {
    _id: string;
    name: string;
    email: string;
  };
  offeredPrice: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
  counterPrice?: number;
  createdAt: string;
}

export default function OffersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'received' | 'sent'>('all');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchOffers();
    }
  }, [session, filter]);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`/api/offers?type=${filter}`);
      const data = await res.json();
      if (res.ok) {
        setOffers(data.offers);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'reject' | 'counter' | 'withdraw', counterPrice?: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : action === 'counter' ? 'countered' : 'withdrawn',
          ...(counterPrice && { counterPrice })
        }),
      });

      if (res.ok) {
        fetchOffers();
        setSelectedOffer(null);
      }
    } catch (error) {
      console.error('Failed to update offer:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      countered: 'bg-blue-100 text-blue-800',
      withdrawn: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageHeader
        title="My Offers"
        description="Manage your buying and selling offers"
        showBackButton
        onBack={() => router.back()}
        action={
          <div className="flex gap-2">
            {(['all', 'received', 'sent'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === type
                    ? 'bg-white text-primary'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {type === 'all' ? 'All' : type === 'received' ? 'Received' : 'Sent'}
              </button>
            ))}
          </div>
        }
      />

      {/* Offers List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {offers.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? "You haven't made or received any offers yet."
                : filter === 'received'
                ? "You haven't received any offers on your listings."
                : "You haven't made any offers on listings."}
            </p>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-ubc-blue transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => {
              const isBuyer = offer.buyerId._id === session?.user?.id;
              const isSeller = offer.sellerId._id === session?.user?.id;
              
              return (
                <div
                  key={offer._id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Listing Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {offer.listingId.imageUrl ? (
                        <img
                          src={offer.listingId.imageUrl}
                          alt={offer.listingId.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <DollarSign className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Offer Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/listings/${offer.listingId._id}`}
                            className="font-semibold text-gray-900 hover:text-primary transition-colors"
                          >
                            {offer.listingId.title}
                          </Link>
                          <p className="text-sm text-gray-500">
                            Listed at: ${offer.listingId.price}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(offer.status)}`}>
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            ${offer.offeredPrice.toFixed(2)}
                          </span>
                          {offer.counterPrice && (
                            <span className="text-gray-500">
                              (Counter: ${offer.counterPrice.toFixed(2)})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          {format(new Date(offer.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>

                      {offer.message && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                          "{offer.message}"
                        </p>
                      )}

                      {/* Action Buttons */}
                      {offer.status === 'pending' && (
                        <div className="mt-4 flex gap-2">
                          {isSeller && (
                            <>
                              <button
                                onClick={() => handleOfferAction(offer._id, 'accept')}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleOfferAction(offer._id, 'counter', offer.offeredPrice * 0.9)}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                Counter
                              </button>
                              <button
                                onClick={() => handleOfferAction(offer._id, 'reject')}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {isBuyer && (
                            <button
                              onClick={() => handleOfferAction(offer._id, 'withdraw')}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Withdraw
                            </button>
                          )}
                        </div>
                      )}

                      {/* Contact Button */}
                      {offer.status !== 'withdrawn' && (
                        <button
                          onClick={() => {
                            // Navigate to messages with pre-filled content
                            const message = `Hi! I'm responding to your offer on "${offer.listingId.title}"`;
                            router.push(`/messages?receiverId=${isSeller ? offer.buyerId._id : offer.sellerId._id}&message=${encodeURIComponent(message)}`);
                          }}
                          className="mt-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Contact {isSeller ? 'Buyer' : 'Seller'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
