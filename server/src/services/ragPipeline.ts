import { searchKnowledgeBase, generateWithLLM } from '../utils/aiProviders';

/**
 * Representation of a RAG pipeline utilizing Vector Search and LLMs.
 */
export class RAGPipeline {
  /**
   * Generates a grounded response based on civic knowledge base.
   * @param {string} query User's query
   * @param {any} userContext Contextual information about the user
   */
  public async generateGroundedResponse(query: string, userContext: any): Promise<string> {
    if (!query || query.trim() === '') {
      throw new Error("Query cannot be empty");
    }
    
    try {
      console.log(`[RAG] Searching knowledge base for: ${query}`);
      const documents = await searchKnowledgeBase(query);
      
      if (!documents || documents.length === 0) {
        return "I couldn't find specific information on that. Please check eci.gov.in.";
      }
      
      return await generateWithLLM(query, documents, userContext);
    } catch (error) {
      console.error('[RAG] Pipeline failed:', error);
      return "I'm experiencing delays accessing the knowledge base. Please try again.";
    }
  }
}
