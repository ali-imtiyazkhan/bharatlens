'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';

export default function LivingArchivePage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/archive/list`);
      const data = await res.json();
      setStories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ background: 'transparent' }}>
      
      <Navbar />

      <main style={{ padding: '64px 48px', maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 64 }}>
        
        <div style={{ flex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 56, fontWeight: 900, marginBottom: 16 }}>The Living Archive</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 48 }}>
              Oral histories from the elders who lived them. Listen to the untranslated voices of India's villages and streets, translated into your language in real-time.
            </p>
          </motion.div>

          <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0.5) 100%)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 24, padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: '#e8e4dc' }}>Are you a local?</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24, lineHeight: 1.5 }}>
              Become a <strong>Story Aide</strong>. Help the elders in your community record their stories. You earn 20 Heritage Points, they earn 50. Preserve your culture before it fades.
            </p>
            <Link href="/archive/record" style={{ display: 'inline-block', background: '#3b82f6', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 800, textDecoration: 'none', fontSize: 14 }}>
              Start Recording a Story →
            </Link>
          </div>
        </div>

        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Stories Nearby</div>
          
          {loading ? (
            <div style={{ color: '#3b82f6' }}>Unearthing oral histories...</div>
          ) : stories.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 48, border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 20 }}>
              No stories archived yet. Be the first to record one!
            </div>
          ) : (
            stories.map((story) => (
              <motion.div 
                key={story.id} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: 24, transition: 'all 0.3s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#e8e4dc', marginBottom: 4 }}>{story.title}</h3>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                      Narrated by <strong>{story.authorName} ({story.authorAge})</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '4px 8px', borderRadius: 4 }}>{story.category}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: 4 }}>{story.era}</span>
                  </div>
                </div>

                {playingId === story.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ overflow: 'hidden', marginBottom: 16 }}>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 12, borderLeft: '3px solid #3b82f6', fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
                      <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Translated from {story.language}</div>
                      "{story.transcript}"
                    </div>
                  </motion.div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <button 
                    onClick={() => setPlayingId(playingId === story.id ? null : story.id)}
                    style={{ background: playingId === story.id ? 'rgba(255,255,255,0.1)' : '#fff', color: playingId === story.id ? '#fff' : '#000', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    {playingId === story.id ? '⏸ Pause' : '▶ Play Original Audio'}
                  </button>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    📍 {story.siteName}
                  </div>
                </div>

              </motion.div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
