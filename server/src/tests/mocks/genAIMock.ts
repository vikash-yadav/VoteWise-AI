/**
 * Mocks the Google Generative AI SDK for testing purposes.
 * Supports simulating successful responses, prompt injections, and API failures.
 */
export const mockGenerateContent = jest.fn();
export const mockSendMessage = jest.fn();
export const mockStartChat = jest.fn().mockReturnValue({
  sendMessage: mockSendMessage
});

export const mockGetGenerativeModel = jest.fn().mockReturnValue({
  startChat: mockStartChat,
  generateContent: mockGenerateContent
});

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    })
  };
});
