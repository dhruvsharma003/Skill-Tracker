import React from 'react';
import { CheckCircle2, Clock, CircleDot, AlertCircle, CheckCheck } from 'lucide-react';

export const StatusBadge = ({ status, type = 'status' }) => {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  if (normalized === 'COMPLETED' || normalized === 'COMPLETE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        Completed
      </span>
    );
  }

  if (normalized === 'IN_PROGRESS' || normalized === 'ON_TRACK') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        {status === 'ON_TRACK' || status === 'On Track' ? 'On Track' : 'In Progress'}
      </span>
    );
  }

  if (normalized === 'BEHIND' || normalized === 'ACTION_REQUIRED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
        Behind
      </span>
    );
  }

  if (normalized === 'WAIVED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
        <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
        Waived / N/A
      </span>
    );
  }

  // NOT_STARTED or default
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/40 text-slate-400 border border-slate-600/30">
      <CircleDot className="w-3.5 h-3.5 text-slate-400" />
      Not Started
    </span>
  );
};
