"use client";
import React from 'react';
import { useAssistant } from '../hooks/useAssistant';

interface AssistantProps {
  user: any;
  voterData: any;
  lang: 'en' | 'hi';
}

/**
 * Assistant UI Component.
 * Fully stateless (business-logic wise). Delegates to useAssistant hook.
 */
export default function Assistant({ user, voterData, lang }: AssistantProps) {
  const {
    t,
    messages,
    input,
    setInput,
    isLoading,
    messagesEndRef,
    sendMessage
  } = useAssistant({ user, voterData, lang });

  return (
    <div className="chat-container animate-fade-in" role="complementary" aria-label="AI Civic Assistant">
      <header className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }} aria-hidden="true">🏛️</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{t.headerTitle}</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600 }}>{t.headerSub}</p>
          </div>
        </div>
        <span className="badge badge-active" aria-label="Assistant Status">{t.headerLive}</span>
      </header>

      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat history">
        {messages.map((msg, idx) => (
          <article key={idx} className={`message-bubble ${msg.role === 'bot' ? 'message-bot' : 'message-user'}`} aria-label={`${msg.role === 'bot' ? 'Assistant' : 'You'}: ${msg.content}`}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          </article>
        ))}
        {isLoading && (
          <div className="message-bubble message-bot" aria-busy="true" aria-label="Assistant is thinking">
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={sendMessage} aria-label="Send message to assistant">
        <input
          className="input-field"
          style={{ borderRadius: '24px' }}
          placeholder={t.placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
          aria-label="Your question"
          autoComplete="off"
        />
        <button 
          type="submit" 
          className="button-primary" 
          style={{ borderRadius: '50%', width: 48, height: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }} 
          disabled={isLoading || !input.trim()}
          aria-label="Send"
        >
          💬
        </button>
      </form>
    </div>
  );
}
