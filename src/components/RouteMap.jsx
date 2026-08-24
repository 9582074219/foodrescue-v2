import React, { useState, useEffect } from 'react';
import { Navigation, Truck, Check } from 'lucide-react';

export default function RouteMap({
  status = 'ACCEPTED',
  etaMinutes = 6
}) {
  const isCollected = status === 'COLLECTED' || status === 'COMPLETED';
  const isCompleted = status === 'COMPLETED';

  // If ACCEPTED: van moves on Leg 1 (Donor -> Shelter, 15% to 46%)
  // If COLLECTED: van moves on Leg 2 (Shelter -> Needy, 54% to 92%)
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
          return p >= 45 ? 18 : p + 3;
        } else {
          return p >= 88 ? 55 : p + 3;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isCollected, isCompleted]);

  return (
    <div style={{
      backgroundColor: '#090d16',
      borderRadius: 16,
      border: '1px solid #1f2937',
      padding: '16px 18px',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Navigation size={17} className="text-emerald-400" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.03em' }}>
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
        height: 85,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
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
            fontSize: 15,
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
            fontSize: 15,
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
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: isCollected ? '#0284c7' : '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: isCollected ? '0 0 14px rgba(2, 132, 199, 0.9)' : '0 0 14px rgba(217, 119, 6, 0.9)'
            }}>
              <Truck size={14} />
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
            fontSize: 15,
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
    </div>
  );
}
