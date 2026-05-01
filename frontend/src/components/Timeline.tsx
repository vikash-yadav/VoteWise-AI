"use client";
import React from 'react';

const data = {
  en: [
    { title: 'Preparation Phase', date: 'TBD', description: 'ECI starts updating rolls and checking polling infrastructures.', status: 'completed', icon: '✅' },
    { title: 'Electoral Roll Revision', date: 'TBD', description: 'Final chance to add/update your name in the voter list via Form 6.', status: 'active', icon: '🕐' },
    { title: 'Registration Deadline', date: '16 MAY 2026', description: 'Last date to submit registration for the final phase.', status: 'upcoming', icon: '📅' },
    { title: 'Election Day', date: '1 JUNE 2026', description: 'Polling stations will be open from 7:00 AM to 6:00 PM.', status: 'upcoming', icon: '📅' }
  ],
  hi: [
    { title: 'तैयारी चरण', date: 'TBD', description: 'ECI मतदाता सूची अपडेट और मतदान अवसंरचना की जाँच शुरू करता है।', status: 'completed', icon: '✅' },
    { title: 'मतदाता सूची संशोधन', date: 'TBD', description: 'फॉर्म 6 के माध्यम से मतदाता सूची में नाम जोड़ने/अपडेट करने का अंतिम अवसर।', status: 'active', icon: '🕐' },
    { title: 'पंजीकरण की अंतिम तिथि', date: '16 मई 2026', description: 'अंतिम चरण के लिए पंजीकरण जमा करने की अंतिम तिथि।', status: 'upcoming', icon: '📅' },
    { title: 'चुनाव का दिन', date: '1 जून 2026', description: 'मतदान केंद्र सुबह 7:00 बजे से शाम 6:00 बजे तक खुले रहेंगे।', status: 'upcoming', icon: '📅' }
  ]
};

const labels = {
  en: { title: 'Election Calendar', subtitle: 'Important dates and deadlines for South Delhi (LS-07) elections.' },
  hi: { title: 'चुनाव कैलेंडर', subtitle: 'दक्षिण दिल्ली (LS-07) चुनावों के लिए महत्वपूर्ण तिथियाँ और समय सीमाएँ।' }
};

interface TimelineProps { lang: 'en' | 'hi'; }

export default function Timeline({ lang }: TimelineProps) {
  const items = data[lang];
  const l = labels[lang];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="timeline-header">
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{l.title}</h2>
        <p style={{ opacity: 0.85 }}>{l.subtitle}</p>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className={`timeline-card ${item.status === 'active' ? 'active' : ''}`}>
          <div className="timeline-icon" style={{ background: item.status === 'completed' ? 'rgba(16,185,129,0.15)' : item.status === 'active' ? 'rgba(79,70,229,0.15)' : 'var(--surface-border)' }}>
            {item.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <h4 style={{ fontStyle: 'italic', margin: 0 }}>{item.title}</h4>
              <span className={`badge badge-${item.status}`}>{item.status.toUpperCase()}</span>
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>{item.date}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
