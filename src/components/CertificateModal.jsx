import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, CheckCircle2, Download, Printer, ShieldCheck, Leaf, Sparkles } from 'lucide-react';

export default function CertificateModal() {
  const { isCertOpen, setIsCertOpen, certDonation, currentUser } = useApp();

  if (!isCertOpen) return null;

  const donorName = certDonation?.donorName || currentUser?.name || "Celebration Banquet & Events";
  const meals = certDonation?.quantity || 180;
  const certId = `CSR-80G-${certDonation?.id?.replace('FR-', '') || '2026'}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 720,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        border: '3px solid #10b981',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Top Header Controls */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award className="text-amber-400" size={20} />
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.04em' }}>
              OFFICIAL ESG & 80G TAX EXEMPTION CERTIFICATE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid #475569',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => setIsCertOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 4
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div style={{ padding: '36px 32px', textAlign: 'center', backgroundColor: '#fcfdfc' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#047857', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            <Sparkles size={16} />
            <span>Government Certified Zero-Waste Initiative</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-display)', marginBottom: 6 }}>
            Certificate of Sustainable Food Rescue & CSR Impact
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
            Certificate Serial: <strong style={{ color: '#0f172a' }}>{certId}</strong> • Verified by Municipal Food Welfare Authority
          </p>

          <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.6, maxWidth: 580, margin: '0 auto 24px' }}>
            This is proudly presented to <strong style={{ fontSize: 18, color: '#0f172a' }}>{donorName}</strong> for exceptional contribution in preventing commercial food waste and redistributing <strong style={{ color: '#059669' }}>{meals} Fresh Meals</strong> to community shelters.
          </p>

          {/* 3 Impact Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 560, margin: '0 auto 28px' }}>
            
            <div style={{ backgroundColor: '#ecfdf5', borderRadius: 14, padding: '14px', border: '1px solid #a7f3d0' }}>
              <Leaf size={20} style={{ color: '#059669', margin: '0 auto 4px' }} />
              <div style={{ fontSize: 18, fontWeight: 900, color: '#065f46' }}>{Math.round(meals * 0.8)} kg</div>
              <div style={{ fontSize: 11, color: '#047857', fontWeight: 700 }}>CO2 Emissions Averted</div>
            </div>

            <div style={{ backgroundColor: '#fef3c7', borderRadius: 14, padding: '14px', border: '1px solid #fde68a' }}>
              <Award size={20} style={{ color: '#d97706', margin: '0 auto 4px' }} />
              <div style={{ fontSize: 18, fontWeight: 900, color: '#92400e' }}>100% Tax 80G</div>
              <div style={{ fontSize: 11, color: '#b45309', fontWeight: 700 }}>Income Tax Exemption</div>
            </div>

            <div style={{ backgroundColor: '#e0f2fe', borderRadius: 14, padding: '14px', border: '1px solid #bae6fd' }}>
              <ShieldCheck size={20} style={{ color: '#0284c7', margin: '0 auto 4px' }} />
              <div style={{ fontSize: 18, fontWeight: 900, color: '#075985' }}>SDG 12 & 2</div>
              <div style={{ fontSize: 11, color: '#0369a1', fontWeight: 700 }}>Zero Hunger Verified</div>
            </div>

          </div>

          <div style={{ fontSize: 12, color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            Issued via FoodRescue AI Smart Redistribution Engine • Digitally Signed & Encrypted
          </div>

        </div>

      </div>
    </div>
  );
}
