'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../../lib/socket';
import Navbar from '../../components/Navbar';
import AuthControls from '../../components/AuthControls';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inbox, setInbox] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);
      const s = getSocket(user.id);
      setSocket(s);

      s.on('receive_message', (data: any) => {
        if (activeChat && data.senderId === activeChat.user.id) {
          setMessages(prev => [...prev, { ...data, createdAt: new Date().toISOString() }]);
        }
        // Refresh inbox
        fetchInbox(user.id);
      });

      fetchInbox(user.id);

      return () => {
        s.disconnect();
      };
    }
  }, [activeChat?.user?.id]);

  useEffect(() => {
    if (activeChat && currentUser) {
      fetchHistory(currentUser.id, activeChat.user.id);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, messages]);

  const fetchInbox = async (uid: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/inbox/${uid}`);
      const data = await res.json();
      setInbox(data);
    } catch (e) { console.error(e); }
  };

  const fetchHistory = async (id1: string, id2: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/history?me=${id1}&other=${id2}`);
      const data = await res.json();
      setMessages(data);
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    const msgData = {
      senderId: currentUser.id,
      receiverId: activeChat.user.id,
      text: newMessage,
      name: currentUser.name
    };

    // Emit real-time
    socket.emit('send_message', msgData);

    // Save to DB
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      setMessages(prev => [...prev, { ...msgData, createdAt: new Date().toISOString() }]);
      setNewMessage('');
    } catch (e) {
      console.error(e);
    }
  };

  if (!currentUser) return <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AuthControls /></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <Navbar />
      
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', height: 'calc(100vh - 80px)', marginTop: 80 }}>
        
        {/* Sidebar: Conversations */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)', padding: 24, overflowY: 'auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, paddingLeft: 8 }}>Messages</h2>
          
          {/* Search for new chats */}
          <div style={{ marginBottom: 16 }}>
            <input 
              placeholder="Search users to chat..."
              value={searchQuery}
              onChange={async (e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length >= 2) {
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/social/discover`);
                    const users = await res.json();
                    setSearchResults(users.filter((u: any) => 
                      u.id !== currentUser.id && 
                      (u.name?.toLowerCase().includes(e.target.value.toLowerCase()) || u.username?.toLowerCase().includes(e.target.value.toLowerCase()))
                    ));
                  } catch(e) { console.error(e); }
                } else {
                  setSearchResults([]);
                }
              }}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 16px', color: '#fff', outline: 'none', fontSize: 13 }}
            />
            {searchResults.length > 0 && (
              <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, marginTop: 4, overflow: 'hidden' }}>
                {searchResults.slice(0, 5).map((u: any) => (
                  <button 
                    key={u.id}
                    onClick={() => {
                      setActiveChat({ user: u, lastMessage: '' });
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  >
                    <img src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} style={{ width: 32, height: 32, borderRadius: '50%' }} alt="" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{u.displayName || u.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>@{u.username}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {inbox.map((conv, i) => (
              <button 
                key={i}
                onClick={() => setActiveChat(conv)}
                style={{ 
                  display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 16, 
                  background: activeChat?.user?.id === conv.user.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.2s'
                }}
              >
                <img src={conv.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.user.username}`} style={{ width: 44, height: 44, borderRadius: '50%' }} alt={conv.user.name} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{conv.user.displayName || conv.user.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
          {activeChat ? (
            <>
              {/* Header */}
              <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <img src={activeChat.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.user.username}`} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900 }}>{activeChat.user.displayName || activeChat.user.name}</div>
                  <div style={{ fontSize: 10, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>Online Explorer</div>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {messages.map((m, i) => {
                    const isMe = m.senderId === currentUser.id;
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ 
                          maxWidth: '60%', padding: '12px 18px', borderRadius: 20,
                          background: isMe ? '#c9a84c' : 'rgba(255,255,255,0.05)',
                          color: isMe ? '#000' : '#fff',
                          fontSize: 14, fontWeight: 600,
                          borderTopRightRadius: isMe ? 4 : 20,
                          borderTopLeftRadius: isMe ? 20 : 4,
                          boxShadow: isMe ? '0 4px 20px rgba(201,168,76,0.2)' : 'none'
                        }}>
                          {m.text}
                          <div style={{ fontSize: 9, opacity: 0.5, marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} style={{ padding: 32, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <input 
                    placeholder="Message explorer..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '0 16px', outline: 'none', fontSize: 14 }}
                  />
                  <button type="submit" style={{ background: '#c9a84c', color: '#000', border: 'none', padding: '10px 24px', borderRadius: 16, fontWeight: 900, cursor: 'pointer' }}>
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, opacity: 0.3 }}>
              <div style={{ fontSize: 64 }}>💬</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Select a conversation to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
