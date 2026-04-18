'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthControls from '../../components/AuthControls';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';

export default function RewardsPage() {
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Get the current logged in user from storage
      const stored = localStorage.getItem('user');
      let currentUser: any = null;
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
        } catch (e) {}
      }

      if (!currentUser || !currentUser.username) {
        setLoading(false);
        return;
      }

      const activeUsername = currentUser.username;
      setCurrentUsername(activeUsername);

      try {
        const [statsRes, leadRes] = await Promise.all([
          fetch(`/api/rewards/stats/${activeUsername}`),
          fetch('/api/rewards/leaderboard')
        ]);
        
        const statsData = await statsRes.json();
        const leadData = await leadRes.json();

        if (statsData) setStats(statsData);
        if (leadData.leaderboard) setLeaderboard(leadData.leaderboard);
      } catch (e) {
        console.error("Failed to fetch rewards data", e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em' }}>SYNCHRONIZING ASSETS...</div>
      </div>
    );
  }

  const badges = stats?.badges || [
    { title: 'Early Explorer', desc: 'Joined BharatLens in Beta', icon: '🌟', unlocked: true },
    { title: 'Fort Historian', desc: 'Visited 5 Forts', icon: '🏰', unlocked: false },
    { title: 'UNESCO Master', desc: 'Visited 3 UNESCO Sites', icon: '🏛️', unlocked: false },
  ];

  return (
    <div className="page" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      <Navbar />

      <div style={{ flex: 1, padding: '48px 64px', overflowY: 'auto', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Cultural Capital</span>
          <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 40, letterSpacing: '-0.02em' }}>Rewards & <span style={{ color: '#c9a84c' }}>Prosperity</span></h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 56 }}>
          {/* Tokens Card */}
          <motion.div whileHover={{ y: -5 }} style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.02) 100%)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 24, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>BHARATLENS TOKENS</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: '#fff', marginTop: 12 }}>{stats?.tokens || 0}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 12, lineHeight: 1.6 }}>Redeemable for immersive AR passes and heritage fast-track entries.</div>
          </motion.div>

          {/* XP Tracker */}
          <motion.div whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase' }}>LEVEL: {stats?.level || 'EXPLORER'}</div>
            <div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#fff' }}>{stats?.xp || 0} <span style={{ fontSize: 16, color: '#a78bfa', fontWeight: 600 }}>XP</span></div>
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, marginTop: 16, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} style={{ height: '100%', background: '#a78bfa' }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>Earned from 360° tours and site visits.</div>
          </motion.div>

          {/* Spending Tracker */}
          <motion.div whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase' }}>TRIP EXPENDITURE</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#fff' }}>₹{(stats?.spent || 0).toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>Total travel capital tracked across all planned journeys.</div>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: 56 }}>
          {/* Badges Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
               <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f0ece4' }}>Heritage Badges</h2>
               <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>{badges.filter((b:any) => b.unlocked).length} / {badges.length} UNLOCKED</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {badges.map((b:any) => (
                <div key={b.title} style={{ 
                  background: b.unlocked ? 'rgba(201,168,76,0.03)' : 'rgba(255,255,255,0.01)', 
                  border: b.unlocked ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(255,255,255,0.04)', 
                  borderRadius: 20, padding: 28, opacity: b.unlocked ? 1 : 0.4, transition: 'all 0.3s' 
                }}>
                  <div style={{ fontSize: 40, marginBottom: 16, filter: b.unlocked ? 'none' : 'grayscale(100%) brightness(0.5)' }}>{b.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: b.unlocked ? '#c9a84c' : '#fff' }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8, lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: '32px', height: 'fit-content' }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#f0ece4', marginBottom: 24 }}>Elite Historians</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {leaderboard.map((user, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, background: user.name.toLowerCase().includes(currentUsername.toLowerCase()) ? 'rgba(201,168,76,0.08)' : 'transparent', padding: '12px', borderRadius: 12, border: user.name.toLowerCase().includes(currentUsername.toLowerCase()) ? '1px solid rgba(201,168,76,0.2)' : 'none' }}>
                  <div style={{ width: 32, fontSize: 12, fontWeight: 900, color: user.rank <= 3 ? '#c9a84c' : 'rgba(255,255,255,0.2)' }}>
                    #{user.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: user.name.toLowerCase().includes(currentUsername.toLowerCase()) ? 900 : 700, color: user.name.toLowerCase().includes(currentUsername.toLowerCase()) ? '#c9a84c' : '#e8e4dc' }}>{user.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{user.level}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{user.points.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
