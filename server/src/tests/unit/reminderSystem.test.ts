import { ReminderSystem } from '../../services/reminderSystem';
import { mockPublishToPubSub, mockSendPushNotification } from '../mocks/providerMocks';

jest.mock('../../utils/cloudProviders', () => ({
  publishToPubSub: (...args: any[]) => mockPublishToPubSub(...args),
  sendPushNotification: (...args: any[]) => mockSendPushNotification(...args)
}));

describe('ReminderSystem Unit Tests', () => {
  let reminderSystem: ReminderSystem;

  beforeEach(() => {
    reminderSystem = new ReminderSystem();
    jest.clearAllMocks();
  });

  describe('scheduleReminder()', () => {
    it('should successfully schedule a reminder and return the ID', async () => {
      // Arrange
      const futureDate = new Date(Date.now() + 100000); // Future
      mockPublishToPubSub.mockResolvedValue('pubsub_12345');

      // Act
      const result = await reminderSystem.scheduleReminder('user_1', futureDate, 'VOTING_DAY');

      // Assert
      expect(result.success).toBe(true);
      expect(result.reminderId).toBe('pubsub_12345');
      expect(mockPublishToPubSub).toHaveBeenCalledWith('reminders', {
        userId: 'user_1',
        targetDate: futureDate,
        eventType: 'VOTING_DAY'
      });
    });

    it('should throw an error if parameters are missing', async () => {
      // Act & Assert
      // @ts-ignore - intentional invalid call
      await expect(reminderSystem.scheduleReminder(null, new Date(), 'TYPE')).rejects.toThrow('Invalid parameters');
    });

    it('should throw an error if target date is in the past', async () => {
      // Arrange
      const pastDate = new Date(Date.now() - 100000); // Past

      // Act & Assert
      await expect(reminderSystem.scheduleReminder('u1', pastDate, 'TYPE')).rejects.toThrow('Cannot schedule in the past');
      expect(mockPublishToPubSub).not.toHaveBeenCalled();
    });

    it('should throw an error if the cloud provider fails', async () => {
      // Arrange
      const futureDate = new Date(Date.now() + 10000);
      mockPublishToPubSub.mockRejectedValue(new Error('Cloud Error'));

      // Act & Assert
      await expect(reminderSystem.scheduleReminder('u1', futureDate, 'TYPE')).rejects.toThrow('Failed to schedule reminder');
    });
  });

  describe('triggerNudge()', () => {
    it('should return success true when notification is delivered', async () => {
      // Arrange
      mockSendPushNotification.mockResolvedValue(undefined);

      // Act
      const result = await reminderSystem.triggerNudge('user_1', 'Go vote!');

      // Assert
      expect(result.success).toBe(true);
      expect(result.delivered).toBe(true);
      expect(mockSendPushNotification).toHaveBeenCalledWith('user_1', 'Go vote!');
    });

    it('should return false if missing payload', async () => {
      // Act
      const result = await reminderSystem.triggerNudge('', 'Go vote!');

      // Assert
      expect(result.success).toBe(false);
      expect(result.delivered).toBe(false);
      expect(result.error).toBe('Missing payload');
      expect(mockSendPushNotification).not.toHaveBeenCalled();
    });

    it('should handle notification failures gracefully without crashing', async () => {
      // Arrange
      mockSendPushNotification.mockRejectedValue(new Error('FCM token expired'));

      // Act
      const result = await reminderSystem.triggerNudge('user_1', 'Go vote!');

      // Assert
      expect(result.success).toBe(false);
      expect(result.delivered).toBe(false);
    });
  });
});
