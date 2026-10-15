import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { GraduateDashboard } from './components/GraduateDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { RefreshCw } from 'lucide-react';

const AppContent = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b132b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Initializing SkillTrack...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#0b132b] flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16">
        {user?.role === 'MENTOR' ? <MentorDashboard /> : <GraduateDashboard />}
      </main>
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>SkillTrack Capstone • Amazon RDS PostgreSQL &amp; Spring Boot Architecture</div>
          <div className="text-slate-400">20 Graduate Hires • 2 Dedicated Dashboards</div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
