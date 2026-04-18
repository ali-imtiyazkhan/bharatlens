'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const getFigureMockData = (id: string) => {
  const data: Record<string, { name: string, site: string, era: string }> = {
    'akbar': { name: 'Jalal-ud-din Muhammad Akbar', site: 'Fatehpur Sikri', era: 'Mughal Empire' },
    'laxmibai': { name: 'Rani Laxmibai', site: 'Jhansi Fort', era: '1857 Rebellion' },
    'ashoka': { name: 'Emperor Ashoka', site: 'Sanchi Stupa', era: 'Mauryan Empire' },
    'birbal': { name: 'Raja Birbal', site: 'Fatehpur Sikri', era: "Akbar's Court" },
    'tipu': { name: 'Tipu Sultan', site: 'Srirangapatna', era: 'Kingdom of Mysore' },
    'bhagat': { name: 'Bhagat Singh', site: 'Jallianwala Bagh', era: 'Freedom Struggle' },
  };
  return data[id] || { name: 'Historical Figure', site: 'Unknown Site', era: 'Unknown Era' };
};

export default function HeritageChatPage() {
  const params = useParams();
  const figureId = params?.figureId as string;
  const figure = getFigureMockData(figureId);

  const [locationVerified, setLocationVerified] = useState(false);
  const [askingLocation, setAskingLocation] = useState(true);
  const [messages, setMessages] = useState<Array<{role: 'user'|'system', text: string, sources?: string[]}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVerifyLocation = () => {
    // In a real app we'd use navigator.geolocation and turf.js to check distance to site coords
    setAskingLocation(false);
    setLocationVerified(true);
    setMessages([
      { role: 'system', text: `Greetings, traveler. You stand before my domain at ${figure.site}. What do you wish to ask?` }
    ]);
  };

  const handleBypassLocation = () => {
    setAskingLocation(false);
    setLocationVerified(true);
    setMessages([
      { role: 'system', text: `Greetings, traveler. I sense you are afar, but I shall speak with you nonetheless. I am ${figure.name}.` }
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !locationVerified) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/heritage/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figureId, message: userMsg, locationVerified })
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'system', text: data.reply, sources: data.sources }]);
      } else {
        setMessages(prev => [...prev, { role: 'system', text: 'I am unable to answer you clearly across the gulf of time.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'system', text: 'The connection to the past was broken. Try asking again.' }]);
    }
    setLoading(false);
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Cancel any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose a dignified voice
    const voices = window.speechSynthesis.getVoices();
    // Try to find a male voice for Akbar or similar
    const preferredVoice = voices.find(v => v.name.includes('India') || v.name.includes('Google'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.pitch = figureId === 'akbar' ? 0.8 : 1.1; // Deep for Akbar, higher for Laxmibai
    utterance.rate = 0.9; // Slightly slower for gravity

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Trigger speech when a new system message arrives
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'system' && !loading) {
      speak(lastMsg.text);
    }
  }, [messages.length]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,168,76,0.1)', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <Link href="/heritage" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
          ← End Conversation
        </Link>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{figure.site}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            {isSpeaking && (
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3].map(i => <div key={i} style={{ width: 2, height: 12, background: '#c9a84c', borderRadius: 1, animation: `wave 0.5s infinite ${i*0.1}s` }} />)}
              </div>
            )}
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{figure.era}</div>
          </div>
        </div>
        <div>
          <button 
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled) window.speechSynthesis.cancel();
            }}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: voiceEnabled ? '#c9a84c' : 'rgba(255,255,255,0.3)', padding: '8px 12px', borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
          >
            {voiceEnabled ? '🔊 Voice On' : '🔇 Muted'}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {askingLocation && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#111', padding: 48, borderRadius: 24, border: '1px solid rgba(201,168,76,0.3)', maxWidth: 400, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#e8e4dc', marginBottom: 16 }}>GPS Check Required</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 32, lineHeight: 1.5 }}>
                To speak with {figure.name}, you must be physically present at {figure.site}. This ensures a grounded historical experience.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={handleVerifyLocation} style={{ background: '#c9a84c', color: '#000', padding: '14px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Verify My Location
                </button>
                <button onClick={handleBypassLocation} style={{ background: 'transparent', color: '#fff', padding: '14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', fontWeight: 800, cursor: 'pointer' }}>
                  Mock Location (Demo Mode)
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Chat Log */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                {m.role === 'system' && (
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#c9a84c', marginBottom: 6, marginLeft: 12 }}>
                    {figure.name.toUpperCase()}
                  </div>
                )}
                
                <div style={{ 
                  background: m.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(201,168,76,0.1)', 
                  border: m.role === 'user' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(201,168,76,0.3)',
                  padding: '16px 20px', 
                  borderRadius: 20, 
                  borderTopRightRadius: m.role === 'user' ? 4 : 20,
                  borderTopLeftRadius: m.role === 'system' ? 4 : 20,
                  color: '#fff',
                  fontSize: 15,
                  lineHeight: 1.6
                }}>
                  {m.text}
                </div>
                
                {m.sources && m.sources.length > 0 && (
                  <div style={{ marginTop: 8, marginLeft: 12, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <span style={{ fontSize: 10 }}>📚</span>
                    <div>
                      {m.sources.map((src, idx) => (
                        <div key={idx} style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                          Source: {src}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
             <div style={{ alignSelf: 'flex-start', marginLeft: 12 }}>
               <div style={{ fontSize: 11, fontWeight: 800, color: '#c9a84c', marginBottom: 6 }}>{figure.name.toUpperCase()}</div>
               <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', padding: '16px 24px', borderRadius: 20, borderTopLeftRadius: 4, display: 'flex', gap: 4 }}>
                 <div style={{ width: 6, height: 6, background: '#c9a84c', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                 <div style={{ width: 6, height: 6, background: '#c9a84c', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                 <div style={{ width: 6, height: 6, background: '#c9a84c', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Disclaimer */}
        <div style={{ padding: '8px 32px', textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
          This is an AI representation based on historical records, not a claim of the actual person's words.
        </div>

        {/* Input Area */}
        <div style={{ padding: '0 32px 32px 32px' }}>
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask ${figure.name.split(' ')[0]} a question...`}
              disabled={!locationVerified || loading}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 15, padding: '0 16px', fontFamily: "'Outfit', sans-serif" }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || !locationVerified || loading}
              style={{ width: 44, height: 44, borderRadius: 12, background: input.trim() ? '#c9a84c' : 'rgba(255,255,255,0.1)', color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
            >
              ↑
            </button>
          </form>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes wave {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}} />
    </div>
  );
}
