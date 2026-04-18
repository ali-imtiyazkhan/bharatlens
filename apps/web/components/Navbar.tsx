'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthControls from './AuthControls';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 48px',
      borderBottom: '0.5px solid rgba(201, 168, 76, 0.25)',
      background: 'rgba(8, 8, 8, 0.8)',
      backdropFilter: 'blur(20px)',
      width: '100%',
    }}>
      {/* Brand */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 30, height: 30,
          border: '0.5px solid #c9a84c',
          borderRadius: '50%',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            width: 15, height: 15,
            border: '0.5px solid #c9a84c',
            borderRadius: '50%',
          }} />
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: '0.18em',
          color: '#f0ece4',
        }}>BHARATLENS</span>
      </Link>

      {/* Nav Center */}
      <div style={{ display: 'flex', gap: 32 }}>
        <Link href="/" style={{ 
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s',
          color: isActive('/') ? '#f0ece4' : 'rgba(240, 236, 228, 0.38)' 
        }}>Home</Link>
        <Link href="/explore" style={{ 
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s',
          color: isActive('/explore') ? '#f0ece4' : 'rgba(240, 236, 228, 0.38)' 
        }}>Explore</Link>
        <Link href="/discover" style={{ 
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s',
          color: isActive('/discover') ? '#f0ece4' : 'rgba(240, 236, 228, 0.38)' 
        }}>Community</Link>
        <Link href="/virtual-tours" style={{ 
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s',
          color: isActive('/virtual-tours') ? '#f0ece4' : 'rgba(240, 236, 228, 0.38)' 
        }}>Virtual Tours</Link>
        <Link href="/planner" style={{ 
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s',
          color: isActive('/planner') ? '#f0ece4' : 'rgba(240, 236, 228, 0.38)' 
        }}>AI Planner</Link>
      </div>

      {/* Auth Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <AuthControls />
      </div>
    </nav>
  );
}
