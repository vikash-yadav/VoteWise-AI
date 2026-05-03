import { publishToPubSub, sendPushNotification } from '../utils/cloudProviders';

/**
 * Representation of an event-driven Reminder System.
 */
export class ReminderSystem {
  /**
   * Schedules a reminder for a specific event.
   */
  public async scheduleReminder(userId: string, targetDate: Date, eventType: string) {
    if (!userId || !targetDate || !eventType) {
      throw new Error("Invalid parameters");
    }
    
    if (targetDate.getTime() < Date.now()) {
      throw new Error("Cannot schedule in the past");
    }
    
    try {
      const id = await publishToPubSub('reminders', { userId, targetDate, eventType });
      console.log(`[Reminder System] Scheduled ${eventType} reminder for user ${userId}`);
      return { success: true, reminderId: id };
    } catch (error) {
      console.error('[Reminder System] Scheduling failed', error);
      throw new Error("Failed to schedule reminder");
    }
  }

  /**
   * Immediately triggers a push notification nudge to a user.
   */
  public async triggerNudge(userId: string, message: string) {
    if (!userId || !message) {
      return { success: false, delivered: false, error: "Missing payload" };
    }

    try {
      await sendPushNotification(userId, message);
      console.log(`[Reminder System] Sending nudge to ${userId}: ${message}`);
      return { success: true, delivered: true };
    } catch (error) {
      console.error('[Reminder System] Nudge failed', error);
      return { success: false, delivered: false };
    }
  }
}
