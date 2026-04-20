"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Cloud, Users, Brain, History, Layout, 
  ChevronRight, MapPin, Compass, ShieldCheck, Info,
  ArrowLeft, Terminal, Globe
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { API_BASE } from "../../lib/api-config";

// --- Types ---
interface RealTimeContext {
  weather: string;
  temperature: string;
  crowdDensity: 'Low' | 'Moderate' | 'High';
  specialEvent?: string;
}

interface UserProfile {
  preferredCategories: string[];
  totalVisits: number;
  expertiseLevel: string;
  lastVisitedSite?: string;
}

interface PlannerEvent {
  time: string;
  location: string;
  description: string;
  isHiddenGem: boolean;
  crowdWaitTime?: string;
}

interface PlannerDay {
  day: number;
  title: string;
  events: PlannerEvent[];
}

interface EnhancedPlan {
  smartReasoning: string;
  days: PlannerDay[];
}

// --- Sub-components ---

const NeuralStatus = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(201,168,76,0.05)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(201,168,76,0.2)', fontSize: 10, fontWeight: 900, color: '#c9a84c', letterSpacing: '0.1em' }}>
    <motion.div 
      animate={{ opacity: [0.3, 1, 0.3] }} 
      transition={{ repeat: Infinity, duration: 1.5 }}
      style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }} 
    />
    {text.toUpperCase()}
  </div>
);

const DataCard = ({ icon: Icon, label, value, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ 
      flex: 1, minWidth: 200, padding: 24, borderRadius: 24, 
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden'
    }}
  >
    <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
      <Icon size={100} color={color} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={color} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{label}</span>
    </div>
    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{value}</div>
  </motion.div>
);

