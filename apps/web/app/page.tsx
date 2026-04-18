"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import AuthControls from "../components/AuthControls";
import CinematicIntro from "../components/CinematicIntro";

const MARQUEE_ITEMS = [
  "TAJ MAHAL","AMBER FORT","QUTUB MINAR","KHAJURAHO",
  "HAMPI","KONARK","RANI KI VAV","RED FORT",
  "ELLORA CAVES","LOTUS TEMPLE","GATEWAY OF INDIA","SANCHI STUPA",
];

const FEATURES = [
  { name: "AR Translation",   desc: "Point your camera at any sign, menu, or monument. Our AI overlays instant translations in 40+ languages directly onto the real world." },
  { name: "AI Trip Planner",  desc: "Tell us your interests, budget and days. Our AI crafts a hyper-personalized itinerary with hidden gems beyond the tourist trail." },
  { name: "Virtual Tours",    desc: "Explore Hampi, Konark, or Rani ki Vav in immersive 3D — from anywhere in the world. No ticket. No travel. Full experience." },
  { name: "Smart Navigation", desc: "Real-time crowd density, optimal routes, and contextual audio guides that activate as you approach each landmark." },
  { name: "Heritage Archive", desc: "A blockchain-verified digital library of India's cultural assets — 3D models, ancient manuscripts, oral histories, and more." },
  { name: "Offline Mode",     desc: "Compressed on-device AI models work perfectly in remote areas with zero connectivity — because heritage knows no signal bars." },
  { name: "Voice Translator", desc: "Two-way real-time speech translation supporting regional dialects — speak to locals, read menus, negotiate at markets." },
  { name: "Rewards System",   desc: "Earn tokens for every site visited, review written, and cultural fact shared. Redeem for exclusive experiences and discounts." },
];

const STATS = [
  { n: "5,000+", l: "HERITAGE SITES" },
  { n: "40+",    l: "LANGUAGES" },
  { n: "100%",   l: "OFFLINE READY" },
  { n: "3D",     l: "VIRTUAL TOURS" },
];

export default function Home() {
  const [clock, setClock] = useState("IST --:-- --");

  /* ── Clock ── */
  useEffect(() => {
    const tick = () => {
      const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      let h = ist.getHours();
      const m = ist.getMinutes();
      const ap = h >= 12 ? "p.m." : "a.m.";
      h = h % 12 || 12;
      setClock(`IST ${h}:${String(m).padStart(2, "0")} ${ap}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className={styles.page}>
      {/* grid bg */}
      <div className={styles.gridBg}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />

      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoMark} />
          <span className={styles.logoText}>BHARATLENS</span>
        </div>
        <div className={styles.navCenter}>
          <Link href="/" className={`${styles.navLink} ${styles.navActive}`}>Home</Link>
          <Link href="/explore" className={styles.navLink}>Explore</Link>
          <Link href="/planner" className={styles.navLink}>AI Planner</Link>
          <Link href="/virtual-tours" className={styles.navLink}>Virtual Tours</Link>
        </div>
        <div className={styles.navRight}>
          <AuthControls />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.eyebrow}>
          <div className={styles.eyebrowLine} />
          AI · Heritage · Tourism · India
          <div className={styles.eyebrowLine} />
        </div>

        <h1 className={styles.h1}>
          <span className={styles.h1Top}>Explore</span>
          <span className={styles.h1Italic}>Heritage</span>
          <span className={styles.h1Bottom}>Differently</span>
        </h1>

        <div className={styles.divider}>
          <div className={styles.divLine} />
          <div className={styles.diamond} />
          <div className={styles.divLine} />
        </div>

        <p className={styles.heroSub}>
          An AI-powered platform that brings India&apos;s monuments, history, and culture
          to life — through augmented reality, real-time translation, and immersive virtual journeys.
        </p>

        <div className={styles.ctaRow}>
          <Link href="/dashboard" className={styles.ctaPrimary}>BEGIN YOUR JOURNEY</Link>
          <button className={styles.ctaSecondary}>WATCH DEMO</button>
        </div>

        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 52px' }}>
          <CinematicIntro />
        </div>

        <div className={styles.statsStrip}>
          {STATS.map((s) => (
            <div key={s.l} className={styles.statCell}>
              <div className={styles.statN}>{s.n}</div>
              <div className={styles.statL}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {doubled.map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item}<span className={styles.marqueeDot}> ✦ </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className={styles.featSection}>
        <div className={styles.featHeader}>
          <span className={styles.featLabel}>PLATFORM CAPABILITIES</span>
          <div className={styles.featLine} />
        </div>
        <div className={styles.featGrid}>
          {FEATURES.map((f) => (
            <div key={f.name} className={styles.featCard}>
              <div className={styles.featIconBox} />
              <div className={styles.featName}>{f.name}</div>
              <div className={styles.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div>
          <div className={styles.footBrand}>BHARATLENS</div>
          <div className={styles.footSub}>AI Cultural Tourism · India</div>
        </div>
        <div className={styles.footLinks}>
          {["GitHub","Twitter","LinkedIn","Blog"].map((l) => (
            <span key={l} className={styles.footLink}>{l}</span>
          ))}
        </div>
        <div className={styles.footTime}>Local time<br /><span>{clock}</span></div>
        <div className={styles.footCopy}>© 2025 BHARATLENS<br />ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}