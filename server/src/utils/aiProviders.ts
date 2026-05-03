/**
 * Mock representation of AI and DB providers
 */
export const searchKnowledgeBase = async (query: string): Promise<string[]> => {
  return ['Document 1'];
};

export const generateWithLLM = async (query: string, docs: string[], context: any): Promise<string> => {
  return 'Generated response based on docs';
};
