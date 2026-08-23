import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, MessageSquare, Utensils, HeartHandshake, MapPin, Clock, Sparkles } from 'lucide-react';

export default function DirectChatModal() {
  const { activeChatDonation, setActiveChatDonation, currentUser, chatMessages, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const donation = activeChatDonation;

  // Auto-scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatDonation]);

  if (!donation) return null;

  const currentThread = chatMessages[donation.id] || [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(donation.id, inputText);
    setInputText('');
  };

  const handleQuickChip = (text) => {
    sendChatMessage(donation.id, text);
  };

  const isDonor = currentUser?.role === 'DONOR';

  const quickChips = isDonor ? [
    "✅ Food is packed in stainless steel containers.",
    "🚪 Please come to the back delivery gate.",
    "📦 We have extra disposable boxes ready."
  ] : [
    "🚚 Our rescue van is on the way (ETA ~8 mins).",
    "📍 Volunteer driver has arrived at your location.",
    "🙏 Thank you for this generous donation!"
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 560,
        height: '85vh',
        maxHeight: 680,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #cbd5e1',
        overflow: 'hidden'
      }}>
        
        {/* Chat Header */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: isDonor ? '#0284c7' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18
            }}>
              {isDonor ? '🤝' : '🏢'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {isDonor ? (donation.matchedNgoName || 'Connected Shelter') : donation.donorName}
                </h3>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 6px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  borderRadius: 6
                }}>
                  CONNECTED
                </span>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                Order #{donation.id} • {donation.quantity} Meals ({donation.foodType})
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveChatDonation(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Order Details Strip */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#475569'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} className="text-rose-500" />
            <span style={{ fontWeight: 600 }}>Pickup: {donation.donorAddress}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} className="text-amber-500" />
            <span style={{ fontWeight: 700, color: '#d97706' }}>Safe Time: ~{donation.safeHoursRemaining || 3}h left</span>
          </div>
        </div>

        {/* Messages List Body */}
        <div style={{
          flex: 1,
          padding: '18px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          backgroundColor: '#f1f5f9'
        }}>
          {currentThread.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: '#94a3b8', fontSize: 13 }}>
              <MessageSquare size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p>No messages yet. Send a message to coordinate pickup!</p>
            </div>
          ) : (
            currentThread.map((msg) => {
              const isMine = msg.senderRole === currentUser?.role;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: isMine ? 'flex-end' : 'flex-start'
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>
                    {msg.senderName} ({msg.senderRole === 'DONOR' ? 'Donor' : 'NGO'})
                  </span>
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      backgroundColor: isMine ? '#10b981' : '#ffffff',
                      color: isMine ? '#ffffff' : '#0f172a',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      fontSize: 13,
                      lineHeight: 1.4,
                      border: isMine ? 'none' : '1px solid #cbd5e1'
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Chips */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '8px 16px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>⚡ Quick:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickChip(chip)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '4px 10px',
                borderRadius: 9999,
                cursor: 'pointer',
                color: '#334155',
                flexShrink: 0
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <input
            type="text"
            placeholder={`Type a message to ${isDonor ? 'NGO' : 'Donor'}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              fontSize: 13
            }}
          >
            <Send size={15} />
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
}
