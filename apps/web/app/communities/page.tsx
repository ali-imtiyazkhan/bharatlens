'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function CommunitiesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', interest: '' });
  const [tab, setTab] = useState<'discover' | 'mine'>('discover');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setCurrentUser(JSON.parse(stored));
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/communities/discover`);
      const data = await res.json();
      setCommunities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_BASE}/api/communities/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCommunity, creatorId: currentUser.id })
      });
      if (res.ok) {
        setShowCreateModal(false);
        fetchCommunities();
      }
    } catch (e) { console.error(e); }
  };

  const handleRequestJoin = async (cid: string) => {
    if (!currentUser) return alert('Login required to join communities');
    const message = prompt('Why would you like to join this community?');
    if (message === null) return;

    try {
      const res = await fetch(`${API_BASE}/api/communities/request-join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, communityId: cid, message })
      });
      if (res.ok) {
        alert('Request sent! The creator will review your request soon.');
      } else {
        alert('Failed to send request. You might already be a member or have a pending request.');
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />
      
      <main style={{ padding: '120px 64px 64px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Explorer Hub</span>
            <h1 style={{ fontSize: 56, fontWeight: 900, marginTop: 16, marginBottom: 12, letterSpacing: '-0.02em' }}>Heritage <span style={{ color: '#c9a84c' }}>Communities</span></h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', maxWidth: 500, lineHeight: 1.6 }}>Join exclusive circles dedicated to preserving and studying India's vast cultural legacy.</p>
          </motion.div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ 
              background: '#c9a84c', color: '#000', 
              border: 'none', padding: '18px 36px', borderRadius: 12, fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 20px 40px rgba(201,168,76,0.2)', transition: 'all 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            + Create Community
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48, background: 'rgba(255,255,255,0.02)', padding: 6, borderRadius: 16, width: 'fit-content', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={() => setTab('discover')} 
            style={{ padding: '12px 28px', borderRadius: 12, fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer', background: tab === 'discover' ? '#c9a84c' : 'transparent', color: tab === 'discover' ? '#000' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s' }}
          >
            Discover All
          </button>
          <button 
            onClick={() => setTab('mine')} 
            style={{ padding: '12px 28px', borderRadius: 12, fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer', background: tab === 'mine' ? '#c9a84c' : 'transparent', color: tab === 'mine' ? '#000' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s' }}
          >
            My Communities
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 32 }}>
             {[1,2,3].map(i => <div key={i} style={{ height: 300, background: 'rgba(255,255,255,0.02)', borderRadius: 24, animation: 'pulse 1.5s infinite' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 32 }}>
            {(tab === 'mine' 
              ? communities.filter((c: any) => c.creatorId === currentUser?.id || c.members?.some((m: any) => m.userId === currentUser?.id))
              : communities
            ).map((c: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', 
                  padding: 40, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 24,
                  transition: 'all 0.4s', position: 'relative', overflow: 'hidden'
                }}
                className="community-card"
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#c9a84c', opacity: 0.3 }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 10, background: 'rgba(201,168,76,0.1)', color: '#c9a84c', padding: '6px 14px', borderRadius: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {c.interest}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                    {c._count.members} Explorers
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.02em' }}>{c.name}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                </div>

                {(() => {
                  const isMember = c.members?.some((m: any) => m.userId === currentUser?.id) || c.creatorId === currentUser?.id;
                  return isMember ? (
                    <Link 
                      href={`/communities/${c.id}`}
                      style={{ 
                        background: '#c9a84c', color: '#000', 
                        border: 'none', padding: '16px', borderRadius: 12, 
                        fontWeight: 900, cursor: 'pointer', textDecoration: 'none', textAlign: 'center',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                      }}
                    >
                      💬 ENTER FORUM
                    </Link>
                  ) : (
                    <button 
                      onClick={() => handleRequestJoin(c.id)}
                      style={{ 
                        background: 'rgba(201,168,76,0.05)', color: '#c9a84c', 
                        border: '1px solid rgba(201,168,76,0.2)', padding: '16px', borderRadius: 12, 
                        fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.05)'; }}
                    >
                      REQUEST TO JOIN
                    </button>
                  );
                })()}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: '#111', padding: 48, borderRadius: 32, width: '100%', maxWidth: 500, border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>Found a Community</h2>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Name</label>
                  <input 
                    required
                    placeholder="e.g. Mughal Architecture Buffs"
                    onChange={e => setNewCommunity({...newCommunity, name: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Interest Category</label>
                  <input 
                    required
                    placeholder="e.g. History, Architecture, Camping"
                    onChange={e => setNewCommunity({...newCommunity, interest: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Description</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="What is this community about?"
                    onChange={e => setNewCommunity({...newCommunity, description: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button type="submit" style={{ flex: 1, background: '#c9a84c', color: '#000', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 900, cursor: 'pointer' }}>Create Community</button>
                  <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
