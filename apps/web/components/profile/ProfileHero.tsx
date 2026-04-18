import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProfileHero({ profile }: { profile: any }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    stars: profile?.totalStars || 0,
    followers: profile?.followersCount || 0,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasStarred, setHasStarred] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  if (!profile) return null;
  const isOwnProfile = currentUser?.id === profile.id || profile.username === 'rajesh_explorer';

  const handleFollow = async () => {
    if (!currentUser || !currentUser.id) return alert('Login required to follow explorers!');
    try {
      const res = await fetch(`/api/social/${isFollowing ? 'unfollow' : 'follow'}/${profile.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId: currentUser.id })
      });
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setStats(prev => ({ ...prev, followers: isFollowing ? prev.followers - 1 : prev.followers + 1 }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStar = async () => {
    if (!currentUser) return alert('Login to give stars!');
    if (hasStarred) return;
    try {
      const res = await fetch(`/api/social/star/${profile.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId: currentUser.id })
      });
      if (res.ok) {
        setHasStarred(true);
        setStats(prev => ({ ...prev, stars: prev.stars + 1 }));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to give star');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ position: 'relative', marginBottom: 64 }}>
      {/* Cover Photo */}
      <div style={{ height: 100, width: '100%', borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1599395293282-eeb7a921d7b1?q=80&w=2000&auto=format&fit=crop) center/cover', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a, transparent)' }} />
      </div>

      {/* Avatar & Info */}
      <div style={{ padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -60, position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
          <img 
            src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
            style={{ width: 140, height: 140, borderRadius: '50%', border: '6px solid #0a0a0a', objectFit: 'cover' }} 
            alt={profile.displayName} 
          />
          <div style={{ paddingBottom: 12 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, display: 'flex', gap: 8, alignItems: 'center' }}>
              {profile.displayName || profile.name}
              {profile.totalVisits >= 50 && <span style={{ color: '#3b82f6', fontSize: 20 }}>✓</span>}
            </h1>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>@{profile.username}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, paddingBottom: 16 }}>
          {isOwnProfile ? (
            <>
               <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Edit Profile</button>
               <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Share ↗</button>
            </>
          ) : (
            <>
               <button 
                 onClick={handleStar}
                 disabled={hasStarred}
                 style={{ 
                   background: hasStarred ? 'rgba(201,168,76,0.1)' : '#c9a84c', 
                   color: hasStarred ? '#c9a84c' : '#000', 
                   border: hasStarred ? '1px solid #c9a84c' : 'none', 
                   padding: '10px 20px', borderRadius: 8, fontWeight: 800, cursor: hasStarred ? 'default' : 'pointer', display: 'flex', gap: 6 
                 }}
               >
                 {hasStarred ? '✦ Starred' : '⭐ Give Star'}
               </button>
               <button 
                 onClick={handleFollow}
                 style={{ 
                   background: isFollowing ? 'transparent' : 'rgba(255,255,255,0.1)', 
                   color: '#fff', 
                   border: '1px solid rgba(255,255,255,0.2)', 
                   padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' 
                 }}
               >
                 {isFollowing ? 'Following' : 'Follow'}
               </button>
            </>
          )}
        </div>
      </div>

      {/* Bio & Pills */}
      <div style={{ padding: '24px 48px' }}>
        <p style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 600, marginBottom: 16 }}>{profile.bio || 'Heritage Explorer @ BharatLens'}</p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 16 }}>📍 {profile.city || 'India'}</span>
          <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 16 }}>🗣️ {profile.languagesSpoken?.join(', ') || 'English, Hindi'}</span>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Visits</div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 32, fontWeight: 800 }}>{profile.totalVisits}</motion.div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Stars</div>
            <motion.div key={stats.stars} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 32, fontWeight: 800, color: '#c9a84c' }}>{stats.stars}</motion.div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Followers</div>
            <motion.div key={stats.followers} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>{stats.followers}</motion.div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Badges</div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: 32, fontWeight: 800, color: '#3b82f6' }}>{profile.badges?.length || 0}</motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

