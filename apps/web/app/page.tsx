"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
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

  /* ── Globe ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 260, H = 260, R = 116, cx = W / 2, cy = H / 2;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // base
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      const bg = ctx.createRadialGradient(cx - 25, cy - 35, 8, cx, cy, R);
      bg.addColorStop(0, "#e8d8a0"); bg.addColorStop(0.25, "#a0c8e8");
      bg.addColorStop(0.5, "#c0a0e0"); bg.addColorStop(0.75, "#e0a0b8");
      bg.addColorStop(1, "#80c0a8");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // streaks
      for (let i = 0; i < 12; i++) {
        const a = ((t * 0.35 + i * 30) * Math.PI) / 180;
        const g = ctx.createLinearGradient(
          cx + Math.cos(a) * R * 0.2, cy + Math.sin(a) * R * 0.2,
          cx + Math.cos(a + Math.PI) * R, cy + Math.sin(a + Math.PI) * R
        );
        const h2 = (i * 30 + t * 1.5) % 360;
        g.addColorStop(0, `hsla(${h2},75%,82%,0)`);
        g.addColorStop(0.35, `hsla(${h2},88%,78%,0.5)`);
        g.addColorStop(0.65, `hsla(${(h2+50)%360},82%,74%,0.38)`);
        g.addColorStop(1, `hsla(${(h2+110)%360},72%,80%,0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }

      // gold sheen
      const gs = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
      gs.addColorStop(0, "rgba(201,168,76,0)");
      gs.addColorStop(0.5, `rgba(201,168,76,${0.08 + 0.04 * Math.sin(t * 0.02)})`);
      gs.addColorStop(1, "rgba(201,168,76,0)");
      ctx.fillStyle = gs; ctx.fillRect(0, 0, W, H);

      // specular
      const sh = ctx.createRadialGradient(cx-50, cy-55, 4, cx-28, cy-32, R*0.72);
      sh.addColorStop(0, "rgba(255,255,255,0.82)");
      sh.addColorStop(0.2, "rgba(255,255,255,0.22)");
      sh.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sh; ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // ring
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(201,168,76,0.4)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();

      // rim
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      const rim = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R);
      rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = rim; ctx.fillRect(0, 0, W, H);
      ctx.restore();

      t += 0.6;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
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
          {["Home","Explore","Heritage","Virtual Tours","Translate"].map((l, i) => (
            <Link key={l} href={i === 0 ? "/" : `/${l.toLowerCase().replace(" ","-")}`}
              className={`${styles.navLink} ${i === 0 ? styles.navActive : ""}`}>{l}</Link>
          ))}
        </div>
        <div className={styles.navRight}>
          <Link href="/login" className={styles.navBtn}>Log in</Link>
          <Link href="/register" className={`${styles.navBtn} ${styles.navPrimary}`}>Get started</Link>
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

        <div className={styles.globeStage}>
          <div className={`${styles.globeRing} ${styles.ringOuter}`}>
            <div className={styles.globeTick} />
          </div>
          <div className={`${styles.globeRing} ${styles.ringMid}`} />
          <canvas ref={canvasRef} width={260} height={260} className={styles.globeCanvas} />
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