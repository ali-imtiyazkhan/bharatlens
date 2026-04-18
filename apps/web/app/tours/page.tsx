'use client';

import Link from 'next/link';
import AuthControls from '../../components/AuthControls';

export default function ToursPage() {
  return (
    <div className="page">
      <nav className="navbar">
        <Link href="/" className="nav-brand">BHARAT<br />LENS</Link>
        <div className="nav-links-center">
          <Link href="/explore">Destinations</Link>
          <Link href="/virtual-tours" style={{ color: '#e8e4dc' }}>Virtual Tours</Link>
          <Link href="/planner">AI Planner</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <div className="nav-controls">
          <AuthControls />
        </div>
      </nav>

      <div style={{ padding: '80px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <span className="section-label">IMMERSIVE EXPERIENCES</span>
        <h1 className="section-title"><span>Virtual Tours</span></h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 600, lineHeight: 1.8, fontSize: 13 }}>
          This page is currently under construction. Soon you'll explore India's heritage 
          sites in immersive 3D — from Hampi to Konark, right from your browser.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/planner" className="btn-fill">Plan a Trip →</Link>
          <Link href="/" className="btn-outline" style={{ width: 'fit-content' }}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
}