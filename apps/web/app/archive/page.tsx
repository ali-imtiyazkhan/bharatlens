'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import CustomDropdown from '../../components/CustomDropdown';
import { API_BASE } from '../../lib/api-config';
import AudioPlayer from '../../components/AudioPlayer';

export default function HeritageArchive() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    async function fetchSites() {
      try {
        const res = await fetch(`${API_BASE}/api/heritage/all`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setSites(data);
          setError(null);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Unexpected data format from server');
        }
      } catch (e) {
        console.error('Failed to fetch archive:', e);
        setError('Connection failed. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = ['All', ...new Set(sites.map(s => s.category).filter(Boolean))];
  const dropdownOptions = categories.map(cat => ({
    value: cat,
    label: cat === 'All' ? 'All Sites' : cat
  }));

  const filteredSites = filter === 'All' ? sites : sites.filter(s => s.category === filter);

  if (error) {
    return (
      <div className="page" style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center' }}>
        <div>
          <h2 style={{ color: '#ef4444', marginBottom: 16 }}>Archive Unavailable</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Retry Access</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#c9a84c', letterSpacing: '0.2em' }}>ACCESSING ARCHIVES...</div>
      </div>
    );
  }

  return (
    <div className="page" style={{ minHeight: '100vh', background: '#050505' }}>
      <Navbar />
      
      <main style={{ padding: 'clamp(24px, 5vw, 64px)', maxWidth: 1400, margin: '0 auto' }}>
        <header style={{ marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Digital Preservation</span>
            <h1 style={{ fontSize: 'clamp(32px, 8vw, 64px)', fontWeight: 900, marginTop: 16, marginBottom: 24, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Heritage <span style={{ color: '#c9a84c' }}>Archive</span></h1>
            <p style={{ fontSize: 'clamp(14px, 4vw, 18px)', color: 'rgba(255,255,255,0.5)', maxWidth: 600, lineHeight: 1.6 }}>
              A blockchain-verified digital library of India's cultural assets. Explore 3D models, historical maps, and high-fidelity captures of our shared history.
            </p>
          </motion.div>

          {isMobile ? (
            <div style={{ marginTop: 32, maxWidth: 400 }}>
              <CustomDropdown 
                options={dropdownOptions}
                value={filter}
                onChange={setFilter}
                label="Filter by Category"
                fullWidth
              />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, marginTop: 48, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  style={{ 
                    padding: '10px 24px', borderRadius: 30, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    background: filter === cat ? '#c9a84c' : 'rgba(255,255,255,0.03)',
                    color: filter === cat ? '#000' : 'rgba(255,255,255,0.6)',
                    border: '1px solid ' + (filter === cat ? '#c9a84c' : 'rgba(255,255,255,0.08)'),
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </header>

        {filteredSites.length === 0 ? (
          <div style={{ padding: '100px 0', textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.3 }}>🏛️</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'rgba(255,255,255,0.2)' }}>No sites discovered in this category</h3>
            <button onClick={() => setFilter('All')} style={{ background: 'none', border: 'none', color: '#c9a84c', marginTop: 12, fontWeight: 800, cursor: 'pointer' }}>View all entries</button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 45vw, 400px), 1fr))', 
            gap: '24px' 
          }}>
            {filteredSites.map((site, idx) => (
              <motion.div 
                key={site.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedSite(site)}
                style={{ 
                  position: 'relative', borderRadius: 20, 
                  overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)',
                  background: '#111'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src={site.images?.[0] || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1200'} 
                  style={{ width: '100%', display: 'block', height: '240px', objectFit: 'cover' }}
                  alt={site.name}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', marginBottom: 4 }}>{site.category}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{site.name}</h3>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{site.state}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedSite && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.95)', 
              backdropFilter: 'blur(20px)', padding: 'clamp(16px, 4vw, 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
            onClick={() => setSelectedSite(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ 
                maxWidth: 1000, width: '100%', display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                background: '#111', borderRadius: 32, overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.1)',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ position: 'relative', height: 'clamp(300px, 50vh, 600px)' }}>
                <img src={selectedSite.images?.[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="S" />
                <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)' }} />
              </div>
              
              <div style={{ padding: 'clamp(24px, 5vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#c9a84c', background: 'rgba(201,168,76,0.1)', padding: '6px 16px', borderRadius: 20 }}>{selectedSite.category}</span>
                  {selectedSite.isVerified && <span style={{ fontSize: 10, fontWeight: 800, color: '#4ade80' }}>✓ VERIFIED ASSET</span>}
                </div>
                
                <h2 style={{ fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 900, marginBottom: 16 }}>{selectedSite.name}</h2>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>📍 {selectedSite.location}</div>
                
                <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: 40 }}>
                  {selectedSite.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                  <button style={{ padding: '16px', borderRadius: 12, background: '#c9a84c', color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>View 3D Model</button>
                  <button 
                    onClick={() => setIsAudioOpen(true)}
                    style={{ padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, cursor: 'pointer', fontSize: 13 }}
                  >
                    🔊 Narration
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setSelectedSite(null)}
                style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AudioPlayer 
        isOpen={isAudioOpen}
        onClose={() => setIsAudioOpen(false)}
        siteName={selectedSite?.name || 'Heritage Site'}
        category={selectedSite?.category}
      />
    </div>
  );
}
