import React from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, HeartHandshake, Shield, LogOut, MessageSquare, Sparkles, User, Award } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logoutUser, activeChatDonation, setActiveChatDonation, donations, openCertificate } = useApp();

  // Find any active donation in ACCEPTED or COLLECTED state to allow opening chat from Navbar
  const activeChatOrder = donations.find(d => 
    (d.status === 'ACCEPTED' || d.status === 'COLLECTED') &&
    (currentUser?.role === 'DONOR' ? d.donorId === currentUser.id : d.matchedNgoId === currentUser?.id)
  );

  return (
    <header style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e293b',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      color: '#ffffff'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        gap: 16
      }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => {}}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Utensils size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                FoodRescue <span style={{ color: '#10b981' }}>V2</span>
              </span>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: 6, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                AI REALTIME
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
              Smart Surplus Prediction & Direct NGO Redistribution
            </p>
          </div>
        </div>

        {/* User Role Badge & Actions */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            
            {/* Active Chat Quick Button */}
            {activeChatOrder && (
              <button
                onClick={() => setActiveChatDonation(activeChatOrder)}
                className="pulse-urgent"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '7px 14px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 0 12px rgba(2, 132, 199, 0.5)'
                }}
              >
                <MessageSquare size={14} />
                <span>Live Chat Active (#{activeChatOrder.id})</span>
              </button>
            )}

            {/* Profile Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#1e293b',
              padding: '6px 14px',
              borderRadius: 12,
              border: '1px solid #334155'
            }}>
              <span style={{ fontSize: 18 }}>{currentUser.avatar || (currentUser.role === 'DONOR' ? '🏢' : currentUser.role === 'RECEIVER' ? '🤝' : '🛡️')}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: currentUser.role === 'DONOR' ? '#34d399' : currentUser.role === 'RECEIVER' ? '#38bdf8' : '#f59e0b' }}>
                  {currentUser.role === 'DONOR' ? 'FOOD DONOR' : currentUser.role === 'RECEIVER' ? 'VERIFIED NGO' : 'MUNICIPAL ADMIN'}
                </div>
              </div>
            </div>

            {/* Log Out Button */}
            <button
              onClick={logoutUser}
              className="btn-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#f1f5f9',
                borderColor: '#475569',
                padding: '8px 14px',
                fontSize: 12,
                borderRadius: 10
              }}
              title="Log Out"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span>Real-Time Network Active</span>
          </div>
        )}

      </div>
    </header>
  );
}
