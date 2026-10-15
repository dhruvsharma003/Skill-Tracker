import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Cloud, Shield, User, Info, Database } from 'lucide-react';
import { ArchitectureModal } from './ArchitectureModal';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [showArchModal, setShowArchModal] = useState(false);

  return (
    <>
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Project Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Cloud className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white tracking-tight">SkillTrack</span>
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                    AWS Capstone
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Graduate Hire Progress Tracker</p>
              </div>
            </div>

            {/* Right actions: Blueprint button + User Info + Logout */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowArchModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                title="View AWS Architecture Blueprint"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Architecture Blueprint</span>
              </button>

              {user && (
                <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.role === 'MENTOR'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {user.role}
                  </span>

                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ArchitectureModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />
    </>
  );
};
