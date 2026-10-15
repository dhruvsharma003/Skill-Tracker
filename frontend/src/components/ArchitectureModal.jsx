import React from 'react';
import { X, Cloud, Shield, Database, Cpu, HardDrive, Eye, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ArchitectureModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">SkillTrack AWS Architecture Blueprint</h2>
              <p className="text-xs text-slate-400">Graduate Hire Capstone • 2 Dashboards • Amazon RDS PostgreSQL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Architecture Flow Box */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-5">
            <h3 className="text-xs uppercase font-semibold text-amber-400 tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> End-to-End Request Flow &amp; Service Mapping
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center">
                <Shield className="w-6 h-6 text-rose-400 mb-2" />
                <span className="font-semibold text-white text-xs">1. Amazon Cognito</span>
                <span className="text-[11px] text-slate-400 mt-1">JWT Auth (Graduate &amp; Mentor Roles)</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center">
                <HardDrive className="w-6 h-6 text-cyan-400 mb-2" />
                <span className="font-semibold text-white text-xs">2. S3 + CloudFront</span>
                <span className="text-[11px] text-slate-400 mt-1">React SPA static distribution</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center">
                <Cpu className="w-6 h-6 text-amber-400 mb-2" />
                <span className="font-semibold text-white text-xs">3. API Gateway / REST</span>
                <span className="text-[11px] text-slate-400 mt-1">HTTPS RESTful APIs &amp; Route Authorizer</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center">
                <Layers className="w-6 h-6 text-indigo-400 mb-2" />
                <span className="font-semibold text-white text-xs">4. Spring Boot / Lambda</span>
                <span className="text-[11px] text-slate-400 mt-1">VPC Private Subnet Business Logic</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center">
                <Database className="w-6 h-6 text-blue-400 mb-2" />
                <span className="font-semibold text-white text-xs">5. RDS PostgreSQL</span>
                <span className="text-[11px] text-slate-400 mt-1">Multi-AZ Relational Data Storage</span>
              </div>
            </div>
          </div>

          {/* Key Architectural Decisions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-4">
              <h4 className="text-white font-semibold flex items-center gap-2 mb-2 text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Relational Data Model (3 Core Tables)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• <strong className="text-slate-200">graduates:</strong> Stores learner profile, role, and mentor assignment.</li>
                <li>• <strong className="text-slate-200">training_modules:</strong> Standardized curriculum, topic, lab requirement.</li>
                <li>• <strong className="text-slate-200">training_progress:</strong> Status, evidence link, notes, and timestamps.</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-4">
              <h4 className="text-white font-semibold flex items-center gap-2 mb-2 text-sm text-cyan-400">
                <CheckCircle2 className="w-4 h-4" /> Security &amp; Observability
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• <strong className="text-slate-200">Role-Based Access Control:</strong> Graduates restricted to own records.</li>
                <li>• <strong className="text-slate-200">Secrets Manager:</strong> Decoupled credentials &amp; encrypted tokens.</li>
                <li>• <strong className="text-slate-200">Observability:</strong> CloudWatch metrics &amp; structured logging.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-800/90 border-t border-slate-700/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
