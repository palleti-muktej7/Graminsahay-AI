import React from 'react';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';

export default function ConfidenceBadge({ level = 'HIGH', source = '', showSource = true }) {
  const normLevel = (level || 'HIGH').toUpperCase();

  let bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dot = 'bg-emerald-500';
  let Icon = ShieldCheck;

  if (normLevel.includes('MED')) {
    bg = 'bg-amber-50 text-amber-700 border-amber-200';
    dot = 'bg-amber-500';
    Icon = AlertTriangle;
  } else if (normLevel.includes('LOW')) {
    bg = 'bg-rose-50 text-rose-700 border-rose-200';
    dot = 'bg-rose-500';
    Icon = Info;
  }

  return (
    <div className="inline-flex flex-col gap-0.5">
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
        <Icon className="w-3.5 h-3.5" />
        <span>Confidence: {normLevel}</span>
      </div>
      {showSource && source && (
        <span className="text-[11px] text-slate-500 italic mt-0.5 flex items-center gap-1">
          📌 Source: {source}
        </span>
      )}
    </div>
  );
}