export default function AdvancedPlannerPage() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("Mid-range");
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<string[]>(["History", "Architecture"]);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnhancedPlan | null>(null);
  const [context, setContext] = useState<RealTimeContext | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  const handleGenerate = async () => {
    if (!destination) return;
    setLoading(true);
    setResult(null);

    const savedUser = localStorage.getItem('user');
    let userId = 'cloym1u4g0000r9v0v0v0v0v0'; // Fallback for demo
    if (savedUser) {
      try { userId = JSON.parse(savedUser).id; } catch (e) {}
    }

    try {
      const res = await fetch(`${API_BASE}/api/enhanced-planner/personalized-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, destination, days, budget, interests })
      });
      const data = await res.json();
      
      // The API returns { plan: string_of_json, meta: { analyzedContext, userProfile } }
      // We need to parse plan if it's a string
      const parsedPlan = typeof data.plan === 'string' ? JSON.parse(data.plan) : data.plan;
      
      setResult(parsedPlan);
      setContext(data.meta.analyzedContext);
      setProfile(data.meta.userProfile);
      setActiveDay(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 24px 60px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <NeuralStatus text="HACK-TO-03 Advanced Intelligence" />
            <NeuralStatus text="Data-Driven Planning" />
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 24 }}>
            The AI <span style={{ color: '#c9a84c' }}>Neural</span> Planner.
          </h1>
          <p style={{ maxWidth: 600, margin: '0 auto', color: 'rgba(255,255,255,0.5)', fontSize: 18, lineHeight: 1.6 }}>
            BharatLens Pro analyzes real-time weather, crowd levels, and your personal history 
            to create the perfect balanced itinerary.
          </p>
        </div>

        {/* Input Panel */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: 32, padding: 32, marginBottom: 60, backdropFilter: 'blur(10px)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#c9a84c', marginBottom: 12, letterSpacing: '0.1em' }}>DESTINATION</label>
            <input 
              value={destination} onChange={e => setDestination(e.target.value)}
              placeholder="Where to?" 
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 20px', color: '#fff', fontSize: 16, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', marginBottom: 12, letterSpacing: '0.1em' }}>DAYS</label>
              <input type="number" value={days} onChange={e => setDays(Number(e.target.value))} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 20px', color: '#fff', fontSize: 16, outline: 'none' }} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', marginBottom: 12, letterSpacing: '0.1em' }}>BUDGET</label>
              <select value={budget} onChange={e => setBudget(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 20px', color: '#fff', fontSize: 16, outline: 'none' }}>
                <option>Budget</option>
                <option>Mid-range</option>
                <option>Luxury</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleGenerate} disabled={loading}
            style={{ 
              background: '#c9a84c', color: '#000', border: 'none', borderRadius: 16, padding: '16px 32px', 
              fontSize: 14, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'transform 0.2s', boxShadow: '0 10px 30px rgba(201,168,76,0.3)'
            }}
          >
            {loading ? <span className="spinner" /> : <><Brain size={18} /> GENERATE NEURAL PLAN</>}
          </button>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              
              {/* Context Dashboard */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
                {context && (
                  <>
                    <DataCard icon={Cloud} label="REAL-TIME WEATHER" value={`${context.weather} · ${context.temperature}`} color="#60a5fa" />
                    <DataCard icon={Users} label="CROWD DENSITY" value={context.crowdDensity} color={context.crowdDensity === 'High' ? '#ef4444' : '#4ade80'} />
                  </>
                )}
                {profile && (
                  <DataCard icon={History} label="BEHAVIORAL MATCH" value={profile.expertiseLevel} color="#c9a84c" />
                )}
              </div>

              {/* Smart Reasoning Section */}
              <div style={{ 
                background: 'linear-gradient(90deg, rgba(201,168,76,0.1), transparent)', 
                borderLeft: '4px solid #c9a84c', borderRadius: '0 24px 24px 0', padding: 32, marginBottom: 40 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#c9a84c' }}>
                  <Sparkles size={20} />
                  <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.1em' }}>AI SMART REASONING</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.5, color: '#e8e4dc' }}>
                  {result.smartReasoning}
                </p>
              </div>

              {/* Main Itinerary Split */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
                
                {/* Left: Days Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {result.days.map((day, i) => (
                    <button 
                      key={day.day}
                      onClick={() => setActiveDay(i)}
                      style={{ 
                        textAlign: 'left', padding: 24, borderRadius: 24, border: '1px solid',
                        borderColor: activeDay === i ? '#c9a84c' : 'rgba(255,255,255,0.05)',
                        background: activeDay === i ? 'rgba(201,168,76,0.05)' : 'transparent',
                        color: activeDay === i ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer', transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', marginBottom: 4 }}>DAY {day.day}</div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{day.title}</div>
                    </button>
                  ))}
                </div>

                {/* Right: Timeline */}
                <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', padding: 40 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 40, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 8, top: 10, bottom: 10, width: 2, background: 'rgba(255,255,255,0.05)' }} />
                    
                    {result.days[activeDay].events.map((event, j) => (
                      <div key={j} style={{ position: 'relative', paddingLeft: 40 }}>
                        <div style={{ 
                          position: 'absolute', left: 4, top: 6, width: 10, height: 10, borderRadius: '50%', 
                          background: event.isHiddenGem ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                          boxShadow: event.isHiddenGem ? '0 0 15px #c9a84c' : 'none'
                        }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 900, color: '#c9a84c' }}>{event.time}</span>
                          {event.isHiddenGem && (
                            <span style={{ fontSize: 9, fontWeight: 900, background: 'rgba(201,168,76,0.1)', color: '#c9a84c', padding: '4px 8px', borderRadius: 4, letterSpacing: '0.1em' }}>HIDDEN GEM</span>
                          )}
                        </div>
                        
                        <h4 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{event.location}</h4>
                        <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 16 }}>{event.description}</p>
                        
                        {(event.crowdWaitTime || event.isHiddenGem) && (
                          <div style={{ display: 'flex', gap: 12 }}>
                            {event.crowdWaitTime && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: 12 }}>
                                <Users size={12} /> {event.crowdWaitTime} wait
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!result && !loading && (
          <div style={{ height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
            <Compass size={60} strokeWidth={1} style={{ marginBottom: 24 }} />
            <p style={{ fontWeight: 700, letterSpacing: '0.1em' }}>WAITING FOR NEURAL INPUT</p>
          </div>
        )}

      </main>

      <style jsx>{`
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0,0,0,0.1);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
