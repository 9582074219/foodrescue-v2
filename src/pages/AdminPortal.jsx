import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Utensils, Leaf, Award, TrendingUp, AlertCircle, CheckCircle2, Download, Users, Building2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import UrgencyBadge from '../components/UrgencyBadge';

export default function AdminPortal() {
  const { donations, openCertificate } = useApp();

  const totalMealsRescued = donations
    .filter(d => d.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 2450);

  const activeDonationsCount = donations.filter(d => d.status !== 'COMPLETED').length;
  const co2SavedKg = Math.round(totalMealsRescued * 0.85);
  const waterSavedL = Math.round(totalMealsRescued * 5.2);

  return (
    <div className="container-custom" style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 26 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>🛡️</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                Municipal Food Welfare & Impact Analytics
              </h1>
              <span className="badge-normal" style={{ fontSize: 11 }}>
                City Operations Hub
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              Municipal Smart City Zero-Waste Command Center • Real-Time Audit & Landfill Diversion
            </p>
          </div>
        </div>

        <button
          onClick={() => alert(`📊 City Operations Summary Exported!\nTotal Rescued: ${totalMealsRescued} Meals\nCO2 Emissions Averted: ${co2SavedKg} kg\nWater Saved: ${waterSavedL} L`)}
          className="btn-secondary"
          style={{ padding: '9px 16px', fontSize: 13 }}
        >
          <Download size={15} />
          <span>Export City Impact Audit</span>
        </button>
      </div>

      {/* 1. TOP GLOBAL IMPACT METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
        <StatCard
          title="Total Food Rescued"
          value={totalMealsRescued.toLocaleString()}
          unit="meals"
          subtitle="Redistributed to shelters"
          icon={Utensils}
          color="#10b981"
          trend="+150 today"
        />
        <StatCard
          title="Active Live Rescues"
          value={activeDonationsCount}
          unit="operations"
          subtitle="Inbound/In-Transit"
          icon={TrendingUp}
          color="#3b82f6"
          trend="Realtime"
        />
        <StatCard
          title="CO2 Emissions Prevented"
          value={`${co2SavedKg.toLocaleString()} kg`}
          subtitle="Methane offset from landfills"
          icon={Leaf}
          color="#059669"
          trend="ESG Verified"
        />
        <StatCard
          title="Agricultural Water Preserved"
          value={`${waterSavedL.toLocaleString()} L`}
          subtitle="Natural resources saved"
          icon={Award}
          color="#0284c7"
          trend="SDG 12"
        />
      </div>

      {/* 2. TWO-COLUMN: LIVE AUDIT LOG (LEFT) + TOP RESCUE LEADERS (RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* LEFT: LIVE CITY OPERATIONS QUEUE */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
              Live Rescue Telemetry & Audit Stream
            </h3>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', backgroundColor: '#ffe4e6', color: '#9f1239', borderRadius: 6 }}>
              Live Telemetry
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {donations.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>#{item.id}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{item.donorName} ➔ {item.matchedNgoName || 'Broadcasting'}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{item.quantity} Meals • {item.foodType}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UrgencyBadge score={item.urgencyScore} level={item.urgencyLevel} />
                  {item.status === 'COMPLETED' && (
                    <button
                      onClick={() => openCertificate(item)}
                      style={{ background: 'none', border: 'none', color: '#059669', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cert ➔
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: TOP SUSTAINABILITY LEADERBOARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 14 }}>
              🏆 Top Zero-Waste Donors (Municipal Rankings)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: "Celebration Banquet & Party Hall", meals: 1240, badge: "🥇 Diamond ESG Partner", co2: "992 kg" },
                { name: "City Central Restaurant & Grill", meals: 820, badge: "🥈 Gold Partner", co2: "656 kg" },
                { name: "University North Hostel Canteen", meals: 450, badge: "🥉 Silver Partner", co2: "360 kg" }
              ].map((donor, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{donor.name}</div>
                    <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>{donor.badge}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: '#0f172a', fontSize: 14 }}>{donor.meals} Meals</div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{donor.co2} CO2 Offset</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 14 }}>
              🤝 Verified Active NGO Fleet
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: "Hope Shelter & Food Bank", fleet: "2 Dedicated Vans", rate: "100% On-Time" },
                { name: "Robin Hood Army (Volunteer Network)", fleet: "12 Volunteer Bikes", rate: "99% On-Time" },
                { name: "Care & Share Community Kitchen", fleet: "1 Mini Cargo Van", rate: "98% On-Time" }
              ].map((ngo, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{ngo.name}</div>
                    <span style={{ fontSize: 11, color: '#0284c7' }}>🚚 {ngo.fleet}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: 6 }}>
                    {ngo.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
