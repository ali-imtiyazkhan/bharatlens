'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImmersiveViewer from '../../../components/ImmersiveViewer';
import Artifact3DViewer from '../../../components/Artifact3DViewer';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Map as MapIcon } from 'lucide-react';

export default function ImmersivePage() {
  const { siteId } = useParams();
  const router = useRouter();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'PANORAMA' | 'ARTIFACT'>('PANORAMA');

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
      
      <AnimatePresence mode="wait">
        {viewMode === 'PANORAMA' ? (
          <motion.div 
            key="panorama" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ImmersiveViewer 
              imageUrl={site?.panoramaUrl || 'https://images.unsplash.com/photo-1599395293282-eeb7a921d7b1?q=80&w=2000'} 
              hotspots={site?.hotspots || []}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="artifact" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Artifact3DViewer 
              modelUrl={site?.model3dUrl || 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shrine/model.gltf'} 
              title={site?.name}
            />
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Perspective Toggle */}
      <div style={{ position: 'absolute', bottom: 40, right: 40, zIndex: 20 }}>
        <div style={{ 
          background: 'rgba(0,0,0,0.6)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: 16, 
          padding: 6, 
          display: 'flex', 
          gap: 4 
        }}>
          <button 
            onClick={() => setViewMode('PANORAMA')}
            style={{ 
              background: viewMode === 'PANORAMA' ? '#c9a84c' : 'transparent',
              color: viewMode === 'PANORAMA' ? '#000' : 'rgba(255,255,255,0.4)',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <MapIcon size={14} /> ENVIRONMENT
          </button>
          <button 
            onClick={() => setViewMode('ARTIFACT')}
            style={{ 
              background: viewMode === 'ARTIFACT' ? '#c9a84c' : 'transparent',
              color: viewMode === 'ARTIFACT' ? '#000' : 'rgba(255,255,255,0.4)',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <Box size={14} /> 3D ARTIFACT
          </button>
        </div>
      </div>

    </div>
  );
}
