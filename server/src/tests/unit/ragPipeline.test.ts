import { RAGPipeline } from '../../services/ragPipeline';
import { mockSearchKnowledgeBase, mockGenerateWithLLM } from '../mocks/providerMocks';

jest.mock('../../utils/aiProviders', () => ({
  searchKnowledgeBase: (...args: any[]) => mockSearchKnowledgeBase(...args),
  generateWithLLM: (...args: any[]) => mockGenerateWithLLM(...args)
}));

describe('RAGPipeline Unit Tests', () => {
  let pipeline: RAGPipeline;

  beforeEach(() => {
    pipeline = new RAGPipeline();
    jest.clearAllMocks();
  });

  describe('generateGroundedResponse()', () => {
    it('should throw an error if the query is empty', async () => {
      // Act & Assert
      await expect(pipeline.generateGroundedResponse('', {})).rejects.toThrow('Query cannot be empty');
      await expect(pipeline.generateGroundedResponse('   ', {})).rejects.toThrow('Query cannot be empty');
      expect(mockSearchKnowledgeBase).not.toHaveBeenCalled();
    });

    it('should return a generated LLM response on successful retrieval', async () => {
      // Arrange
      const mockDocs = ['Rule 1', 'Rule 2'];
      mockSearchKnowledgeBase.mockResolvedValue(mockDocs);
      mockGenerateWithLLM.mockResolvedValue('Here is your civic answer.');

      // Act
      const response = await pipeline.generateGroundedResponse('How to vote', { userId: '123' });

      // Assert
      expect(response).toBe('Here is your civic answer.');
      expect(mockSearchKnowledgeBase).toHaveBeenCalledWith('How to vote');
      expect(mockGenerateWithLLM).toHaveBeenCalledWith('How to vote', mockDocs, { userId: '123' });
    });

    it('should return a fallback message if no documents are retrieved', async () => {
      // Arrange
      mockSearchKnowledgeBase.mockResolvedValue([]);

      // Act
      const response = await pipeline.generateGroundedResponse('Obscure query', {});

      // Assert
      expect(response).toBe("I couldn't find specific information on that. Please check eci.gov.in.");
      expect(mockGenerateWithLLM).not.toHaveBeenCalled();
    });

    it('should handle search provider failures gracefully', async () => {
      // Arrange
      mockSearchKnowledgeBase.mockRejectedValue(new Error('Vector DB Timeout'));

      // Act
      const response = await pipeline.generateGroundedResponse('How to vote', {});

      // Assert
      expect(response).toBe("I'm experiencing delays accessing the knowledge base. Please try again.");
    });

    it('should handle LLM generation failures gracefully', async () => {
      // Arrange
      mockSearchKnowledgeBase.mockResolvedValue(['Valid doc']);
      mockGenerateWithLLM.mockRejectedValue(new Error('LLM Quota Exceeded'));

      // Act
      const response = await pipeline.generateGroundedResponse('How to vote', {});

      // Assert
      expect(response).toBe("I'm experiencing delays accessing the knowledge base. Please try again.");
    });
  });
});
