'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImmersiveViewer from '../../../components/ImmersiveViewer';

export default function ImmersivePage() {
  const { siteId } = useParams();
  const router = useRouter();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/explore/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => {
      const found = data.sites.find((s: any) => s.id.toString() === siteId || s.name.toLowerCase().includes(siteId.toString().toLowerCase()));
      setSite(found || data.sites[0]);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [siteId]);

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 800, letterSpacing: '0.2em' }}>INITIALIZING PERSPECTIVE...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000', overflow: 'hidden', position: 'relative' }}>
      
      <ImmersiveViewer 
        imageUrl={site?.panoramaUrl || 'https://images.unsplash.com/photo-1599395293282-eeb7a921d7b1?q=80&w=2000'} 
        hotspots={site?.hotspots || []}
      />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <button 
          onClick={() => router.back()} 
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            color: '#fff', 
            padding: '12px 24px', 
            borderRadius: 12, 
            fontSize: 12, 
            fontWeight: 700, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <span>←</span> Back to Map
        </button>

        <div style={{ textAlign: 'right' }}>
           <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{site?.name || 'Heritage Site'}</h1>
           <div style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em', marginTop: 4 }}>{site?.state?.toUpperCase()} · {site?.era?.toUpperCase()}</div>
        </div>
      </div>

      {/* Floating Coordinates */}
      <div style={{ position: 'absolute', top: '50%', left: 40, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 20, pointerEvents: 'none' }}>
         <div style={{ opacity: 0.4 }}>
            <div style={{ fontSize: 9, color: '#fff', marginBottom: 4 }}>LATITUDE</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{site?.lat || '27.1751'}° N</div>
         </div>
         <div style={{ opacity: 0.4 }}>
            <div style={{ fontSize: 9, color: '#fff', marginBottom: 4 }}>LONGITUDE</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{site?.lng || '78.0421'}° E</div>
         </div>
         <div style={{ opacity: 0.4 }}>
            <div style={{ fontSize: 9, color: '#fff', marginBottom: 4 }}>ELEVATION</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>171m MSL</div>
         </div>
      </div>

    </div>
  );
}
