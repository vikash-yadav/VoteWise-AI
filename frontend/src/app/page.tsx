"use client";

import { useState, useEffect } from 'react';
import { auth, provider, signInWithPopup, signOut } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Dashboard from '../components/Dashboard';
import Assistant from '../components/Assistant';
import Timeline from '../components/Timeline';
import Checklist from '../components/Checklist';
import { API_URL } from '../lib/config';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [voterData, setVoterData] = useState<any>(null);

  const tabs = [
    { id: 'dashboard', label: lang === 'hi' ? 'डैशबोर्ड' : 'DASHBOARD', icon: '⊞' },
    { id: 'assistant', label: lang === 'hi' ? 'सहायक' : 'ASSISTANT', icon: '💬' },
    { id: 'timeline', label: lang === 'hi' ? 'समयरेखा' : 'TIMELINE', icon: '📅' },
    { id: 'checklist', label: lang === 'hi' ? 'चेकलिस्ट' : 'CHECKLIST', icon: '☑️' },
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      if (!u) setVoterData(null);
    });
    return () => unsub();
  }, []);

  // Fetch voter profile when user logs in
  useEffect(() => {
    if (user && !voterData) {
      fetch(`${API_URL}/api/v1/voter-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, displayName: user.displayName, email: user.email })
      })
        .then(r => r.json())
        .then(d => { if (d.success) setVoterData(d.data); })
        .catch(console.error);
    }
  }, [user]);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, provider); } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); setVoterData(null); } catch (e) { console.error(e); }
  };

  return (
    <main style={{ padding: '1rem 1.5rem', paddingBottom: '90px', minHeight: '100vh' }}>
      {/* Header */}
      <header className="app-header">
        {/* Clickable Logo — always goes to Dashboard */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('dashboard')}
          role="button"
          tabIndex={0}
          aria-label="Go to Dashboard"
        >
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>⊞</div>
          <div>
            <h1 style={{ fontSize: '1.3rem', margin: 0 }}>
              <span style={{ color: 'var(--primary-color)' }}>VoteWise</span>{' '}
              <span style={{ color: 'var(--accent-color)' }}>AI</span>
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600, letterSpacing: '1px' }}>
              {lang === 'hi' ? 'आपका व्यक्तिगत नागरिक सहायक' : 'YOUR PERSONAL CIVIC ASSISTANT'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{ background: 'var(--surface-border)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'var(--text-primary)' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
            <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिंदी</button>
          </div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0, letterSpacing: '0.5px' }}>CITIZEN ID: {user.uid.slice(0, 8).toUpperCase()}</p>
                <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{user.displayName}</p>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-secondary)', padding: '4px' }} title="Sign Out">↪</button>
            </div>
          ) : (
            <button className="button-primary" style={{ borderRadius: '12px', padding: '10px 20px', fontSize: '0.85rem' }} onClick={handleLogin}>Sign In</button>
          )}
        </div>
      </header>

      {/* Active View */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {activeTab === 'dashboard' && <Dashboard user={user} voterData={voterData} onTabChange={setActiveTab} lang={lang} />}
        {activeTab === 'assistant' && <Assistant user={user} voterData={voterData} lang={lang} />}
        {activeTab === 'timeline' && <Timeline lang={lang} />}
        {activeTab === 'checklist' && <Checklist voterData={voterData} onTabChange={setActiveTab} lang={lang} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span className="nav-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
