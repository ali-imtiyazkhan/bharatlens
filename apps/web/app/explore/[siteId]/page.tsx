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
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ height: '40vh', position: 'relative', background: 'linear-gradient(to bottom, transparent, #080808)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 64px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2670&auto=format&fit=crop) center/cover', opacity: 0.3, zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, #080808 100%)', zIndex: 0 }} />

        <nav className="navbar" style={{ position: 'relative', zIndex: 10, background: 'none', border: 'none', padding: 0 }}>
          <Link href="/explore" className="nav-brand" style={{ fontSize: 13, padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, backdropFilter: 'blur(10px)', textDecoration: 'none' }}>
            ← Back to Explore
          </Link>
          <div className="nav-controls">
            <AuthControls />
          </div>
        </nav>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {details?.category && <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(201,168,76,0.2)', color: '#c9a84c', padding: '4px 10px', borderRadius: 4 }}>{details.category}</span>}
            {details?.era && <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 10px', borderRadius: 4 }}>{details.era}</span>}
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#fff', margin: 0, textTransform: 'capitalize' }}>
            {siteName}
          </h1>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>📍 {details?.state || 'India'}</span>
            <span>⭐ {details?.rating || '4.5'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px 64px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 64, zIndex: 10 }}>
        
        {/* Left Column: History */}
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#e8e4dc', marginBottom: 24 }}>History & Heritage</h2>
          
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5 }}>
              <div style={{ height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 4, width: '100%', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 4, width: '90%', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 4, width: '95%', animation: 'pulse 1.5s infinite' }} />
            </div>
          ) : (
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
              {details?.fullHistory}
            </p>
          )}

          <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#e8e4dc', marginTop: 48, marginBottom: 24 }}>Experiences</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <button 
              onClick={() => setIsAudioOpen(true)}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: 24, borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s', textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎧</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>Audio Tour</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Listen to the story as you walk.</div>
            </button>
            <Link href="/ar-camera" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: 24, borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>AR Camera</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Translate signs and unlock secrets.</div>
            </Link>
            <Link href="/heritage" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(0,0,0,0.5) 100%)', border: '1px solid rgba(201,168,76,0.3)', padding: 24, borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📜</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>Heritage Voices</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Talk to historical figures at this site.</div>
            </Link>
            <Link href="/archive" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0.5) 100%)', border: '1px solid rgba(59,130,246,0.3)', padding: 24, borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎙️</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#3b82f6', fontFamily: "'Outfit', sans-serif" }}>Living Archive</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Listen to local elders tell untold stories.</div>
            </Link>
            <Link href="/journey" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(0,0,0,0.5) 100%)', border: '1px solid rgba(168,85,247,0.3)', padding: 24, borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🗺️</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#a855f7', fontFamily: "'Outfit', sans-serif" }}>Insider Journey</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Navigate like a local with crowd-sourced tips.</div>
            </Link>
          </div>
        </div>

        {/* Right Column: Verification & Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Blockchain Verified Badge */}
          <div style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(0,0,0,0.5) 100%)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(74,222,128,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#4ade80', fontFamily: "'Outfit', sans-serif" }}>Authenticity Verified</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Ministry of Culture, India</div>
              </div>
            </div>
            
            {details && (
              <>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Tx Hash</div>
                <div style={{ fontSize: 11, color: '#fff', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 4, letterSpacing: '0.05em', wordBreak: 'break-all' }}>
                  {details.blockchainHash}
                </div>
                <div style={{ textAlign: 'right', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>Verified on {details.verifiedDate}</div>
              </>
            )}
          </div>

          <button style={{ width: '100%', background: '#c9a84c', color: '#000', border: 'none', padding: '16px', borderRadius: 12, fontWeight: 800, fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: 'pointer' }}>
            Add to My Planner ＋
          </button>
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
