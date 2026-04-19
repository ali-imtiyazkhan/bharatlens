'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE } from '../../lib/api-config';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.2fr', background: '#080808', overflow: 'hidden' }}>
      
      {/* Form Side */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 64, position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ maxWidth: 400, width: '100%' }}
        >
          <div style={{ marginBottom: 48 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
              <div style={{ width: 32, height: 32, border: '1px solid #c9a84c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 14, height: 14, border: '1px solid #c9a84c', borderRadius: '50%' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#c9a84c', letterSpacing: '0.2em' }}>BHARATLENS</span>
            </Link>
            
            <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', marginBottom: 16 }}>Welcome Back</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, lineHeight: 1.6 }}>Continue your exploration of India's living history via the AI Lens.</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '16px', borderRadius: 12, marginBottom: 24, fontSize: 13, fontWeight: 700 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@bharatlens.com"
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', color: '#fff', outline: 'none', transition: 'all 0.3s' }}
                className="auth-input"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
                <a href="#" style={{ fontSize: 10, color: '#c9a84c', textDecoration: 'none', fontWeight: 800 }}>FORGOT?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', color: '#fff', outline: 'none' }}
                className="auth-input"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '18px', background: '#c9a84c', color: '#000', borderRadius: 12, border: 'none', fontWeight: 900, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>SIGN IN <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ marginTop: 40, fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
            New to the Lens? <Link href="/signup" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 800 }}>Create an account</Link>
          </p>
        </motion.div>
      </div>

      {/* Visual Side */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img 
            src="/auth-bg.png" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            alt="Heritage Visual" 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #080808 0%, transparent 40%, rgba(0,0,0,0.3) 100%)' }} />
        </motion.div>

        <div style={{ position: 'absolute', bottom: 80, left: 80, right: 80, zIndex: 20 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{ width: 40, height: 2, background: '#c9a84c', marginBottom: 24 }} />
            <p style={{ fontSize: 32, fontWeight: 300, color: '#fff', lineHeight: 1.4, fontStyle: 'italic', marginBottom: 32, maxWidth: 600 }}>
              "A nation's culture resides in the hearts and in the soul of its people."
            </p>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              — MAHATMA GANDHI
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .auth-input:focus {
          border-color: #c9a84c !important;
          background: rgba(255,255,255,0.05) !important;
          box-shadow: 0 0 20px rgba(201,168,76,0.1);
        }
        @media (max-width: 900px) {
          div { grid-template-columns: 1fr !important; }
          div:last-child { display: none !important; }
        }
      `}} />
    </div>
  );
}
