'use client';

import { useEffect, useRef } from 'react';

export default function CinematicIntro() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas!.width = stage!.offsetWidth;
      canvas!.height = stage!.offsetHeight;
    }
    resize();

    // helpers
    function el(id: string) { return document.getElementById(id); }
    function fade(id: string, opacity: number, duration: number, delay = 0) {
      const e = el(id);
      if (!e) return;
      setTimeout(() => {
        e.style.transition = `opacity ${duration}ms ease`;
        e.style.opacity = String(opacity);
      }, delay);
    }
    function fadeAll(ids: string[], opacity: number, duration: number, delay = 0) {
      ids.forEach((id, i) => fade(id, opacity, duration, delay + i * 80));
    }

    // Globe drawing
    let globeT = 0;
    let globeActive = false;
    let globeAlpha = 0;
    let globeScale = 0;
    let targetScale = 0;
    let targetAlpha = 0;

    function drawGlobe(x: number, y: number, r: number, t: number, alpha = 1) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.beginPath(); ctx!.arc(x, y, r, 0, Math.PI * 2); ctx!.clip();

      const bg = ctx!.createRadialGradient(x - r * 0.2, y - r * 0.25, r * 0.05, x, y, r);
      bg.addColorStop(0, '#e8d8a0'); bg.addColorStop(0.25, '#a0c8e8');
      bg.addColorStop(0.5, '#c0a0e0'); bg.addColorStop(0.75, '#e0a0b8');
      bg.addColorStop(1, '#80c0a8');
      ctx!.fillStyle = bg; ctx!.fillRect(x - r - 2, y - r - 2, r * 2 + 4, r * 2 + 4);

      for (let i = 0; i < 12; i++) {
        const a = ((t * 0.4 + i * 30) * Math.PI) / 180;
        const g = ctx!.createLinearGradient(
          x + Math.cos(a) * r * 0.2, y + Math.sin(a) * r * 0.2,
          x + Math.cos(a + Math.PI) * r, y + Math.sin(a + Math.PI) * r
        );
        const h = (i * 30 + t * 2) % 360;
        g.addColorStop(0, `hsla(${h},75%,82%,0)`);
        g.addColorStop(0.4, `hsla(${h},90%,78%,0.55)`);
        g.addColorStop(0.6, `hsla(${(h + 60) % 360},82%,74%,0.4)`);
        g.addColorStop(1, `hsla(${(h + 120) % 360},72%,80%,0)`);
        ctx!.fillStyle = g; ctx!.fillRect(x - r - 2, y - r - 2, r * 2 + 4, r * 2 + 4);
      }

      const gs = ctx!.createLinearGradient(x - r, y, x + r, y);
      gs.addColorStop(0, 'rgba(201,168,76,0)');
      gs.addColorStop(0.5, `rgba(201,168,76,${0.1 + 0.05 * Math.sin(t * 0.025)})`);
      gs.addColorStop(1, 'rgba(201,168,76,0)');
      ctx!.fillStyle = gs; ctx!.fillRect(x - r - 2, y - r - 2, r * 2 + 4, r * 2 + 4);

      const sh = ctx!.createRadialGradient(x - r * 0.4, y - r * 0.45, r * 0.02, x - r * 0.22, y - r * 0.28, r * 0.7);
      sh.addColorStop(0, 'rgba(255,255,255,0.8)');
      sh.addColorStop(0.2, 'rgba(255,255,255,0.18)');
      sh.addColorStop(1, 'rgba(255,255,255,0)');
      ctx!.fillStyle = sh; ctx!.fillRect(x - r - 2, y - r - 2, r * 2 + 4, r * 2 + 4);

      const rim = ctx!.createRadialGradient(x, y, r * 0.5, x, y, r);
      rim.addColorStop(0, 'rgba(0,0,0,0)'); rim.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx!.fillStyle = rim; ctx!.fillRect(x - r - 2, y - r - 2, r * 2 + 4, r * 2 + 4);
      ctx!.restore();

      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.beginPath(); ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(201,168,76,0.45)'; ctx!.lineWidth = 1; ctx!.stroke();
      ctx!.restore();
    }

    function drawOrbitalRings(x: number, y: number, r: number, t: number, alpha = 1) {
      ctx!.save(); ctx!.globalAlpha = alpha * 0.6;
      ctx!.save();
      ctx!.translate(x, y); ctx!.rotate(t * 0.008);
      ctx!.beginPath(); ctx!.arc(0, 0, r + 28, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(201,168,76,0.3)'; ctx!.lineWidth = 0.5; ctx!.stroke();
      ctx!.fillStyle = '#c9a84c'; ctx!.fillRect(-0.5, -r - 34, 1, 8);
      ctx!.restore();
      ctx!.save();
      ctx!.translate(x, y); ctx!.rotate(-t * 0.012);
      ctx!.beginPath(); ctx!.arc(0, 0, r + 14, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(201,168,76,0.15)'; ctx!.lineWidth = 0.5; ctx!.stroke();
      ctx!.restore();
      ctx!.restore();
    }

    // Particles
    const particles: { x: number; y: number; vx: number; vy: number; life: number; decay: number; r: number; gold: boolean }[] = [];
    function spawnParticle(x: number, y: number) {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          life: 1, decay: 0.008 + Math.random() * 0.006,
          r: 1 + Math.random() * 2,
          gold: Math.random() > 0.5
        });
      }
    }

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx!.save();
        ctx!.globalAlpha = p.life * 0.6;
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.gold ? '#c9a84c' : 'rgba(240,236,228,0.8)';
        ctx!.fill(); ctx!.restore();
      }
    }

    // Scanline
    function animateScan() {
      const sl = el('ci-scanline');
      if (!sl) return;
      sl.style.opacity = '1';
      sl.style.transition = 'top 1.2s linear';
      sl.style.top = '0px';
      setTimeout(() => { sl.style.top = canvas!.height + 'px'; }, 50);
      setTimeout(() => { sl.style.opacity = '0'; sl.style.top = '-2px'; }, 1300);
    }

    // Progress
    function setProgress(pct: number, duration: number) {
      const pb = el('ci-progress');
      if (!pb) return;
      pb.style.opacity = '0.5';
      pb.style.transition = `width ${duration}ms linear`;
      pb.style.width = pct + '%';
    }

    // Counter
    function setCounter(cur: number, total: number) {
      const c = el('ci-counter');
      if (!c) return;
      c.style.opacity = '1';
      c.textContent = String(cur).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    }

    const W = () => canvas!.width, H = () => canvas!.height;

    function mainLoop() {
      ctx!.clearRect(0, 0, W(), H());
      globeT += 0.7;

      if (globeActive) {
        const cx = W() / 2, cy = H() / 2;
        globeScale += (targetScale - globeScale) * 0.05;
        globeAlpha += (targetAlpha - globeAlpha) * 0.04;
        const r = 110 * globeScale;
        if (r > 2) {
          drawOrbitalRings(cx, cy, r, globeT, globeAlpha);
          drawGlobe(cx, cy, r, globeT, globeAlpha);
        }
        if (Math.random() < 0.15) spawnParticle(cx + (Math.random() - 0.5) * r * 2, cy + (Math.random() - 0.5) * r * 2);
      }

      updateParticles();
      animRef.current = requestAnimationFrame(mainLoop);
    }

    function runIntro() {
      runningRef.current = true;
      globeActive = false; globeAlpha = 0; globeScale = 0; targetScale = 0; targetAlpha = 0;

      ['ci-scene-tagline', 'ci-scene-title', 'ci-scene-logo', 'ci-scene-features', 'ci-grid-layer',
        'ci-o1', 'ci-o2', 'ci-o3', 'ci-hl1', 'ci-hl2', 'ci-vl1', 'ci-vl2', 'ci-c1', 'ci-c2', 'ci-c3', 'ci-c4', 'ci-counter', 'ci-replay']
        .forEach(id => { const e = el(id); if (e) { e.style.transition = 'none'; e.style.opacity = '0'; } });
      const pb = el('ci-progress'); if (pb) pb.style.width = '0%';

      // SCENE 1
      setTimeout(() => { setCounter(1, 5); animateScan(); setProgress(20, 2400); fade('ci-scene-tagline', 1, 800, 400); }, 300);
      // SCENE 2
      setTimeout(() => {
        setCounter(2, 5); fade('ci-scene-tagline', 0, 500); setProgress(40, 2400);
        fade('ci-grid-layer', 1, 1200);
        fadeAll(['ci-o1', 'ci-o2', 'ci-o3'], 1, 1500, 200);
        fadeAll(['ci-c1', 'ci-c2', 'ci-c3', 'ci-c4'], 1, 600, 400);
        fadeAll(['ci-hl1', 'ci-hl2'], 1, 800, 600);
        fadeAll(['ci-vl1', 'ci-vl2'], 1, 800, 800);
        globeActive = true; targetScale = 1; targetAlpha = 1;
        animateScan();
      }, 2500);
      // SCENE 3
      setTimeout(() => { setCounter(3, 5); setProgress(60, 4000); fade('ci-scene-title', 1, 1000); targetAlpha = 0.35; }, 5000);
      // SCENE 4
      setTimeout(() => {
        setCounter(4, 5); setProgress(80, 3000); fade('ci-scene-title', 0, 600); targetAlpha = 0.7;
        setTimeout(() => fade('ci-scene-features', 1, 800), 700);
        animateScan();
      }, 9000);
      // SCENE 5
      setTimeout(() => {
        setCounter(5, 5); setProgress(100, 4500); fade('ci-scene-features', 0, 500);
        targetScale = 1.1; targetAlpha = 0.2;
        setTimeout(() => fade('ci-scene-logo', 1, 1200), 600);
        fadeAll(['ci-hl1', 'ci-hl2', 'ci-vl1', 'ci-vl2'], 0, 600, 200);
      }, 12500);
      // END
      setTimeout(() => { fade('ci-replay', 1, 800); runningRef.current = false; }, 17000);
    }

    mainLoop();
    setTimeout(runIntro, 400);

    const replayEl = el('ci-replay');
    const replayHandler = () => {
      if (runningRef.current) return;
      fade('ci-replay', 0, 300);
      setTimeout(runIntro, 400);
    };
    replayEl?.addEventListener('click', replayHandler);

    const stageHandler = () => {
      if (!runningRef.current && parseFloat(replayEl?.style.opacity || '0') < 0.5) {
        runIntro();
      }
    };
    stage?.addEventListener('click', stageHandler);

    const resizeHandler = () => resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      cancelAnimationFrame(animRef.current);
      replayEl?.removeEventListener('click', replayHandler);
      stage?.removeEventListener('click', stageHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const stageStyle: React.CSSProperties = {
    width: '100%', height: '600px', background: '#000', position: 'relative',
    overflow: 'hidden', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif",
    borderRadius: '8px',
  };

  return (
    <div ref={stageRef} style={stageStyle}>
      <div id="ci-grid-layer" style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 1s' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs><pattern id="cig" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#c9a84c" strokeWidth="0.4" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#cig)" />
        </svg>
      </div>

      <div className="ci-orb" id="ci-o1" style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', opacity: 0, transition: 'opacity 2s', width: 500, height: 500, background: 'rgba(201,168,76,0.12)', top: '-10%', left: '-10%' }} />
      <div className="ci-orb" id="ci-o2" style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', opacity: 0, transition: 'opacity 2s', width: 400, height: 400, background: 'rgba(100,180,220,0.08)', top: '20%', right: '-8%' }} />
      <div className="ci-orb" id="ci-o3" style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', opacity: 0, transition: 'opacity 2s', width: 300, height: 300, background: 'rgba(180,100,200,0.07)', bottom: '0%', left: '30%' }} />

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div id="ci-scanline" style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent)', top: -2, opacity: 0 }} />

      <div className="ci-h-line" id="ci-hl1" style={{ position: 'absolute', height: '0.5px', background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)', opacity: 0, top: 80, left: '10%', right: '10%' }} />
      <div className="ci-h-line" id="ci-hl2" style={{ position: 'absolute', height: '0.5px', background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)', opacity: 0, bottom: 80, left: '10%', right: '10%' }} />
      <div className="ci-v-line" id="ci-vl1" style={{ position: 'absolute', width: '0.5px', background: 'linear-gradient(180deg,transparent,rgba(201,168,76,0.3),transparent)', opacity: 0, left: 80, top: '10%', bottom: '10%' }} />
      <div className="ci-v-line" id="ci-vl2" style={{ position: 'absolute', width: '0.5px', background: 'linear-gradient(180deg,transparent,rgba(201,168,76,0.3),transparent)', opacity: 0, right: 80, top: '10%', bottom: '10%' }} />

      <div id="ci-c1" style={{ position: 'absolute', width: 20, height: 20, opacity: 0, top: 16, left: 16, borderTop: '0.5px solid #c9a84c', borderLeft: '0.5px solid #c9a84c' }} />
      <div id="ci-c2" style={{ position: 'absolute', width: 20, height: 20, opacity: 0, top: 16, right: 16, borderTop: '0.5px solid #c9a84c', borderRight: '0.5px solid #c9a84c' }} />
      <div id="ci-c3" style={{ position: 'absolute', width: 20, height: 20, opacity: 0, bottom: 16, left: 16, borderBottom: '0.5px solid #c9a84c', borderLeft: '0.5px solid #c9a84c' }} />
      <div id="ci-c4" style={{ position: 'absolute', width: 20, height: 20, opacity: 0, bottom: 16, right: 16, borderBottom: '0.5px solid #c9a84c', borderRight: '0.5px solid #c9a84c' }} />

      <div id="ci-scene-tagline" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(201,168,76,0.7)', opacity: 0, whiteSpace: 'nowrap' }}>
        AI · HERITAGE · TOURISM · INDIA
      </div>

      <div id="ci-scene-title" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: 0 }}>
        <span style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontStyle: 'italic', fontWeight: 800, fontSize: 72, color: '#f0ece4', lineHeight: 0.9, letterSpacing: '-0.01em' }}>Discover</span>
        <span style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 64, color: 'transparent', WebkitTextStroke: '1.5px #c9a84c', letterSpacing: '0.06em', lineHeight: 1 }}>HERITAGE</span>
        <span style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', color: '#c9a84c', marginTop: 18 }}>AN AI-POWERED CULTURAL TOURISM PLATFORM</span>
      </div>

      <div id="ci-scene-logo" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '0.5px solid rgba(201,168,76,0.4)', animation: 'ci-spin 8s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '0.5px solid rgba(201,168,76,0.2)', animation: 'ci-spin 5s linear infinite reverse' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#c9a84c', position: 'relative', zIndex: 2 }} />
        </div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 800, letterSpacing: '0.24em', color: '#f0ece4' }}>BHARATLENS</div>
        <div style={{ fontSize: 9, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.28em', color: '#c9a84c', marginTop: 8 }}>EXPLORE · TRANSLATE · DISCOVER</div>
      </div>

      <div id="ci-scene-features" style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0, opacity: 0 }}>
        {[
          { label: 'AR', value: 'TRANSLATION' },
          { label: 'AI', value: 'TRIP PLANNER' },
          { label: '3D', value: 'VIRTUAL TOURS' },
          { label: '40+', value: 'LANGUAGES' },
          { label: '100%', value: 'OFFLINE' },
        ].map((f, i) => (
          <div key={i} style={{ fontSize: 9, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(240,236,228,0.45)', padding: '8px 20px', borderRight: i < 4 ? '0.5px solid rgba(201,168,76,0.2)' : 'none' }}>
            <span style={{ color: '#c9a84c' }}>{f.label}</span> {f.value}
          </div>
        ))}
      </div>

      <div id="ci-counter" style={{ position: 'absolute', top: 22, right: 24, fontSize: 9, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(201,168,76,0.35)', opacity: 0 }}>00 / 05</div>
      <div id="ci-progress" style={{ position: 'absolute', bottom: 0, left: 0, height: 1, background: '#c9a84c', width: '0%', transition: 'width linear', opacity: 0.5 }} />
      <button id="ci-replay" style={{ position: 'absolute', bottom: 20, right: 24, fontSize: 9, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(201,168,76,0.5)', background: 'transparent', border: '0.5px solid rgba(201,168,76,0.3)', padding: '7px 16px', cursor: 'pointer', opacity: 0, transition: 'all 0.3s' }}>
        ↺ REPLAY
      </button>

      <style>{`@keyframes ci-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
