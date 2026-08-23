import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function UrgencyBadge({ score = 80, level = 'HIGH' }) {
  if (score >= 80 || level === 'HIGH' || level === 'CRITICAL') {
    return (
      <span className="badge-urgent pulse-urgent">
        <AlertCircle size={12} />
        <span>URGENT ({score}%)</span>
      </span>
    );
  }

  if (score >= 60 || level === 'MEDIUM') {
    return (
      <span className="badge-blue">
        <Clock size={12} />
        <span>MEDIUM PRIORITY ({score}%)</span>
      </span>
    );
  }

  return (
    <span className="badge-normal">
      <CheckCircle2 size={12} />
      <span>STABLE ({score}%)</span>
    </span>
  );
}
