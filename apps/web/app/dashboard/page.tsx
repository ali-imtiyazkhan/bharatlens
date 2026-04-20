'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, TrendingUp, Map, Camera, Globe, 
  MessageSquare, Users, Award, Compass, 
  Plus, ArrowRight, Settings, LogOut, Search
} from 'lucide-react';
import AuthControls from '../../components/AuthControls';
import Navbar from '../../components/Navbar';
import { API_BASE } from '../../lib/api-config';

// --- Sub-components ---

const BentoCard = ({ children, title, icon: Icon, className = "", style = {} }: any) => (
  <motion.div
    whileHover={{ y: -4 }}
    style={{
      background: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 32,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      ...style
    }}
    className={className}
  >
    {title && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color="#c9a84c" />
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{title}</span>
      </div>
    )}
    {children}
  </motion.div>
);

const StatMini = ({ label, value, color }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>{label}</span>
    <span style={{ fontSize: 18, fontWeight: 900, color: color || '#fff' }}>{value}</span>
  </div>
);

export default function DashboardPage() {
  const [savings, setSavings] = useState(300);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [monthlyPlan, setMonthlyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const FALLBACK_PLAN = {
    title: "The Hampi Golden Circuit",
    destination: "Hampi, Karnataka",
    budgetUsed: "$280",
    reasoning: "Your passion for Architecture perfectly matches the stone-carved ruins of Hampi. At your current savings level, this 3-day journey offers an incredible immersion into the Vijayanagar Empire's legacy.",
    topAttractions: ["Virupaksha Temple", "Stone Chariot", "Vittala Temple Complex", "Hemakuta Hill"]
  };

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
          }).catch(() => null) // Handle network failure
        ]);

        const profileData = await profileRes.json();
        const statsData = await statsRes.json();
        
        let planData = null;
        if (planRes && planRes.ok) {
           const d = await planRes.json();
           planData = d.monthlyPlan;
        }

        setProfile(profileData);
        setStats(statsData);
        setMonthlyPlan(planData || FALLBACK_PLAN);
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
        setMonthlyPlan(FALLBACK_PLAN);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [savings]);

  if (loading || !profile) {
    return (
      <div style={{ height: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        <div style={{ width: 40, height: 40, border: '2px solid rgba(201,168,76,0.1)', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ fontSize: 10, fontWeight: 900, color: '#c9a84c', letterSpacing: '0.3em' }}>SYNCHRONIZING WITH BHARATLENS NEURAL CLOUD</div>
        <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 24px 60px' }}>
        
        {/* --- Dashboard Top Header --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#c9a84c', letterSpacing: '0.2em', marginBottom: 8 }}>WELCOME BACK, EXPLORER</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
                {profile.displayName || profile.name}
              </h1>
            </motion.div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ padding: '12px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>PROJECT STATUS</button>
            <Link href="/advanced-planner" style={{ padding: '12px 24px', borderRadius: 16, background: '#c9a84c', color: '#000', textDecoration: 'none', fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              NEURAL AI ✦
            </Link>
          </div>
        </div>

        {/* --- Bento Grid Layout --- */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gridAutoRows: 'minmax(180px, auto)',
          gap: 24 
        }}>
          
          {/* 1. Hero / Main Info Card (Large) */}
          <BentoCard 
            style={{ gridColumn: 'span 8', gridRow: 'span 2', background: 'linear-gradient(225deg, rgba(201,168,76,0.15) 0%, rgba(0,0,0,0) 100%)' }}
            title="Next Exploration"
            icon={Map}
          >
            <div style={{ display: 'flex', gap: 40, height: '100%', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                {monthlyPlan ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.1, marginBottom: 12 }}>{monthlyPlan.title}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>{monthlyPlan.reasoning}</p>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <StatMini label="DESTINATION" value={monthlyPlan.destination} color="#c9a84c" />
                      <StatMini label="BUDGET" value={monthlyPlan.budgetUsed} color="#4ade80" />
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ opacity: 0.3 }}>Synthesizing monthly recommendations...</div>
                )}
              </div>
              <div style={{ width: 280, height: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop) center/cover' }} />
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000, transparent)' }} />
                 <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                    <button style={{ width: '100%', background: '#fff', color: '#000', border: 'none', padding: '12px', borderRadius: 12, fontWeight: 900, fontSize: 11, cursor: 'pointer' }}>BUILD ITINERARY</button>
                 </div>
              </div>
            </div>
          </BentoCard>

          {/* 2. Level & Tokens (Tall) */}
          <BentoCard style={{ gridColumn: 'span 4', gridRow: 'span 2' }} title="Recognition" icon={Award}>
             <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 24px' }}>
                   <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle cx="70" cy="70" r="60" fill="none" stroke="#c9a84c" strokeWidth="8" strokeDasharray="376" strokeDashoffset={376 - (376 * 0.65)} strokeLinecap="round" />
                   </svg>
                   <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{stats?.level || '1'}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>CURRENT LEVEL</span>
                   </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                   <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#c9a84c' }}>{stats?.tokens || 0}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>TOKENS</div>
                   </div>
                   <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{profile.totalVisits || 0}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>VISITS</div>
                   </div>
                </div>
             </div>
          </BentoCard>

          {/* 3. Quick Actions Tiles */}
          {[
            { name: 'AR Camera', icon: Camera, color: '#4ecdc4', path: '/ar-camera' },
            { name: 'Voice Translator', icon: Globe, color: '#a78bfa', path: '/translator' },
            { name: 'Communities', icon: Users, color: '#fca5a5', path: '/discover' },
            { name: 'AI Planner', icon: Compass, color: '#fbbf24', path: '/planner' }
          ].map((action, i) => (
            <BentoCard key={i} style={{ gridColumn: 'span 3' }}>
               <Link href={action.path} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <action.icon size={24} color={action.color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{action.name}</span>
               </Link>
            </BentoCard>
          ))}

          {/* 4. Travel Savings & Interests (Medium) */}
          <BentoCard style={{ gridColumn: 'span 6' }} title="Travel Wallet" icon={TrendingUp}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <div style={{ fontSize: 48, fontWeight: 900, color: '#4ade80' }}>${savings}</div>
                   <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 4 }}>TOTAL MONTHLY SAVINGS</div>
                </div>
                <button onClick={() => setSavings(s => s + 50)} style={{ width: 56, height: 56, borderRadius: '50%', background: '#c9a84c', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                   <Plus size={24} />
                </button>
             </div>
          </BentoCard>

          <BentoCard style={{ gridColumn: 'span 6' }} title="Current Interests" icon={Sparkles}>
             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(profile.interests || ['History', 'Art', 'Architecture', 'Culture']).map((interest: string, i: number) => (
                  <div key={i} style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                    {interest}
                  </div>
                ))}
                <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(201,168,76,0.1)', border: '1px dashed #c9a84c', cursor: 'pointer' }}>
                   <Settings size={16} color="#c9a84c" />
                </div>
             </div>
          </BentoCard>

        </div>
      </main>

      {/* --- Global Styles --- */}
      <style jsx global>{`
        body { background: #050505; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}