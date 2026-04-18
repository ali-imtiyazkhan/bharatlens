'use client';

import { motion } from 'framer-motion';

export default function BadgeWall({ badges }: { badges: any[] }) {
  const allPossibleBadges = [
    { type: 'STREAK_7', label: '7-Day Explorer', icon: '🔥', desc: 'Maintained a 7 day visit streak' },
    { type: 'EXPLORER_10', label: 'Trailblazer', icon: '🗺️', desc: 'Logged 10 unique heritage sites' },
    { type: 'HISTORIAN_50', label: 'Historian', icon: '📚', desc: 'Visited 50 heritage sites' },
    { type: 'STAR_COLLECTOR_100', label: 'Star Collector', icon: '⭐', desc: 'Earned 100 stars from the community' },
    { type: 'RAJASTHAN_COMPLETE', label: 'Desert Fox', icon: '🐪', desc: 'Visited all key Rajasthan monuments' },
  ];

  return (
    <div style={{ padding: '0 48px', marginBottom: 64 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Explorer Badges</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {allPossibleBadges.map(badgeDef => {
          const earned = badges.find(b => b.type === badgeDef.type);
          return (
            <motion.div 
              key={badgeDef.type}
              whileHover={{ scale: 1.05 }}
              style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: earned ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)', 
                borderRadius: 16, 
                padding: 24, 
                textAlign: 'center',
                opacity: earned ? 1 : 0.4,
                filter: earned ? 'none' : 'grayscale(100%)'
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{badgeDef.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4, color: earned ? '#fff' : 'rgba(255,255,255,0.5)' }}>{badgeDef.label}</div>
              {earned ? (
                <div style={{ fontSize: 10, color: '#3b82f6' }}>Earned {earned.earnedAt}</div>
              ) : (
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Locked</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
