'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../../../lib/socket';
import Navbar from '../../../components/Navbar';
import AuthControls from '../../../components/AuthControls';
import { Socket } from 'socket.io-client';
import { Users, Send, Info, ChevronLeft, ShieldCheck } from 'lucide-react';

export default function CommunityChat() {
  const { id } = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [community, setCommunity] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLoading(false); return; }
    const user = JSON.parse(stored);
    setCurrentUser(user);

    const s = getSocket(user.id);
    socketRef.current = s;
    s.emit('join_community', id);

    s.on('new_community_message', (data: any) => {
      if (data.communityId === id) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
      }
    });

    fetchCommunity();
    fetchMessages();

    return () => {
      s.emit('leave_community', id);
      s.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchCommunity = async () => {
    try {
      const res = await fetch(`${API}/api/communities/${id}`);
      const data = await res.json();
      setCommunity(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API}/api/communities/${id}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (e) { console.error(e); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !currentUser) return;

    try {
      const res = await fetch(`${API}/api/communities/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, text: newMsg })
      });
      const saved = await res.json();

      socketRef.current?.emit('community_message', {
        ...saved,
        communityId: id
      });

      setNewMsg('');
    } catch (e) { console.error(e); }
  };

  if (!currentUser && !loading) {
    return <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AuthControls /></div>;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 800, letterSpacing: '0.2em' }}>JOINING THE CONVERSATION...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#080808', color: '#fff', fontFamily: "'Outfit', sans-serif", overflow: 'hidden' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
        <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>

      {/* Header */}
      <div style={{ 
        padding: '16px 32px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(20px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => router.push('/communities')} 
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={18} />
          </button>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #c9a84c 0%, #a88b39 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#000' }}>
            {community?.name?.[0]?.toUpperCase() || 'C'}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.01em' }}>{community?.name}</div>
            <div style={{ fontSize: 11, color: '#c9a84c', fontWeight: 700, opacity: 0.8 }}>{community?.interest?.toUpperCase()}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            style={{ 
              background: showSidebar ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)', 
              border: `1px solid ${showSidebar ? '#c9a84c' : 'rgba(255,255,255,0.08)'}`,
              color: showSidebar ? '#c9a84c' : '#fff',
              padding: '8px 16px', borderRadius: 12, fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s'
            }}
          >
            <Users size={14} /> {showSidebar ? 'HIDE MEMBERS' : 'SHOW MEMBERS'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* Chat Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 64, color: 'rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🏛️</div>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.1em' }}>THE FORUM IS EMPTY</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Be the first to share a perspective.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {messages.map((m, i) => {
                  const isMe = m.userId === currentUser?.id || m.user?.id === currentUser?.id;
                  const userName = m.user?.displayName || m.user?.name || 'Explorer';
                  const avatar = m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user?.username || m.userId}`;

                  return (
                    <motion.div 
                      key={m.id || i} 
                      initial={{ opacity: 0, scale: 0.98 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: isMe ? 'row-reverse' : 'row' }}
                    >
                      <img src={avatar} style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} alt="" />
                      <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: isMe ? '#c9a84c' : 'rgba(255,255,255,0.5)', marginBottom: 4, padding: '0 4px', letterSpacing: '0.05em' }}>
                          {userName.toUpperCase()}
                        </div>
                        <div style={{
                          padding: '14px 20px',
                          borderRadius: 20,
                          background: isMe ? '#c9a84c' : 'rgba(255,255,255,0.03)',
                          color: isMe ? '#000' : '#fff',
                          fontSize: 14, fontWeight: 600,
                          lineHeight: 1.6,
                          border: isMe ? 'none' : '1px solid rgba(255,255,255,0.05)',
                          borderTopRightRadius: isMe ? 4 : 20,
                          borderTopLeftRadius: isMe ? 20 : 4,
                          boxShadow: isMe ? '0 10px 20px rgba(201,168,76,0.1)' : 'none'
                        }}>
                          {m.text}
                        </div>
                        <div style={{ fontSize: 9, opacity: 0.3, marginTop: 6, fontWeight: 800 }}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '24px 48px', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '6px 6px 6px 20px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', alignItems: 'center' }}>
              <input 
                placeholder={`Share something with ${community?.name}...`}
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: 14, fontWeight: 500 }}
              />
              <button 
                type="submit" 
                disabled={!newMsg.trim()}
                style={{ 
                  background: newMsg.trim() ? '#c9a84c' : 'rgba(255,255,255,0.05)', 
                  color: '#000', border: 'none', 
                  width: 44, height: 44, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: newMsg.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Members Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              style={{ 
                background: 'rgba(10,10,10,0.5)',
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(30px)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <Users size={16} color="#c9a84c" />
                  <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', color: '#fff' }}>MEMBERS</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontWeight: 800 }}>
                    {community?.members?.length || 0}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {community?.members?.map((m: any) => (
                    <div key={m.userId} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.9 }}>
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user?.username || m.userId}`} 
                          style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }} 
                          alt="" 
                        />
                        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#4ade80', border: '2px solid #0a0a0a' }}>
                           <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#4ade80', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{m.user?.name}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {m.role === 'CREATOR' && <ShieldCheck size={10} color="#c9a84c" />}
                          {m.role === 'CREATOR' ? 'FOUNDER' : 'EXPLORER'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 48, padding: 20, borderRadius: 16, background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)' }}>
                   <div style={{ fontSize: 11, fontWeight: 900, color: '#c9a84c', marginBottom: 8 }}>ABOUT FORUM</div>
                   <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                     {community?.description || 'A gathering place for those who value the preservation of Indian heritage.'}
                   </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}} />

    </div>
  );
}
