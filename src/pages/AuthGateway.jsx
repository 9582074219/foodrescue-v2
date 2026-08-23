import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_DONORS, DEFAULT_RECEIVERS } from '../data/mockData';
import { Utensils, HeartHandshake, Shield, Sparkles, ArrowRight, CheckCircle2, UserPlus, LogIn, Lock } from 'lucide-react';

export default function AuthGateway() {
  const { loginUser } = useApp();

  const [authMode, setAuthMode] = useState('ROLE_SELECT'); // 'ROLE_SELECT' | 'CUSTOM_REGISTER' | 'ADMIN_AUTH'
  const [selectedRole, setSelectedRole] = useState('DONOR'); // 'DONOR' | 'RECEIVER'
  const [adminPasscode, setAdminPasscode] = useState('');
  
  // Custom Registration Form State
  const [name, setName] = useState('');
  const [categoryLabel, setCategoryLabel] = useState('Banquet & Party Hall');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleCustomRegister = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      role: selectedRole,
      type: selectedRole === 'DONOR' ? 'COMMERCIAL_DONOR' : 'COMMUNITY_SHELTER',
      categoryLabel: categoryLabel,
      address: address.trim() || 'Sector 18, Central City',
      phone: phone.trim() || '+91 98000 11223',
      avatar: selectedRole === 'DONOR' ? '🏢' : '🤝',
      badge: selectedRole === 'DONOR' ? 'Registered Food Partner' : 'Registered Rescue Partner',
      rating: '5.0 ★ (New Partner)',
      dailyPrepared: 400,
      expectedDemand: 320,
      predictedSurplus: 80,
      currentNeedMeals: 100,
      pickupAvailable: true
    };

    loginUser(newUser);
  };

  const handleAdminLogin = (e) => {
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
      alert('Invalid admin passcode. (Use 1234 or leave empty for demo)');
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 60%, #080c14 100%)',
      color: '#ffffff'
    }}>
      <div style={{ width: '100%', maxWidth: 900 }}>
        
        {/* Main Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 9999,
            color: '#34d399',
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 16
          }}>
            <Sparkles size={16} />
            <span>AUTHENTICATION & ROLE SELECTION GATEWAY</span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Welcome to <span style={{ color: '#10b981' }}>FoodRescue V2</span>
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', marginTop: 8, maxWidth: 620, margin: '8px auto 0' }}>
            Select your account type below to enter your dedicated operational portal:
          </p>
        </div>

        {authMode === 'ROLE_SELECT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* DUAL ROLE CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              
              {/* 1. DONOR ROLE CARD */}
              <div
                className="card-hover-effect"
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: 22,
                  border: '2px solid #334155',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                  }}>
                    🏢
                  </div>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc' }}>I am a Food Donor</h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Banquet Halls, Restaurants, Canteens & Events</p>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
                  • 🔮 AI Surplus Prediction Engine<br />
                  • 🍱 List surplus food & broadcast to nearby NGOs<br />
                  • 💬 Direct real-time chat with accepting shelter<br />
                  • 📜 Downloadable 80G Tax Exemption Certificate
                </div>

                {/* 1-Click Quick Demo Donors */}
                <div style={{ borderTop: '1px solid #334155', paddingTop: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    ⚡ 1-Click Demo Profiles:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                    {DEFAULT_DONORS.slice(0, 3).map((donor) => (
                      <button
                        key={donor.id}
                        type="button"
                        onClick={() => loginUser(donor)}
                        style={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: 10,
                          padding: '10px 14px',
                          color: '#f8fafc',
                          fontSize: 13,
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
                        <ArrowRight size={14} className="text-emerald-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedRole('DONOR'); setAuthMode('CUSTOM_REGISTER'); }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: 13, marginTop: 6 }}
                >
                  <UserPlus size={16} />
                  <span>Register New Donor Profile</span>
                </button>
              </div>

              {/* 2. NGO ROLE CARD */}
              <div
                className="card-hover-effect"
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: 22,
                  border: '2px solid #334155',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: 'rgba(2, 132, 199, 0.2)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                  }}>
                    🤝
                  </div>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc' }}>I am an NGO / Shelter</h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Night Shelters, Food Banks & Volunteers</p>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
                  • 📡 Live nearby inbound surplus food stream<br />
                  • ⚡ 1-Click Accept & Lock donation<br />
                  • 💬 Direct real-time chat with Donor<br />
                  • ✓ Mark "Collected" & "Distributed to Needy"
                </div>

                {/* 1-Click Quick Demo NGOs */}
                <div style={{ borderTop: '1px solid #334155', paddingTop: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    ⚡ 1-Click Demo Profiles:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                    {DEFAULT_RECEIVERS.map((ngo) => (
                      <button
                        key={ngo.id}
                        type="button"
                        onClick={() => loginUser(ngo)}
                        style={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: 10,
                          padding: '10px 14px',
                          color: '#f8fafc',
                          fontSize: 13,
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
                        <ArrowRight size={14} className="text-sky-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedRole('RECEIVER'); setAuthMode('CUSTOM_REGISTER'); }}
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 6
                  }}
                >
                  <UserPlus size={16} />
                  <span>Register New NGO / Shelter</span>
                </button>
              </div>

            </div>

            {/* Municipal Admin Link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: 20 }}>
              <button
                type="button"
                onClick={() => setAuthMode('ADMIN_AUTH')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Shield size={15} className="text-amber-400" />
                <span>Municipal City Administration Access & Audit Logs ➔</span>
              </button>
            </div>

          </div>
        )}

        {/* CUSTOM REGISTRATION SCREEN */}
        {authMode === 'CUSTOM_REGISTER' && (
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: 22,
            border: '1px solid #334155',
            padding: '32px',
            maxWidth: 540,
            margin: '0 auto'
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', marginBottom: 6 }}>
              Register as {selectedRole === 'DONOR' ? '🏢 Food Donor' : '🤝 NGO / Shelter'}
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
              Create your profile to start donating or receiving surplus food.
            </p>

            <form onSubmit={handleCustomRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Organization / Venue Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'DONOR' ? 'e.g. Royal Grand Palace' : 'e.g. Seva Food Bank'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Category Type
                </label>
                <input
                  type="text"
                  value={categoryLabel}
                  onChange={(e) => setCategoryLabel(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Address / City Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sector 18 Market, Main Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98000 11223"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setAuthMode('ROLE_SELECT')}
                  className="btn-secondary"
                  style={{ flex: 1, backgroundColor: '#0f172a', color: '#f1f5f9', borderColor: '#334155' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2 }}
                >
                  Create & Enter Dashboard
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ADMIN AUTH SCREEN */}
        {authMode === 'ADMIN_AUTH' && (
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: 22,
            border: '1px solid #334155',
            padding: '32px',
            maxWidth: 420,
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <Shield size={40} className="text-amber-400" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', marginBottom: 6 }}>
              Municipal Administration Login
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
              Enter City Admin Passcode (Demo: 1234 or leave blank)
            </p>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                type="password"
                placeholder="Enter Passcode..."
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 14, textAlign: 'center', letterSpacing: '0.2em' }}
              />

              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setAuthMode('ROLE_SELECT')}
                  className="btn-secondary"
                  style={{ flex: 1, backgroundColor: '#0f172a', color: '#f1f5f9', borderColor: '#334155' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-amber"
                  style={{ flex: 2 }}
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
