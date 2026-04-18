'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSocket } from '../../../lib/socket';
import Navbar from '../../../components/Navbar';
import AuthControls from '../../../components/AuthControls';
import { Socket } from 'socket.io-client';

export default function CommunityChat() {
  const { id } = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [community, setCommunity] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLoading(false); return; }
    const user = JSON.parse(stored);
    setCurrentUser(user);

    // Connect socket and join room
    const s = getSocket(user.id);
    socketRef.current = s;
    s.emit('join_community', id);

    s.on('new_community_message', (data: any) => {
      if (data.communityId === id) {
        setMessages(prev => {
          // Prevent duplicates
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
      }
    });

    // Fetch community info + history
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

      // Emit to socket for real-time broadcast
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Header */}
      <div style={{ 
        padding: '20px 32px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.01)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => router.push('/communities')} 
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ←
          </button>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#c9a84c' }}>
            {community?.name?.[0]?.toUpperCase() || 'C'}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>{community?.name || 'Community'}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
              {community?._count?.members || 0} members
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', letterSpacing: '0.1em', background: 'rgba(201,168,76,0.1)', padding: '6px 14px', borderRadius: 20 }}>
          {community?.interest?.toUpperCase()}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: 'rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>No messages yet. Start the conversation!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((m, i) => {
              const isMe = m.userId === currentUser?.id || m.user?.id === currentUser?.id;
              const userName = m.user?.displayName || m.user?.name || 'Explorer';
              const avatar = m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user?.username || m.userId}`;

              return (
                <motion.div 
                  key={m.id || i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', gap: 12, alignItems: isMe ? 'flex-end' : 'flex-start', flexDirection: isMe ? 'row-reverse' : 'row' }}
                >
                  {!isMe && (
                    <img src={avatar} style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} alt="" />
                  )}
                  <div style={{ maxWidth: '65%' }}>
                    {!isMe && (
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#c9a84c', marginBottom: 4, paddingLeft: 4 }}>
                        {userName}
                      </div>
                    )}
                    <div style={{
                      padding: '12px 18px',
                      borderRadius: 20,
                      background: isMe ? '#c9a84c' : 'rgba(255,255,255,0.05)',
                      color: isMe ? '#000' : '#fff',
                      fontSize: 14, fontWeight: 600,
                      borderTopRightRadius: isMe ? 4 : 20,
                      borderTopLeftRadius: isMe ? 20 : 4,
                    }}>
                      {m.text}
                      <div style={{ fontSize: 9, opacity: 0.5, marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} style={{ padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
          <input 
            placeholder={`Message ${community?.name || 'community'}...`}
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '0 16px', outline: 'none', fontSize: 14 }}
          />
          <button 
            type="submit" 
            disabled={!newMsg.trim()}
            style={{ 
              background: newMsg.trim() ? '#c9a84c' : 'rgba(201,168,76,0.3)', 
              color: '#000', border: 'none', 
              padding: '10px 24px', borderRadius: 16, 
              fontWeight: 900, cursor: newMsg.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
