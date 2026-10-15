import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, color = 'blue', progress }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      bar: 'bg-blue-500'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      bar: 'bg-amber-500'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bar: 'bg-emerald-500'
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
      bar: 'bg-purple-500'
    },
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      bar: 'bg-rose-500'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${scheme.bg} ${scheme.border} border`}>
            <Icon className={`w-5 h-5 ${scheme.text}`} />
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-slate-200">{progress}%</span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scheme.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {subtext && !progress && (
        <p className="mt-3 text-xs text-slate-400">{subtext}</p>
      )}
    </div>
  );
};
