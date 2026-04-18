'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import MapComponent from '../../components/MapComponent';
import DynastyTimeline from '../../components/DynastyTimeline';

/* ── Data ── */
const CATEGORIES = ['All', 'Monuments', 'Forts', 'UNESCO', 'Temples', 'Caves', 'Palaces', 'Stepwells'];
const STATES = ['All States', 'Rajasthan', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Madhya Pradesh', 'Uttar Pradesh', 'Kerala'];
const ERAS = ['All Eras', 'Ancient (Pre-600)', 'Medieval (600-1500)', 'Mughal (1526-1857)', 'Colonial (1858-1947)', 'Modern'];
const SORT_OPTIONS = ['Relevance', 'Rating', 'Distance', 'Era'];

interface Site {
  id: number;
  name: string;
  state: string;
  category: string;
  era: string;
  rating: number;
  crowd: 'Low' | 'Moderate' | 'High';
  hasAR: boolean;
  has3D: boolean;
  offline: boolean;
  unesco: boolean;
  lat: number;
  lng: number;
  image: string;
  desc: string;
  weather: string;
  temp: string;
  panoramaUrl?: string; // Added for immersive compatibility
}


const crowdColor = (c: string) => c === 'Low' ? '#4ade80' : c === 'Moderate' ? '#facc15' : '#f87171';
const catColor = (c: string) => {
  const map: Record<string,string> = { Monuments: '#c9a84c', Forts: '#4ecdc4', Temples: '#a78bfa', Caves: '#f97316', Palaces: '#ec4899', UNESCO: '#3b82f6', Stepwells: '#06b6d4' };
  return map[c] || '#c9a84c';
};

/* ── Dynamic image from Wikipedia ── */
const SiteImage = ({ name, style, children }: { name: string; style: React.CSSProperties; children?: React.ReactNode }) => {
  const [img, setImg] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const q = name.split(',')[0].trim();
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(q)}&prop=pageimages&format=json&pithumbsize=800&origin=*`);
        const data = await res.json();
        const pages = data.query.pages;
        const page = Object.values(pages)[0] as any;
        if (active && page?.thumbnail) setImg(page.thumbnail.source);
      } catch {}
    })();
    return () => { active = false; };
  }, [name]);
  return (
    <div style={{ ...style, background: img ? `url(${img}) center/cover` : 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(78,205,196,0.1))', position: 'relative' }}>
      {!img && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, opacity: 0.3 }}>🏛️</div>}
      {children}
    </div>
  );
};

export default function ExplorePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [stateFilter, setStateFilter] = useState('All States');
  const [eraFilter, setEraFilter] = useState('All Eras');
  const [sortBy, setSortBy] = useState('Relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = async (useFilters = false) => {
    setLoading(true);
    try {
      const body = useFilters 
        ? { search, category: activeCat, state: stateFilter, era: eraFilter }
        : {};
        
      const res = await fetch('/api/explore/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.sites) {
        setSites(data.sites);
        setSelectedSite(null);
      }
    } catch (err) {
      console.error("Failed to fetch sites from AI", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const filtered = useMemo(() => {
    let list = [...sites];
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.state.toLowerCase().includes(search.toLowerCase()));
    if (activeCat !== 'All') list = list.filter(s => s.category === activeCat || (activeCat === 'UNESCO' && s.unesco));
    if (stateFilter !== 'All States') list = list.filter(s => s.state === stateFilter);
    if (eraFilter !== 'All Eras') list = list.filter(s => s.era === eraFilter);
    if (sortBy === 'Rating') list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'Era') list.sort((a, b) => a.era.localeCompare(b.era));
    return list;
  }, [sites, search, activeCat, stateFilter, eraFilter, sortBy]);

  return (
    <div className="page" style={{ background: 'transparent' }}>
      <Navbar />

      {/* ── Zone 1: Search & Category Chips ── */}
      <div style={{ padding: '48px 48px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search monuments, forts, temples, cities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 20px 14px 44px', background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#e8e4dc',
                fontSize: 13, fontFamily: "'Montserrat', sans-serif", fontWeight: 500, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#c9a84c'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔍</span>
            <button 
              onClick={() => fetchSites(true)}
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'linear-gradient(135deg, #c9a84c 0%, #a88b39 100%)', border: 'none',
                padding: '8px 16px', borderRadius: 6, color: '#000', fontSize: 11, fontWeight: 800,
                cursor: 'pointer', fontFamily: "'Outfit', sans-serif"
              }}
            >
              {loading ? 'WAIT...' : 'ASK AI ✨'}
            </button>
          </div>
        </div>
      </div>

      <DynastyTimeline activeEra={eraFilter} onSelectEra={setEraFilter} />

      {/* ── Main Layout: Sidebar + Content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1, position: 'relative', zIndex: 5 }}>

        {/* ── Zone 2: Sidebar Filters ── */}
        <aside style={{ padding: '28px 48px', borderRight: '0.5px solid rgba(255,255,255,0.08)', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>State</label>
            <select
              value={stateFilter} onChange={e => setStateFilter(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 4, color: '#e8e4dc', fontSize: 12, fontFamily: "'Montserrat', sans-serif", outline: 'none' }}
            >
              {STATES.map(s => <option key={s} value={s} style={{ background: '#0a0a0a' }}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>Historical Era</label>
            <select
              value={eraFilter} onChange={e => setEraFilter(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 4, color: '#e8e4dc', fontSize: 12, fontFamily: "'Montserrat', sans-serif", outline: 'none' }}
            >
              {ERAS.map(e => <option key={e} value={e} style={{ background: '#0a0a0a' }}>{e}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>Features</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['AR Available', '3D Tours', 'Offline Ready', 'UNESCO Site'].map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#c9a84c' }} />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px 0', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, display: 'block', marginBottom: 12 }}>Quick Stats</label>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 2.2 }}>
              <div><span style={{ color: '#c9a84c', fontWeight: 700 }}>{filtered.length}</span> sites found</div>
              <div><span style={{ color: '#4ade80', fontWeight: 700 }}>{filtered.filter(s => s.crowd === 'Low').length}</span> low crowd</div>
              <div><span style={{ color: '#3b82f6', fontWeight: 700 }}>{filtered.filter(s => s.unesco).length}</span> UNESCO sites</div>
            </div>
          </div>
        </aside>

        {/* ── Right Content ── */}
        <div style={{ padding: '28px 48px', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>

          {/* ── Zone 3: Interactive Map ── */}
          <div style={{
            width: '100%', height: 400, borderRadius: 12, marginBottom: 32,
            border: '0.5px solid rgba(201,168,76,0.2)', position: 'relative', overflow: 'hidden',
          }}>
            <MapComponent 
              sites={filtered} 
              onSelectSite={setSelectedSite} 
              selectedSite={selectedSite} 
            />

            <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 9, color: 'rgba(201,168,76,0.5)', fontWeight: 700, letterSpacing: '0.1em', fontFamily: "'Montserrat', sans-serif", pointerEvents: 'none' }}>
              HERITAGE MAP · 3D PERSPECTIVE
            </div>
          </div>

          {/* ── Zone 5: Sort & View Controls ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt} onClick={() => setSortBy(opt)}
                  style={{
                    padding: '6px 14px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                    fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.06em', cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: sortBy === opt ? '0.5px solid #c9a84c' : '0.5px solid rgba(255,255,255,0.08)',
                    background: sortBy === opt ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: sortBy === opt ? '#c9a84c' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['grid', 'list'] as const).map(mode => (
                <button
                  key={mode} onClick={() => setViewMode(mode)}
                  style={{
                    padding: '6px 10px', borderRadius: 4, fontSize: 14, cursor: 'pointer',
                    border: '0.5px solid rgba(255,255,255,0.08)', transition: 'all 0.2s',
                    background: viewMode === mode ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: viewMode === mode ? '#c9a84c' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {mode === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          </div>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 40px' }}>
              <div style={{ fontSize: 32, marginBottom: 16, animation: 'ci-spin 2s linear infinite' }}>🌍</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>AI is curating sites...</div>
            </div>
          )}

          {/* ── Zone 4: Site Cards Grid ── */}
          {!loading && <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
            gap: viewMode === 'grid' ? 20 : 12,
          }}>
            {filtered.map(site => (
              <div
                key={site.id}
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer',
                  display: viewMode === 'list' ? 'flex' : 'block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.3)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
                onClick={() => setSelectedSite(site)}
              >
                {/* Image */}
                <SiteImage name={site.name} style={{
                  width: viewMode === 'list' ? 200 : '100%', height: viewMode === 'list' ? '100%' : 180,
                  minHeight: viewMode === 'list' ? 140 : undefined,
                  flexShrink: 0,
                }}>
                  {/* Crowd badge */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10, fontSize: 8, fontWeight: 800,
                    padding: '3px 10px', borderRadius: 12, zIndex: 2,
                    background: `${crowdColor(site.crowd)}18`, color: crowdColor(site.crowd),
                    backdropFilter: 'blur(8px)', border: `0.5px solid ${crowdColor(site.crowd)}30`,
                    fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.06em',
                  }}>
                    {site.crowd === 'Low' ? '🟢' : site.crowd === 'Moderate' ? '🟡' : '🔴'} {site.crowd}
                  </div>
                  {/* Tags */}
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4 }}>
                    {site.hasAR && <span style={{ fontSize: 7, padding: '3px 8px', borderRadius: 10, background: 'rgba(0,0,0,0.7)', color: '#c9a84c', fontWeight: 800, backdropFilter: 'blur(8px)' }}>AR</span>}
                    {site.has3D && <span style={{ fontSize: 7, padding: '3px 8px', borderRadius: 10, background: 'rgba(0,0,0,0.7)', color: '#4ecdc4', fontWeight: 800, backdropFilter: 'blur(8px)' }}>3D</span>}
                    {site.unesco && <span style={{ fontSize: 7, padding: '3px 8px', borderRadius: 10, background: 'rgba(0,0,0,0.7)', color: '#3b82f6', fontWeight: 800, backdropFilter: 'blur(8px)' }}>UNESCO</span>}
                  </div>
                </SiteImage>
                {/* Info */}
                <div style={{ padding: 18, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#e8e4dc', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em' }}>{site.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontWeight: 600 }}>{site.state} · {site.era.split(' ')[0]}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>★ {site.rating}</div>
                  </div>
                  <p style={{ fontSize: 11, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', marginBottom: 14, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{site.desc}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/immersive/${site.id || site.name.toLowerCase().replace(/\s+/g, '-')}`);
                      }}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 4, fontSize: 9, fontWeight: 800,
                        fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em',
                        background: 'rgba(201,168,76,0.12)', border: '0.5px solid rgba(201,168,76,0.3)',
                        color: '#c9a84c', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      AR VIEW
                    </button>
                    <Link href={`/planner?destination=${encodeURIComponent(site.name)}`} style={{
                      flex: 1, padding: '8px 0', borderRadius: 4, fontSize: 9, fontWeight: 800,
                      fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', textAlign: 'center',
                      background: '#c9a84c', border: 'none', color: '#0a0a0a', cursor: 'pointer',
                      transition: 'all 0.2s', textDecoration: 'none', display: 'block',
                    }}>
                      EXPLORE →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 40px' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🏛️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#e8e4dc', fontFamily: "'Outfit', sans-serif" }}>No sites found</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Try adjusting your filters or search terms.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}