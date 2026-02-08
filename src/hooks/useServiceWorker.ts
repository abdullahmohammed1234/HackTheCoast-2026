'use client';

import { useState, useEffect } from 'react';

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          setRegistration(reg);
        })
        .catch(err => {
          setError(err.message);
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);

  return { registration, error };
}
