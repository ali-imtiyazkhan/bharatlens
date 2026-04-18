'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';

/* ── Types ── */

interface JourneyStep {
  type: string;
  title: string;
  time: string;
  duration?: string;
  details: string;
  cost: string;
  hasBooking?: boolean;
  bookingUrl?: string;
  crowd?: string;
  crowdColor?: string;
  scamShield?: string;
  warning?: string;
  tip?: string;
}

export default function InsiderJourneyPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);

  const generateRoute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!origin || !destination) return;

    setLoading(true);
    try {
      const res = await fetch('/api/journey/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: origin, to: destination })
      });
      const data = await res.json();
      if (data.steps) {
        setSteps(data.steps);
      }
    } catch (err) {
      console.error("Failed to generate route:", err);
    }
    setLoading(false);
  };

  const crowdDefaultColor = (c: string) => {
    if (c === 'Low') return '#4ade80';
    if (c === 'Moderate') return '#facc15';
    if (c === 'High') return '#f87171';
    return '#c9a84c';
  };

  return (
    <div className="page" style={{ background: 'transparent' }}>
      
      <Navbar />

      <main style={{ padding: '64px 48px', maxWidth: 850, margin: '0 auto' }}>
        
        {/* Header & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Smart Logistics Engine</span>
            <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.02em' }}>The <span style={{ color: '#c9a84c' }}>Insider</span> Route</h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
              AI-Generated Safety, Cost & Transit Intelligence <span style={{ color: '#c9a84c' }}>✦</span>
            </p>
          </motion.div>

          <button 
            onClick={() => setOfflineMode(!offlineMode)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: offlineMode ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)', border: offlineMode ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.08)', padding: '10px 18px', borderRadius: 24, cursor: 'pointer', transition: 'all 0.3s', marginTop: 8 }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: offlineMode ? '#4ade80' : '#666' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: offlineMode ? '#4ade80' : 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
              {offlineMode ? 'SAVED OFFLINE' : 'SAVE FOR OFFLINE'}
            </span>
          </button>
        </div>

        {/* Input Form */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={generateRoute}
          style={{ 
            background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', 
            borderRadius: 16, padding: 32, marginBottom: 56, display: 'flex', gap: 16, alignItems: 'flex-end'
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'block' }}>Starting Point</label>
            <input 
              type="text" 
              placeholder="e.g. Jaipur Junction" 
              value={origin} 
              onChange={e => setOrigin(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }}
            />
          </div>
          <div style={{ fontSize: 20, marginBottom: 12, opacity: 0.2 }}>→</div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'block' }}>Destination</label>
            <input 
              type="text" 
              placeholder="e.g. Amer Fort" 
              value={destination} 
              onChange={e => setDestination(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              background: '#c9a84c', color: '#000', border: 'none', padding: '14px 24px', 
              borderRadius: 8, fontSize: 12, fontWeight: 900, cursor: 'pointer',
              transition: 'all 0.2s', opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'CALCULATING...' : 'GENERATE ROUTE'}
          </button>
        </motion.form>

        {/* Journey Timeline */}
        <div style={{ position: 'relative' }}>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 20, animation: 'pulse 2s infinite' }}>🗺️</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#c9a84c' }}>Consulting Local Logistics AI...</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Cross-referencing transport hubs, costs, and scam reports.</p>
            </div>
          )}

          {!loading && steps.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 24 }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>Enter your travel points above to generate a safe, insider route.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button 
                  onClick={() => { setOrigin('Jaipur Junction'); setDestination('Ajmer शरीफ'); }}
                  style={{ background: 'rgba(201,168,76,0.1)', border: '0.5px solid rgba(201,168,76,0.3)', color: '#c9a84c', padding: '10px 20px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                >
                  Quick Start: Jaipur → Ajmer
                </button>
              </div>
            </div>
          )}

          {steps.length > 0 && (
            <>
              {/* Vertical Track Line */}
              <div style={{ position: 'absolute', top: 32, bottom: 32, left: 31, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)' }} />

              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {steps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 32, marginBottom: 48, position: 'relative', zIndex: 10 }}>
                      
                      {/* Timeline Node */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 64, flexShrink: 0 }}>
                        <div style={{ 
                          width: 14, height: 14, borderRadius: '50%', 
                          background: step.type === 'destination' ? '#c9a84c' : 'transparent', 
                          border: `2px solid ${step.type === 'destination' ? '#c9a84c' : '#444'}`, 
                          marginBottom: 12, zIndex: 10 
                        }} />
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{step.time}</div>
                      </div>

                      {/* Content Card */}
                      <div style={{ 
                        flex: 1, background: 'rgba(255,255,255,0.02)', 
                        border: '0.5px solid rgba(255,255,255,0.08)', 
                        borderRadius: 16, padding: 28,
                        position: 'relative', overflow: 'hidden'
                      }}>
                        {/* Mode specific icon/label */}
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px 16px', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', background: 'rgba(201,168,76,0.1)', color: '#c9a84c', borderBottomLeftRadius: 12, textTransform: 'uppercase' }}>
                          {step.type.replace('_', ' ')}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, marginRight: 80 }}>
                          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#e8e4dc' }}>{step.title}</h3>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                          {step.duration && (
                            <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 4 }}>
                              ⏱ {step.duration}
                            </span>
                          )}
                          {step.cost && (
                            <span style={{ fontSize: 9, fontWeight: 900, color: '#c9a84c', background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.2)', padding: '4px 10px', borderRadius: 4 }}>
                              FARES: {step.cost}
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 20, lineHeight: 1.6, fontWeight: 500 }}>
                          {step.details}
                        </p>

                        {/* Interactions */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                          {/* Booking Action */}
                          {step.hasBooking && (
                            <a 
                              href={step.bookingUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ 
                                textDecoration: 'none', background: '#c9a84c', color: '#000', 
                                padding: '8px 20px', borderRadius: 6, fontSize: 10, fontWeight: 900, 
                                letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 
                              }}
                            >
                              BOOK TICKETS ↗
                            </a>
                          )}

                          {/* Crowd Intelligence */}
                          {(step.crowd || step.crowdColor) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, color: step.crowdColor || crowdDefaultColor(step.crowd!), padding: '8px 16px', background: `${step.crowdColor || crowdDefaultColor(step.crowd!)}08`, borderRadius: 6, border: `0.5px solid ${step.crowdColor || crowdDefaultColor(step.crowd!)}20` }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: step.crowdColor || crowdDefaultColor(step.crowd!) }} />
                              Crowd: {step.crowd || 'Normal'}
                            </div>
                          )}
                        </div>

                        {/* Scam Shield Block */}
                        {step.scamShield && (
                          <div style={{ marginTop: 24, background: 'rgba(248,113,113,0.03)', border: '0.5px solid rgba(248,113,113,0.15)', padding: 16, borderRadius: 12 }}>
                            <div style={{ fontSize: 10, color: '#f87171', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>⚠️ Scam Alert & Saver</div>
                            <div style={{ fontSize: 13, color: 'rgba(240,236,228,0.7)', lineHeight: 1.5 }}>
                              {step.warning && <span>{step.warning} </span>}
                              <strong style={{ color: '#f87171' }}>{step.scamShield}</strong>
                            </div>
                          </div>
                        )}

                        {/* Local Insider Tip */}
                        {step.tip && (
                          <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.01)', border: '0.5px solid rgba(255,255,255,0.06)', padding: 18, borderRadius: 12, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                            <div style={{ fontSize: 20, marginTop: -2 }}>💡</div>
                            <div>
                              <div style={{ fontSize: 10, color: '#c9a84c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Local Genius Tip</div>
                              <div style={{ fontSize: 13, color: 'rgba(240,236,228,0.8)', fontStyle: 'italic', lineHeight: 1.6 }}>"{step.tip}"</div>
                            </div>
                          </div>
                        )}
                        
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
          
        </div>

        {/* Collaborative Footer */}
        <div style={{ textAlign: 'center', marginTop: 64, padding: 48, borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Found a better shortcut or cheaper fare?</p>
          <button style={{ background: 'transparent', border: '1px solid #c9a84c', color: '#c9a84c', padding: '14px 32px', borderRadius: 8, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontSize: 12, letterSpacing: '0.05em' }}>
            CONTRIBUTE TO ARCHIVE (+20 HP)
          </button>
        </div>

      </main>
    </div>
  );
}
