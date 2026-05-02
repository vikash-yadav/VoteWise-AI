"use client";
import React, { useState } from 'react';

interface DashboardProps {
  user: any;
  voterData: any;
  onTabChange: (tab: string) => void;
  lang: 'en' | 'hi';
}

export default function Dashboard({ user, voterData, onTabChange, lang }: DashboardProps) {
  const [showMap, setShowMap] = useState(false);
  const daysRemaining = Math.max(0, Math.ceil((new Date('2026-06-01').getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const voter = voterData;

  const t = {
    en: {
      welcome: 'Welcome to VoteWise AI',
      welcomeSub: 'Sign in with Google to check your voter status, view your polling booth, and get personalized election guidance.',
      verifying: 'Verifying your voter status...',
      status: 'YOUR VOTER STATUS',
      verified: 'VERIFIED VOTER',
      pending: 'PENDING',
      epic: 'EPIC Number',
      partSerial: 'Part / Serial',
      aiTitle: 'AI CIVIC ASSISTANT',
      aiPowered: 'GEMINI POWERED',
      aiMsg: (name: string, constituency: string) => `Namaste ${name}! You are registered in **${constituency}**. I can help with booth navigation, documents, or any election query.`,
      chatBtn: '💬 Chat with VoteWise AI',
      insights: 'CONSTITUENCY INSIGHTS',
      constituency: 'CONSTITUENCY',
      assembly: 'ASSEMBLY',
      votingDate: 'VOTING DATE',
      state: 'STATE',
      district: 'DISTRICT',
      countdownTitle: 'ELECTION DAY MODE',
      daysLeft: 'DAYS REMAINING',
      openChecklist: 'Open Checklist',
      checklistTitle: 'DOCS CHECKLIST',
      boothTitle: 'YOUR POLLING BOOTH',
      close: '✕ Close',
      map: '🗺️ Map',
      navigate: '➤ Navigate'
    },
    hi: {
      welcome: 'VoteWise AI में आपका स्वागत है',
      welcomeSub: 'अपनी मतदाता स्थिति जांचने, अपने मतदान केंद्र को देखने और व्यक्तिगत चुनाव मार्गदर्शन प्राप्त करने के लिए Google के साथ साइन इन करें।',
      verifying: 'आपकी मतदाता स्थिति की पुष्टि की जा रही है...',
      status: 'आपकी मतदाता स्थिति',
      verified: 'सत्यापित मतदाता',
      pending: 'लंबित',
      epic: 'ईपिक नंबर',
      partSerial: 'भाग / क्रम संख्या',
      aiTitle: 'AI नागरिक सहायक',
      aiPowered: 'GEMINI द्वारा संचालित',
      aiMsg: (name: string, constituency: string) => `नमस्ते ${name}! आप **${constituency}** में पंजीकृत हैं। मैं बूथ नेविगेशन, दस्तावेजों या किसी भी चुनाव प्रश्न में मदद कर सकता हूँ।`,
      chatBtn: '💬 VoteWise AI के साथ चैट करें',
      insights: 'निर्वाचन क्षेत्र की जानकारी',
      constituency: 'निर्वाचन क्षेत्र',
      assembly: 'विधानसभा',
      votingDate: 'मतदान की तारीख',
      state: 'राज्य',
      district: 'जिला',
      countdownTitle: 'चुनाव दिवस मोड',
      daysLeft: 'दिन शेष',
      openChecklist: 'चेकलिस्ट खोलें',
      checklistTitle: 'दस्तावेज़ चेकलिस्ट',
      boothTitle: 'आपका मतदान केंद्र',
      close: '✕ बंद करें',
      map: '🗺️ नक्शा',
      navigate: '➤ नेविगेट करें'
    }
  }[lang];

  if (!user) {
    return (
      <div className="bento-item span-12 animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗳️</div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.welcome}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 500 }}>{t.welcomeSub}</p>
      </div>
    );
  }

  if (!voter) {
    return (
      <div className="bento-item span-12 animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
        <div className="loading-dots"><span /><span /><span /></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{t.verifying}</p>
      </div>
    );
  }

  return (
    <div className="bento-container animate-fade-in" role="main" aria-label="Voter Dashboard">
      {/* Voter Status Card */}
      <section className="bento-item span-5" aria-labelledby="status-title">
        <p id="status-title" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '1rem' }}>{t.status}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div 
            role="status" 
            aria-label={voter.voterStatus === 'active' ? 'Verified' : 'Pending'}
            style={{ width: 48, height: 48, borderRadius: '50%', background: voter.voterStatus === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            {voter.voterStatus === 'active' ? '✅' : '⏳'}
          </div>
          <div>
            <p style={{ fontWeight: 700, margin: 0, fontSize: '1.1rem' }}>{voter.voterName}</p>
            <span className={`badge ${voter.voterStatus === 'active' ? 'badge-verified' : 'badge-pending'}`}>
              {voter.voterStatus === 'active' ? t.verified : t.pending}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>{t.epic}</span><span style={{ fontWeight: 600, fontFamily: 'monospace' }} aria-label={`EPIC Number: ${voter.epicNumber}`}>{voter.epicNumber}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>{t.partSerial}</span><span style={{ fontWeight: 600 }}>{voter.partNumber} / {voter.serialNumber}</span></div>
        </div>
      </section>

      {/* AI Mini Chat */}
      <section className="bento-item span-7" aria-labelledby="ai-assistant-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-color)', display: 'inline-block' }} aria-hidden="true" />
            <span id="ai-assistant-title" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.aiTitle}</span>
          </div>
          <span className="badge badge-active" aria-label="AI Model Information">{t.aiPowered}</span>
        </div>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          {t.aiMsg(voter.voterName?.split(' ')[0], voter.constituency)}
        </p>
        <button 
          className="button-primary" 
          aria-label="Open AI Civic Assistant"
          style={{ alignSelf: 'flex-start', marginTop: 'auto' }} 
          onClick={() => onTabChange('assistant')}>{t.chatBtn}</button>
      </section>

      {/* Constituency Insights */}
      <section className="bento-item span-5" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white' }} aria-labelledby="insights-title">
        <p id="insights-title" style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '1px', marginBottom: '1rem' }}>{t.insights}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[[t.constituency, voter.constituency], [t.assembly, voter.assemblyConstituency], [t.votingDate, '1 June 2026'], [t.state, voter.state], [t.district, voter.district]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{k}</span><span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{v}</span></div>
          ))}
        </div>
      </section>

      {/* Countdown */}
      <section className="bento-item span-3" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', color: 'white', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} aria-labelledby="countdown-title">
        <p id="countdown-title" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem', opacity: 0.8 }}>{t.countdownTitle}</p>
        <p style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'Outfit', lineHeight: 1 }} aria-label={`${daysRemaining} days remaining`}>{daysRemaining}</p>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.9, marginBottom: '1rem' }}>{t.daysLeft}</p>
        <button 
          onClick={() => onTabChange('checklist')} 
          aria-label="View Election Readiness Checklist"
          style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter', fontSize: '0.85rem' }}>{t.openChecklist}</button>
      </section>

      {/* Docs Mini */}
      <section className="bento-item span-4" aria-labelledby="docs-title">
        <p id="docs-title" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '1rem' }}>{t.checklistTitle}</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} aria-label="EPIC Card Verified"><span style={{ color: 'var(--success-color)' }} aria-hidden="true">✓</span><span style={{ fontWeight: 500 }}>EPIC Card ({voter.epicNumber?.slice(0, 6)}...)</span></li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} aria-label="Photograph Uploaded Verified"><span style={{ color: 'var(--success-color)' }} aria-hidden="true">✓</span><span style={{ fontWeight: 500 }}>Photograph (Uploaded)</span></li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} aria-label="Proof of Address Needed"><span style={{ color: 'var(--warning-color)' }} aria-hidden="true">⚠</span><span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Proof of Address Needed</span></li>
        </ul>
      </section>

      {/* Polling Booth with Map */}
      <section className="bento-item span-12" aria-labelledby="booth-info-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showMap ? '1rem' : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }} aria-hidden="true">📍</span>
            <div>
              <p id="booth-info-title" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '1px' }}>{t.boothTitle} — #{voter.pollingBooth?.number}</p>
              <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>{voter.pollingBooth?.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{voter.pollingBooth?.address}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setShowMap(!showMap)} 
              aria-expanded={showMap}
              aria-controls="booth-map-container"
              style={{ background: 'var(--surface-border)', color: 'var(--text-primary)', border: 'none', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter', fontSize: '0.85rem' }}>{showMap ? t.close : t.map}</button>
            <a 
              href={voter.maps?.navigationUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Navigate to polling booth using Google Maps"
              style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{t.navigate}</a>
          </div>
        </div>
        {showMap && voter.maps && (
          <div id="booth-map-container" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
            <iframe src={voter.maps.embedUrl} width="100%" height="350" style={{ border: 0 }} allowFullScreen loading="lazy" title="Polling Booth Location Map" />
          </div>
        )}
      </section>
    </div>
  );
}
