'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { API_BASE } from '../../lib/api-config';

export default function DiscoverPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch(`${API_BASE}/api/social/discover`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page" style={{ background: '#050505', minHeight: '100vh', position: 'relative' }}>
      
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 64 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Global Network</span>
            <h1 style={{ fontSize: 64, fontWeight: 900, marginTop: 16, marginBottom: 24, letterSpacing: '-0.03em' }}>Connect with <span style={{ color: '#c9a84c' }}>Explorers</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 600, lineHeight: 1.6 }}>
              Join a world-class network of heritage conservators, historians, and travelers. Discover unique journeys across India.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 350, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 100, background: 'rgba(255,255,255,0.02)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ fontSize: 48, marginBottom: 24 }}>🧭</div>
             <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>No Explorers Found</h3>
             <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Be the first to begin the journey.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
            {users.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link 
                  href={`/profile/${user.username}`}
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                    padding: 40,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="explorer-card"
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', opacity: 0, transition: 'opacity 0.3s' }} className="card-line" />
                  
                  <img 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                    style={{ width: 110, height: 110, borderRadius: '50%', marginBottom: 24, objectFit: 'cover', border: '3px solid #c9a84c', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} 
                    alt={user.displayName} 
                  />
                  <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.02em' }}>{user.displayName || user.username}</h3>
                  <div style={{ fontSize: 13, color: '#c9a84c', fontWeight: 800, marginBottom: 16, letterSpacing: '0.1em' }}>@{user.username.toUpperCase()}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, height: 40, overflow: 'hidden', marginBottom: 32 }}>{user.bio || 'Heritage Explorer @ BharatLens'}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 16, width: '100%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 8px' }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{user?._count?.starsReceived || 0}</div>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '0.1em' }}>STARS</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 8px' }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{user?._count?.visits || 0}</div>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '0.1em' }}>VISITS</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 8px' }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{user?._count?.followers || 0}</div>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '0.1em' }}>FOLKS</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .explorer-card:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(201,168,76,0.3) !important;
          transform: translateY(-8px);
        }
        .explorer-card:hover .card-line {
          opacity: 1 !important;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}} />
    </div>
  );
}
