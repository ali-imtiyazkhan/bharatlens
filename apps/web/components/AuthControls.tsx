'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AuthControls() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        // ignore JSON parse error
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/login';
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          href={`/profile/${user.username || 'rajesh_explorer'}`}
          title={`View profile of ${user.name}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
            border: '2px solid rgba(201,168,76,0.3)',
            borderRadius: '50%',
            padding: '2px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9a84c 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              {user.name?.[0]}
            </div>
          )}
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#c9a84c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Explorer</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0',
              textAlign: 'left'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link href="/login" className="btn-login">Sign In</Link>
  );
}
