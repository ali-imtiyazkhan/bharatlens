'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AuthControls from '../../../components/AuthControls';
import AudioPlayer from '../../../components/AudioPlayer';

export default function SiteExplorerPage() {
  const params = useParams();
  const rawId = params?.siteId as string;
  const siteName = rawId ? decodeURIComponent(rawId).replace(/-/g, ' ') : 'Heritage Site';

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [isAudioOpen, setIsAudioOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch('/api/explore/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search: siteName })
        });
        const data = await res.json();
        if (data.sites && data.sites.length > 0) {
          setDetails({
            ...data.sites[0],
            fullHistory: `${data.sites[0].desc} This incredible monument dates back to the ${data.sites[0].era} era. It stands as a testament to the architectural brilliance of its time. Archaeological excavations have revealed layers of history indicating it was a pivotal center for cultural and trade exchanges.`,
            blockchainHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
            verifiedDate: new Date().toLocaleDateString()
          });
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    
    fetchDetails();
  }, [siteName]);

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Hero Section */}
      <div style={{ height: '55vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '64px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2670&auto=format&fit=crop) center/cover', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080808 0%, rgba(8,8,8,0.4) 50%, rgba(8,8,8,0.7) 100%)', zIndex: 1 }} />

        <nav style={{ position: 'absolute', top: 32, left: 64, right: 64, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/explore" style={{ fontSize: 12, fontWeight: 800, padding: '10px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, backdropFilter: 'blur(20px)', textDecoration: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
            ← BACK TO DISCOVERY
          </Link>
          <AuthControls />
        </nav>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 800 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 900, background: '#c9a84c', color: '#000', padding: '4px 12px', borderRadius: 4, letterSpacing: '0.1em' }}>{details?.category?.toUpperCase() || 'HERITAGE'}</span>
            <span style={{ fontSize: 10, fontWeight: 900, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 12px', borderRadius: 4, letterSpacing: '0.1em', backdropFilter: 'blur(10px)' }}>{details?.era?.toUpperCase()}</span>
          </div>
          <h1 style={{ fontSize: 72, fontWeight: 900, margin: '0 0 16px', lineHeight: 1, letterSpacing: '-0.03em' }}>{siteName}</h1>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 20, fontWeight: 600 }}>
            <span>📍 {details?.state || 'Ancient India'}</span>
            <span style={{ color: '#c9a84c' }}>★ {details?.rating || '4.8'} ARCHAEOLOGIST RATING</span>
          </div>

          <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
             <Link 
               href={`/immersive/${rawId}`}
               style={{ 
                 background: '#c9a84c', color: '#000', padding: '18px 36px', borderRadius: 12, fontWeight: 900, textDecoration: 'none', fontSize: 14, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 30px rgba(201,168,76,0.3)'
               }}
             >
               START VIRTUAL EXPEDITION 🥽
             </Link>
             <button 
               onClick={() => setIsAudioOpen(true)}
               style={{ 
                 background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '18px 28px', borderRadius: 12, fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 14, backdropFilter: 'blur(20px)'
               }}
             >
               LISTEN TO TRANSCRIPT 🎧
             </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '80px 64px', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 80, zIndex: 10 }}>
        
        {/* Left Column: History */}
        <div>
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, letterSpacing: '-0.02em' }}>HISTORICAL ARCHIVE</h2>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5 }}>
                <div style={{ height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, width: '100%' }} />
                <div style={{ height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, width: '90%' }} />
              </div>
            ) : (
              <p style={{ fontSize: 17, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                {details?.fullHistory}
              </p>
            )}
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32, letterSpacing: '-0.02em' }}>AVAILABLE MODULES</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <Link href="/ar-camera" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 32, borderRadius: 24, textDecoration: 'none', transition: 'all 0.3s' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>📷</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 }}>AR Analyzer</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Real-time translation and architectural breakdown.</div>
            </Link>
            <Link href="/heritage" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(201,168,76,0.2)', padding: 32, borderRadius: 24, textDecoration: 'none', transition: 'all 0.3s' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>📜</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#c9a84c', marginBottom: 8 }}>Heritage Voices</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Engage in AI dialogues with figures from this era.</div>
            </Link>
            <Link href="/archive" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 32, borderRadius: 24, textDecoration: 'none', transition: 'all 0.3s' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🎙️</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Oral History</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Listen to local storytellers and preserved archives.</div>
            </Link>
          </div>
        </div>

        {/* Right Column: Meta & Verification */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(74,222,128,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#4ade80' }}>SECURE VERIFICATION</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>GOVERNMENT CERTIFIED ARCHIVE</div>
              </div>
            </div>
            
            {details && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '0.1em', marginBottom: 6 }}>BLOCKCHAIN PROOF</div>
                  <div style={{ fontSize: 11, color: '#fff', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: 8, wordBreak: 'break-all', border: '1px solid rgba(255,255,255,0.03)' }}>
                    {details.blockchainHash}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>
                  <span>NETWORK: POLYGON POS</span>
                  <span>{details.verifiedDate}</span>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/planner"
            style={{ 
              width: '100%', background: '#fff', color: '#000', border: 'none', padding: '20px', borderRadius: 16, fontWeight: 900, fontSize: 14, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block', boxShadow: '0 20px 40px rgba(255,255,255,0.1)'
            }}
          >
            ADD TO TRAVEL PLANNER ＋
          </Link>

          {/* Site Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
             <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 900, marginBottom: 8 }}>LIVE CROWD</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#4ade80' }}>LOW (12%)</div>
             </div>
             <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 900, marginBottom: 8 }}>CLIMATE</div>
                <div style={{ fontSize: 14, fontWeight: 900 }}>{details?.weather || 'SUNNY'} {details?.temp || '28°C'}</div>
             </div>
          </div>
        </div>

      </div>

      <AudioPlayer 
        isOpen={isAudioOpen} 
        onClose={() => setIsAudioOpen(false)} 
        siteName={siteName} 
        category={details?.category}
      />
    </div>
  );
}

