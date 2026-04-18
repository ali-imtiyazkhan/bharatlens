'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import AuthControls from '../../components/AuthControls';

export default function CommunitiesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', interest: '' });
  const [requestPopup, setRequestPopup] = useState<any>(null); // To handle join messages

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setCurrentUser(JSON.parse(stored));
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/communities/discover`);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/communities/create`, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/communities/request-join`, {
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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <Navbar />
      
      <main style={{ padding: '120px 48px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12 }}>Explorer Hub</h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>Join niche communities dedicated to India's vast heritage</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ 
              background: 'linear-gradient(135deg, #c9a84c, #8a6e2d)', color: '#000', 
              border: 'none', padding: '16px 32px', borderRadius: 16, fontWeight: 900, cursor: 'pointer' 
            }}
          >
            Create Community
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#c9a84c' }}>Mapping communities...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {communities.map((c, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
                  padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 20 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 10, background: 'rgba(201,168,76,0.1)', color: '#c9a84c', padding: '6px 14px', borderRadius: 20, fontWeight: 800, textTransform: 'uppercase' }}>
                    {c.interest}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                    {c._count.members} Members
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{c.name}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                </div>
                <button 
                  onClick={() => handleRequestJoin(c.id)}
                  style={{ 
                    marginTop: 'auto', background: 'rgba(255,255,255,0.05)', color: '#fff', 
                    border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: 12, 
                    fontWeight: 700, cursor: 'pointer' 
                  }}
                >
                  Request to Join
                </button>
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
