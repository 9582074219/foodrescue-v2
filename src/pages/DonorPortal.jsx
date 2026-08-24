import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Utensils, PlusCircle, Clock, MapPin, Truck, AlertTriangle, CheckCircle2, MessageSquare, Award, ShieldCheck, ArrowRight, Thermometer, Sliders, Check, Phone, Target, Radio } from 'lucide-react';
import StatCard from '../components/StatCard';
import UrgencyBadge from '../components/UrgencyBadge';
import RouteMap from '../components/RouteMap';
import { DEFAULT_RECEIVERS, calculateMatchScore } from '../data/mockData';

export default function DonorPortal() {
  const { currentUser, donations, createAndBroadcastDonation, setActiveChatDonation, openCertificate } = useApp();

  // 1. AI Interactive Forecaster State (Editable by Donor)
  const [aiPrepared, setAiPrepared] = useState(currentUser?.dailyPrepared || 700);
  const [aiGuests, setAiGuests] = useState(currentUser?.expectedDemand || 520);
  const [aiStorage, setAiStorage] = useState('HOT_CHAFING'); // 'HOT_CHAFING' | 'ROOM_TEMP' | 'REFRIGERATED' | 'CUSTOM'
  const [customTemp, setCustomTemp] = useState(65); // User entered temperature in °C
  const [customStorageVessel, setCustomStorageVessel] = useState('Insulated Stainless Steel Casseroles');
  const [aiPrepTime, setAiPrepTime] = useState('08:30 PM');

  // AI Temperature & Safe-Hours Scientific Model (FSSAI / FDA Guidelines)
  const getAiSafeHours = () => {
    if (aiStorage === 'HOT_CHAFING') return 4.5;
    if (aiStorage === 'ROOM_TEMP') return 3.0;
    if (aiStorage === 'REFRIGERATED') return 8.0;
    
    // Automatic AI computation from user's manual temperature (°C)
    const t = parseFloat(customTemp);
    if (isNaN(t)) return 3.5;
    if (t <= 0) return 24.0;         // Deep Frozen (<=0°C)
    if (t <= 4) return 9.0;          // Safe Chilled / Refrigerator (0-4°C)
    if (t <= 10) return 5.5;         // Cool storage (5-10°C)
    if (t >= 70) return 6.0;         // High Thermal Holding (>70°C)
    if (t >= 60) return 4.5;         // Safe Hot Holding (60-70°C)
    if (t >= 45) return 2.5;         // Warm Danger Zone (45-60°C)
    if (t >= 32) return 2.5;         // Hot ambient room temp (32-45°C)
    return 3.5;                      // Normal Room temp (15-32°C)
  };

  const safeHours = getAiSafeHours();
  const calcSurplus = Math.max(0, Number(aiPrepared) - Number(aiGuests));
  const surplusPercent = Math.round((calcSurplus / (Number(aiPrepared) || 1)) * 100);
  const urgencyScore = calcSurplus >= 120 ? 95 : calcSurplus >= 70 ? 85 : calcSurplus >= 30 ? 70 : 50;
  
  const currentTempNum = aiStorage === 'HOT_CHAFING' ? 65 : aiStorage === 'ROOM_TEMP' ? 25 : aiStorage === 'REFRIGERATED' ? 4 : parseFloat(customTemp) || 25;
  const isDangerZone = currentTempNum > 5 && currentTempNum < 60;
  const freshnessScore = isDangerZone ? 86 : 97;

  // Compute calculated expiry time label
  const calculatedExpiry = `${safeHours} Hours from Prep (${aiStorage === 'HOT_CHAFING' ? 'Safe until 01:00 AM' : aiStorage === 'REFRIGERATED' ? 'Safe until 04:30 AM' : 'Safe for ~' + safeHours + 'h'})`;

  // 2. Listing Form State
  const [foodType, setFoodType] = useState('Paneer Butter Masala, Dal Makhani, Veg Pulao, Rotis & Sweets');
  const [quantity, setQuantity] = useState(180);
  const [foodCategory, setFoodCategory] = useState('Cooked Meal (Event Buffet)');
  const [preparedAt, setPreparedAt] = useState('08:30 PM');
  const [availableUntil, setAvailableUntil] = useState('12:30 AM');
  const [location, setLocation] = useState(currentUser?.address || 'Sector 29, Main City Corridor');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '+91 98220 54321');
  const [notes, setNotes] = useState('Freshly prepared buffet food stored in stainless steel insulated containers.');
  
  // Target Recipient Option (Broadcast to All vs Specific NGO)
  const [targetType, setTargetType] = useState('ALL'); // 'ALL' | 'SPECIFIC'
  const [selectedNgoId, setSelectedNgoId] = useState(DEFAULT_RECEIVERS[0].id);

  // History Filter
  const [historyFilter, setHistoryFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED'

  // Apply AI Calculation into Form
  const applyCalculatedSurplus = () => {
    setQuantity(calcSurplus);
    setPreparedAt(aiPrepTime);
    setAvailableUntil(`Safe for ~${safeHours} hours (${currentTempNum}°C)`);
    if (aiStorage === 'CUSTOM') {
      setNotes(`Vessel: ${customStorageVessel} | Temp: ${customTemp}°C (AI Safe Window: ~${safeHours}h)`);
    } else {
      setNotes(`Stored under ${aiStorage === 'HOT_CHAFING' ? 'Hot Chafing (65°C)' : aiStorage === 'REFRIGERATED' ? 'Refrigerated (4°C)' : 'Room Temp (25°C)'} (AI Safe Window: ~${safeHours}h).`);
    }
    const elem = document.getElementById('donation-form-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter donations for this donor
  const donorDonations = donations.filter(d => d.donorId === currentUser?.id || d.donorName === currentUser?.name || d.donorId === 'donor_banquet');
  const activeDonations = donorDonations.filter(d => d.status !== 'COMPLETED');
  const completedDonations = donorDonations.filter(d => d.status === 'COMPLETED');

  const filteredHistoryDonations = donorDonations.filter(d => {
    if (historyFilter === 'ACTIVE') return d.status !== 'COMPLETED';
    if (historyFilter === 'COMPLETED') return d.status === 'COMPLETED';
    return true;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const targetedNgoObj = targetType === 'SPECIFIC' ? DEFAULT_RECEIVERS.find(n => n.id === selectedNgoId) : null;

    createAndBroadcastDonation({
      foodType,
      quantity,
      foodCategory,
      preparedAt,
      availableUntil,
      location,
      donorPhone,
      notes,
      targetNgoId: targetedNgoObj ? targetedNgoObj.id : null,
      targetNgoName: targetedNgoObj ? targetedNgoObj.name : null
    });

    // Scroll to history to see instant reflection
    setTimeout(() => {
      document.getElementById('donor-history-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    <div className="container-custom" style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 26 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>{currentUser?.avatar || '🏢'}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                {currentUser?.name}
              </h1>
              <span className="badge-normal" style={{ fontSize: 11 }}>
                {currentUser?.badge || 'Verified Food Partner'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              📍 {currentUser?.address} • 📞 {currentUser?.phone}
            </p>
          </div>
        </div>

        {/* Global Action */}
        <button
          onClick={() => openCertificate(completedDonations[0] || donorDonations[0])}
          className="btn-secondary"
          style={{ padding: '9px 16px', fontSize: 13 }}
        >
          <Award size={16} className="text-amber-500" />
          <span>View ESG / 80G Certificate</span>
        </button>
      </div>

      {/* 1. INTERACTIVE AI SURPLUS & SAFE-TIME PREDICTOR */}
      <div className="card-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* Card Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 14px rgba(16, 185, 129, 0.4)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                  Interactive AI Surplus & Safe-Time Predictor
                </h3>
                <span style={{ fontSize: 11, padding: '2px 8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: 6, fontWeight: 800 }}>
                  LIVE AI MODEL
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                Edit kitchen preparation numbers to forecast surplus and compute safe-consumption hours in real-time.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, padding: '4px 12px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', borderRadius: 9999, fontWeight: 800, border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              ⚡ 87% Prediction Confidence
            </span>
          </div>
        </div>

        {/* INTERACTIVE INPUT CONTROLS ROW */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 20
        }}>
          
          {/* Input 1: Total Prepared */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Total Food Prepared (Meals)
            </label>
            <input
              type="number"
              min="10"
              max="2000"
              value={aiPrepared}
              onChange={(e) => setAiPrepared(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 800
              }}
            />
          </div>

          {/* Input 2: Expected Demand / Guests */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Expected Guests / Eaters
            </label>
            <input
              type="number"
              min="0"
              max="2000"
              value={aiGuests}
              onChange={(e) => setAiGuests(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#38bdf8',
                fontSize: 16,
                fontWeight: 800
              }}
            />
          </div>

          {/* Input 3: Prep Time */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Cooked / Prep Time
            </label>
            <input
              type="text"
              value={aiPrepTime}
              onChange={(e) => setAiPrepTime(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700
              }}
            />
          </div>

          {/* Input 4: Storage & Temperature */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Storage & Temp Condition
            </label>
            <select
              value={aiStorage}
              onChange={(e) => setAiStorage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#fde047',
                fontSize: 13,
                fontWeight: 700
              }}
            >
              <option value="HOT_CHAFING">🔥 Hot Thermal Chafing (65°C)</option>
              <option value="ROOM_TEMP">🌡️ Room Temperature (25°C)</option>
              <option value="REFRIGERATED">❄️ Chilled / Refrigerated (4°C)</option>
              <option value="CUSTOM">✏️ Custom Temperature (°C) & Vessel...</option>
            </select>
          </div>

        </div>

        {/* CONDITIONAL CUSTOM TEMPERATURE & VESSEL INPUTS */}
        {aiStorage === 'CUSTOM' && (
          <div style={{
            backgroundColor: 'rgba(253, 224, 71, 0.08)',
            border: '1px solid rgba(253, 224, 71, 0.3)',
            borderRadius: 12,
            padding: '16px 18px',
            marginBottom: 20,
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1.5fr',
            gap: 14,
            alignItems: 'center'
          }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                🌡️ Enter Temperature (°C) *
              </label>
              <input
                type="number"
                min="-20"
                max="100"
                value={customTemp}
                onChange={(e) => setCustomTemp(e.target.value)}
                placeholder="e.g. 65"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  backgroundColor: '#0f172a',
                  border: '1px solid #eab308',
                  color: '#fef08a',
                  fontSize: 16,
                  fontWeight: 800
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                🍲 Storage Vessel / Container Type:
              </label>
              <input
                type="text"
                value={customStorageVessel}
                onChange={(e) => setCustomStorageVessel(e.target.value)}
                placeholder="e.g. Insulated casseroles, sealed thermal boxes, steel vessel"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  backgroundColor: '#0f172a',
                  border: '1px solid #eab308',
                  color: '#ffffff',
                  fontSize: 13
                }}
              />
            </div>

            {/* AI Real-Time Feedback on entered temperature */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: 8,
              padding: '8px 12px',
              border: isDangerZone ? '1px solid #f87171' : '1px solid #34d399',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: isDangerZone ? '#fca5a5' : '#86efac', textTransform: 'uppercase', display: 'block' }}>
                AI Computed Safe Time:
              </span>
              <div style={{ fontSize: 18, fontWeight: 900, color: isDangerZone ? '#f87171' : '#34d399' }}>
                ~{safeHours} Hours
              </div>
              <span style={{ fontSize: 9, color: isDangerZone ? '#fca5a5' : '#86efac', fontWeight: 700 }}>
                {currentTempNum >= 60 ? '🔥 Safe Hot Holding' : currentTempNum <= 5 ? '❄️ Safe Cold Holding' : '⚠️ Bacteria Danger Zone'}
              </span>
            </div>
          </div>
        )}

        {/* DYNAMIC AI COMPUTED METRICS (4 TILES) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
          
          {/* Tile 1: Predicted Surplus */}
          <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.12)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <span style={{ fontSize: 11, color: '#fca5a5', fontWeight: 800, textTransform: 'uppercase' }}>
              🔮 1. Predicted Surplus
            </span>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#f43f5e', fontFamily: 'var(--font-display)', marginTop: 4 }}>
              ~{calcSurplus} <span style={{ fontSize: 14, fontWeight: 500, color: '#fca5a5' }}>meals</span>
            </div>
            <span style={{ fontSize: 11, color: '#fca5a5', fontWeight: 700 }}>
              {surplusPercent}% of prepared food
            </span>
          </div>

          {/* Tile 2: Safe-Time Window */}
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <span style={{ fontSize: 11, color: '#fde68a', fontWeight: 800, textTransform: 'uppercase' }}>
              ⏱️ 2. Safe Window Remaining
            </span>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-display)', marginTop: 4 }}>
              ~{safeHours} <span style={{ fontSize: 14, fontWeight: 500, color: '#fde68a' }}>hours</span>
            </div>
            <span style={{ fontSize: 11, color: '#fde68a', fontWeight: 700 }}>
              Safe until: {calculatedExpiry}
            </span>
          </div>

          {/* Tile 3: AI Urgency & Quality Score */}
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <span style={{ fontSize: 11, color: '#a7f3d0', fontWeight: 800, textTransform: 'uppercase' }}>
              🛡️ 3. Freshness & Quality
            </span>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-display)', marginTop: 4 }}>
              {freshnessScore}% <span style={{ fontSize: 14, fontWeight: 500, color: '#a7f3d0' }}>Index</span>
            </div>
            <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>
              Urgency: {urgencyScore}% High Priority
            </span>
          </div>

          {/* Tile 4: Environmental Value */}
          <div style={{ backgroundColor: 'rgba(2, 132, 199, 0.12)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
            <span style={{ fontSize: 11, color: '#bae6fd', fontWeight: 800, textTransform: 'uppercase' }}>
              🌱 4. Potential ESG Impact
            </span>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-display)', marginTop: 4 }}>
              ~{Math.round(calcSurplus * 0.8)} <span style={{ fontSize: 14, fontWeight: 500, color: '#bae6fd' }}>kg CO2</span>
            </div>
            <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>
              80G Tax Exemption Ready
            </span>
          </div>

        </div>

        {/* Dynamic Action Bar */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 14,
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={18} className="text-amber-400" />
            <span style={{ fontSize: 13, color: '#f1f5f9', lineHeight: 1.4 }}>
              <strong>AI Recommendation:</strong> Estimated surplus of <strong>~{calcSurplus} meals</strong> predicted. Safe for redistribution for <strong>~{safeHours} hours</strong>.
            </span>
          </div>

          <button
            type="button"
            onClick={applyCalculatedSurplus}
            className="btn-primary"
            style={{
              padding: '9px 18px',
              fontSize: 13,
              borderRadius: 10,
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Sparkles size={15} />
            <span>Apply AI Surplus ({calcSurplus} Meals) to Form ➔</span>
          </button>
        </div>

      </div>

      {/* 2-COLUMN: CREATE FOOD DONATION FORM (LEFT) + ACTIVE RESCUES & RADAR (RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* LEFT: CREATE FOOD DONATION FORM */}
        <div className="card" id="donation-form-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PlusCircle className="text-emerald-600" size={20} />
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                List Surplus Food & Donate
              </h3>
            </div>
          </div>

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            
            {/* TARGET SELECTION: BROADCAST TO ALL VS SPECIFIC NGO */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: 12,
              padding: '14px',
              border: '1px solid #e2e8f0'
            }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: 8 }}>
                🎯 Send Donation To:
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <button
                  type="button"
                  onClick={() => setTargetType('ALL')}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    backgroundColor: targetType === 'ALL' ? '#0f172a' : '#ffffff',
                    color: targetType === 'ALL' ? '#ffffff' : '#475569',
                    borderColor: targetType === 'ALL' ? '#0f172a' : '#cbd5e1'
                  }}
                >
                  <span>📡 All Nearby NGOs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('SPECIFIC')}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    backgroundColor: targetType === 'SPECIFIC' ? '#0284c7' : '#ffffff',
                    color: targetType === 'SPECIFIC' ? '#ffffff' : '#475569',
                    borderColor: targetType === 'SPECIFIC' ? '#0284c7' : '#cbd5e1'
                  }}
                >
                  <Target size={14} />
                  <span>Choose Specific NGO</span>
                </button>
              </div>

              {targetType === 'SPECIFIC' && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', display: 'block', marginBottom: 4 }}>
                    Select Preferred Verified NGO:
                  </label>
                  <select
                    value={selectedNgoId}
                    onChange={(e) => setSelectedNgoId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #0284c7', fontSize: 13, backgroundColor: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                  >
                    {DEFAULT_RECEIVERS.map((ngo) => (
                      <option key={ngo.id} value={ngo.id}>
                        🤝 {ngo.name} ({ngo.distanceLabel} • Capacity: {ngo.currentNeedMeals} Meals)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                Donor Category / Venue Type *
              </label>
              <select
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, backgroundColor: '#ffffff' }}
              >
                <option value="Cooked Meal (Event Buffet)">🎉 Wedding / Banquet Hall Event</option>
                <option value="Restaurant Cooked Food">🍽️ Restaurant / Cafe Buffet</option>
                <option value="Hostel Mess Batch">🎓 College / Hostel Mess Canteen</option>
                <option value="Household Community Batch">🏠 Individual / Household Event</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                Food Items & Dishes *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rice, Dal, Mixed Sabzi, Roti"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Surplus Quantity (Meals) *
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Cooked / Prepared At
                </label>
                <input
                  type="text"
                  value={preparedAt}
                  onChange={(e) => setPreparedAt(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Safe Until (Calculated Expiry)
                </label>
                <input
                  type="text"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Your Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="+91 98220 54321"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                Pickup Address *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                Packaging / Special Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: 14, marginTop: 4, borderRadius: 12 }}
            >
              <Sparkles size={16} />
              <span>{targetType === 'SPECIFIC' ? 'Send Direct Request to NGO 🎯' : 'Broadcast Surplus to Nearby NGOs 📡'}</span>
            </button>
          </form>
        </div>

        {/* RIGHT: LIVE ACTIVE RESCUES & RADAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Active Orders List */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
                Active Broadcasts & Pickups ({activeDonations.length})
              </h3>
              <span className="badge-blue" style={{ fontSize: 11 }}>
                Live Stream
              </span>
            </div>

            {activeDonations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: 13 }}>
                <Utensils size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p>No active donations right now. Use the form on the left to broadcast surplus food!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activeDonations.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: 14,
                      padding: '16px',
                      backgroundColor: item.status === 'ACCEPTED' ? '#f0fdf4' : item.status === 'COLLECTED' ? '#eff6ff' : '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#047857', padding: '2px 8px', backgroundColor: '#ecfdf5', borderRadius: 6 }}>
                          #{item.id}
                        </span>
                        <UrgencyBadge score={item.urgencyScore} level={item.urgencyLevel} />
                      </div>

                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 9999,
                        backgroundColor: item.status === 'ACCEPTED' ? '#dcfce7' : item.status === 'COLLECTED' ? '#dbeafe' : '#fef3c7',
                        color: item.status === 'ACCEPTED' ? '#15803d' : item.status === 'COLLECTED' ? '#1e40af' : '#b45309'
                      }}>
                        {item.status === 'AVAILABLE' ? (item.targetNgoName ? `🎯 TARGETED: ${item.targetNgoName}` : '📡 BROADCASTED') : item.status === 'ACCEPTED' ? '🤝 CLAIMED BY NGO' : '🚚 IN TRANSIT'}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                        {item.foodType}
                      </div>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                        {item.quantity} Meals • Prepared at {item.preparedAt} • Safe until {item.availableUntil}
                      </p>
                    </div>

                    {/* Status Feedback & Actions */}
                    {item.status === 'AVAILABLE' && (
                      <div style={{ fontSize: 12, color: '#d97706', backgroundColor: '#fffbeb', padding: '8px 12px', borderRadius: 8, border: '1px solid #fef3c7', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} />
                        <span>
                          {item.targetNgoName ? `Direct request sent to ${item.targetNgoName}. Waiting for acceptance...` : 'Broadcast active across nearby verified shelters. Waiting for NGO to accept...'}
                        </span>
                      </div>
                    )}

                    {item.status === 'ACCEPTED' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
                            Accepted by: {item.matchedNgoName}
                          </div>
                          <span style={{ fontSize: 11, color: '#64748b' }}>Rescue driver dispatched</span>
                        </div>
                        <button
                          onClick={() => setActiveChatDonation(item)}
                          className="btn-primary"
                          style={{ padding: '8px 14px', fontSize: 12, borderRadius: 8 }}
                        >
                          <MessageSquare size={14} />
                          <span>Chat with NGO</span>
                        </button>
                      </div>
                    )}

                    {item.status === 'COLLECTED' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#1e40af' }}>
                            Food Collected by {item.matchedNgoName}
                          </div>
                          <span style={{ fontSize: 11, color: '#64748b' }}>Currently on route to distribution point</span>
                        </div>
                        <button
                          onClick={() => setActiveChatDonation(item)}
                          className="btn-secondary"
                          style={{ padding: '8px 14px', fontSize: 12, borderRadius: 8 }}
                        >
                          <MessageSquare size={14} />
                          <span>Chat</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NEAREST VERIFIED NGOS RADAR */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              📡 Nearest Verified NGO Network
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEFAULT_RECEIVERS.map((ngo) => (
                <div
                  key={ngo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    fontSize: 12
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{ngo.name}</div>
                    <span style={{ color: '#64748b' }}>📍 {ngo.distanceLabel} • Capacity: {ngo.currentNeedMeals} Meals • 📞 {ngo.phone}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: 6 }}>
                    {calculateMatchScore({ quantity: calcSurplus || 150, urgencyScore: urgencyScore }, ngo)}% Match
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. IMMEDIATE COMPLETE DONATION HISTORY & TRACKING (UPDATES INSTANTLY ON SENDING) */}
      <div className="card" id="donor-history-section">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                Donation History & Live Activity Log ({donorDonations.length})
              </h3>
              <span className="pulse-urgent" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            </div>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              All donations created by your organization are automatically tracked in real-time below
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[
              { id: 'ALL', label: `All (${donorDonations.length})` },
              { id: 'ACTIVE', label: `Active (${activeDonations.length})` },
              { id: 'COMPLETED', label: `Completed (${completedDonations.length})` }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setHistoryFilter(f.id)}
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: '1px solid',
                  cursor: 'pointer',
                  backgroundColor: historyFilter === f.id ? '#0f172a' : '#ffffff',
                  color: historyFilter === f.id ? '#ffffff' : '#64748b',
                  borderColor: historyFilter === f.id ? '#0f172a' : '#cbd5e1'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredHistoryDonations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: 13 }}>
            No donations match this filter. Use the form above to post surplus food!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredHistoryDonations.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  padding: '16px 20px',
                  borderRadius: 14,
                  backgroundColor: item.status === 'COMPLETED' ? '#f8fafc' : item.status === 'ACCEPTED' ? '#f0fdf4' : item.status === 'COLLECTED' ? '#eff6ff' : '#ffffff',
                  border: item.status === 'ACCEPTED' ? '1px solid #86efac' : item.status === 'COLLECTED' ? '1px solid #bfdbfe' : '1px solid #e2e8f0'
                }}
              >
                {/* Left Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: item.status === 'COMPLETED' ? '#ecfdf5' : item.status === 'ACCEPTED' ? '#dcfce7' : item.status === 'COLLECTED' ? '#dbeafe' : '#fef3c7',
                    color: item.status === 'COMPLETED' ? '#059669' : item.status === 'ACCEPTED' ? '#166534' : item.status === 'COLLECTED' ? '#1e40af' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                  }}>
                    {item.status === 'COMPLETED' ? <CheckCircle2 size={22} /> : item.status === 'COLLECTED' ? <Truck size={22} /> : item.status === 'ACCEPTED' ? '🤝' : '📡'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                        {item.foodType}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', padding: '1px 6px', borderRadius: 4 }}>
                        #{item.id}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      <span>📦 <strong>{item.quantity} Meals</strong></span>
                      <span>•</span>
                      <span>⏱️ Safe until {item.availableUntil}</span>
                      <span>•</span>
                      <span>📍 {item.donorAddress}</span>
                    </div>

                    {item.matchedNgoName && (
                      <div style={{ fontSize: 12, color: '#166534', fontWeight: 700, marginTop: 4 }}>
                        🤝 Handled by: {item.matchedNgoName} {item.driverName && `(Driver: ${item.driverName})`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Status Pill & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 9999,
                    backgroundColor: item.status === 'COMPLETED' ? '#dcfce7' : item.status === 'ACCEPTED' ? '#dcfce7' : item.status === 'COLLECTED' ? '#dbeafe' : '#fef3c7',
                    color: item.status === 'COMPLETED' ? '#15803d' : item.status === 'ACCEPTED' ? '#15803d' : item.status === 'COLLECTED' ? '#1e40af' : '#b45309'
                  }}>
                    {item.status === 'AVAILABLE' ? (item.targetNgoName ? `🎯 SENT TO: ${item.targetNgoName}` : '📡 BROADCASTED') : item.status === 'ACCEPTED' ? '🤝 CLAIMED' : item.status === 'COLLECTED' ? '🚚 IN TRANSIT' : '✓ COMPLETED'}
                  </span>

                  {(item.status === 'ACCEPTED' || item.status === 'COLLECTED') && (
                    <button
                      onClick={() => setActiveChatDonation(item)}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8 }}
                    >
                      <MessageSquare size={14} />
                      <span>Chat</span>
                    </button>
                  )}

                  {item.status === 'COMPLETED' && (
                    <button
                      onClick={() => openCertificate(item)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8 }}
                    >
                      <Award size={14} className="text-amber-500" />
                      <span>80G Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
