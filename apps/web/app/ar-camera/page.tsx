'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Webcam from 'react-webcam';

export default function ARCameraPage() {
  const webcamRef = useRef<Webcam>(null);
  const [mode, setMode] = useState<string>('Monument Story');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const captureFrame = useCallback(async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setScanning(true);
    setResult(null);

    try {
      const res = await fetch('/api/explore/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc, mode })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({ error: 'Failed to analyze object. Try again.' });
    }
    
    setScanning(false);
  }, [webcamRef, mode]);

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', background: '#000' }}>
      
      {/* Top Navbar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '24px 32px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif", background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>
          ← Back
        </Link>
        <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em' }}>AR LENS</div>
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

      {/* AR Overlays */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: '70vw', height: '60vh', border: '1.5px solid rgba(201,168,76,0.3)', borderRadius: 24, position: 'relative',
          boxShadow: scanning ? '0 0 40px rgba(201,168,76,0.2) inset' : 'none',
          transition: 'all 0.5s'
        }}>
          {/* Corner brackets */}
          <div style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTop: '4px solid #c9a84c', borderLeft: '4px solid #c9a84c', borderRadius: '24px 0 0 0' }} />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTop: '4px solid #c9a84c', borderRight: '4px solid #c9a84c', borderRadius: '0 24px 0 0' }} />
          <div style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottom: '4px solid #c9a84c', borderLeft: '4px solid #c9a84c', borderRadius: '0 0 0 24px' }} />
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottom: '4px solid #c9a84c', borderRight: '4px solid #c9a84c', borderRadius: '0 0 24px 0' }} />
          
          {/* Scanning Line Animation */}
          {scanning && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#c9a84c', boxShadow: '0 0 20px 4px #c9a84c', animation: 'scan 1.5s linear infinite' }} />}
        </div>
      </div>

      {/* Results Overlay */}
      {result && !scanning && (
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '80%', maxWidth: 400, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 16, padding: 24, zIndex: 20 }}>
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
              <div style={{ fontSize: 18, color: '#c9a84c', fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>{result.identification}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{result.story}</div>
            </>
          )}

          {result.identification && result.explanation && (
            <>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Object</div>
              <div style={{ fontSize: 18, color: '#c9a84c', fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>{result.identification}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{result.explanation}</div>
            </>
          )}
          
          <button onClick={() => setResult(null)} style={{ marginTop: 24, width: '100%', background: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: 10, borderRadius: 8, color: '#fff', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>Close</button>
        </div>
      )}

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
      `}} />
    </div>
  );
}
