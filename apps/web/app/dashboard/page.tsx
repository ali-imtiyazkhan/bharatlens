'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthControls from '../../components/AuthControls';
import { API_BASE } from '../../lib/api-config';

export default function DashboardPage() {
  const [savings, setSavings] = useState(300);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [monthlyPlan, setMonthlyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        window.location.href = '/login';
        return;
      }

      try {
        const u = JSON.parse(savedUser);
        const [profileRes, statsRes, planRes] = await Promise.all([
          fetch(`${API_BASE}/api/profile/${u.username}`),
          fetch(`${API_BASE}/api/rewards/stats/${u.username}`),
          fetch(`${API_BASE}/api/planner/monthly-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savings, interests: u.interests || ['Forts', 'Monuments'], language: u.language || 'English' })
          })
        ]);

        const profileData = await profileRes.json();
        const statsData = await statsRes.json();
        const planData = await planRes.json();

        setProfile(profileData);
        setStats(statsData);
        setMonthlyPlan(planData.monthlyPlan);
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [savings]);

  if (loading || !profile) {
    return (
      <div className="page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#c9a84c', letterSpacing: '0.2em' }}>SYNCHRONIZING PROFILE...</div>
      </div>
    );
  }

  return (
    <div className="page" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar" style={{ flexShrink: 0 }}>
        <Link href="/" className="nav-brand">BHARAT<br />LENS</Link>
        <div className="nav-links-center">
          <Link href="/dashboard" style={{ color: '#c9a84c' }}>Dashboard</Link>
          <Link href="/">Home</Link>
          <Link href="/planner">AI Planner</Link>
          <Link href="/rewards">Rewards</Link>
        </div>
        <div className="nav-controls">
          <AuthControls />
        </div>
      </nav>

      <div style={{ flex: 1, padding: '32px 64px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '40px' }}>

          {/* ── Left Column: Profile & AI Plan ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* User Profile Summary */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #c9a84c' }} alt="P" />
                ) : (
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #c9a84c 0%, #a88b39 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#000' }}>
                    {profile.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#e8e4dc' }}>{profile.displayName || profile.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'Montserrat', sans-serif" }}>Level {stats?.level || '1'} • {stats?.tokens || 0} Tokens</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                {(profile.interests || ['History', 'Culture']).map((i: string) => (
                  <span key={i} style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', borderRadius: 12, fontFamily: "'Outfit', sans-serif" }}>{i}</span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: 12, border: '0.5px solid rgba(201,168,76,0.2)' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Month's Travel Savings</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#4ade80', fontFamily: "'Outfit', sans-serif" }}>${savings}</div>
                </div>
                <button onClick={() => setSavings(s => s + 50)} style={{ background: '#222', border: 'none', color: '#c9a84c', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>+</button>
              </div>
            </div>

            {/* AI Monthly Trip Plan */}
            <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.02) 100%)', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>✨ AI MONTHLY PLAN</span>
              </div>

              {monthlyPlan ? (
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif", margin: '0 0 8px 0', lineHeight: 1.2 }}>{monthlyPlan.title}</h3>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>📍 {monthlyPlan.destination} — Estimated Cost: <span style={{ color: '#4ade80', fontWeight: 700 }}>{monthlyPlan.budgetUsed}</span></div>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>{monthlyPlan.reasoning}</p>

                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Highlights:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(monthlyPlan.topAttractions || []).map((att: string, i: number) => (
                      <div key={i} style={{ fontSize: 11, background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 6, color: 'rgba(255,255,255,0.8)' }}>• {att}</div>
                    ))}
                  </div>

                  <button style={{ width: '100%', background: '#c9a84c', color: '#000', border: 'none', padding: '12px', borderRadius: 8, fontWeight: 800, marginTop: 24, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                    Build Full Itinerary
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Analyzing your savings for matching trips...</div>
              )}
            </div>

          </div>

          {/* ── Right Column: Map & Features ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Quick Access Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { title: 'AR Camera', icon: '📷', link: '/ar-camera', color: '#4ecdc4', desc: 'Point & translate' },
                { title: 'Voice Translator', icon: '🗣️', link: '/translator', color: '#a78bfa', desc: 'Real-time speech' },
                { title: 'Smart Nav', icon: '🧭', link: '/navigation', color: '#f97316', desc: 'Audio-guided paths' },
                { title: 'Virtual Tours', icon: '🥽', link: '/virtual-tours', color: '#3b82f6', desc: 'Explore in 3D' }
              ].map(feat => (
                <Link key={feat.title} href={feat.link} style={{ display: 'block', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 16px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = feat.color} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{feat.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#e8e4dc', fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>{feat.title}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{feat.desc}</div>
                </Link>
              ))}
            </div>

            {/* Smart Map Dashboard Widget */}
            <div style={{ flex: 1, background: '#0a0a0a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, position: 'relative', overflow: 'hidden', minHeight: 300 }}>
              <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>Visited Heritage Map</h3>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{profile.totalVisits || 0} Sites Explored</div>
              </div>

              {/* Map background placeholder grid */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
                <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              <div style={{ position: 'absolute', top: '15%', left: '25%', width: '50%', height: '70%', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '30% 40% 50% 20%', opacity: 0.4 }} />

              {/* Mock Pins */}
              <div style={{ position: 'absolute', top: '40%', left: '40%', width: 12, height: 12, background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }} />
              <div style={{ position: 'absolute', top: '30%', left: '45%', width: 12, height: 12, background: '#c9a84c', borderRadius: '50%', boxShadow: '0 0 10px #c9a84c' }} />
              <div style={{ position: 'absolute', top: '60%', left: '35%', width: 12, height: 12, background: '#c9a84c', borderRadius: '50%', boxShadow: '0 0 10px #c9a84c' }} />

              {/* Weather & Crowd Overlay */}
              <div style={{ position: 'absolute', bottom: 20, right: 24, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: '12px 16px', borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Nearby Spots</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>2 km radius</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Weather Alert</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>☀️ Clear, 32°C</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}