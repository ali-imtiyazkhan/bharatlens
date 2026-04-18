'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../components/Navbar';

// Heritage assets
const ARTIFACTS = [
  { id: '1', name: 'Ancient Stone Pillar', url: 'https://modelviewer.dev/shared-assets/models/Canoe.glb', desc: 'A meticulously carved stone pillar representing 11th-century craftsmanship.' },
  { id: '2', name: 'Ceremonial Vase', url: 'https://modelviewer.dev/shared-assets/models/Chair.glb', desc: 'An ornate vessel used during royal ceremonies in the 16th century.' }
];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function VirtualToursPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtifact, setSelectedArtifact] = useState(ARTIFACTS[0]);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    fetch('/api/explore/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => {
      setSites(data.sites || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const handleEnterVR = () => {
    if (modelViewerRef.current) {
      if (modelViewerRef.current.canActivateAR) {
        modelViewerRef.current.activateAR();
      } else {
        try {
          if (modelViewerRef.current.requestFullscreen) {
            modelViewerRef.current.requestFullscreen();
          }
        } catch (err) {
          alert("VR/AR mode failed to initialize.");
        }
      }
    }
  };

  return (
    <div className="page" style={{ background: 'transparent' }}>
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
      
      <Navbar />

      {/* ── Hero: 3D Artifact Museum ── */}
      <section style={{ height: '70vh', background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)', display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* Left Sidebar: Artifact Info */}
        <div style={{ width: 400, padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, background: 'linear-gradient(to right, #000, transparent)' }}>
           <span style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Museum of Bharat</span>
           <h1 style={{ fontSize: 42, fontWeight: 900, marginTop: 12, marginBottom: 20, lineHeight: 1.1 }}>{selectedArtifact.name}</h1>
           <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 32 }}>{selectedArtifact.desc}</p>
           
           <div style={{ display: 'flex', gap: 12 }}>
             <button 
                onClick={handleEnterVR}
                style={{ background: '#c9a84c', border: 'none', padding: '14px 28px', borderRadius: 8, color: '#000', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
             >
                ENTER VR MODE 🥽
             </button>
             <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                🏛️
             </div>
           </div>
        </div>

        {/* 3D Model View */}
        <div style={{ flex: 1, position: 'relative' }}>
          <model-viewer
            ref={modelViewerRef}
            src={selectedArtifact.url}
            shadow-intensity="2"
            exposure="1"
            environment-image="neutral"
            camera-controls
            auto-rotate
            ar
            ar-modes="webxr scene-viewer quick-look"
            style={{ width: '100%', height: '100%', outline: 'none' }}
          >
            <div slot="progress-bar" style={{ display: 'none' }} />
          </model-viewer>

          {/* Bottom HUD */}
          <div style={{ position: 'absolute', bottom: 40, right: 40, display: 'flex', gap: 40, textAlign: 'right', opacity: 0.5 }}>
             <div>
                <div style={{ fontSize: 9, color: '#fff', marginBottom: 4 }}>HISTORICAL ACCURACY</div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>± 0.04mm</div>
             </div>
             <div>
                <div style={{ fontSize: 9, color: '#fff', marginBottom: 4 }}>DATA SOURCE</div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>LiDAR Scan</div>
             </div>
          </div>
        </div>
      </section>

      {/* ── Immersive Tours Gallery ── */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
           <div>
              <h2 style={{ fontSize: 32, fontWeight: 900 }}>360° Immersive <span style={{ color: '#c9a84c' }}>Tours</span></h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Virtually teleport inside India&apos;s most iconic historical monuments.</p>
           </div>
           <Link href="/dashboard" style={{ color: '#c9a84c', fontSize: 12, fontWeight: 800, textDecoration: 'none', borderBottom: '1px solid #c9a84c', paddingBottom: 4 }}>VIEW DASHBOARD</Link>
        </div>

        {loading ? (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>FETCHING IMPERIAL ARCHIVES...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
            {sites.map(site => (
              <Link 
                key={site.id} 
                href={`/immersive/${site.id || site.name.toLowerCase().replace(/\s+/g, '-')}`}
                style={{ position: 'relative', height: 260, borderRadius: 20, overflow: 'hidden', textDecoration: 'none' }}
              >
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%), url(${site.panoramaUrl}) center/cover` }} className="tour-bg" />
                <div style={{ position: 'absolute', inset: 0, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 1 }}>
                   <div style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em', marginBottom: 4 }}>{site.state.toUpperCase()}</div>
                   <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>{site.name}</h3>
                   <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }} className="tour-action">
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>START IMMERSIVE TOUR</span>
                      <span style={{ fontSize: 14 }}>→</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Global CSS for hover effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tour-action { opacity: 0; transform: translateY(10px); transition: all 0.3s; }
        a:hover .tour-action { opacity: 1 !important; transform: translateY(0) !important; }
        a:hover .tour-bg { transform: scale(1.05); transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .tour-bg { transition: transform 0.8s ease; }
      `}} />
    </div>
  );
}
