'use client';

import { motion } from 'framer-motion';

export default function VisitFeed({ visits }: { visits: any[] }) {
  if (!visits || visits.length === 0) return null;

  return (
    <div style={{ padding: '0 48px', marginBottom: 64 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>Exploration Feed</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, background: '#c9a84c', color: '#000', padding: '6px 12px', borderRadius: 20, cursor: 'pointer' }}>All</span>
          <span style={{ fontSize: 13, fontWeight: 800, background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '6px 12px', borderRadius: 20, cursor: 'pointer' }}>With Stories</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {visits.map((visit: any, i: number) => (
          <motion.div 
            key={visit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, overflow: 'hidden' }}
          >
            {/* Image */}
            <div style={{ height: 200, width: '100%', background: `url(${visit.photos?.[0]}) center/cover`, position: 'relative' }}>
              {visit.audioStoryUrl && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: 16, fontSize: 12, fontWeight: 800, border: '1px solid rgba(255,255,255,0.2)' }}>
                  🎙️ Audio Story
                </div>
              )}
            </div>
            
            {/* Content */}
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>{visit.monumentName}</h3>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>📍 {visit.monumentCity}</div>
                </div>
                <div style={{ fontSize: 12, background: 'rgba(201,168,76,0.1)', color: '#c9a84c', padding: '4px 8px', borderRadius: 8, fontWeight: 800 }}>
                  ⭐ {visit.stars}
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 16 }}>{visit.caption}</p>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Visited {new Date(visit.visitedAt).toLocaleDateString()}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
