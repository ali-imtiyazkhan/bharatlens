'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthControls from '../../components/AuthControls';

export default function RewardsPage() {
  const [tokens] = useState(1250);
  const [spent] = useState(1400); // Mock past trip expenditure
  
  const badges = [
    { title: 'Early Explorer', desc: 'Joined BharatLens in Beta', icon: '🌟', unlocked: true },
    { title: 'Fort Historian', desc: 'Visited 5 Forts', icon: '🏰', unlocked: true },
    { title: 'Temple Run', desc: 'Visited 10 Temples', icon: '🛕', unlocked: false },
    { title: 'UNESCO Master', desc: 'Visited 3 UNESCO Sites', icon: '🏛️', unlocked: false },
  ];

  const leaderboard = [
    { rank: 1, name: 'Ananya S.', points: 8400, level: 'Grandmaster' },
    { rank: 2, name: 'Rahul V.', points: 7200, level: 'Historian' },
    { rank: 3, name: 'Vikram K.', points: 6900, level: 'Historian' },
    { rank: 4, name: 'Priya M.', points: 5100, level: 'Explorer' },
    { rank: 5, name: 'You', points: 1250, level: 'Explorer', isYou: true },
  ];

  return (
    <div className="page" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar" style={{ flexShrink: 0 }}>
        <Link href="/" className="nav-brand">BHARAT<br />LENS</Link>
        <div className="nav-links-center">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/explore">Destinations</Link>
          <Link href="/planner">AI Planner</Link>
          <Link href="/rewards" style={{ color: '#c9a84c' }}>Rewards</Link>
        </div>
        <div className="nav-controls">
          <AuthControls />
        </div>
      </nav>

      <div style={{ flex: 1, padding: '40px 64px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#fff', marginBottom: 32 }}>Rewards & Progress</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
          {/* Tokens Card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>BharatLens Tokens</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif", marginTop: 8 }}>{tokens}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Redeemable for 15% off virtual AR passes.</div>
          </div>

          {/* Spending Tracker */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Trip Expenditure</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif", marginTop: 8 }}>${spent}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Total spent. Helps AI curate accurate future plans.</div>
          </div>

          {/* Next Goal */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Next Level: Historian</div>
            <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, marginTop: 24, overflow: 'hidden' }}>
              <div style={{ width: '25%', height: '100%', background: '#a78bfa' }} />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 16 }}>3,750 tokens needed to level up.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 2fr) 1fr', gap: 40 }}>
          {/* Badges Section */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#fff', marginBottom: 20 }}>Your Badges</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {badges.map(b => (
                <div key={b.title} style={{ background: b.unlocked ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)', border: b.unlocked ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, opacity: b.unlocked ? 1 : 0.5, filter: b.unlocked ? 'none' : 'grayscale(100%)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: b.unlocked ? '#c9a84c' : '#fff', fontFamily: "'Outfit', sans-serif" }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div style={{ background: '#0a0a0a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#fff', marginBottom: 20 }}>Global Leaderboard</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {leaderboard.map(user => (
                <div key={user.rank} style={{ display: 'flex', alignItems: 'center', gap: 16, background: user.isYou ? 'rgba(201,168,76,0.1)' : 'transparent', padding: '12px', borderRadius: 8, border: user.isYou ? '1px solid rgba(201,168,76,0.3)' : 'none' }}>
                  <div style={{ width: 24, fontSize: 14, fontWeight: 800, color: user.rank <= 3 ? '#c9a84c' : '#888' }}>
                    #{user.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: user.isYou ? 800 : 600, color: user.isYou ? '#c9a84c' : '#e8e4dc' }}>{user.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{user.level}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{user.points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
