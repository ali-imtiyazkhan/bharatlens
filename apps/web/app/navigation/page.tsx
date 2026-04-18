'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AuthControls from '../../components/AuthControls';

export default function NavigationPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(45); // 45 seconds in
  const duration = 180; // 3 minutes total for this clip

  // Simulate progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(t => (t >= duration ? 0 : t + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: '#0a0a0a', overflow: 'hidden' }}>
      
      {/* Top Navbar overlapping the map */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '24px 32px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif", background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>
          ← Dashboard
        </Link>
        <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>SMART NAV</div>
      </div>

      {/* Full Screen Map Mock */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Map Grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15, background: '#0a0a0a' }}>
          <defs><pattern id="navgrid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e8e4dc" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#navgrid)" />
        </svg>

        {/* Route Polyline */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M 200 600 Q 400 300 700 400 T 1200 200" fill="none" stroke="#c9a84c" strokeWidth="6" strokeDasharray="12, 12" style={{ animation: 'dash 30s linear infinite' }} />
        </svg>

        {/* Start Point */}
        <div style={{ position: 'absolute', left: 192, top: 410, width: 24, height: 24, background: '#3b82f6', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 0 20px #3b82f6', zIndex: 5 }} />
        
        {/* Current Location Ping */}
        <div style={{ position: 'absolute', left: 692, top: 210, zIndex: 10 }}>
          <div style={{ width: 24, height: 24, background: '#c9a84c', borderRadius: '50%', border: '4px solid #fff', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, border: '2px solid #c9a84c', borderRadius: '50%', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
          </div>
          {/* User Marker Overlay */}
          <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', background: 'rgba(201,168,76,0.2)', backdropFilter: 'blur(10px)', border: '1px solid #c9a84c', color: '#c9a84c', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>
            You are here
          </div>
        </div>

        {/* Destination Target */}
        <div style={{ position: 'absolute', left: 1192, top: 210, width: 24, height: 24, background: '#ef4444', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 0 20px #ef4444', zIndex: 5 }} />
      </div>

      {/* Sticky Bottom Audio Guide */}
      <div style={{ background: '#000', borderTop: '0.5px solid rgba(255,255,255,0.1)', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 32 }}>
        
        {/* Play/Pause */}
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: 56, height: 56, borderRadius: '50%', background: '#c9a84c', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {isPlaying ? (
            <div style={{ display: 'flex', gap: 4 }}><div style={{ width: 4, height: 16, background: '#000', borderRadius: 2 }} /><div style={{ width: 4, height: 16, background: '#000', borderRadius: 2 }} /></div>
          ) : (
            <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #000', marginLeft: 6 }} />
          )}
        </button>

        {/* Track Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Now Playing • Audio Guide</div>
              <div style={{ fontSize: 18, color: '#fff', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>The Royal Elephant Stables</div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>
          
          {/* Scrubber */}
          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(currentTime / duration) * 100}%`, background: '#c9a84c', borderRadius: 3 }} />
            <div style={{ position: 'absolute', top: '50%', left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)', width: 12, height: 12, background: '#fff', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
          </div>
        </div>

        {/* Real-time Crowd Panel */}
        <div style={{ width: 180, background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Ahead: Main Gate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🟡</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#facc15' }}>Moderate Crowd</div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}} />
    </div>
  );
}
