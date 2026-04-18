'use client';

import Link from 'next/link';
import AuthControls from '../../components/AuthControls';

export default function BlogPage() {
  return (
    <div className="page">
      <nav className="navbar">
        <Link href="/" className="nav-brand">BHARAT<br />LENS</Link>
        <div className="nav-links-center">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/virtual-tours">Virtual Tours</Link>
          <Link href="/planner">AI Planner</Link>
          <Link href="/blog" style={{ color: '#e8e4dc' }}>Blog</Link>
        </div>
        <div className="nav-controls">
          <AuthControls />
        </div>
      </nav>

      <div style={{ padding: '80px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <span className="section-label">STORIES & INSIGHTS</span>
        <h1 className="section-title"><span>Blog</span></h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 600, lineHeight: 1.8, fontSize: 13 }}>
          This page is currently under construction. Soon you'll find travel stories, 
          heritage deep-dives, and AI-powered cultural insights here.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/planner" className="btn-fill">Plan a Trip →</Link>
          <Link href="/" className="btn-outline" style={{ width: 'fit-content' }}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
}