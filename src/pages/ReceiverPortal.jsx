import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, ShieldCheck, Clock, MapPin, Truck, AlertCircle, ArrowRight, Filter, Sparkles, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import StatCard from '../components/StatCard';
import UrgencyBadge from '../components/UrgencyBadge';
import RouteMap from '../components/RouteMap';

export default function ReceiverPortal() {
  const { currentUser, donations, acceptDonation, markFoodCollected, markDistributedToNeedy, setActiveChatDonation } = useApp();
  const [filterUrgency, setFilterUrgency] = useState('ALL');

  // 1. Available Public Feed (broadcasted by donors and not claimed yet)
  const availableDonations = donations.filter(d => {
    if (d.status !== 'AVAILABLE') return false;
    if (filterUrgency === 'URGENT') return d.urgencyScore >= 80;
    if (filterUrgency === 'MEDIUM') return d.urgencyScore >= 60 && d.urgencyScore < 80;
    return true;
  });

  // 2. Active Pickups claimed by this specific NGO
  const myActivePickups = donations.filter(d => 
    (d.status === 'ACCEPTED' || d.status === 'COLLECTED') && 
    d.matchedNgoId === currentUser?.id
  );

  // 3. Completed Distributions by this NGO
  const myCompletedDistributions = donations.filter(d => 
    d.status === 'COMPLETED' && 
    d.matchedNgoId === currentUser?.id
  );

  const totalMealsRescued = myCompletedDistributions.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 180);

  return (
    <div className="container-custom" style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 26 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>🤝</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                {currentUser?.name || 'Hope Shelter & Food Bank'}
              </h1>
              <span className="badge-blue" style={{ fontSize: 11 }}>
                Verified NGO Rescue Partner
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              📍 {currentUser?.address || 'Shelter Complex 4, Ring Road Corridor'} • {currentUser?.categoryLabel}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ padding: '8px 14px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: 12, fontSize: 13, fontWeight: 800 }}>
            🚚 Active Fleet: {currentUser?.pickupFleet || '2 Dedicated Rescue Vans Ready'}
          </span>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
        <StatCard
          title="Current Shelter Demand"
          value={currentUser?.currentNeedMeals || 150}
          unit="meals"
          subtitle="Beneficiaries waiting today"
          icon={HeartHandshake}
          color="#3b82f6"
          trend="Night Kitchen"
        />
        <StatCard
          title="Nearby Available Broadcasts"
          value={availableDonations.length}
          unit="listings"
          subtitle="Within 5 km radius"
          icon={AlertCircle}
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
                Live broadcasts from banquet halls, restaurants, and canteens
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
                    border: '2px solid #e2e8f0',
                    borderRadius: 16,
                    padding: '18px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#047857', padding: '2px 8px', backgroundColor: '#ecfdf5', borderRadius: 6 }}>
                        #{item.id}
                      </span>
                      <UrgencyBadge score={item.urgencyScore} level={item.urgencyLevel} />
                    </div>

                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7' }}>
                      📍 ~2.4 km away
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                      {item.foodType}
                    </h4>
                    <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                      🏢 <strong>{item.donorName}</strong> ({item.foodCategory})
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: 10, fontSize: 12, color: '#475569' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Quantity:</span>
                      <p style={{ fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>{item.quantity} Meals</p>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Safe Window:</span>
                      <p style={{ fontWeight: 800, color: '#d97706', margin: '2px 0 0' }}>Until {item.availableUntil} (~{item.safeHoursRemaining}h left)</p>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
                        Rescue Dispatch #{item.id}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 9999,
                        backgroundColor: item.status === 'ACCEPTED' ? '#fef3c7' : '#dbeafe',
                        color: item.status === 'ACCEPTED' ? '#b45309' : '#1e40af'
                      }}>
                        {item.status === 'ACCEPTED' ? '🚗 DISPATCH EN ROUTE' : '📦 FOOD COLLECTED'}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>
                        {item.foodType}
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>
                        {item.quantity} Meals from <strong>{item.donorName}</strong>
                      </p>
                      <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        📍 {item.donorAddress} • 📞 {item.donorPhone}
                      </p>
                    </div>

                    {/* Telemetric Route Map */}
                    <RouteMap
                      donorAddress={item.donorAddress}
                      shelterAddress={currentUser?.address || 'Hope Shelter'}
                      status={item.status}
                      etaMinutes={item.status === 'ACCEPTED' ? 8 : 4}
                    />

                    {/* Action Buttons: Chat, Mark Collected, Mark Distributed */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      
                      {/* Direct Chat Button */}
                      <button
                        onClick={() => setActiveChatDonation(item)}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '10px', fontSize: 12, borderRadius: 10 }}
                      >
                        <MessageSquare size={14} />
                        <span>Chat with Donor</span>
                      </button>

                      {/* Step 1: Mark Food Collected */}
                      {item.status === 'ACCEPTED' && (
                        <button
                          onClick={() => markFoodCollected(item.id)}
                          className="btn-amber"
                          style={{ flex: 1.5, padding: '10px', fontSize: 12, borderRadius: 10 }}
                        >
                          <Truck size={14} />
                          <span>Mark Food Collected</span>
                        </button>
                      )}

                      {/* Step 2: Mark Distributed to Needy People (COMPLETED) */}
                      {item.status === 'COLLECTED' && (
                        <button
                          onClick={() => markDistributedToNeedy(item.id)}
                          className="btn-primary"
                          style={{ flex: 1.5, padding: '10px', fontSize: 12, borderRadius: 10 }}
                        >
                          <CheckCircle2 size={14} />
                          <span>Distributed to Needy ✓</span>
                        </button>
                      )}

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DISTRIBUTION HISTORY ARCHIVE */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>
              📜 Distribution History ({myCompletedDistributions.length})
            </h3>
            {myCompletedDistributions.length === 0 ? (
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Completed distributions will be archived here with impact verification.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myCompletedDistributions.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 12
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{item.foodType}</div>
                      <span style={{ color: '#64748b' }}>{item.quantity} Meals from {item.donorName}</span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: 6 }}>
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
