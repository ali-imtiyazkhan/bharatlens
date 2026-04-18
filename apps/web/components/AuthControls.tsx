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
    window.location.reload();
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>
          Hi, {user.name?.split(' ')[0]}
        </span>
        <button 
          onClick={handleLogout} 
          className="btn-outline" 
          style={{ padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="btn-login">Sign In</Link>
  );
}
