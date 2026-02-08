import webpush from 'web-push';
import PushSubscription from '@/models/PushSubscription';
import User from '@/models/User';
import connectDB from './mongodb';

// Configure web-push with VAPID keys
// These should be set in environment variables
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:notifications@exchangify.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    type?: string;
    listingId?: string;
    messageId?: string;
    offerId?: string;
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export async function sendPushNotification(
  userId: string,
  notification: PushNotificationPayload
): Promise<{ success: number; failed: number }> {
  try {
    await connectDB();

    const subscriptions = await PushSubscription.find({ userId });

    if (subscriptions.length === 0) {
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/icon-192.png',
      badge: notification.badge || '/badge-72.png',
      tag: notification.tag,
      data: notification.data,
      actions: notification.actions,
      timestamp: Date.now(),
    });

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
          payload
        );
        success++;
      } catch (error: any) {
        // Remove invalid subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
          await PushSubscription.deleteOne({ _id: subscription._id });
        }
        failed++;
      }
    }

    return { success, failed };
  } catch (error) {
    console.error('Error sending push notifications:', error);
    return { success: 0, failed: 0 };
  }
}

export async function sendNewMessageNotification(
  recipientId: string,
  senderName: string,
  messagePreview: string,
  messageId: string,
  conversationId: string
): Promise<{ success: number; failed: number }> {
  // Check if user has message notifications enabled
  await connectDB();
  const user = await User.findById(recipientId);

  if (!user?.notificationPreferences?.newMessageNotifications) {
    return { success: 0, failed: 0 };
  }

  return sendPushNotification(recipientId, {
    title: `New message from ${senderName}`,
    body: messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: `message-${conversationId}`,
    data: {
      url: `/messages?conversation=${conversationId}`,
      type: 'new_message',
      messageId,
    },
    actions: [
      { action: 'reply', title: 'Reply' },
      { action: 'view', title: 'View' },
    ],
  });
}

export async function sendNewListingNotification(
  userId: string,
  listingTitle: string,
  listingPrice: number,
  listingId: string,
  category: string
): Promise<{ success: number; failed: number }> {
  return sendPushNotification(userId, {
    title: `New ${category} listing!`,
    body: `${listingTitle} - $${listingPrice}`,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: `listing-${listingId}`,
    data: {
      url: `/listings/${listingId}`,
      type: 'new_listing',
      listingId,
    },
    actions: [
      { action: 'view', title: 'View Listing' },
      { action: 'wishlist', title: 'Add to Wishlist' },
    ],
  });
}

export async function sendWishlistMatchNotification(
  userId: string,
  listingTitle: string,
  listingPrice: number,
  listingId: string
): Promise<{ success: number; failed: number }> {
  return sendPushNotification(userId, {
    title: '🎯 Wishlist Match!',
    body: `${listingTitle} is now available for $${listingPrice}`,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: `wishlist-${listingId}`,
    data: {
      url: `/listings/${listingId}`,
      type: 'wishlist_match',
      listingId,
    },
    actions: [
      { action: 'view', title: 'View Now' },
      { action: 'buy', title: 'Buy Now' },
    ],
  });
}

export async function sendOfferNotification(
  userId: string,
  offerAmount: number,
  listingTitle: string,
  offerId: string,
  listingId: string
): Promise<{ success: number; failed: number }> {
  return sendPushNotification(userId, {
    title: '💰 New Offer Received!',
    body: `Offer of $${offerAmount} for ${listingTitle}`,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: `offer-${offerId}`,
    data: {
      url: `/offers?listing=${listingId}`,
      type: 'new_offer',
      offerId,
    },
    actions: [
      { action: 'accept', title: 'Accept' },
      { action: 'decline', title: 'Decline' },
      { action: 'view', title: 'View Details' },
    ],
  });
}

export { webpush };
