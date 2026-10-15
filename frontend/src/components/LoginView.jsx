import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cloud, Lock, Mail, UserCheck, ShieldAlert, ArrowRight, Database } from 'lucide-react';

export const LoginView = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    login(demoEmail, demoPassword).catch((err) => {
      setError(err.message || 'Login failed');
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1128] bg-radial flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 shadow-xl shadow-amber-500/20 mb-4">
          <Cloud className="w-9 h-9 text-slate-950" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          SkillTrack AWS Capstone
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
          Progress tracking platform for 20 graduate hires &amp; mentors.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-700/80 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-amber-500/20 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('sarah.jenkins@example.com', 'password123')}
                className="p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Mentor View</span>
                  <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded">Sarah</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-1">sarah.jenkins@example.com</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Cohort Oversight &amp; Review</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('alex.chen@example.com', 'password123')}
                className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Graduate View</span>
                  <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded">Alex</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-1">alex.chen@example.com</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Learner Dashboard &amp; Labs</div>
              </button>
            </div>

            <div className="mt-4 p-2.5 bg-slate-900/50 rounded-xl border border-slate-700/50 text-[11px] text-slate-400 text-center">
              Password for all demo accounts: <code className="text-amber-400 font-mono font-semibold">password123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
