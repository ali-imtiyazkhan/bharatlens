'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AuthControls from './AuthControls';

export default function Navbar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'AI Planner', path: '/planner' },
  ];

  const dropdownLinks = [
    { name: 'Virtual Tours', path: '/virtual-tours' },
    { name: 'Heritage Voices', path: '/heritage' },
    { name: 'Living Archive', path: '/archive' },
    { name: 'Community', path: '/discover' },
    { name: 'Communities Hub', path: '/communities' },
    { name: 'Chat', path: '/chat' },
    { name: 'Rewards', path: '/rewards' },
    { name: 'Insider Journey', path: '/journey' },
    { name: 'Voice Translator', path: '/translator' },
    { name: 'AR Camera', path: '/ar-camera' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 48px',
      borderBottom: '0.5px solid rgba(201, 168, 76, 0.25)',
      background: 'rgba(8, 8, 8, 0.85)',
      backdropFilter: 'blur(20px)',
      width: '100%',
    }}>
      {/* Brand */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 28, height: 28,
          border: '0.5px solid #c9a84c',
          borderRadius: '50%',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            width: 14, height: 14,
            border: '0.5px solid #c9a84c',
            borderRadius: '50%',
          }} />
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: '#f0ece4',
        }}>BHARATLENS</span>
      </Link>

      {/* Nav Center */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {mainLinks.map((link) => (
          <Link 
            key={link.path}
            href={link.path} 
            style={{ 
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textDecoration: 'none', transition: 'all 0.3s',
              color: isActive(link.path) ? '#c9a84c' : 'rgba(240, 236, 228, 0.45)',
              textTransform: 'uppercase'
            }}
          >
            {link.name}
          </Link>
        ))}

        {/* More Dropdown Trigger */}
        <div 
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
          style={{ position: 'relative', padding: '10px 0' }}
        >
          <button style={{ 
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            color: isDropdownOpen ? '#c9a84c' : 'rgba(240, 236, 228, 0.45)',
            display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', transition: 'all 0.3s'
          }}>
            MORE <span style={{ fontSize: 8, transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: -60,
                  width: 220,
                  background: 'rgba(12, 12, 12, 0.95)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  borderRadius: 20,
                  padding: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                {dropdownLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.2s',
                      background: isActive(link.path) ? 'rgba(201, 168, 76, 0.1)' : 'transparent'
                    }}
                    className="nav-dropdown-item"
                  >
                    <span style={{ 
                      fontSize: 12, 
                      fontWeight: 700, 
                      color: isActive(link.path) ? '#c9a84c' : 'rgba(240, 236, 228, 0.7)',
                      letterSpacing: '0.05em'
                    }}>
                      {link.name}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Auth Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <AuthControls />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .nav-dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-dropdown-item:hover span {
          color: #c9a84c !important;
        }
      `}} />
    </nav>
  );
}
