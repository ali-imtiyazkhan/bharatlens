'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthControls from '../../components/AuthControls';

// Mocked structured journey based on community data
const journeySteps = [
  {
    type: 'intercity',
    title: 'RSRTC AC Bus to Ajmer',
    time: '08:00 AM',
    duration: '2h 15m',
    details: 'From Sindhi Camp, Jaipur to Ajmer Bus Stand',
    crowd: 'Low',
    crowdColor: '#4ade80',
    tip: 'Sit on the left side (window) to see the Ana Sagar lake approach.'
  },
  {
    type: 'transit_hub',
    title: 'Ajmer Intercity Bus Stand',
    time: '10:15 AM',
    details: 'Exit from Gate 2 for local transit.',
    warning: 'Auto-rickshaws here will quote ₹150 for Dargah.',
    scamShield: 'Fixed Fare Zone: Max ₹40 to Dargah Chowk. Pre-agree before boarding.'
  },
  {
    type: 'local',
    title: 'Local Bus No. 7',
    time: '10:25 AM',
    duration: '18m',
    details: 'Board at Gate 2 stop. Drops at Nala Bazaar (1 stop before Dargah Chowk).',
    crowd: 'Severe Jam Expected',
    crowdColor: '#ef4444',
    tip: 'Get off at Nala Bazaar. It is actually a 2-minute shorter walk to the entrance than Dargah Chowk, and skips the main traffic bottleneck.'
  },
  {
    type: 'destination',
    title: 'Dargah Sharif, Nizam Gate',
    time: '10:45 AM',
    details: 'Walk 350m North from Nala Bazaar.',
    tip: 'Remove your shoes at the designated shop on the left before the final gate—it is safer and free if you buy flowers from them.'
  }
];

export default function InsiderJourneyPage() {
  const [offlineMode, setOfflineMode] = useState(true);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Navigation Bar */}
      <nav style={{ padding: '24px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <Link href="/explore" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
          ← Back
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ color: '#a855f7', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>INSIDER JOURNEY</div>
          <AuthControls />
        </div>
      </nav>

      <main style={{ padding: '64px', maxWidth: 800, margin: '0 auto' }}>
        
        {/* Header & Offline Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }}>Jaipur to Ajmer Sharif</h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 8 }}>
              Curated by the Local Community <span style={{ color: '#a855f7' }}>✓ Verified</span>
            </p>
          </motion.div>
          
          <button 
            onClick={() => setOfflineMode(!offlineMode)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: offlineMode ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', border: offlineMode ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: 20, cursor: 'pointer', transition: 'all 0.3s' }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: offlineMode ? '#4ade80' : '#888' }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: offlineMode ? '#4ade80' : '#fff' }}>
              {offlineMode ? 'Saved Offline' : 'Save for Offline'}
            </span>
          </button>
        </div>

        {/* The Stitched Journey Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical Track Line */}
          <div style={{ position: 'absolute', top: 24, bottom: 24, left: 31, width: 2, background: 'rgba(255,255,255,0.1)' }} />

          {journeySteps.map((step, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: idx * 0.15 }}
              style={{ display: 'flex', gap: 24, marginBottom: 40, position: 'relative', zIndex: 10 }}
            >
              {/* Timeline Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 64 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: step.type === 'destination' ? '#a855f7' : '#222', border: step.type === 'destination' ? 'none' : '4px solid #444', marginBottom: 8, zIndex: 10 }} />
                <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>{step.time}</div>
              </div>

              {/* Content Card */}
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: 24 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 800 }}>{step.title}</h3>
                  {step.duration && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
                      {step.duration}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 16, lineHeight: 1.5 }}>
                  {step.details}
                </p>

                {/* Layer 2: Crowd Intelligence */}
                {step.crowd && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, fontWeight: 800, color: step.crowdColor }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: step.crowdColor }} />
                    Live Crowd: {step.crowd}
                  </div>
                )}

                {/* Layer 3: Scam Shield */}
                {step.scamShield && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #ef4444', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>⚠️ Scam Shield</div>
                    <div style={{ fontSize: 14, color: '#f87171', lineHeight: 1.5 }}>{step.warning} <strong style={{ color: '#fff' }}>{step.scamShield}</strong></div>
                  </div>
                )}

                {/* Layer 4: Insider Local Tip */}
                {step.tip && (
                  <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', padding: 16, borderRadius: 12, display: 'flex', gap: 12 }}>
                    <div style={{ fontSize: 20 }}>💡</div>
                    <div>
                      <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Local Tip</div>
                      <div style={{ fontSize: 14, color: '#e8e4dc', fontStyle: 'italic', lineHeight: 1.5 }}>"{step.tip}"</div>
                    </div>
                  </div>
                )}
                
              </div>
            </motion.div>
          ))}
          
        </div>

        {/* CTA Footer */}
        <div style={{ textAlign: 'center', marginTop: 48, padding: 32, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Know a better route? Help the community.</p>
          <button style={{ background: 'transparent', border: '1px solid #a855f7', color: '#a855f7', padding: '12px 24px', borderRadius: 8, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontSize: 14 }}>
            Suggest a Correction (+10 HP)
          </button>
        </div>

      </main>
    </div>
  );
}
