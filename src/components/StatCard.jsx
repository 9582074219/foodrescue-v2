import React from 'react';

export default function StatCard({ title, value, unit, subtitle, icon: Icon, color = '#10b981', trend }) {
  return (
    <div className="card card-hover-effect" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>{title}</span>
        {Icon && (
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: `${color}18`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>{unit}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
        <span style={{ color: '#64748b' }}>{subtitle}</span>
        {trend && (
          <span style={{ fontWeight: 800, color: color, backgroundColor: `${color}15`, padding: '2px 8px', borderRadius: 6 }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
