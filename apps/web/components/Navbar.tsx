'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Globe, Sparkles } from 'lucide-react';
import AuthControls from './AuthControls';
import CustomDropdown from './CustomDropdown';
import { useUser } from '../hooks/use-user';
import { Language, getTranslation } from '../lib/i18n';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [lang, setLang] = useState<Language>('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMoreOpenMobile, setIsMoreOpenMobile] = useState(false);

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

  const langOptions = [
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'hi', label: 'Hindi', icon: '🇮🇳' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '12px 24px' : '16px 48px',
      borderBottom: '0.5px solid rgba(201, 168, 76, 0.25)',
      background: 'rgba(8, 8, 8, 0.85)',
      backdropFilter: 'blur(20px)',
      width: '100%',
    }}>
      {/* Brand */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 28, height: 28,
          border: '1px solid #c9a84c',
          borderRadius: '50%',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 15px rgba(201, 168, 76, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            width: 14, height: 14,
            border: '1px solid #c9a84c',
            borderRadius: '50%',
            opacity: 0.5
          }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a84c' }} />
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: isMobile ? 14 : 16,
          fontWeight: 900,
          letterSpacing: '0.25em',
          color: '#f0ece4',
          background: 'linear-gradient(to right, #f0ece4, #c9a84c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>BHARATLENS</span>
      </Link>

      {/* Desktop Nav */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
          {mainLinks.map((link) => (
            <Link 
              key={link.path}
              href={link.path} 
              style={{ 
                fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textDecoration: 'none', transition: 'all 0.3s',
                color: isActive(link.path) ? '#c9a84c' : 'rgba(240, 236, 228, 0.4)',
                textTransform: 'uppercase',
                position: 'relative'
              }}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div layoutId="nav-line" style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 1.5, background: '#c9a84c', borderRadius: 2 }} />
              )}
            </Link>
          ))}

          <div 
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
            style={{ position: 'relative', padding: '10px 0' }}
          >
            <button style={{ 
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.15em',
              color: isDropdownOpen ? '#c9a84c' : 'rgba(240, 236, 228, 0.4)',
              display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', transition: 'all 0.3s'
            }}>
              DISCOVER <ChevronDown size={12} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: -100,
                    width: 260,
                    background: 'rgba(10, 10, 10, 0.98)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    borderRadius: 24,
                    padding: '16px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 4
                  }}
                >
                  <div style={{ padding: '0 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 8 }}>
                    <span style={{ fontSize: 9, color: '#c9a84c', fontWeight: 900, letterSpacing: '0.1em' }}>EXPLORE INDIA</span>
                  </div>
                  {dropdownLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setIsDropdownOpen(false)}
                      className="nav-dropdown-item"
                    >
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{link.name}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Auth & HP & Lang */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 24 }}>
        {!isMobile && (
          <div style={{ width: 110 }}>
            <CustomDropdown 
              options={langOptions}
              value={lang}
              onChange={(v) => setLang(v as Language)}
            />
          </div>
        )}

        {user && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 8, 
            background: 'rgba(201, 168, 76, 0.08)', 
            padding: isMobile ? '6px 12px' : '8px 16px', borderRadius: 24,
            border: '1px solid rgba(201, 168, 76, 0.2)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            <Sparkles size={14} color="#c9a84c" />
            <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 900, color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
              {user.tokens} <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 2 }}>{t.hp}</span>
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
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
              cursor: 'pointer', padding: 10, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c'
            }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <>
            {/* Backdrop Blur Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(5, 5, 5, 0.6)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                zIndex: 9998
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(8, 8, 8, 0.8)', 
                padding: '100px 32px 32px', 
                zIndex: 9999, 
                display: 'flex', flexDirection: 'column', gap: 40,
                overflowY: 'auto'
              }}
            >
            {/* Lang switcher on mobile inside menu */}
            <div style={{ marginBottom: 8 }}>
              <CustomDropdown 
                options={langOptions}
                value={lang}
                onChange={(v) => {
                  setLang(v as Language);
                  setIsMobileMenuOpen(false);
                }}
                label="Select Language"
                fullWidth
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <span style={{ fontSize: 10, color: '#c9a84c', fontWeight: 900, letterSpacing: '0.2em' }}>NAVIGATION</span>
              {mainLinks.map((link) => (
                <Link 
                  key={link.path}
                  href={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ 
                    fontSize: 32, fontWeight: 900, color: isActive(link.path) ? '#c9a84c' : '#f0ece4',
                    textDecoration: 'none', letterSpacing: '-0.02em',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}
                >
                  {link.name}
                  {isActive(link.path) && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9a84c' }} />}
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button 
                onClick={() => setIsMoreOpenMobile(!isMoreOpenMobile)}
                style={{
                  background: 'none', border: 'none', width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', color: '#c9a84c', cursor: 'pointer', padding: '12px 0',
                  borderTop: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.2em' }}>DISCOVER MORE</span>
                <ChevronDown size={18} style={{ transform: isMoreOpenMobile ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </button>
              
              <AnimatePresence>
                {isMoreOpenMobile && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 16 }}
                  >
                    {dropdownLinks.map((link) => (
                      <Link 
                        key={link.path}
                        href={link.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ 
                          fontSize: 18, fontWeight: 700, color: 'rgba(240, 236, 228, 0.6)',
                          textDecoration: 'none'
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <AuthControls />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .nav-dropdown-item {
          padding: 12px 14px;
          border-radius: 16px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12;
          transition: all 0.2s;
          background: transparent;
          color: rgba(240, 236, 228, 0.6);
        }
        .nav-dropdown-item:hover {
          background: rgba(201, 168, 76, 0.1);
          color: #c9a84c;
          padding-left: 18px;
        }
        @media (max-width: 1024px) {
          .hide-mobile { display: none; }
        }
      `}} />
    </nav>
  );
}
