export const mockSearchKnowledgeBase = jest.fn();
export const mockGenerateWithLLM = jest.fn();
export const mockPublishToPubSub = jest.fn();
export const mockSendPushNotification = jest.fn();

jest.mock('../../utils/aiProviders', () => ({
  searchKnowledgeBase: mockSearchKnowledgeBase,
  generateWithLLM: mockGenerateWithLLM
}));

jest.mock('../../utils/cloudProviders', () => ({
  publishToPubSub: mockPublishToPubSub,
  sendPushNotification: mockSendPushNotification
}));
