import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Utensils, PlusCircle, Clock, MapPin, Truck, AlertTriangle, CheckCircle2, MessageSquare, Award, ShieldCheck, ArrowRight, Thermometer, Sliders, Check } from 'lucide-react';
import StatCard from '../components/StatCard';
import UrgencyBadge from '../components/UrgencyBadge';
import RouteMap from '../components/RouteMap';
import { DEFAULT_RECEIVERS, calculateMatchScore } from '../data/mockData';

export default function DonorPortal() {
  const { currentUser, donations, createAndBroadcastDonation, setActiveChatDonation, openCertificate } = useApp();

  // 1. AI Interactive Forecaster State (Editable by Donor)
  const [aiPrepared, setAiPrepared] = useState(currentUser?.dailyPrepared || 700);
  const [aiGuests, setAiGuests] = useState(currentUser?.expectedDemand || 520);
  const [aiStorage, setAiStorage] = useState('HOT_CHAFING'); // 'HOT_CHAFING' | 'ROOM_TEMP' | 'REFRIGERATED'
  const [aiPrepTime, setAiPrepTime] = useState('08:30 PM');

  // Dynamic AI Calculations
  const calcSurplus = Math.max(0, Number(aiPrepared) - Number(aiGuests));
  const surplusPercent = Math.round((calcSurplus / (Number(aiPrepared) || 1)) * 100);
  const safeHours = aiStorage === 'HOT_CHAFING' ? 4.5 : aiStorage === 'REFRIGERATED' ? 6.0 : 3.0;
  const urgencyScore = calcSurplus >= 120 ? 95 : calcSurplus >= 70 ? 85 : calcSurplus >= 30 ? 70 : 50;
  const freshnessScore = aiStorage === 'HOT_CHAFING' ? 96 : aiStorage === 'REFRIGERATED' ? 98 : 88;
  const calculatedExpiry = aiStorage === 'HOT_CHAFING' ? '12:30 AM' : aiStorage === 'REFRIGERATED' ? '02:30 AM' : '11:30 PM';

  // 2. Listing Form State
  const [foodType, setFoodType] = useState('Paneer Butter Masala, Dal Makhani, Veg Pulao, Rotis & Sweets');
  const [quantity, setQuantity] = useState(180);
  const [foodCategory, setFoodCategory] = useState('Cooked Meal (Event Buffet)');
  const [preparedAt, setPreparedAt] = useState('08:30 PM');
  const [availableUntil, setAvailableUntil] = useState('12:30 AM');
  const [location, setLocation] = useState(currentUser?.address || 'Sector 29, Main City Corridor');
  const [notes, setNotes] = useState('Freshly prepared buffet food stored in stainless steel insulated containers.');

  // Apply AI Calculation into Form
  const applyCalculatedSurplus = () => {
    setQuantity(calcSurplus);
    setPreparedAt(aiPrepTime);
    setAvailableUntil(calculatedExpiry);
    const elem = document.getElementById('donation-form-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter donations for this donor
  const donorDonations = donations.filter(d => d.donorId === currentUser?.id);
  const activeDonations = donorDonations.filter(d => d.status !== 'COMPLETED');
  const completedDonations = donorDonations.filter(d => d.status === 'COMPLETED');

  const handleCreate = (e) => {
    e.preventDefault();
    createAndBroadcastDonation({
      foodType,
      quantity,
      foodCategory,
      preparedAt,
      availableUntil,
      location,
      notes
    });
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

      {/* 1. INTERACTIVE AI SURPLUS & SAFE-TIME PREDICTOR (FULLY EDITABLE) */}
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
                Edit your kitchen preparation numbers to forecast surplus and calculate exact safe-consumption hours in real-time.
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
            </select>
          </div>

        </div>

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
                List Surplus Food & Broadcast
              </h3>
            </div>
          </div>

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>
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
              <span>Broadcast Surplus to Nearby NGOs 📡</span>
            </button>
          </form>
        </div>

        {/* RIGHT: ACTIVE RESCUES & LIVE MATCH RADAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Active Orders List */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
                Active Broadcasts & Rescues ({activeDonations.length})
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
                        {item.status === 'AVAILABLE' ? '📡 BROADCASTED' : item.status === 'ACCEPTED' ? '🤝 ACCEPTED BY NGO' : '🚚 IN TRANSIT'}
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
                        <span>Broadcast active across nearby verified shelters. Waiting for NGO to accept...</span>
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
                    <span style={{ color: '#64748b' }}>📍 {ngo.distanceLabel} • Capacity: {ngo.currentNeedMeals} Meals</span>
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

      {/* 3. COMPLETED DONATION HISTORY SECTION (WITH 80G CERTIFICATES) */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
              Completed Rescue History & 80G Tax Records ({completedDonations.length})
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              Verified meals safely distributed to beneficiaries by partner NGOs
            </p>
          </div>
        </div>

        {completedDonations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: 13 }}>
            No completed history yet. Completed orders will appear here automatically with downloadable 80G tax certificates.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {completedDonations.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  padding: '14px 18px',
                  borderRadius: 12,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                      {item.foodType}
                    </div>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      {item.quantity} Meals • Distributed by <strong>{item.matchedNgoName || 'Hope Shelter'}</strong> • #{item.id}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#059669' }}>
                    ~{Math.round(item.quantity * 0.8)} kg CO2 Offset
                  </span>
                  <button
                    onClick={() => openCertificate(item)}
                    className="btn-secondary"
                    style={{ padding: '7px 14px', fontSize: 12, borderRadius: 8 }}
                  >
                    <Award size={14} className="text-amber-500" />
                    <span>80G Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
