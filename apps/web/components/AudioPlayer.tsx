'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speechManager, VoicePersona } from '../lib/speech-util';

interface AudioPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
  category?: string;
}

export default function AudioPlayer({ isOpen, onClose, siteName, category }: AudioPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [persona, setPersona] = useState<VoicePersona>('modern');
  
  useEffect(() => {
    if (isOpen) {
      fetchNarration();
    } else {
      stopAudio();
    }
  }, [isOpen, siteName]);

  const fetchNarration = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/narration/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, category })
      });
      const data = await res.json();
      if (data.script) {
        setScript(data.script);
      }
    } catch (e) {
      console.error(e);
      setScript("Failed to generate historical narration.");
    }
    setLoading(false);
  };

  const togglePlay = () => {
    if (!script) return;
    
    if (isPlaying) {
      speechManager?.stop();
      setIsPlaying(false);
    } else {
      speechManager?.speak(script, persona, () => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    speechManager?.stop();
    setIsPlaying(false);
  };

  const personas: { id: VoicePersona; label: string; icon: string }[] = [
    { id: 'modern', label: 'Modern Guide', icon: '💁‍♂️' },
    { id: 'historic', label: 'Wise Historian', icon: '📜' },
    { id: 'mystical', label: 'Mystical Sage', icon: '✨' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90vw',
            maxWidth: 500,
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderRadius: 32,
            padding: 32,
            zIndex: 1000,
            boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
               <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                 {isPlaying && (
                   <motion.div 
                     animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     style={{ position: 'absolute', inset: 0, border: '2px solid #c9a84c', borderRadius: 16 }} 
                   />
                 )}
                 <div style={{ fontSize: 24 }}>{personas.find(p => p.id === persona)?.icon}</div>
               </div>
               <div>
                  <div style={{ fontSize: 10, color: '#c9a84c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Cinema Narration</div>
                  <div style={{ fontSize: 18, color: '#fff', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{siteName}</div>
               </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Persona Selector */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 16 }}>
            {personas.map(p => (
              <button
                key={p.id}
                onClick={() => { setPersona(p.id); stopAudio(); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 12, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  background: persona === p.id ? '#c9a84c' : 'transparent',
                  color: persona === p.id ? '#000' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Script Display */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 20, maxHeight: 150, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                <div style={{ width: 4, height: 4, background: '#c9a84c', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                Channeling historical records...
              </div>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                "{script}"
              </p>
            )}
          </div>

          {/* Player Main Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <button 
              onClick={togglePlay}
              disabled={loading || !script}
              style={{
                width: 64, height: 64, borderRadius: '50%', background: '#c9a84c', border: 'none', 
                color: '#000', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isPlaying ? '0 0 30px rgba(201,168,76,0.4)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            
            <div style={{ flex: 1 }}>
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20, marginBottom: 8 }}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: isPlaying ? [10, 20, 10] : 4 }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      style={{ width: 3, background: isPlaying ? '#c9a84c' : 'rgba(255,255,255,0.1)', borderRadius: 1.5 }}
                    />
                  ))}
               </div>
               <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.1em' }}>
                 {isPlaying ? 'NARRATING LIVE' : 'READY TO NARRATE'}
               </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(2); opacity: 1; }
        }
      `}</style>
    </AnimatePresence>
  );
}
