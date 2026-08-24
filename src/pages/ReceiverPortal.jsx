import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, CheckCircle2, Clock, MapPin, AlertTriangle, MessageSquare, Phone, ShieldCheck, HeartHandshake, ArrowRight, Target, Sparkles } from 'lucide-react';
import StatCard from '../components/StatCard';
import UrgencyBadge from '../components/UrgencyBadge';
import RouteMap from '../components/RouteMap';

export default function ReceiverPortal() {
  const {
    currentUser,
    donations,
    acceptDonation,
    collectDonation,
    distributeAndComplete,
    setActiveChatDonation
  } = useApp();

  const [filterUrgency, setFilterUrgency] = useState('ALL'); // 'ALL' | 'URGENT' | 'MEDIUM'

  // Filter donations
  // 1. Available stream (either broadcast to all OR targeted to this NGO)
  const availableDonations = donations.filter(d => {
    if (d.status !== 'AVAILABLE') return false;
    if (d.targetNgoId && d.targetNgoId !== currentUser?.id && d.targetNgoName !== currentUser?.name) {
      // Directed to another NGO specifically
      return false;
    }
    if (filterUrgency === 'URGENT') return d.urgencyScore >= 80;
    if (filterUrgency === 'MEDIUM') return d.urgencyScore < 80;
    return true;
  });

  // 2. Claimed rescues by this NGO
  const myActivePickups = donations.filter(
    d => (d.status === 'ACCEPTED' || d.status === 'COLLECTED') && (d.matchedNgoId === currentUser?.id || d.matchedNgoName === currentUser?.name)
  );

  // 3. Completed history by this NGO
  const myCompletedRescues = donations.filter(
    d => d.status === 'COMPLETED' && (d.matchedNgoId === currentUser?.id || d.matchedNgoName === currentUser?.name)
  );

  // Statistics
  const totalMealsClaimed = myActivePickups.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalMealsRescued = myCompletedRescues.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="container-custom" style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 26 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>{currentUser?.avatar || '🤝'}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                {currentUser?.name}
              </h1>
              <span className="badge-normal" style={{ fontSize: 11 }}>
                {currentUser?.badge || 'Verified Rescue Partner'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              📍 {currentUser?.address} • 📞 {currentUser?.phone}
            </p>
          </div>
        </div>

        {/* Current Need Badge */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 12,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <HeartHandshake className="text-sky-600" size={20} />
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Shelter Capacity</span>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
              Needs: <strong>{currentUser?.currentNeedMeals || 150} Meals</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard
          title="Inbound Surplus Stream"
          value={availableDonations.length}
          unit="listings"
          subtitle="Nearby food awaiting rescue"
          icon={AlertTriangle}
          color="#f59e0b"
          trend="Live Radar"
        />
        <StatCard
          title="Active Claimed Rescues"
          value={myActivePickups.length}
          unit="in transit"
          subtitle={`${totalMealsClaimed} meals being collected`}
          icon={Truck}
          color="#f43f5e"
          trend="Live Queue"
        />
        <StatCard
          title="Total Meals Rescued"
          value={totalMealsRescued}
          unit="meals"
          subtitle="Safely distributed"
          icon={CheckCircle2}
          color="#10b981"
          trend="+100% On-Time"
        />
      </div>

      {/* 2-COLUMN: LIVE INBOUND STREAM (LEFT) + MY ACTIVE RESCUES & ROUTE (RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>
        
        {/* LEFT: LIVE NEARBY INBOUND SURPLUS FEED */}
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                  Nearby Surplus Food Stream
                </h3>
                <span className="pulse-urgent" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f43f5e', display: 'inline-block' }} />
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                Live broadcasts from banquet halls, restaurants, caterers & canteens
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {['ALL', 'URGENT', 'MEDIUM'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterUrgency(f)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 8,
                    border: '1px solid',
                    cursor: 'pointer',
                    backgroundColor: filterUrgency === f ? '#0f172a' : '#ffffff',
                    color: filterUrgency === f ? '#ffffff' : '#64748b',
                    borderColor: filterUrgency === f ? '#0f172a' : '#cbd5e1'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {availableDonations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: '#94a3b8' }}>
              <CheckCircle2 size={36} className="text-emerald-500" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>All Nearby Surplus Rescued!</h4>
              <p style={{ fontSize: 13, marginTop: 4 }}>
                Currently no unclaimed food available in your radius. When donors post, it will pop up here in real-time.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {availableDonations.map((item) => (
                <div
                  key={item.id}
                  className="card-hover-effect"
                  style={{
                    border: item.targetNgoId ? '2px solid #0284c7' : '2px solid #e2e8f0',
                    borderRadius: 16,
                    padding: '18px',
                    backgroundColor: item.targetNgoId ? '#f0f9ff' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  {/* Top Bar with Urgency & Direct Request Badge */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#047857', padding: '2px 8px', backgroundColor: '#ecfdf5', borderRadius: 6 }}>
                        #{item.id}
                      </span>
                      <UrgencyBadge score={item.urgencyScore} level={item.urgencyLevel} />
                      
                      {item.targetNgoName && (
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Target size={12} />
                          <span>Direct Request for You</span>
                        </span>
                      )}
                    </div>

                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7' }}>
                      📍 ~2.4 km away
                    </span>
                  </div>

                  {/* Food Details */}
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                      {item.foodType}
                    </h4>
                    
                    {/* Donor Name & Contact Phone */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 6, fontSize: 13, color: '#475569' }}>
                      <span>🏢 <strong>{item.donorName}</strong> ({item.foodCategory})</span>
                      <span>•</span>
                      <a
                        href={`tel:${item.donorPhone || '+91 98220 54321'}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          color: '#0284c7',
                          fontWeight: 700,
                          textDecoration: 'none',
                          backgroundColor: '#e0f2fe',
                          padding: '2px 8px',
                          borderRadius: 6
                        }}
                      >
                        <Phone size={12} />
                        <span>{item.donorPhone || '+91 98220 54321'}</span>
                      </a>
                    </div>

                    <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>
                      📍 Pickup Address: {item.donorAddress}
                    </p>
                  </div>

                  {/* Quantity & Safe Window */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: 10, fontSize: 12, color: '#475569' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Quantity:</span>
                      <p style={{ fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>{item.quantity} Meals</p>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Safe Window:</span>
                      <p style={{ fontWeight: 800, color: '#d97706', margin: '2px 0 0' }}>Until {item.availableUntil} (~{item.safeHoursRemaining || 3.5}h left)</p>
                    </div>
                  </div>

                  {/* Accept Donation Button */}
                  <button
                    onClick={() => acceptDonation(item.id, currentUser)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: 14, borderRadius: 12 }}
                  >
                    <CheckCircle2 size={17} />
                    <span>Accept & Claim This Donation ➔</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: MY CLAIMED RESCUES & LIVE DISPATCH */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
                My Claimed Rescues ({myActivePickups.length})
              </h3>
              <span className="badge-normal" style={{ fontSize: 11 }}>
                In Progress
              </span>
            </div>

            {myActivePickups.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: 13 }}>
                <Truck size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p>No active claimed rescues. Click "Accept & Claim" on any incoming food listing on the left!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {myActivePickups.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '2px solid #bbf7d0',
                      borderRadius: 16,
                      padding: '18px',
                      backgroundColor: '#f0fdf4',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#166534', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: 6 }}>
                          RESCUE CLAIMED #{item.id}
                        </span>
                        <h4 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
                          {item.foodType} ({item.quantity} Meals)
                        </h4>
                      </div>

                      <span style={{ fontSize: 12, fontWeight: 800, color: item.status === 'COLLECTED' ? '#1e40af' : '#15803d' }}>
                        {item.status === 'COLLECTED' ? '🚚 In Transit' : '⏱️ Pickup Dispatched'}
                      </span>
                    </div>

                    {/* Donor Phone & Pickup info */}
                    <div style={{ backgroundColor: '#ffffff', padding: '12px 14px', borderRadius: 10, border: '1px solid #dcfce7', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#0f172a', fontWeight: 800 }}>🏢 {item.donorName}</span>
                        <a
                          href={`tel:${item.donorPhone || '+91 98220 54321'}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            backgroundColor: '#ecfdf5',
                            color: '#047857',
                            padding: '4px 10px',
                            borderRadius: 8,
                            fontWeight: 800,
                            fontSize: 12,
                            textDecoration: 'none',
                            border: '1px solid #a7f3d0'
                          }}
                        >
                          <Phone size={13} />
                          <span>{item.donorPhone || '+91 98220 54321'}</span>
                        </a>
                      </div>
                      <p style={{ color: '#64748b', fontSize: 12, margin: '6px 0 0' }}>
                        📍 {item.donorAddress}
                      </p>
                    </div>

                    {/* Route Simulation */}
                    <RouteMap
                      from={item.donorAddress}
                      to={currentUser?.address || 'Shelter Facility'}
                      status={item.status}
                    />

                    {/* Action Flow */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <button
                        onClick={() => setActiveChatDonation(item)}
                        className="btn-secondary"
                        style={{ padding: '10px', fontSize: 13, borderRadius: 10 }}
                      >
                        <MessageSquare size={15} />
                        <span>Chat with Donor</span>
                      </button>

                      {item.status === 'ACCEPTED' ? (
                        <button
                          onClick={() => collectDonation(item.id)}
                          className="btn-primary"
                          style={{ padding: '10px', fontSize: 13, borderRadius: 10, backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                        >
                          <Truck size={15} />
                          <span>Mark Food Collected</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => distributeAndComplete(item.id)}
                          className="btn-primary"
                          style={{ padding: '10px', fontSize: 13, borderRadius: 10 }}
                        >
                          <CheckCircle2 size={15} />
                          <span>Distributed to Needy ✓</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BENEFICIARY AUDIT LOG */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              📜 Completed Distribution Log ({myCompletedRescues.length})
            </h3>
            {myCompletedRescues.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8' }}>
                Completed rescues will be archived here for municipal audit.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myCompletedRescues.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      fontSize: 12
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{item.foodType}</div>
                      <span style={{ color: '#64748b' }}>From {item.donorName} • {item.quantity} Meals</span>
                    </div>
                    <span style={{ color: '#059669', fontWeight: 800, backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: 6 }}>
                      ✓ Distributed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
