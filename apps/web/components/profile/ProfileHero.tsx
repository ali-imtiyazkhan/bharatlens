'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileHero({ profile: initialProfile }: { profile: any }) {
  const [profile, setProfile] = useState(initialProfile);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: initialProfile.displayName || initialProfile.name || '',
    bio: initialProfile.bio || '',
    city: initialProfile.city || ''
  });
  
  const [stats, setStats] = useState({
    stars: initialProfile?.totalStars || 0,
    followers: initialProfile?.followersCount || 0,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasStarred, setHasStarred] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  if (!profile) return null;
  const isOwnProfile = currentUser?.id === profile.id;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Profile link copied to clipboard! 🔗');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        setProfile((prev: any) => ({ ...prev, ...editData }));
        setIsEditing(false);
      } else {
        alert('Failed to save profile updates.');
      }
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

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
    <div style={{ position: 'relative', marginBottom: 48 }}>
      {/* Cover Photo */}
      <div style={{ height: 120, width: '100%', borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1599395293282-eeb7a921d7b1?q=80&w=2000&auto=format&fit=crop) center/cover', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a, transparent)' }} />
      </div>

      {/* Profile Header Layer */}
      <div style={{ padding: '0 48px', position: 'relative', marginTop: -60, zIndex: 10 }}>
        
        {/* Main Row: Avatar + Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
            <img 
              src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
              style={{ width: 140, height: 140, borderRadius: '50%', border: '6px solid #0a0a0a', objectFit: 'cover' }} 
              alt={profile.displayName} 
            />
            {!isEditing && (
              <div style={{ paddingBottom: 12 }}>
                <h1 style={{ fontSize: 32, fontWeight: 900, display: 'flex', gap: 8, alignItems: 'center', color: '#fff' }}>
                  {profile.displayName || profile.name}
                  {profile.totalVisits >= 10 && <span style={{ color: '#c9a84c', fontSize: 20 }}>✦</span>}
                </h1>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>@{profile.username}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, paddingBottom: 16 }}>
            {isOwnProfile ? (
              <>
                {isEditing ? (
                  <>
                    <button onClick={handleSave} disabled={isSaving} style={{ background: '#c9a84c', color: '#000', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setIsEditing(false)} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Edit Profile</button>
                    <button onClick={handleShare} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Share ↗</button>
                  </>
                )}
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
                 <button onClick={handleFollow} style={{ background: isFollowing ? 'transparent' : 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                   {isFollowing ? 'Following' : 'Follow'}
                 </button>
                 <a href="/chat" style={{ textDecoration: 'none', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                   Message
                 </a>
                 <button onClick={handleShare} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>↗</button>
              </>
            )}
          </div>
        </div>

        {/* Info Area */}
        <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 32px', borderRadius: 24 }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Display Name</label>
                <input 
                  value={editData.displayName}
                  onChange={e => setEditData({...editData, displayName: e.target.value})}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Bio</label>
                <textarea 
                  value={editData.bio}
                  onChange={e => setEditData({...editData, bio: e.target.value})}
                  rows={3}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', color: '#fff', fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>City</label>
                <input 
                  value={editData.city}
                  onChange={e => setEditData({...editData, city: e.target.value})}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', color: '#fff' }}
                />
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>{profile.bio || 'Heritage Explorer @ BharatLens'}</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(201,168,76,0.1)', color: '#c9a84c', padding: '6px 14px', borderRadius: 20 }}>📍 {profile.city || 'India'}</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: 20 }}>🗣️ {profile.languagesSpoken?.join(', ') || 'English, Hindi'}</span>
              </div>
            </>
          )}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginTop: 16 }}>
           {[
             { label: 'Visits', value: profile.totalVisits },
             { label: 'Stars', value: stats.stars, color: '#c9a84c' },
             { label: 'Followers', value: stats.followers },
             { label: 'Badges', value: profile.badges?.length || 0, color: '#3b82f6' }
           ].map((stat, i) => (
             <div key={stat.label} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 800 }}>{stat.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: stat.color || '#fff' }}>{stat.value}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
