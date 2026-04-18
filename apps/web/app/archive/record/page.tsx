'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecordArchivePage() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [time, setTime] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const timerRef = useRef<any>(null);

  // Initialize MediaRecorder if access allowed
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
    }).catch(console.error);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleStart = () => {
    if (!mediaRecorder) return;
    mediaRecorder.start();
    setRecording(true);
    setResult(null);
    setTime(0);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const handleStop = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setRecording(false);
    clearInterval(timerRef.current);
    
    // Simulate AI upload payload by manually passing a mock transcription
    // In reality this would be: upload audio blob to backend -> whisper text -> process tags
    processMockTranscriptToAI();
  };

  const processMockTranscriptToAI = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/archive/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: "Humare zamane mein, kuye ka paani bilkul meetha hota tha. 1950s ki baat hai, sarpanch ne ek chabutra banwaya... waha gaon ki saari panchayat hoti thi.",
          language: "Hindi",
          location: "Village Square Well"
        })
      });
      const data = await res.json();
      setResult(data);
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

              <div style={{ fontSize: 48, fontWeight: 300, fontFamily: 'monospace', color: recording ? '#ef4444' : '#fff' }}>
                00:{time < 10 ? `0${time}` : time}
              </div>

              <p style={{ marginTop: 24, fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 300, lineHeight: 1.5 }}>
                Hold the phone near the elder. Let them speak comfortably in their native language.
              </p>
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

          {result && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: 500 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32 }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(74,222,128,0.1)', borderRadius: '50%', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✓</div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800 }}>Story Archived!</h2>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Available immediately to tourists.</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>AI Translation</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6 }}>"{result.translation}"</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8 }}>
                     <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>ERA</div>
                     <div style={{ fontSize: 14, fontWeight: 800, color: '#60a5fa' }}>{result.era}</div>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8 }}>
                     <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>CATEGORY</div>
                     <div style={{ fontSize: 14, fontWeight: 800, color: '#facc15' }}>{result.category}</div>
                   </div>
                </div>

                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>EARNED</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#4ade80' }}>+70 <span style={{ fontSize: 14 }}>HP</span></div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>20 You • 50 Elder</div>
                  </div>
                  <button onClick={() => { setResult(null); setTime(0); }} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>
                    Record Another
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

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
