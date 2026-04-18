'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [progress, setProgress] = useState(0);
  const [narrator, setNarrator] = useState<string>('Academic Historian');
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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
        setupSynthesis(data.script);
      }
    } catch (e) {
      console.error(e);
      setScript("Failed to generate historical narration.");
    }
    setLoading(false);
  };

  const setupSynthesis = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cleanup old
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    
    // Find a good voice (preferably a warm male or female voice)
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium') || v.lang.startsWith('en-IN')) || voices[0];
    if (premiumVoice) utterance.voice = premiumVoice;

    utterance.onboundary = (event) => {
       const charIndex = event.charIndex;
       setProgress((charIndex / text.length) * 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    utteranceRef.current = utterance;
  };

  const togglePlay = () => {
    if (!utteranceRef.current) return;
    
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.speak(utteranceRef.current);
      }
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
  };

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
            background: 'rgba(10, 10, 10, 0.85)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderRadius: 24,
            padding: 24,
            zIndex: 1000,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
               <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: 12, height: 12, borderRadius: 2, background: '#c9a84c', animation: isPlaying ? 'pulse 1s infinite' : 'none' }} />
               </div>
               <div>
                  <div style={{ fontSize: 10, color: '#c9a84c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Studio Narration</div>
                  <div style={{ fontSize: 14, color: '#f0ece4', fontWeight: 700 }}>{siteName}</div>
               </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: 20, cursor: 'pointer' }}>×</button>
          </div>

          {/* Body */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, maxHeight: 120, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Generating historical script...</div>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>
                "{script}"
              </p>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button 
              onClick={togglePlay}
              disabled={loading}
              style={{
                width: 48, height: 48, borderRadius: '50%', background: '#c9a84c', border: 'none', 
                color: '#000', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  style={{ height: '100%', background: '#c9a84c' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>AI NARRATOR: GENIUS</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>LIVE SYNC</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
