declare module 'web-push' {
  interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  interface VapidDetails {
    subject: string;
    publicKey: string;
    privateKey: string;
    expiration?: number;
  }

  interface WebPushError extends Error {
    statusCode: number;
  }

  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string,
    expiration?: number
  ): void;

  export function generateVAPIDKeys(): {
    publicKey: string;
    privateKey: string;
  };

  export function sendNotification(
    subscription: PushSubscription,
    payload?: string | Buffer,
    options?: {
      timeout?: number;
      TTL?: number;
      headers?: Record<string, string>;
    }
  ): Promise<void>;

  export function deleteSubscription(
    endpoint: string
  ): Promise<void>;
}
