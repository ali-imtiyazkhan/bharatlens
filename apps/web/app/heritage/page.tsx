'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthControls from '../../components/AuthControls';

const figures = [
  {
    id: 'akbar',
    name: 'Akbar the Great',
    era: '1542 – 1605 CE',
    site: 'Fatehpur Sikri',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2000&auto=format&fit=crop',
    description: 'Speak with Jalal-ud-din Muhammad Akbar. Discuss the Din-i-Ilahi, the Ibadat Khana, and his vision for a syncretic India.',
  },
  {
    id: 'laxmibai',
    name: 'Rani Laxmibai',
    era: '1828 – 1858 CE',
    site: 'Jhansi Fort',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1707056637380-575ec65c82de?q=80&w=2000&auto=format&fit=crop',
    description: 'Converse with the fierce Queen of Jhansi. Discover her bravery during the Indian Rebellion of 1857.',
  },
  {
    id: 'ashoka',
    name: 'Emperor Ashoka',
    era: '304 – 232 BCE',
    site: 'Sanchi Stupa',
    state: 'Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2000&auto=format&fit=crop',
    description: 'Meet the Mauryan Emperor who renounced violence after the Kalinga War. Discuss Dhamma, his rock edicts, and the path of non-violence.',
  },
  {
    id: 'birbal',
    name: 'Raja Birbal',
    era: '1528 – 1586 CE',
    site: 'Fatehpur Sikri',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1585135497273-1a86d9d81b88?q=80&w=2000&auto=format&fit=crop',
    description: 'Challenge the wittiest advisor in Akbar\'s court. Birbal will answer your hardest questions with humor and wisdom.',
  },
  {
    id: 'tipu',
    name: 'Tipu Sultan',
    era: '1750 – 1799 CE',
    site: 'Srirangapatna',
    state: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1600100397608-ef80f6a956c5?q=80&w=2000&auto=format&fit=crop',
    description: 'Speak with the Tiger of Mysore. Learn about his military rocket innovations and his fierce resistance against the British.',
  },
  {
    id: 'bhagat',
    name: 'Bhagat Singh',
    era: '1907 – 1931 CE',
    site: 'Jallianwala Bagh',
    state: 'Punjab',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2000&auto=format&fit=crop',
    description: 'Converse with the revolutionary who shook the British Empire. Discuss his writings, his sacrifice, and his vision for a free India.',
  }
];

export default function HeritageVoicesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      <nav style={{ 
        padding: '16px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
          ← <span className="hide-mobile">Back to Home</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ color: '#c9a84c', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em' }}>HERITAGE VOICES</div>
          <AuthControls />
        </div>
      </nav>

      <main style={{ padding: 'clamp(24px, 5vw, 64px)', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: 900, marginBottom: 16 }}>Talk to History</h1>
          <p style={{ fontSize: 'clamp(14px, 4vw, 18px)', color: 'rgba(255,255,255,0.6)', maxWidth: 600, lineHeight: 1.6, marginBottom: 'clamp(32px, 6vw, 64px)' }}>
            Experience history like never before. Stand at the exact locations where they made history, and use your device to converse with the figures who shaped India.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: 'clamp(16px, 4vw, 32px)' 
        }}>
          {figures.map((figure, idx) => (
            <motion.div 
              key={figure.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
              style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 'clamp(350px, 50vh, 400px)' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: `url(${figure.image}) center/cover`, transition: 'transform 0.5s', transform: 'scale(1.05)' }} className="bg-img" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2))' }} />
              
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(20px, 4vw, 32px)' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(201,168,76,0.2)', color: '#c9a84c', padding: '4px 10px', borderRadius: 4 }}>📍 {figure.site}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 10px', borderRadius: 4 }}>{figure.era}</span>
                </div>
                <h2 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, marginBottom: 8 }}>{figure.name}</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.5 }}>{figure.description}</p>
                
                <Link href={`/heritage/${figure.id}`} style={{ display: 'inline-block', background: '#c9a84c', color: '#000', padding: '12px 24px', borderRadius: 8, fontWeight: 800, textDecoration: 'none', fontSize: 13 }}>
                  Connect with {figure.name.split(' ')[0]} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .bg-img:hover { transform: scale(1.1); }
        @media (max-width: 480px) {
          .group { height: 450px !important; }
        }
      `}} />
    </div>
  );
}
