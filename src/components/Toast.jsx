import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isInfo = toast.type === 'info';

  return (
    <div style={{
      position: 'fixed',
      top: 85,
      right: 24,
      zIndex: 10000,
      backgroundColor: '#0f172a',
      color: '#ffffff',
      border: isSuccess ? '1px solid #10b981' : isInfo ? '1px solid #0284c7' : '1px solid #f43f5e',
      borderRadius: 14,
      padding: '14px 20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      maxWidth: 420,
      animation: 'slideIn 0.3s ease'
    }}>
      <div style={{
        color: isSuccess ? '#10b981' : isInfo ? '#38bdf8' : '#f43f5e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isSuccess ? <CheckCircle2 size={20} /> : isInfo ? <Sparkles size={20} /> : <AlertCircle size={20} />}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
        {toast.message}
      </div>
    </div>
  );
}
