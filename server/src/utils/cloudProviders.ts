/**
 * Mock representation of Cloud Providers (PubSub, FCM)
 */
export const publishToPubSub = async (topic: string, payload: any): Promise<string> => {
  return `pubsub_${Date.now()}`;
};

export const sendPushNotification = async (userId: string, message: string): Promise<void> => {
  // Simulates push notification
};
