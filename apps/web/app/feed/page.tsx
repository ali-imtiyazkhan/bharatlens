'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { API_BASE } from '../../lib/api-config';
import Link from 'next/link';

export default function FeedPage() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/social/feed`)
      .then(res => res.json())
      .then(data => {
        setFeed(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />
      
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <header style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Live Network Activity</span>
            <h1 style={{ fontSize: 48, fontWeight: 900, marginTop: 16, marginBottom: 16 }}>The Community <span style={{ color: '#c9a84c' }}>Pulse</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Real-time dispatches from explorers preserving India's heritage across the subcontinent.
            </p>
          </motion.div>
        </header>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 200, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <AnimatePresence>
              {feed.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: 24, 
                    padding: 32,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <Link href={`/profile/${post.user.username}`}>
                      <img 
                        src={post.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`}
                        style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid #c9a84c' }}
                        alt={post.user.username}
                      />
                    </Link>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <Link href={`/profile/${post.user.username}`} style={{ textDecoration: 'none', color: '#fff', fontSize: 16, fontWeight: 800 }}>
                            {post.user.displayName || post.user.username}
                          </Link>
                          <div style={{ fontSize: 11, color: '#c9a84c', fontWeight: 700, marginTop: 2 }}>@{post.user.username.toUpperCase()}</div>
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                          {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>

                      <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
                        {post.content}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                          📍 <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{post.location}</span>
                        </div>
                        {post.type === 'story' && (
                          <div style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 800 }}>
                            📜 {post.metadata.category} • {post.metadata.era}
                          </div>
                        )}
                      </div>

                      {post.photos?.length > 0 && (
                        <div style={{ marginTop: 20, borderRadius: 16, overflow: 'hidden' }}>
                          <img src={post.photos[0]} style={{ width: '100%', height: 250, objectFit: 'cover' }} alt="Visit" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
               <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>You've reached the origin of the network</p>
               <Link href="/discover" style={{ display: 'inline-block', marginTop: 16, color: '#c9a84c', textDecoration: 'none', fontSize: 13, fontWeight: 800 }}>Find more explorers →</Link>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}} />
    </div>
  );
}
