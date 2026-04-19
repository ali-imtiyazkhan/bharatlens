'use client';

export default function StudioBackground() {
  return (
    <>
      {/* Grid Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.04,
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Orbs */}
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      {/* Styles for animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        .orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
          animation: drift 9s ease-in-out infinite;
          z-index: 0;
        }
        .orb1 { width: 360px; height: 360px; background: rgba(201,168,76,0.06); top: 5%; left: -8%; animation-delay: 0s; }
        .orb2 { width: 300px; height: 300px; background: rgba(125,212,176,0.05); top: 8%; right: -5%; animation-delay: 3.5s; }
        .orb3 { width: 220px; height: 220px; background: rgba(180,120,200,0.04); bottom: 14%; left: 16%; animation-delay: 6s; }
        
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(18px, -18px) scale(1.04); }
        }

        @media (max-width: 768px) {
          .orb1 { width: 200px; height: 200px; top: 10%; left: -10%; }
          .orb2 { width: 150px; height: 150px; top: 5%; right: -10%; }
          .orb3 { width: 120px; height: 120px; bottom: 10%; left: 5%; }
          .orb { filter: blur(60px); }
        }
      `}} />
    </>
  );
}
