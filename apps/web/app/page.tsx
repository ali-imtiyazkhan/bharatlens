"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TravelCards from "../components/TravelCards";
import WorkflowInteractive from "../components/WorkflowInteractive";
import AuthControls from "../components/AuthControls";

export default function LandingPage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const ist = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      let h = ist.getHours();
      const m = ist.getMinutes();
      const ampm = h >= 12 ? "p.m." : "a.m.";
      h = h % 12 || 12;
      setTime(`IST ${h}:${String(m).padStart(2, "0")} ${ampm}`);
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="nav-brand">
          BHARAT
          <br />
          LENS
        </Link>
        <div className="nav-links-center">
          <Link href="/explore">Destinations</Link>
          <Link href="/tours">Virtual Tours</Link>
          <Link href="/planner">AI Planner</Link>
        </div>
        <div className="nav-controls">
          <button className="lang-select">EN / HI</button>
          <AuthControls />
        </div>
      </nav>

      {/* Hero */}
      <main className="hero">
        {/* Left — Title */}
        <div className="hero-left">
          <span className="badge">AI-powered · India</span>
          <h1>
            <span className="title-script">Discover</span>
            <span className="title-bold">
              HERITAGE<span className="title-dot">.</span>
            </span>
          </h1>
          <div className="cta-row">
            <Link href="/dashboard" className="btn-fill">
              Start exploring
            </Link>
            <button className="btn-outline">Watch demo</button>
          </div>
          <div className="stats-row">
            <div className="stat">
              <div className="stat-n">5K+</div>
              <div className="stat-l">SITES</div>
            </div>
            <div className="stat">
              <div className="stat-n">40+</div>
              <div className="stat-l">LANGUAGES</div>
            </div>
            <div className="stat">
              <div className="stat-n">100%</div>
              <div className="stat-l">OFFLINE</div>
            </div>
          </div>
        </div>

        {/* Center — Travel Showcase */}
        <div className="globe-wrap">
          <TravelCards />
        </div>
      </main>

      {/* Features Section */}
      <section className="section">
        <span className="section-label">01 ⁄ PLATFORM CAPABILITIES</span>
        <h2 className="section-title">
          Breaking barriers with <span>AI</span> and immersive tech.
        </h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">❖</div>
            <h3 className="feature-title">AR Translation Lens</h3>
            <p className="feature-desc">Point your camera at Hindi, Sanskrit, or Urdu plaques. Read translations projected dynamically in your native language directly on your screen without internet.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">◉</div>
            <h3 className="feature-title">Virtual 3D Tours</h3>
            <p className="feature-desc">Can't travel? Explore majestic forts and ancient temples via high-resolution 3D virtual reconstructions crafted natively inside your browser.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⎔</div>
            <h3 className="feature-title">AI Tech Planner</h3>
            <p className="feature-desc">Simply list your interests, days, and budget constraint. Our AI generates a meticulous day-by-day interactive itinerary perfectly optimized for logic and crowd densities.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <span className="section-label">02 ⁄ THE WORKFLOW</span>
        <h2 className="section-title">
          Explore confidently in <span>Three Steps</span>.
        </h2>
        <div className="steps-container">
          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">I</div>
              <div className="step-content">
                <h3>Build your AI Itinerary</h3>
                <p>Provide your dates and preferences so our algorithm can chart the perfect historic route mapped dynamically to weather and crowd densities.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">II</div>
              <div className="step-content">
                <h3>Open the Lens</h3>
                <p>Arrive at the site and tap your camera. Let our offline-first AI translate monument inscriptions and narrate historic stories effortlessly.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">III</div>
              <div className="step-content">
                <h3>Earn Tokenized Rewards</h3>
                <p>Contribute reviews, scan artifacts, and earn platform tokens that discount future local tour guide sessions.</p>
              </div>
            </div>
          </div>
          <div className="interactive-wrapper" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent' }}>
            <WorkflowInteractive />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-time">
          Local time
          <br />
          <span>{time}</span>
        </div>
        <div className="footer-socials">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="/blog">Blog</a>
        </div>
        <div />
        <div className="footer-copy">
          © 2025
          <br />
          BHARATLENS
        </div>
      </footer>
    </div>
  );
}