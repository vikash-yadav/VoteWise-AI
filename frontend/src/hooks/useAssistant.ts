import { useState, useRef, useEffect, FormEvent } from 'react';
import { ApiService } from '../services/api';
import { TRANSLATIONS } from '../config/constants';

export interface Message {
  role: 'bot' | 'user';
  content: string;
}

export interface AssistantConfig {
  user: any;
  voterData: any;
  lang: 'en' | 'hi';
}

/**
 * Custom hook to manage Assistant state and AI interactions.
 * Isolates business logic from presentation.
 * 
 * @param {AssistantConfig} config User configuration.
 */
export function useAssistant({ user, voterData, lang }: AssistantConfig) {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', content: t.greeting(voterData) }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = newMessages.slice(1).map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const context = {
        userId: user?.uid || 'anonymous',
        name: voterData?.voterName || user?.displayName || 'Citizen',
        state: voterData?.state || 'Unknown',
        constituency: voterData?.constituency || 'Unknown',
        language: lang
      };

      const data = await ApiService.sendMessage(userMsg, context, history.slice(0, -1));
      setMessages([...newMessages, { role: 'bot', content: data.success ? data.response : t.errorGeneral }]);
    } catch {
      setMessages([...newMessages, { role: 'bot', content: t.errorServer }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    t,
    messages,
    input,
    setInput,
    isLoading,
    messagesEndRef,
    sendMessage
  };
}
