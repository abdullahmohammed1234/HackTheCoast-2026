export interface INotificationPreferences {
  pushEnabled: boolean;
  newMessageNotifications: boolean;
  newListingNotifications: boolean;
  wishlistMatchNotifications: boolean;
  offerNotifications: boolean;
}

export const defaultNotificationPreferences: INotificationPreferences = {
  pushEnabled: true,
  newMessageNotifications: true,
  newListingNotifications: true,
  wishlistMatchNotifications: true,
  offerNotifications: true,
};
