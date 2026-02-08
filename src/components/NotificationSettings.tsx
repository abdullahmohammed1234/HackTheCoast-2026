'use client';

import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { INotificationPreferences } from '@/types/notifications';

interface NotificationSettingsProps {
  onClose?: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const { isSupported, isSubscribed, subscribe, unsubscribe, loading: pushLoading } = usePushNotifications();
  const [preferences, setPreferences] = useState<INotificationPreferences>({
    pushEnabled: true,
    newMessageNotifications: true,
    newListingNotifications: true,
    wishlistMatchNotifications: true,
    offerNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [vapidKey, setVapidKey] = useState<string | null>(null);

  useEffect(() => {
    // Fetch VAPID key
    fetch('/api/notifications/vapid-key')
      .then(res => res.json())
      .then(data => {
        if (data.publicKey) {
          setVapidKey(data.publicKey);
        }
      })
      .catch(console.error);

    // Fetch preferences
    fetch('/api/notifications/preferences')
      .then(res => res.json())
      .then(data => {
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else if (vapidKey) {
      await subscribe(vapidKey);
    }
  };

  const updatePreference = <K extends keyof INotificationPreferences>(
    key: K,
    value: INotificationPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Push Notifications */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Push Notifications</h3>
        
        {isSupported ? (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Enable push notifications</p>
              <p className="text-sm text-gray-500">Get instant notifications on your device</p>
            </div>
            <button
              onClick={handlePushToggle}
              disabled={pushLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isSubscribed ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isSubscribed ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Your browser doesn't support push notifications
          </p>
        )}
      </div>

      {/* Notification Types */}
      {isSubscribed && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Types</h3>
          <div className="space-y-3">
            {[
              { key: 'newMessageNotifications', label: 'New messages', icon: '💬' },
              { key: 'newListingNotifications', label: 'New listings in your area', icon: '📦' },
              { key: 'wishlistMatchNotifications', label: 'Wishlist matches', icon: '🎯' },
              { key: 'offerNotifications', label: 'New offers', icon: '💰' },
            ].map(({ key, label, icon }) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <span className="text-gray-700">{icon} {label}</span>
                <input
                  type="checkbox"
                  checked={preferences[key as keyof INotificationPreferences] as boolean}
                  onChange={(e) => updatePreference(key as keyof INotificationPreferences, e.target.checked)}
                  className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
