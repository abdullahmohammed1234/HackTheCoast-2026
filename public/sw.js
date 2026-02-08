// Service Worker for Exchangify Push Notifications
// This file handles push event listeners and notification interactions

const CACHE_NAME = 'exchangify-v1';

// Handle push notifications
self.addEventListener('push', function (event) {
  if (!event.data) return;

  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    vibrate: [100, 50, 100],
    requireInteraction: true,
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const data = event.notification.data;
  let url = '/';

  // Determine the URL based on notification type
  if (data && data.url) {
    url = data.url;
  } else if (event.action === 'reply') {
    // Handle reply action
    if (data && data.conversationId) {
      url = `/messages?conversation=${data.conversationId}&reply=true`;
    }
  } else if (event.action === 'view' || event.action === 'viewDetails') {
    if (data && data.listingId) {
      url = `/listings/${data.listingId}`;
    } else if (data && data.messageId) {
      url = `/messages?message=${data.messageId}`;
    } else if (data && data.offerId) {
      url = `/offers?offer=${data.offerId}`;
    }
  } else if (event.action === 'buy' || event.action === 'accept') {
    if (data && data.listingId) {
      url = `/listings/${data.listingId}?action=buy`;
    } else if (data && data.offerId) {
      url = `/offers?offer=${data.offerId}&action=accept`;
    }
  } else if (event.action === 'decline') {
    if (data && data.offerId) {
      url = `/offers?offer=${data.offerId}&action=decline`;
    }
  } else if (event.action === 'wishlist') {
    if (data && data.listingId) {
      url = `/listings/${data.listingId}?action=wishlist`;
    }
  }

  // Open or focus the window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Check if there's already a window open
      for (const client of clientList) {
        if ('focus' in client && client.url === url) {
          return client.focus();
        }
      }
      // Open a new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close event (for analytics)
self.addEventListener('notificationclose', function (event) {
  const data = event.notification.data;
  // You can send analytics data to your server here
  console.log('Notification closed:', data);
});

// Handle service worker installation
self.addEventListener('install', function (event) {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', function (event) {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});
