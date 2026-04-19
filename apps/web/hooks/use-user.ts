'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  displayName: string;
  tokens: number;
  avatarUrl?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const localUser = JSON.parse(stored);
      // Fetch fresh data from backend (especially tokens/HP)
      const res = await fetch(`/api/profile/me/${localUser.id}`);
      if (res.ok) {
        const freshUser = await res.json();
        setUser(freshUser);
        // Sync back to localStorage if basic info changed
        localStorage.setItem('user', JSON.stringify({ ...localUser, ...freshUser }));
      } else {
        setUser(localUser);
      }
    } catch (e) {
      console.error('Failed to sync user:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = () => {
    fetchUser();
  };

  return { user, loading, refreshUser };
}
