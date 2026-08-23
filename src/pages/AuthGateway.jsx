import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, HeartHandshake, Sparkles, LogIn } from 'lucide-react';

export default function AuthGateway() {
  const { loginUser } = useApp();

  const [activeTab, setActiveTab] = useState('DONOR'); // 'DONOR' | 'NGO'
  
  // Donor Login/Register Form State
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorAddress, setDonorAddress] = useState('');

  // NGO Login/Register Form State
  const [ngoName, setNgoName] = useState('');
  const [ngoPhone, setNgoPhone] = useState('');
  const [ngoAddress, setNgoAddress] = useState('');

  // 1. Handle Donor Sign-In / Register
  const handleDonorSubmit = (e) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPhone.trim()) return;

    const donorUser = {
      id: `donor_${Date.now()}`,
      name: donorName.trim(),
      role: 'DONOR',
      phone: donorPhone.trim(),
      address: donorAddress.trim() || 'Main City Area',
      avatar: '🏢',
      badge: 'Verified Food Partner',
      rating: '5.0 ★',
      dailyPrepared: 500,
      expectedDemand: 380,
      predictedSurplus: 120
    };

    loginUser(donorUser);
  };

  // 2. Handle NGO Sign-In / Register
  const handleNgoSubmit = (e) => {
    e.preventDefault();
    if (!ngoName.trim() || !ngoPhone.trim()) return;

    const ngoUser = {
      id: `ngo_${Date.now()}`,
      name: ngoName.trim(),
      role: 'RECEIVER',
      phone: ngoPhone.trim(),
      address: ngoAddress.trim() || 'Shelter Complex, Ward 4',
      avatar: '🤝',
      badge: 'Verified Rescue Partner',
      rating: '5.0 ★',
      currentNeedMeals: 120,
      pickupAvailable: true,
      pickupFleet: 'Dedicated Rescue Fleet'
    };

    loginUser(ngoUser);
  };

  return (
    <div style={{
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 60%, #080c14 100%)',
      color: '#ffffff'
    }}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 9999,
            color: '#34d399',
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 14
          }}>
            <Sparkles size={16} />
            <span>AI-POWERED SURPLUS REDISTRIBUTION PLATFORM</span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Welcome to <span style={{ color: '#10b981' }}>FoodRescue V2</span>
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', marginTop: 6 }}>
            Select your portal to login or register:
          </p>
        </div>

        {/* 2-TAB ROLE SWITCHER */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: 16,
          padding: 6,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          marginBottom: 24,
          border: '1px solid #334155'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('DONOR')}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: activeTab === 'DONOR' ? '#10b981' : 'transparent',
              color: activeTab === 'DONOR' ? '#ffffff' : '#94a3b8',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <span>🏢 Food Donor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('NGO')}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: activeTab === 'NGO' ? '#0284c7' : 'transparent',
              color: activeTab === 'NGO' ? '#ffffff' : '#94a3b8',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <span>🤝 NGO / Shelter</span>
          </button>
        </div>

        {/* 1. FOOD DONOR LOGIN / REGISTER CARD */}
        {activeTab === 'DONOR' && (
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: 22,
            border: '2px solid #334155',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                🏢
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', margin: 0 }}>Food Donor Portal</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Enter your details to donate surplus food</p>
              </div>
            </div>

            <form onSubmit={handleDonorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98220 54321"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Address / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 29, Main City Area"
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 8 }}
              >
                <LogIn size={17} />
                <span>Enter Donor Portal ➔</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. NGO / SHELTER LOGIN / REGISTER CARD */}
        {activeTab === 'NGO' && (
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: 22,
            border: '2px solid #334155',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                🤝
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', margin: 0 }}>NGO & Shelter Portal</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Login or register your shelter to receive food</p>
              </div>
            </div>

            <form onSubmit={handleNgoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  NGO / Shelter Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hope Shelter & Food Bank"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={ngoPhone}
                  onChange={(e) => setNgoPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Address / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ring Road Shelter Complex, Ward 4"
                  value={ngoAddress}
                  onChange={(e) => setNgoAddress(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '13px',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 8
                }}
              >
                <LogIn size={17} />
                <span>Enter NGO Portal ➔</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
