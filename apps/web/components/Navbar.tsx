'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AuthControls from './AuthControls';
import { useUser } from '../hooks/use-user';
import { Language, getTranslation } from '../lib/i18n';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [lang, setLang] = useState<Language>('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const t = getTranslation(lang);
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
      padding: isMobile ? '16px 24px' : '20px 48px',
      borderBottom: '0.5px solid rgba(201, 168, 76, 0.25)',
      background: 'rgba(8, 8, 8, 0.85)',
      backdropFilter: 'blur(20px)',
      width: '100%',
    }}>
      {/* Brand */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 24, height: 24,
          border: '0.5px solid #c9a84c',
          borderRadius: '50%',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            width: 12, height: 12,
            border: '0.5px solid #c9a84c',
            borderRadius: '50%',
          }} />
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: isMobile ? 12 : 14,
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: '#f0ece4',
        }}>BHARATLENS</span>
      </Link>

      {/* Desktop Nav */}
      {!isMobile && (
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
                      className="nav-dropdown-item"
                    >
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Auth & HP & Lang */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>
        {!isMobile && (
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#c9a84c',
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 8px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
          </select>
        )}

        {user && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 6, 
            background: 'rgba(201, 168, 76, 0.1)', 
            padding: isMobile ? '4px 10px' : '6px 14px', borderRadius: 20,
            border: '1px solid rgba(201, 168, 76, 0.3)'
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }} />
            <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 900, color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
              {user.tokens} <span style={{ fontSize: 9, opacity: 0.6 }}>{t.hp}</span>
            </span>
          </div>
        )}
        
        <div className={isMobile ? 'hide-mobile' : ''}>
          <AuthControls />
        </div>

        {/* Hamburger */}
        {isMobile && (
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              display: 'flex', flexDirection: 'column', gap: 5, width: 24
            }}
          >
            <motion.div animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }} style={{ height: 2, background: '#f0ece4', width: '100%', borderRadius: 2 }} />
            <motion.div animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} style={{ height: 2, background: '#f0ece4', width: '100%', borderRadius: 2 }} />
            <motion.div animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }} style={{ height: 2, background: '#f0ece4', width: '100%', borderRadius: 2 }} />
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 90 }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '80%',
                background: '#0c0c0c', borderLeft: '1px solid rgba(201, 168, 76, 0.2)',
                padding: '80px 32px 32px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: 24,
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 10, color: '#c9a84c', fontWeight: 800, letterSpacing: '0.1em' }}>MENU</span>
                {mainLinks.map((link) => (
                  <Link 
                    key={link.path}
                    href={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ 
                      fontSize: 18, fontWeight: 800, color: isActive(link.path) ? '#c9a84c' : '#f0ece4',
                      textDecoration: 'none', letterSpacing: '-0.02em'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
                <span style={{ fontSize: 10, color: '#c9a84c', fontWeight: 800, letterSpacing: '0.1em' }}>DISCOVER</span>
                {dropdownLinks.map((link) => (
                  <Link 
                    key={link.path}
                    href={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ 
                      fontSize: 14, fontWeight: 700, color: 'rgba(240, 236, 228, 0.6)',
                      textDecoration: 'none'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 32 }}>
                <AuthControls />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .nav-dropdown-item {
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12,
          transition: all 0.2s;
          background: transparent;
        }
        .nav-dropdown-item span {
          fontSize: 12px;
          fontWeight: 700;
          color: rgba(240, 236, 228, 0.7);
          letterSpacing: 0.05em;
        }
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
