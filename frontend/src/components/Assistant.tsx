"use client";
import React, { useState, useRef, useEffect } from 'react';
import { API_URL } from '../lib/config';

interface Message {
  role: 'bot' | 'user';
  content: string;
}

interface AssistantProps {
  user: any;
  voterData: any;
  lang: 'en' | 'hi';
}

export default function Assistant({ user, voterData, lang }: AssistantProps) {
  const t = {
    en: {
      headerTitle: 'VoteWise Assistant',
      headerSub: '● GEMINI AI · CONTEXT GROUNDED',
      headerLive: 'LIVE',
      errorServer: 'Unable to reach the server. Please check if the backend is running on port 3001.',
      errorGeneral: 'Sorry, something went wrong. Please try again.',
      placeholder: 'Ask anything about elections, registration, or your constituency...',
      greeting: (voter: any) => voter
        ? `Namaste ${voter.voterName?.split(' ')[0]}! I'm VoteWise AI, powered by Google Gemini.\n\nYou are registered in **${voter.constituency}**, and your polling booth is **${voter.pollingBooth?.name}**.\n\nI can help with voter registration, eligibility, documents, polling booth directions, and more. Just ask!`
        : `Namaste! I'm VoteWise AI, your intelligent civic assistant. Ask me anything about Indian elections!`
    },
    hi: {
      headerTitle: 'VoteWise सहायक',
      headerSub: '● GEMINI AI · संदर्भ आधारित',
      headerLive: 'लाइव',
      errorServer: 'सर्वर तक पहुँचने में असमर्थ। कृपया जाँचें कि क्या बैकएंड पोर्ट 3001 पर चल रहा है।',
      errorGeneral: 'क्षमा करें, कुछ गलत हो गया। कृपया पुन: प्रयास करें।',
      placeholder: 'चुनाव, पंजीकरण, या अपने निर्वाचन क्षेत्र के बारे में कुछ भी पूछें...',
      greeting: (voter: any) => voter
        ? `नमस्ते ${voter.voterName?.split(' ')[0]}! मैं VoteWise AI हूँ, Google Gemini द्वारा संचालित।\n\nआप **${voter.constituency}** में पंजीकृत हैं, और आपका मतदान केंद्र **${voter.pollingBooth?.name}** है।\n\nमैं मतदाता पंजीकरण, पात्रता, दस्तावेज, मतदान केंद्र, चुनाव तिथि आदि में आपकी सहायता कर सकता हूँ। पूछिए!`
        : `नमस्ते! मैं VoteWise AI हूँ, आपका बुद्धिमान नागरिक सहायक। मतदाता पंजीकरण, पात्रता, दस्तावेज, मतदान केंद्र आदि के बारे में कुछ भी पूछें!`
    }
  }[lang];

  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', content: t.greeting(voterData) }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const res = await fetch(`${API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          userId: user?.uid || 'anonymous',
          history: history.slice(0, -1),
          userContext: {
            name: voterData?.voterName || user?.displayName || 'Citizen',
            state: voterData?.state || 'Unknown',
            constituency: voterData?.constituency || 'Unknown',
            assemblyConstituency: voterData?.assemblyConstituency || 'Unknown',
            epicNumber: voterData?.epicNumber || 'Unknown',
            boothName: voterData?.pollingBooth?.name || 'Unknown',
            boothAddress: voterData?.pollingBooth?.address || 'Unknown',
            language: lang,
            step: 0
          }
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'bot', content: data.success ? data.response : t.errorGeneral }]);
    } catch {
      setMessages([...newMessages, { role: 'bot', content: t.errorServer }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container animate-fade-in">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏛️</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{t.headerTitle}</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600 }}>{t.headerSub}</p>
          </div>
        </div>
        <span className="badge badge-active">{t.headerLive}</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-bubble ${msg.role === 'bot' ? 'message-bot' : 'message-user'}`}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble message-bot">
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          className="input-field"
          style={{ borderRadius: '24px' }}
          placeholder={t.placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="button-primary" style={{ borderRadius: '50%', width: 48, height: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }} disabled={isLoading}>
          💬
        </button>
      </form>
    </div>
  );
}
