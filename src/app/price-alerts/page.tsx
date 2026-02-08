'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  BellIcon, 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

interface PriceAlert {
  _id: string;
  name: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number | null;
  isActive: boolean;
  createdAt: Date;
}

export default function PriceAlertsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'all',
    location: 'all',
    minPrice: '',
    maxPrice: '',
  });

  const categories = ['all', 'Dorm', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Appliances', 'Other'];
  const locations = ['all', 'Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird'];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAlerts();
    }
  }, [status]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/price-alerts');
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Failed to fetch price alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          location: formData.location,
          minPrice: formData.minPrice ? parseFloat(formData.minPrice) : 0,
          maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts((prev) => [data.alert, ...prev]);
        setShowCreateForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create price alert:', error);
    }
  };

  const handleUpdateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlert) return;
    try {
      const res = await fetch('/api/price-alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: editingAlert._id,
          name: formData.name,
          category: formData.category,
          location: formData.location,
          minPrice: formData.minPrice ? parseFloat(formData.minPrice) : 0,
          maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts((prev) => prev.map((a) => (a._id === data.alert._id ? data.alert : a)));
        setEditingAlert(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to update price alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/price-alerts?alertId=${alertId}`, { method: 'DELETE' });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a._id !== alertId));
      }
    } catch (error) {
      console.error('Failed to delete price alert:', error);
    }
  };

  const handleToggleActive = async (alert: PriceAlert) => {
    try {
      const res = await fetch('/api/price-alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alert._id,
          isActive: !alert.isActive,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts((prev) => prev.map((a) => (a._id === data.alert._id ? data.alert : a)));
      }
    } catch (error) {
      console.error('Failed to toggle price alert:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'all',
      location: 'all',
      minPrice: '',
      maxPrice: '',
    });
  };

  const startEdit = (alert: PriceAlert) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      category: alert.category,
      location: alert.location,
      minPrice: alert.minPrice.toString(),
      maxPrice: alert.maxPrice?.toString() || '',
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHeader
        title="Price Alerts"
        description={`${alerts.length} ${alerts.length === 1 ? 'alert' : 'alerts'} active - Get notified when items matching your criteria are posted`}
        showBackButton
        onBack={() => router.back()}
      />

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Create/Edit Form */}
          {(showCreateForm || editingAlert) && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAlert ? 'Edit Price Alert' : 'Create Price Alert'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingAlert(null);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={editingAlert ? handleUpdateAlert : handleCreateAlert} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alert Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Looking for a bike"
                    className="input-modern"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-modern"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-modern"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc === 'all' ? 'All Locations' : loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($)</label>
                    <input
                      type="number"
                      value={formData.minPrice}
                      onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                      placeholder="0"
                      min="0"
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
                    <input
                      type="number"
                      value={formData.maxPrice}
                      onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                      placeholder="No max"
                      min="0"
                      className="input-modern"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingAlert(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-ubc-blue to-primary text-white px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <CheckIcon className="h-5 w-5" />
                    {editingAlert ? 'Save Changes' : 'Create Alert'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Create Button */}
          {!showCreateForm && !editingAlert && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8 hover:shadow-lg transition-shadow flex items-center justify-center gap-3 text-ubc-blue font-medium"
            >
              <PlusIcon className="h-6 w-6" />
              Create New Price Alert
            </button>
          )}

          {/* Alerts List */}
          {alerts.length === 0 && !showCreateForm ? (
            <EmptyState
              type="alerts"
              title="No price alerts yet"
              description="Create alerts to get notified when items matching your criteria are posted."
              actionLabel="Create Your First Alert"
              actionOnClick={() => setShowCreateForm(true)}
            />
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className={`bg-white rounded-2xl shadow-md border p-6 transition-all ${
                    alert.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${alert.isActive ? 'bg-ubc-blue/10' : 'bg-gray-100'}`}>
                        <BellIcon className={`h-6 w-6 ${alert.isActive ? 'text-ubc-blue' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{alert.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            {alert.category === 'all' ? 'All Categories' : alert.category}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            {alert.location === 'all' ? 'All Locations' : alert.location}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            ${alert.minPrice} - ${alert.maxPrice || '∞'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(alert)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          alert.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {alert.isActive ? 'Active' : 'Paused'}
                      </button>
                      <button
                        onClick={() => startEdit(alert)}
                        className="p-2 text-gray-400 hover:text-ubc-blue transition-colors"
                        title="Edit alert"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete alert"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
