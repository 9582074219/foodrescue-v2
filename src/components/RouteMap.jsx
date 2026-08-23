import React, { useState, useEffect } from 'react';
import { Navigation, Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';

export default function RouteMap({ donorAddress, shelterAddress, status = 'IN_TRANSIT', etaMinutes = 8 }) {
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 95 ? 30 : p + 4));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#090d16',
      borderRadius: 18,
      border: '1px solid #1f2937',
      padding: '20px',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Navigation size={18} className="text-emerald-400" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
            LIVE GPS RESCUE TELEMETRY
          </span>
        </div>

        <span style={{ fontSize: 11, padding: '3px 8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: 6, fontWeight: 700 }}>
          ⚡ Fleet Tracking Active
        </span>
      </div>

      {/* Visual GPS Path */}
      <div style={{
        position: 'relative',
        height: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 30px',
        overflow: 'hidden'
      }}>
        
        {/* Glow Line */}
        <div style={{
          position: 'absolute',
          left: 40,
          right: 40,
          height: 4,
          backgroundColor: '#1e293b',
          borderRadius: 2
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)',
            boxShadow: '0 0 10px #10b981',
            borderRadius: 2,
            transition: 'width 0.8s ease'
          }} />
        </div>

        {/* Start Pin: Donor */}
        <div style={{
          position: 'absolute',
          left: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)' }}>
            🏢
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>Donor</span>
        </div>

        {/* Moving Van Icon */}
        <div style={{
          position: 'absolute',
          left: `calc(40px + ${progress}% * 0.75)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          transition: 'left 0.8s ease'
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(2, 132, 199, 0.8)'
          }}>
            <Truck size={16} />
          </div>
          <span style={{ fontSize: 9, fontWeight: 800, color: '#38bdf8' }}>~{etaMinutes}m ETA</span>
        </div>

        {/* End Pin: Shelter */}
        <div style={{
          position: 'absolute',
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(244, 63, 94, 0.6)' }}>
            🤝
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>Shelter</span>
        </div>

      </div>

      {/* Telemetry info footer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, fontSize: 11, color: '#94a3b8' }}>
        <div>
          <span style={{ color: '#64748b' }}>Pickup From:</span>
          <p style={{ fontWeight: 700, color: '#f1f5f9', margin: '2px 0 0' }}>{donorAddress || 'Donor Hub'}</p>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Delivery To:</span>
          <p style={{ fontWeight: 700, color: '#f1f5f9', margin: '2px 0 0' }}>{shelterAddress || 'Hope Shelter'}</p>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Estimated Time:</span>
          <p style={{ fontWeight: 700, color: '#34d399', margin: '2px 0 0' }}>~{etaMinutes} Mins (Clear Traffic)</p>
        </div>
      </div>
    </div>
  );
}
