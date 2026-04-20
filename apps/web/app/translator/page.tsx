'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Globe, ArrowLeft, Languages, Sparkles } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';

// Helper component for pulsing voice waves
const VoiceWaves = ({ active, color }: { active: boolean; color: string }) => {
  return (
    <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence>
        {active && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: `2px solid ${color}`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TranslatorPage() {
  const [touristText, setTouristText] = useState('');
  const [localText, setLocalText] = useState('');
  const [touristLang, setTouristLang] = useState('English');
  const [localLang, setLocalLang] = useState('Hindi');
  const [isRecording, setIsRecording] = useState<'tourist' | 'local' | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const recognitionRef = useRef<any>(null);

  const langOptions = [
    { value: 'English', label: 'English', icon: '🇺🇸' },
    { value: 'Hindi', label: 'Hindi', icon: '🇮🇳' },
    { value: 'Tamil', label: 'Tamil', icon: '🇮🇳' },
    { value: 'Bengali', label: 'Bengali', icon: '🇮🇳' },
    { value: 'French', label: 'French', icon: '🇫🇷' },
    { value: 'German', label: 'German', icon: '🇩🇪' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
      }
    }
  }, []);

  const handleTranslate = async (text: string, from: string, to: string, isTourist: boolean) => {
    if (!text) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/explore/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from, to })
      });
      const data = await res.json();
      if (data.translation) {
        if (isTourist) setLocalText(data.translation);
        else setTouristText(data.translation);
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.translation);
          utterance.lang = to === 'Hindi' ? 'hi-IN' : 'en-US';
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsTranslating(false);
  };

  const toggleRecording = (speaker: 'tourist' | 'local') => {
    if (isRecording === speaker) {
      recognitionRef.current?.stop();
      setIsRecording(null);
      return;
    }
    
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(null);
    }

    if (recognitionRef.current) {
      recognitionRef.current.lang = speaker === 'local' ? 'hi-IN' : 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results).map((r: any) => (r as any)[0].transcript).join('');
        if (speaker === 'tourist') setTouristText(transcript);
        else setLocalText(transcript);
      };
      recognitionRef.current.onend = () => {
        setIsRecording(null);
        if (speaker === 'tourist') handleTranslate(touristText, touristLang, localLang, true);
        else handleTranslate(localText, localLang, touristLang, false);
      };
      setIsRecording(speaker);
      recognitionRef.current.start();
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: '#050505', overflow: 'hidden', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Top Half: Local Guide (Inverted) */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: 24, 
        transform: 'rotate(180deg)',
        borderTop: '1px solid rgba(255,255,255,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Languages size={14} color="rgba(255,255,255,0.4)" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>Local Guide</div>
          </div>
          <div style={{ width: 130 }}>
            <CustomDropdown 
              options={langOptions.filter(o => ['Hindi', 'Tamil', 'Bengali'].includes(o.value))}
              value={localLang}
              onChange={setLocalLang}
            />
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
          <motion.div 
            animate={{ opacity: isRecording === 'local' ? 1 : 0.8, scale: isRecording === 'local' ? 1.02 : 1 }}
            style={{ 
              width: '100%', 
              background: 'rgba(255,255,255,0.02)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 32,
              padding: 40,
              minHeight: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isRecording === 'local' ? '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.02)' : 'none'
            }}
          >
            <textarea
              value={localText}
              onChange={e => setLocalText(e.target.value)}
              placeholder="Waiting for speech..."
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: 28, fontWeight: 700, resize: 'none', textAlign: 'center', outline: 'none' }}
              disabled={isTranslating}
            />
          </motion.div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 20 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VoiceWaves active={isRecording === 'local'} color="#4b5563" />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleRecording('local')}
              style={{ 
                width: 72, height: 72, borderRadius: '50%', 
                background: isRecording === 'local' ? '#ef4444' : 'rgba(255,255,255,0.05)', 
                border: '1px solid ' + (isRecording === 'local' ? '#ef4444' : 'rgba(255,255,255,0.1)'),
                color: '#fff', fontSize: 24, cursor: 'pointer', transition: 'all 0.3s', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isRecording === 'local' ? '0 0 40px rgba(239, 68, 68, 0.4)' : '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <Mic size={28} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Middle Status Bar */}
      <div style={{ height: 60, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, position: 'relative', borderTop: '1.5px solid rgba(255,255,255,0.05)', borderBottom: '1.5px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', left: 24 }}>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> EXIT STUDIO
          </Link>
        </div>
        
        <motion.div 
          animate={isTranslating ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ 
            background: isTranslating ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)', 
            padding: '8px 20px', borderRadius: 30, fontSize: 10, fontWeight: 900, 
            color: isTranslating ? '#c9a84c' : 'rgba(255,255,255,0.5)', 
            border: '1px solid ' + (isTranslating ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.05)'),
            display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.2em'
          }}
        >
          {isTranslating ? (
            <><Sparkles size={12} /> PROCESSING ENGINE</>
          ) : (
            <><Globe size={12} /> BILINGUAL MODE ACTIVE</>
          )}
        </motion.div>
      </div>

      {/* Bottom Half: Tourist */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(0deg, rgba(201,168,76,0.05) 0%, rgba(10,10,10,1) 100%)', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: 24 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={14} color="#c9a84c" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#c9a84c' }}>You (Tourist)</div>
          </div>
          <div style={{ width: 130 }}>
            <CustomDropdown 
              options={langOptions.filter(o => ['English', 'French', 'German'].includes(o.value))}
              value={touristLang}
              onChange={setTouristLang}
            />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
          <motion.div 
            animate={{ opacity: isRecording === 'tourist' ? 1 : 0.8, scale: isRecording === 'tourist' ? 1.02 : 1 }}
            style={{ 
              width: '100%', 
              background: 'rgba(255,255,255,0.02)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 32,
              padding: 40,
              minHeight: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isRecording === 'tourist' ? '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(201,168,76,0.05)' : 'none'
            }}
          >
            <textarea
              value={touristText}
              onChange={e => setTouristText(e.target.value)}
              placeholder="Tap mic to speak..."
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#e8e4dc', fontSize: 28, fontWeight: 700, resize: 'none', textAlign: 'center', outline: 'none' }}
              disabled={isTranslating}
            />
          </motion.div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VoiceWaves active={isRecording === 'tourist'} color="#c9a84c" />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleRecording('tourist')}
              style={{ 
                width: 72, height: 72, borderRadius: '50%', 
                background: isRecording === 'tourist' ? '#ef4444' : '#c9a84c', 
                border: 'none', color: isRecording === 'tourist' ? '#fff' : '#000', fontSize: 24, cursor: 'pointer', transition: 'all 0.3s', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isRecording === 'tourist' ? '0 0 40px rgba(239, 68, 68, 0.4)' : '0 10px 30px rgba(201,168,76,0.3)'
              }}
            >
              <Mic size={28} />
            </motion.button>
          </div>
        </div>
      </div>

    </div>
  );
}
