'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../../../lib/api-config';
import AudioPlayer from '../../../components/AudioPlayer';

export default function RecordArchivePage() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [time, setTime] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [authorInfo, setAuthorInfo] = useState({ name: '', age: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  
  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition and MediaRecorder
  useEffect(() => {
    // MediaRecorder
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
    }).catch(console.error);

    // Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN'; // Default to Indian English, Gemini handles other langs in processing

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setLiveTranscript(prev => (prev + ' ' + final).trim());
      };

      recognitionRef.current = rec;
    }

    return () => {
      clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const handleStart = () => {
    if (!mediaRecorder) return;
    mediaRecorder.start();
    setRecording(true);
    setResult(null);
    setTime(0);
    setLiveTranscript('');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) { console.error('Recognition already started'); }
    }

    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const handleStop = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setRecording(false);
    clearInterval(timerRef.current);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    processRealTranscriptToAI();
  };

  const processRealTranscriptToAI = async () => {
    setProcessing(true);
    try {
      // Use the actual transcript from the live recognition
      const textToProcess = liveTranscript || "Default transcript fallback";
      
      const res = await fetch('/api/archive/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: textToProcess,
          language: "Auto-detect",
          location: "Current Heritage Site"
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  };

  const handleSubmit = async () => {
    const stored = localStorage.getItem('user');
    if (!stored || !result) return;
    const user = JSON.parse(stored);

    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/archive/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aideId: user.id,
          authorName: authorInfo.name,
          authorAge: authorInfo.age,
          siteName: result.location,
          resultData: result
        })
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar for Aide */}
      <nav style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <Link href="/archive" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
          ✕ Cancel
        </Link>
        <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '6px 16px', borderRadius: 20, color: '#4ade80', fontSize: 12, fontWeight: 800 }}>
          Story Aide Mode Active
        </div>
      </nav>

      {/* Main Recording Interface */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        
        <AnimatePresence mode="wait">
          {!result && !processing && (
            <motion.div key="recorder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {recording ? 'Recording Oral History...' : 'Ready to Record'}
              </div>

              <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 48px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Ripples */}
                {recording && (
                  <>
                    <div style={{ position: 'absolute', inset: -20, background: 'rgba(239,68,68,0.2)', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                    <div style={{ position: 'absolute', inset: -40, border: '1px solid rgba(239,68,68,0.3)', borderRadius: '50%', animation: 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                  </>
                )}
                
                {/* Main Button */}
                <button 
                  onClick={recording ? handleStop : handleStart}
                  style={{ width: 120, height: 120, borderRadius: '50%', background: recording ? 'transparent' : '#ef4444', border: recording ? '4px solid #ef4444' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'all 0.3s' }}
                >
                  {recording ? (
                    <div style={{ width: 40, height: 40, background: '#ef4444', borderRadius: 8 }} />
                  ) : (
                    <div style={{ fontSize: 40 }}>🎙️</div>
                  )}
                </button>
              </div>

              <div style={{ fontSize: 48, fontWeight: 300, fontFamily: 'monospace', color: recording ? '#ef4444' : '#fff', marginBottom: 32 }}>
                00:{time < 10 ? `0${time}` : time}
              </div>

              <AnimatePresence>
                {recording && liveTranscript && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 400, margin: '0 auto' }}
                  >
                    <div style={{ fontSize: 9, color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.1em' }}>Live Caption</div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{liveTranscript}..."
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!recording && (
                <p style={{ marginTop: 24, fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 300, lineHeight: 1.5, margin: '24px auto 0 auto' }}>
                  Hold the phone near the elder. Let them speak comfortably in their native language.
                </p>
              )}
            </motion.div>
          )}

          {processing && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
               <div style={{ width: 64, height: 64, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px auto' }} />
               <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>AI Processing Pipeline</h2>
               <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6 }}>
                 Transcribing audio... <br/>
                 Translating to English... <br/>
                 Extracting semantic tags...
               </p>
            </motion.div>
          )}

          {result && !submitted && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: 500 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32 }}>
                
                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Story Details</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Elder's Name</label>
                    <input 
                      placeholder="Who is telling the story?"
                      value={authorInfo.name}
                      onChange={e => setAuthorInfo({...authorInfo, name: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Approximate Age</label>
                    <input 
                      type="number"
                      placeholder="e.g. 82"
                      value={authorInfo.age}
                      onChange={e => setAuthorInfo({...authorInfo, age: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 12, marginBottom: 24, position: 'relative' }}>
                  <div style={{ fontSize: 11, color: 'rgba(59,130,246,0.6)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>AI Summary: "{result.title}"</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>{result.translation}</p>
                  <button 
                    onClick={() => setIsAudioOpen(true)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    🔊 Listen to Narration
                  </button>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={!authorInfo.name || !authorInfo.age}
                  style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 900, cursor: (authorInfo.name && authorInfo.age) ? 'pointer' : 'not-allowed', opacity: (authorInfo.name && authorInfo.age) ? 1 : 0.5 }}
                >
                  Confirm & Archive Story
                </button>
              </div>
            </motion.div>
          )}

          {submitted && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
               <div style={{ width: 80, height: 80, background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px auto' }}>✓</div>
               <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Hero Status Earned!</h2>
               <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>The story is now part of the Living Archive. <br/>You earned <strong>70 HP</strong>.</p>
               <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                 <button onClick={() => window.location.href = '/archive'} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>View Archive</button>
                 <button onClick={() => { setSubmitted(false); setResult(null); setAuthorInfo({name:'', age:''}); }} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Record Another</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <AudioPlayer 
        isOpen={isAudioOpen}
        onClose={() => setIsAudioOpen(false)}
        siteName={result?.location || 'Heritage Site'}
        category="Oral History"
      />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
