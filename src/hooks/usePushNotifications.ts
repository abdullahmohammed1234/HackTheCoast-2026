'use client';

import { useState, useEffect, useCallback } from 'react';

interface PushSubscriptionState {
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  loading: boolean;
  error: string | null;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushSubscriptionState>({
    isSupported: false,
    isSubscribed: false,
    subscription: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const init = async () => {
      const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;

      if (!isSupported) {
        setState(prev => ({ ...prev, isSupported: false, loading: false }));
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        setState({
          isSupported: true,
          isSubscribed: !!subscription,
          subscription,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          isSupported: true,
          isSubscribed: false,
          subscription: null,
          loading: false,
          error: 'Failed to check subscription status',
        });
      }
    };

    init();
  }, []);

  const subscribe = useCallback(async (vapidPublicKey: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Register service worker if not already registered
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as ArrayBuffer,
      });

      // Send subscription to server
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription,
        loading: false,
      }));

      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to subscribe',
      }));
      return false;
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const subscription = state.subscription;
      if (!subscription) return false;

      // Unsubscribe from push
      await subscription.unsubscribe();

      // Notify server
      await fetch(`/api/notifications/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`, {
        method: 'DELETE',
      });

      setState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
        loading: false,
      }));

      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to unsubscribe',
      }));
      return false;
    }
  }, [state.subscription]);

  return {
    ...state,
    subscribe,
    unsubscribe,
  };
}

// Helper function to convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
