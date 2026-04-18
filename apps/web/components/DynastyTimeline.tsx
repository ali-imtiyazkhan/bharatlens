'use client';

import { useState } from 'react';

const ERAS = [
  { id: 'all', label: 'All Eras', year: 'Infinity' },
  { id: 'ancient', label: 'Ancient', year: 'Pre-600' },
  { id: 'medieval', label: 'Medieval', year: '600-1500' },
  { id: 'mughal', label: 'Mughal', year: '1526-1857' },
  { id: 'colonial', label: 'Colonial', year: '1858-1947' },
  { id: 'modern', label: 'Modern', year: '1947+' },
];

interface Props {
  activeEra: string;
  onSelectEra: (id: string) => void;
}

export default function DynastyTimeline({ activeEra, onSelectEra }: Props) {
  return (
    <div style={{ 
      width: '100%', 
      background: 'rgba(255,255,255,0.02)', 
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '20px 48px',
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      overflowX: 'auto',
      scrollbarWidth: 'none'
    }}>
      <div style={{ flexShrink: 0, fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        Chronological Selection
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {ERAS.map((era) => {
          const isActive = activeEra.toLowerCase().includes(era.id) || (era.id === 'all' && activeEra === 'All Eras');
          return (
            <button
              key={era.id}
              onClick={() => onSelectEra(era.id === 'all' ? 'All Eras' : era.label)}
              style={{
                flexShrink: 0,
                padding: '12px 24px',
                borderRadius: 12,
                background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? '#c9a84c' : 'rgba(255,255,255,0.1)',
                color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left',
                minWidth: 140
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.6, marginBottom: 4 }}>{era.year}</div>
              <div style={{ fontSize: 12, fontWeight: 900 }}>{era.label.toUpperCase()}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
