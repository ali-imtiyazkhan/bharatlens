'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';

import ProfileHero from '../../../components/profile/ProfileHero';
import HighlightReel from '../../../components/profile/HighlightReel';
import BadgeWall from '../../../components/profile/BadgeWall';
import VisitFeed from '../../../components/profile/VisitFeed';
import { API_BASE } from '../../../lib/api-config';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const username = params?.username as string;
  
  useEffect(() => {
    if (!username) return;

    // Fetch Profile and Visits aggressively in parallel
    Promise.all([
      fetch(`${API_BASE}/api/profile/${username}`).then(res => res.json()),
      fetch(`${API_BASE}/api/visits/${username}`).then(res => res.json())
    ]).then(([profileData, feedData]) => {
      setProfile(profileData);
      setFeed(feedData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [username]);

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  if (!profile || profile.error) {
    return <div style={{ height: '100vh', background: '#0a0a0a', color: '#fff', padding: 48 }}>Profile not found</div>;
  }

  return (
    <div className="page" style={{ background: 'transparent' }}>
      
      <Navbar />

      <main style={{ maxWidth: 1000, margin: '20px auto' }}>
        <ProfileHero profile={profile} />
        
        {profile.highlights && profile.highlights.length > 0 && (
          <HighlightReel highlights={profile.highlights} />
        )}
        
        <BadgeWall badges={profile.badges} />
        
        <VisitFeed visits={feed} />
      </main>

    </div>
  );
}
