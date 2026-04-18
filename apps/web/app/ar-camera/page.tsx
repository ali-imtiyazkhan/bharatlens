'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanResult {
  identification?: string;
  story?: string;
  explanation?: string;
  translation?: string;
  context?: string;
  error?: string;
  mode: string;
  timestamp: string;
}

export default function ARCameraPage() {
  const webcamRef = useRef<Webcam>(null);
  const [mode, setMode] = useState<string>('Monument Story');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakResult = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const captureFrame = useCallback(async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setScanning(true);
    setResult(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${API_BASE}/api/explore/vision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc, mode })
      });
      const data = await res.json();
      const scanResult = { ...data, mode, timestamp: new Date().toLocaleTimeString() };
      setResult(scanResult);
      setScanHistory(prev => [scanResult, ...prev].slice(0, 10));
    } catch (e) {
      console.error(e);
      setResult({ error: 'Vision API Offline. Check GEMINI_API_KEY.', mode, timestamp: new Date().toLocaleTimeString() });
    }
    
    setScanning(false);
  }, [webcamRef, mode]);

  const getResultText = (r: ScanResult) => {
    if (r.story) return `${r.identification}. ${r.story}`;
    if (r.explanation) return `${r.identification}. ${r.explanation}`;
    if (r.translation) return `Translation: ${r.translation}. ${r.context || ''}`;
    return '';
  };

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', background: '#000' }}>
      
      {/* Top Navbar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '24px 32px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif", background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>
          ← Back
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Scan history button */}
          <button 
            onClick={() => setShowHistory(!showHistory)}
            style={{ 
              background: showHistory ? '#c9a84c' : 'rgba(0,0,0,0.5)', 
              color: showHistory ? '#000' : '#fff',
              border: 'none', padding: '8px 16px', borderRadius: 20, backdropFilter: 'blur(10px)', 
              fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            📋 {scanHistory.length}
          </button>
          <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em' }}>AR LENS</div>
        </div>
      </div>

      {/* Camera Feed */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'environment' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Scanning Overlay with enhanced animations */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: '70vw', height: '60vh', border: '1.5px solid rgba(201,168,76,0.3)', borderRadius: 24, position: 'relative',
          boxShadow: scanning ? '0 0 60px rgba(201,168,76,0.3) inset, 0 0 120px rgba(201,168,76,0.1)' : 'none',
          transition: 'all 0.5s'
        }}>
          {/* Corner brackets */}
          <div style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTop: '4px solid #c9a84c', borderLeft: '4px solid #c9a84c', borderRadius: '24px 0 0 0' }} />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTop: '4px solid #c9a84c', borderRight: '4px solid #c9a84c', borderRadius: '0 24px 0 0' }} />
          <div style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottom: '4px solid #c9a84c', borderLeft: '4px solid #c9a84c', borderRadius: '0 0 0 24px' }} />
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottom: '4px solid #c9a84c', borderRight: '4px solid #c9a84c', borderRadius: '0 0 24px 0' }} />
          
          {/* Scanning Line + Pulse */}
          {scanning && (
            <>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#c9a84c', boxShadow: '0 0 20px 4px #c9a84c', animation: 'scan 1.5s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: 24, animation: 'pulse-border 1.5s ease-in-out infinite', border: '2px solid rgba(201,168,76,0.4)' }} />
            </>
          )}

          {/* Center crosshair */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: scanning ? 1 : 0.4, transition: 'opacity 0.3s' }}>
            <div style={{ width: 24, height: 1, background: '#c9a84c', position: 'absolute', top: 0, left: -12 }} />
            <div style={{ width: 1, height: 24, background: '#c9a84c', position: 'absolute', top: -12, left: 0 }} />
          </div>

          {/* Status text */}
          {scanning && (
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', fontFamily: "'Outfit', sans-serif" }}>
              ANALYZING...
            </div>
          )}
        </div>
      </div>

      {/* Results Overlay — Enhanced with voice button */}
      <AnimatePresence>
        {result && !scanning && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '85%', maxWidth: 420, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: 28, zIndex: 20 }}
          >
            {/* Mode badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.15em', background: 'rgba(201,168,76,0.1)', padding: '4px 12px', borderRadius: 12 }}>{result.mode?.toUpperCase()}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{result.timestamp}</div>
            </div>

            {result.error && <div style={{ color: '#f87171', fontSize: 13, fontWeight: 600 }}>{result.error}</div>}
            
            {result.translation && (
              <>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Translation</div>
                <div style={{ fontSize: 18, color: '#e8e4dc', fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>"{result.translation}"</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{result.context}</div>
              </>
            )}

            {result.identification && result.story && (
              <>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Identified</div>
                <div style={{ fontSize: 20, color: '#c9a84c', fontWeight: 900, fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>{result.identification}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{result.story}</div>
              </>
            )}

            {result.identification && result.explanation && (
              <>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Object</div>
                <div style={{ fontSize: 20, color: '#c9a84c', fontWeight: 900, fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>{result.identification}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{result.explanation}</div>
              </>
            )}

            {/* Action buttons row */}
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {/* Voice Narrate button */}
              {!result.error && (
                <button 
                  onClick={() => isSpeaking ? stopSpeaking() : speakResult(getResultText(result))}
                  style={{ 
                    flex: 1, padding: '12px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: 12,
                    fontFamily: "'Outfit', sans-serif", border: 'none', transition: 'all 0.2s',
                    background: isSpeaking ? 'rgba(239,68,68,0.2)' : 'rgba(201,168,76,0.15)',
                    color: isSpeaking ? '#f87171' : '#c9a84c',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  {isSpeaking ? (
                    <><span style={{ animation: 'pulse-dot 1s infinite' }}>🔊</span> STOP</>
                  ) : (
                    <>🔊 NARRATE</>
                  )}
                </button>
              )}
              
            </div>

            <button onClick={() => { setResult(null); stopSpeaking(); }} style={{ marginTop: 8, width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: 10, borderRadius: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 11 }}>Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            style={{ 
              position: 'absolute', top: 0, right: 0, bottom: 0, width: 320, 
              background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', 
              borderLeft: '1px solid rgba(255,255,255,0.05)', zIndex: 30,
              padding: '80px 24px 24px', overflowY: 'auto'
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Scan History</span>
              <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            {scanHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 12 }}>No scans yet</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {scanHistory.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => { setResult(s); setShowHistory(false); }}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', 
                      borderRadius: 14, padding: 16, cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontSize: 9, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em' }}>{s.mode?.toUpperCase()}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{s.timestamp}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>
                      {s.identification || s.translation?.slice(0, 40) || 'Processing...'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', zIndex: 10 }}>
        
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 8, maxWidth: '100%', scrollbarWidth: 'none' }}>
          {['Sign Translation', 'Monument Story', 'Object ID'].map(m => (
            <button 
              key={m}
              onClick={() => { setMode(m); setResult(null); }}
              style={{
                background: mode === m ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.5)',
                border: mode === m ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,0.1)',
                color: mode === m ? '#c9a84c' : 'rgba(255,255,255,0.6)',
                padding: '8px 16px', borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: 'pointer', backdropFilter: 'blur(10px)',
                fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap'
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <button 
          onClick={captureFrame} 
          disabled={scanning}
          style={{ width: 72, height: 72, borderRadius: '50%', background: 'none', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: scanning ? 'not-allowed' : 'pointer' }}
        >
          <div style={{ width: scanning ? 24 : 54, height: scanning ? 24 : 54, background: scanning ? '#f87171' : '#fff', borderRadius: scanning ? 4 : '50%', transition: 'all 0.2s' }} />
        </button>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulse-border {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.01); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}} />
    </div>
  );
}
