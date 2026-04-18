'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HighlightReel({ highlights }: { highlights: any[] }) {
  const [activeStory, setActiveStory] = useState<any>(null);

  return (
    <>
      <div style={{ padding: '0 48px', marginBottom: 64 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Travel Highlights</h2>
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16 }}>
          
          {highlights.map((h: any) => (
            <div key={h.id} onClick={() => setActiveStory(h)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(45deg, #c9a84c, #ef4444)', padding: 3 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `url(${h.coverImageUrl}) center/cover`, border: '3px solid #0a0a0a' }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'center' }}>{h.title}</div>
            </div>
          ))}

          {/* New highlight stub */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 80 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              +
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>New</div>
          </div>
        </div>
      </div>

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {activeStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 24, right: 32, fontSize: 32, cursor: 'pointer', color: '#fff', zIndex: 110 }} onClick={() => setActiveStory(null)}>✕</div>
            
            <div style={{ width: '100%', maxWidth: 500, height: '90vh', background: `url(${activeStory.coverImageUrl}) center/cover`, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 20%, rgba(0,0,0,0.8) 100%)' }} />
              
              {/* Progress Bar (fake) */}
              <div style={{ position: 'absolute', top: 16, left: 16, right: 16, height: 3, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 5 }} style={{ height: '100%', background: '#fff' }} onAnimationComplete={() => setActiveStory(null)} />
              </div>
              
              <div style={{ position: 'absolute', bottom: 32, left: 24, right: 24 }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{activeStory.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{activeStory.visitCount} memories saved</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
