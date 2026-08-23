import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_DONORS, DEFAULT_RECEIVERS } from '../data/mockData';
import { Utensils, HeartHandshake, Shield, Sparkles, ArrowRight, UserPlus, LogIn, Lock, CheckCircle2 } from 'lucide-react';

export default function AuthGateway() {
  const { loginUser } = useApp();

  const [activeTab, setActiveTab] = useState('DONOR'); // 'DONOR' | 'NGO' | 'ADMIN'
  
  // Donor Login/Register Form State
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorAddress, setDonorAddress] = useState('');

  // NGO Login/Register Form State
  const [ngoName, setNgoName] = useState('');
  const [ngoPhone, setNgoPhone] = useState('');
  const [ngoAddress, setNgoAddress] = useState('');

  // Admin Passcode State
  const [adminPasscode, setAdminPasscode] = useState('');

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

  // 3. Handle Admin Login
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminPasscode === '1234' || adminPasscode === 'admin' || adminPasscode === '') {
      loginUser({
        id: 'admin_municipal',
        name: 'Municipal Food Welfare & Zero-Waste Authority',
        role: 'ADMIN',
        badge: 'City Administration Command',
        avatar: '🛡️'
      });
    } else {
      alert('Invalid admin passcode. (Default: 1234)');
    }
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
      <div style={{ width: '100%', maxWidth: 780 }}>
        
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
            Select your account type to login or register:
          </p>
        </div>

        {/* 3-TAB ROLE SWITCHER */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: 16,
          padding: 6,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
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
              fontSize: 14,
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
              fontSize: 14,
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

          <button
            type="button"
            onClick={() => setActiveTab('ADMIN')}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: activeTab === 'ADMIN' ? '#f59e0b' : 'transparent',
              color: activeTab === 'ADMIN' ? '#0f172a' : '#94a3b8',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <span>🛡️ City Admin</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                🏢
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', margin: 0 }}>Food Donor Portal</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Enter your name and contact details to proceed</p>
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
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                    Address / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 29, Main Road"
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: 14, marginTop: 6 }}
              >
                <LogIn size={16} />
                <span>Enter Donor Portal ➔</span>
              </button>
            </form>

            {/* Quick Sign-In with Verified Donor Accounts */}
            <div style={{ borderTop: '1px solid #334155', marginTop: 22, paddingTop: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ⚡ Quick Sign-in (Verified Accounts):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginTop: 10 }}>
                {DEFAULT_DONORS.map((donor) => (
                  <button
                    key={donor.id}
                    type="button"
                    onClick={() => loginUser(donor)}
                    style={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: 10,
                      padding: '10px 12px',
                      color: '#f8fafc',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                    className="card-hover-effect"
                  >
                    <span>{donor.avatar} {donor.name}</span>
                    <ArrowRight size={13} className="text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                🤝
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', margin: 0 }}>NGO & Shelter Portal</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Register or login your food bank / shelter</p>
              </div>
            </div>

            <form onSubmit={handleNgoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  NGO / Shelter / Foundation Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hope Shelter & Food Bank"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={ngoPhone}
                    onChange={(e) => setNgoPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                    Shelter Location Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ring Road Shelter Complex"
                    value={ngoAddress}
                    onChange={(e) => setNgoAddress(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '13px',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 6
                }}
              >
                <LogIn size={16} />
                <span>Enter NGO Portal ➔</span>
              </button>
            </form>

            {/* Quick Sign-In with Verified NGO Accounts */}
            <div style={{ borderTop: '1px solid #334155', marginTop: 22, paddingTop: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ⚡ Quick Sign-in (Verified NGO Accounts):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginTop: 10 }}>
                {DEFAULT_RECEIVERS.map((ngo) => (
                  <button
                    key={ngo.id}
                    type="button"
                    onClick={() => loginUser(ngo)}
                    style={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: 10,
                      padding: '10px 12px',
                      color: '#f8fafc',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                    className="card-hover-effect"
                  >
                    <span>🤝 {ngo.name}</span>
                    <ArrowRight size={13} className="text-sky-400" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3. MUNICIPAL ADMIN LOGIN CARD */}
        {activeTab === 'ADMIN' && (
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: 22,
            border: '2px solid #334155',
            padding: '30px',
            maxWidth: 480,
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <Shield size={42} className="text-amber-400" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', marginBottom: 6 }}>
              Municipal City Administration
            </h3>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
              Enter City Admin Passcode (Default: 1234 or leave blank)
            </p>

            <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                type="password"
                placeholder="Passcode: 1234"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14, textAlign: 'center', letterSpacing: '0.2em' }}
              />

              <button
                type="submit"
                className="btn-amber"
                style={{ width: '100%', padding: '12px', fontSize: 14, borderRadius: 10 }}
              >
                <Lock size={15} />
                <span>Verify & Enter Operations Hub</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
