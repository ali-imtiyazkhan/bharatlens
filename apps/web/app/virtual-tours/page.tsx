'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import AuthControls from '../../components/AuthControls';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function VirtualToursPage() {
  const [era, setEra] = useState<'Present' | '1500s'>('Present');
  
  // Changing the environment HDR simulates entirely different lighting/time periods
  const hdrEnvironment = era === 'Present' 
    ? 'https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.hdr' 
    : 'https://modelviewer.dev/shared-assets/environments/moon_1k.hdr'; // Darker/historic mock

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
      
      <nav className="navbar" style={{ flexShrink: 0 }}>
        <Link href="/" className="nav-brand">BHARAT<br />LENS</Link>
        <div className="nav-links-center">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/explore">Destinations</Link>
          <Link href="/virtual-tours" style={{ color: '#c9a84c' }}>Virtual Tours</Link>
          <Link href="/planner">AI Planner</Link>
        </div>
        <div className="nav-controls">
          <AuthControls />
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        
        {/* Left Sidebar Info */}
        <div style={{ width: 350, background: '#0a0a0a', borderRight: '0.5px solid rgba(255,255,255,0.08)', padding: '32px', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em' }}>AR/VR EXPERIENCE</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#fff', marginTop: 8, marginBottom: 16 }}>Historic Artifact</h1>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
            Examine high-fidelity photogrammetry scans of historical artifacts and architecture. 
            Drag to rotate, scroll to zoom.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px', marginBottom: 'auto' }}>
            <h3 style={{ fontSize: 12, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#e8e4dc', textTransform: 'uppercase', marginBottom: 16 }}>Time Travel Slider</h3>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Change the environmental lighting and historical context.</p>
            
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button 
                onClick={() => setEra('Present')}
                style={{ flex: 1, padding: '8px 0', border: 'none', background: era === 'Present' ? 'rgba(201,168,76,0.2)' : 'transparent', color: era === 'Present' ? '#c9a84c' : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}
              >
                Present Day
              </button>
              <button 
                onClick={() => setEra('1500s')}
                style={{ flex: 1, padding: '8px 0', border: 'none', background: era === '1500s' ? 'rgba(201,168,76,0.2)' : 'transparent', color: era === '1500s' ? '#c9a84c' : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}
              >
                16th Century
              </button>
            </div>
          </div>

          <button style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #a88b39 100%)', border: 'none', padding: '12px', borderRadius: 8, color: '#000', fontWeight: 800, fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>
            Enter VR Mode 🥽
          </button>
        </div>

        {/* 3D Viewer */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: '#fff', zIndex: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#4ade80' }}>●</span> Blockchain Verified 
          </div>

          <model-viewer
            src="https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb"
            environment-image={hdrEnvironment}
            poster="https://modelviewer.dev/shared-assets/models/NeilArmstrong.webp"
            shadow-intensity="1"
            camera-controls
            auto-rotate
            style={{ width: '100%', height: '100%', outline: 'none' }}
            alt="A 3D model of a historic artifact"
          >
            <div className="progress-bar" slot="progress-bar" style={{ display: 'block', width: '33%', height: '4px', background: 'rgba(201,168,76,0.5)', position: 'absolute', top: '50%', left: '33%' }} />
          </model-viewer>
        </div>
      </div>
    </div>
  );
}
