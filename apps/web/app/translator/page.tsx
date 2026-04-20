'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import CustomDropdown from '../../components/CustomDropdown';

// Helper type for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
        
        // Speak it out
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
        const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
        if (speaker === 'tourist') {
          setTouristText(transcript);
        } else {
          setLocalText(transcript);
        }
      };
      recognitionRef.current.onend = () => {
        setIsRecording(null);
        if (speaker === 'tourist') handleTranslate(touristText, touristLang, localLang, true);
        else handleTranslate(localText, localLang, touristLang, false);
      };
      setIsRecording(speaker);
      recognitionRef.current.start();
    } else {
      alert("Speech recognition not supported in this browser. Please use Chrome.");
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
      
      {/* Top Half: Local (Inverted for easy reading if facing phone flat) */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', position: 'relative', display: 'flex', flexDirection: 'column', padding: 32, transform: 'rotate(180deg)', borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
          <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Outfit', sans-serif", opacity: 0.5 }}>Local Guide</div>
          <div style={{ width: 140 }}>
            <CustomDropdown 
              options={langOptions.filter(o => ['Hindi', 'Tamil', 'Bengali'].includes(o.value))}
              value={localLang}
              onChange={setLocalLang}
            />
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <textarea
            value={localText}
            onChange={e => setLocalText(e.target.value)}
            placeholder="Tap mic to speak..."
            style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: 32, fontWeight: 700, fontFamily: "'Outfit', sans-serif", resize: 'none', textAlign: 'center' }}
            disabled={isTranslating}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 16 }}>
          <button 
            onClick={() => toggleRecording('local')}
            style={{ width: 64, height: 64, borderRadius: '50%', background: isRecording === 'local' ? '#ef4444' : '#4b5563', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', transition: 'all 0.2s', boxShadow: isRecording === 'local' ? '0 0 20px rgba(239, 68, 68, 0.6)' : 'none' }}
          >
            🎤
          </button>
        </div>
      </div>

      {/* Center Divider / Processing Status */}
      <div style={{ height: 48, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 24 }}>
          <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>← Dashboard</Link>
        </div>
        
        <div style={{ background: isTranslating ? '#c9a84c' : 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: isTranslating ? '#000' : '#fff', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em' }}>
          {isTranslating ? '✨ TRANSLATING' : '↔ TWO-WAY VOICE'}
        </div>
      </div>

      {/* Bottom Half: Tourist */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(10,10,10,1) 100%)', position: 'relative', display: 'flex', flexDirection: 'column', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
          <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Outfit', sans-serif", color: '#c9a84c' }}>You (Tourist)</div>
          <div style={{ width: 140 }}>
            <CustomDropdown 
              options={langOptions.filter(o => ['English', 'French', 'German'].includes(o.value))}
              value={touristLang}
              onChange={setTouristLang}
            />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <textarea
            value={touristText}
            onChange={e => setTouristText(e.target.value)}
            placeholder="Tap mic to speak..."
            style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: '#e8e4dc', fontSize: 32, fontWeight: 700, fontFamily: "'Outfit', sans-serif", resize: 'none', textAlign: 'center' }}
            disabled={isTranslating}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
          <button 
            onClick={() => toggleRecording('tourist')}
            style={{ width: 64, height: 64, borderRadius: '50%', background: isRecording === 'tourist' ? '#ef4444' : '#c9a84c', border: 'none', color: isRecording === 'tourist' ? '#fff' : '#000', fontSize: 24, cursor: 'pointer', transition: 'all 0.2s', boxShadow: isRecording === 'tourist' ? '0 0 20px rgba(239, 68, 68, 0.6)' : '0 0 20px rgba(201,168,76,0.4)' }}
          >
            🎤
          </button>
        </div>
      </div>

    </div>
  );
}
