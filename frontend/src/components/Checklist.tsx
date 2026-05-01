"use client";
import React, { useState } from 'react';

const docs = (lang: string) => [
  { id: 'epic', name: lang === 'hi' ? 'ईपिक कार्ड (वोटर आईडी)' : 'EPIC Card (Voter ID)', type: lang === 'hi' ? 'अनिवार्य' : 'MANDATORY', verified: true },
  { id: 'aadhaar', name: lang === 'hi' ? 'आधार कार्ड' : 'Aadhaar Card', type: lang === 'hi' ? 'सहायक दस्तावेज' : 'SUPPORTING DOC', verified: false },
  { id: 'pan', name: lang === 'hi' ? 'पैन कार्ड' : 'PAN Card', type: lang === 'hi' ? 'सहायक दस्तावेज' : 'SUPPORTING DOC', verified: false },
  { id: 'passport', name: lang === 'hi' ? 'पासपोर्ट' : 'Passport', type: lang === 'hi' ? 'सहायक दस्तावेज' : 'SUPPORTING DOC', verified: false },
];

interface ChecklistProps {
  voterData: any;
  onTabChange: (tab: string) => void;
  lang: 'en' | 'hi';
}

export default function Checklist({ voterData, onTabChange, lang }: ChecklistProps) {
  const [docStatus, setDocStatus] = useState(docs(lang));
  const [showBoothMap, setShowBoothMap] = useState(false);

  const t = {
    en: {
      title: 'Voter Readiness',
      subtitle: 'Finalize your preparation for the polling day. Ensure documentation and booth awareness is complete.',
      requiredId: 'REQUIRED IDENTIFICATION',
      verifyStatus: 'VERIFY STATUS',
      verified: '✓ VERIFIED',
      boothReadiness: 'BOOTH READINESS',
      boothMap: 'Booth Location Map',
      downloadSlip: 'Download Voter Slip',
      allSet: 'ALL SET TO VOTE',
      pending: 'VERIFICATION PENDING',
      getDirections: '➤ Get Directions',
      booth: 'Booth',
      electionDay: 'Election Day: 1 June 2026',
      timing: '7:00 AM - 6:00 PM',
      signInMsg: 'Please sign in to download your voter slip.'
    },
    hi: {
      title: 'मतदाता तैयारी',
      subtitle: 'मतदान दिवस के लिए अपनी तैयारी पूरी करें। सुनिश्चित करें कि दस्तावेज और बूथ की जानकारी पूरी है।',
      requiredId: 'आवश्यक पहचान',
      verifyStatus: 'स्थिति सत्यापित करें',
      verified: '✓ सत्यापित',
      boothReadiness: 'बूथ की तैयारी',
      boothMap: 'बूथ स्थान का नक्शा',
      downloadSlip: 'वोटर स्लिप डाउनलोड करें',
      allSet: 'वोट देने के लिए तैयार',
      pending: 'सत्यापन लंबित',
      getDirections: '➤ दिशा-निर्देश प्राप्त करें',
      booth: 'बूथ',
      electionDay: 'चुनाव का दिन: 1 जून 2026',
      timing: '7:00 AM - 6:00 PM',
      signInMsg: 'वोटर स्लिप डाउनलोड करने के लिए कृपया साइन इन करें।'
    }
  }[lang];

  const toggleVerify = (id: string) => {
    setDocStatus(prev => prev.map(d => d.id === id ? { ...d, verified: !d.verified } : d));
  };

  const allMandatoryVerified = docStatus.filter(d => d.type === (lang === 'hi' ? 'अनिवार्य' : 'MANDATORY')).every(d => d.verified);

  const downloadVoterSlip = () => {
    if (!voterData) {
      alert(t.signInMsg);
      return;
    }
    // Generate a voter slip as a text file
    const slipContent = `
╔══════════════════════════════════════════════╗
║           VOTER INFORMATION SLIP             ║
║         Election Commission of India         ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Name:          ${voterData.voterName.padEnd(28)}║
║  EPIC No:       ${voterData.epicNumber.padEnd(28)}║
║  Constituency:  ${voterData.constituency.padEnd(28)}║
║  Assembly:      ${voterData.assemblyConstituency.padEnd(28)}║
║  State:         ${voterData.state.padEnd(28)}║
║  District:      ${voterData.district.padEnd(28)}║
║  Part No:       ${String(voterData.partNumber).padEnd(28)}║
║  Serial No:     ${String(voterData.serialNumber).padEnd(28)}║
║                                              ║
║  POLLING BOOTH:                              ║
║  Booth #${String(voterData.pollingBooth.number).padEnd(37)}║
║  ${voterData.pollingBooth.name.padEnd(44)}║
║  ${voterData.pollingBooth.address.substring(0, 44).padEnd(44)}║
║                                              ║
║  ELECTION DATE: 1 June 2026                  ║
║  TIMING: 7:00 AM - 6:00 PM                  ║
║                                              ║
║  STATUS: ${voterData.voterStatus === 'active' ? '✅ VERIFIED & ACTIVE' : '⏳ PENDING VERIFICATION'}${' '.repeat(voterData.voterStatus === 'active' ? 6 : 1)}║
║                                              ║
║  Note: Carry a valid photo ID to the booth.  ║
║  Helpline: 1950                              ║
╚══════════════════════════════════════════════╝
    `.trim();

    const blob = new Blob([slipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VoterSlip_${voterData.epicNumber.replace(/\//g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openBoothMap = () => {
    if (voterData?.maps?.navigationUrl) {
      window.open(voterData.maps.navigationUrl, '_blank');
    } else {
      setShowBoothMap(!showBoothMap);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="checklist-header">
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>{t.title}</h2>
        <p style={{ opacity: 0.85 }}>{t.subtitle}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', letterSpacing: '1px', marginBottom: '0.75rem' }}>{t.requiredId}</p>
        </div>
        {docStatus.map(doc => (
          <div key={doc.id} className="doc-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                {doc.id === 'epic' ? '🪪' : doc.id === 'aadhaar' ? '📱' : doc.id === 'pan' ? '💳' : '📘'}
              </div>
              <div>
                <p style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{doc.name}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600, letterSpacing: '0.5px' }}>{doc.type}</p>
              </div>
            </div>
            {doc.verified ? (
              <div style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success-color)', padding: '8px', borderRadius: '8px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{t.verified}</div>
            ) : (
              <button className="button-outline" style={{ width: '100%', textAlign: 'center' }} onClick={() => toggleVerify(doc.id)}>{t.verifyStatus}</button>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', borderRadius: '20px', padding: '1.5rem', color: 'white' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '1rem', opacity: 0.9 }}>{t.boothReadiness}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={openBoothMap} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.15)', padding: '12px 14px', borderRadius: '10px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter', fontSize: '0.9rem', width: '100%' }}>
              <span>{t.boothMap}</span><span>📍</span>
            </button>
            <button onClick={downloadVoterSlip} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.15)', padding: '12px 14px', borderRadius: '10px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter', fontSize: '0.9rem', width: '100%' }}>
              <span>{t.downloadSlip}</span><span>⬇️</span>
            </button>
          </div>
        </div>

        <div style={{ background: allMandatoryVerified ? 'linear-gradient(135deg, #10b981, #34d399)' : 'var(--surface-dark)', border: allMandatoryVerified ? 'none' : '1px solid var(--surface-border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: allMandatoryVerified ? 'white' : 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{allMandatoryVerified ? '🗳️' : '⏳'}</div>
          <p style={{ fontWeight: 800, fontStyle: 'italic', fontSize: '1.2rem', textAlign: 'center' }}>{allMandatoryVerified ? t.allSet : t.pending}</p>
        </div>
      </div>

      {showBoothMap && voterData?.maps && (
        <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--surface-border)', marginBottom: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ padding: '1rem 1.5rem', background: 'var(--surface-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>📍 {voterData.pollingBooth.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{voterData.pollingBooth.address}</p>
            </div>
            <a href={voterData.maps.navigationUrl} target="_blank" rel="noopener noreferrer" className="button-primary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>{t.getDirections}</a>
          </div>
          <iframe src={voterData.maps.embedUrl} width="100%" height="350" style={{ border: 0 }} allowFullScreen loading="lazy" title="Booth Map" />
        </div>
      )}

      {voterData && (
        <div className="doc-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏛️</span>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>{t.booth} #{voterData.pollingBooth.number} — {voterData.pollingBooth.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{t.electionDay} · {t.timing}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
