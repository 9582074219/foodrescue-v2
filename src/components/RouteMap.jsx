import React, { useState, useEffect } from 'react';
import { Navigation, Truck, MapPin, CheckCircle2, Clock, Check } from 'lucide-react';

export default function RouteMap({
  donorAddress,
  from,
  shelterAddress,
  to,
  needyAddress = 'Slum Cluster & Night Shelter, Ward 12',
  status = 'ACCEPTED',
  etaMinutes = 6
}) {
  const startAddr = donorAddress || from || 'Celebration Banquet, Sector 29';
  const midAddr = shelterAddress || to || 'Hope Shelter Facility, Ring Road';
  const endAddr = needyAddress;

  const isCollected = status === 'COLLECTED' || status === 'COMPLETED';
  const isCompleted = status === 'COMPLETED';

  // Animated progress:
  // If ACCEPTED: van moves between 10% and 45% (Donor -> NGO Shelter)
  // If COLLECTED: van moves between 55% and 92% (NGO Shelter -> Needy Area)
  // If COMPLETED: 100%
  const [progress, setProgress] = useState(isCompleted ? 100 : isCollected ? 65 : 25);

  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress(p => {
        if (!isCollected) {
          // Leg 1: 15% to 48%
          return p >= 46 ? 18 : p + 3;
        } else {
          // Leg 2: 54% to 92%
          return p >= 90 ? 56 : p + 3;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isCollected, isCompleted]);

  return (
    <div style={{
      backgroundColor: '#090d16',
      borderRadius: 18,
      border: '1px solid #1f2937',
      padding: '18px 20px',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Navigation size={18} className="text-emerald-400" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
            LIVE GPS RESCUE TELEMETRY
          </span>
        </div>

        <span style={{
          fontSize: 11,
          padding: '3px 10px',
          backgroundColor: isCollected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(245, 158, 11, 0.18)',
          color: isCollected ? '#38bdf8' : '#fbbf24',
          borderRadius: 6,
          fontWeight: 700,
          border: isCollected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          {isCompleted ? '✓ Distribution Completed' : isCollected ? '🚚 Leg 2: Van En Route to Needy' : '🚗 Leg 1: Van En Route to Donor'}
        </span>
      </div>

      {/* Visual GPS 3-Waypoints Path */}
      <div style={{
        position: 'relative',
        height: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 14,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        overflow: 'hidden'
      }}>
        
        {/* Background Track Line */}
        <div style={{
          position: 'absolute',
          left: 45,
          right: 45,
          height: 4,
          backgroundColor: '#1e293b',
          borderRadius: 2
        }}>
          {/* Active Glowing Progress */}
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: isCollected
              ? 'linear-gradient(90deg, #10b981 0%, #0ea5e9 60%, #38bdf8 100%)'
              : 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)',
            boxShadow: isCollected ? '0 0 12px #38bdf8' : '0 0 10px #10b981',
            borderRadius: 2,
            transition: 'width 0.8s ease'
          }} />
        </div>

        {/* WAYPOINT 1: DONOR (LEFT) */}
        <div style={{
          position: 'absolute',
          left: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: isCollected ? '#10b981' : '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isCollected ? '0 0 14px rgba(16, 185, 129, 0.7)' : '0 0 8px rgba(16, 185, 129, 0.4)',
            fontSize: 16,
            color: '#fff'
          }}>
            {isCollected ? <Check size={16} strokeWidth={3} /> : '🏢'}
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, color: isCollected ? '#34d399' : '#cbd5e1' }}>
            {isCollected ? '✓ Collected' : '1. Donor'}
          </span>
        </div>

        {/* WAYPOINT 2: NGO SHELTER (CENTER) */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          zIndex: 2
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: isCollected ? '#0284c7' : '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isCollected ? '0 0 14px rgba(2, 132, 199, 0.7)' : 'none',
            fontSize: 16,
            color: '#fff',
            border: isCollected ? '2px solid #38bdf8' : '1px solid #475569'
          }}>
            🤝
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, color: isCollected ? '#38bdf8' : '#94a3b8' }}>
            2. NGO Shelter
          </span>
        </div>

        {/* MOVING RESCUE VAN */}
        {!isCompleted && (
          <div style={{
            position: 'absolute',
            left: `calc(35px + ${progress}% * 0.82)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            transition: 'left 0.8s ease',
            zIndex: 3
          }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              backgroundColor: isCollected ? '#0284c7' : '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: isCollected ? '0 0 14px rgba(2, 132, 199, 0.9)' : '0 0 14px rgba(217, 119, 6, 0.9)'
            }}>
              <Truck size={15} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, color: isCollected ? '#38bdf8' : '#fbbf24', whiteSpace: 'nowrap' }}>
              {isCollected ? '~4m ETA' : '~6m ETA'}
            </span>
          </div>
        )}

        {/* WAYPOINT 3: NEEDY BENEFICIARIES (RIGHT) */}
        <div style={{
          position: 'absolute',
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: isCompleted ? '#10b981' : isCollected ? '#f43f5e' : '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isCompleted ? '0 0 14px rgba(16, 185, 129, 0.7)' : isCollected ? '0 0 14px rgba(244, 63, 94, 0.6)' : 'none',
            fontSize: 16,
            color: '#fff',
            border: isCollected ? '2px solid #f43f5e' : '1px solid #475569'
          }}>
            {isCompleted ? <Check size={16} strokeWidth={3} /> : '🏠'}
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, color: isCompleted ? '#34d399' : isCollected ? '#fca5a5' : '#94a3b8' }}>
            {isCompleted ? '✓ Distributed' : '3. Needy Area'}
          </span>
        </div>

      </div>

      {/* 3-Column Waypoint Detail Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, fontSize: 11 }}>
        
        {/* Step 1: Donor Pickup */}
        <div style={{
          backgroundColor: isCollected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
          border: isCollected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10,
          padding: '8px 10px'
        }}>
          <span style={{ color: isCollected ? '#34d399' : '#94a3b8', fontWeight: 700 }}>
            {isCollected ? '✓ Pickup Done:' : '1. Pickup Point:'}
          </span>
          <p style={{ fontWeight: 700, color: '#f1f5f9', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {startAddr}
          </p>
        </div>

        {/* Step 2: Shelter Transit */}
        <div style={{
          backgroundColor: isCollected ? 'rgba(2, 132, 199, 0.08)' : 'rgba(255, 255, 255, 0.03)',
          border: isCollected ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10,
          padding: '8px 10px'
        }}>
          <span style={{ color: isCollected ? '#38bdf8' : '#94a3b8', fontWeight: 700 }}>
            2. Transit Hub:
          </span>
          <p style={{ fontWeight: 700, color: '#f1f5f9', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {midAddr}
          </p>
        </div>

        {/* Step 3: Needy Community Area */}
        <div style={{
          backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
          border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10,
          padding: '8px 10px'
        }}>
          <span style={{ color: isCompleted ? '#34d399' : '#fca5a5', fontWeight: 700 }}>
            {isCompleted ? '✓ Distributed:' : '3. Needy Destination:'}
          </span>
          <p style={{ fontWeight: 700, color: '#f1f5f9', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {endAddr}
          </p>
        </div>

      </div>
    </div>
  );
}
