'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function DiscoverPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/social/discover')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page" style={{ background: 'transparent' }}>
      
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '64px auto', padding: '0 48px' }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 12 }}>Connect with <span style={{ color: '#c9a84c' }}>Explorers</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Discover fellow heritage lovers and see their unique journeys across India.</p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: 200, borderRadius: 16, background: 'rgba(255,255,255,0.02)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {users.map(user => (
              <Link 
                key={user.id} 
                href={`/profile/${user.username}`}
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 20,
                  padding: 32,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <img 
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                  style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: 20, objectFit: 'cover', border: '3px solid rgba(201,168,76,0.2)' }} 
                  alt={user.displayName} 
                />
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{user.displayName || user.username}</h3>
                <div style={{ fontSize: 12, color: '#c9a84c', fontWeight: 700, marginBottom: 12, letterSpacing: '0.05em' }}>@{user.username}</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, height: 40, overflow: 'hidden', marginBottom: 20 }}>{user.bio || 'Heritage Explorer @ BharatLens'}</p>
                
                <div style={{ display: 'flex', gap: 16, background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: 12, width: '100%', justifyContent: 'center' }}>
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 900 }}>{user._count.starsReceived}</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Stars</div>
                   </div>
                   <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: 24 }} />
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 900 }}>{user._count.visits}</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Visits</div>
                   </div>
                   <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: 24 }} />
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 900 }}>{user._count.followers}</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Folks</div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}} />
    </div>
  );
}
