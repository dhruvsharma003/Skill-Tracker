import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from './StatCard';
import { StatusBadge } from './StatusBadge';
import { EvidenceModal } from './EvidenceModal';
import { BookOpen, FlaskConical, Trophy, CheckCircle2, Clock, ExternalLink, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';

export const GraduateDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getGraduateProgress();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleSaveProgress = async (moduleId, payload) => {
    await api.updateGraduateProgress(moduleId, payload);
    await fetchProgress();
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading your capstone progress...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Error Loading Dashboard</h3>
          <p className="text-xs text-rose-300 mt-1">{error}</p>
          <button
            onClick={fetchProgress}
            className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const modules = data?.modules || [];
  const topics = ['ALL', ...new Set(modules.map((m) => m.topic))];

  const filteredModules = modules.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'ALL' || m.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <span>Graduate Cohort Learner View</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {data?.graduate?.name || user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Track your AWS training curriculum, verify hands-on lab exercises, and submit evidence links for mentor review.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur p-3.5 rounded-xl border border-slate-700 self-start md:self-auto">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              {data?.overallPercentage}%
            </div>
            <div className="text-xs">
              <div className="text-slate-400">Total Completion</div>
              <div className="font-semibold text-white">
                {data?.overallPercentage >= 100 ? 'Capstone Completed!' : 'In Progress'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${data?.overallPercentage || 0}%`}
          progress={data?.overallPercentage || 0}
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Training Modules"
          value={`${data?.trainingCompletedCount || 0} / ${data?.totalModules || 8}`}
          progress={data?.trainingPercentage || 0}
          subtext={`${data?.trainingPercentage || 0}% theory completed`}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Hands-on Labs"
          value={`${data?.labCompletedCount || 0} / ${data?.labRequiredTotal || 7}`}
          progress={data?.labPercentage || 0}
          subtext={`${data?.labPercentage || 0}% labs verified`}
          icon={FlaskConical}
          color="purple"
        />
        <StatCard
          title="Curriculum Time"
          value="86 Hours"
          subtext="8 AWS Core Capstone Domains"
          icon={Clock}
          color="emerald"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTopic === topic
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Core Training Modules</span>
            <span className="text-xs font-normal text-slate-400">
              ({filteredModules.length} of {modules.length})
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModules.map((module) => (
            <div
              key={module.moduleId}
              className="bg-slate-800/80 backdrop-blur border border-slate-700/70 hover:border-slate-600 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                {/* Module Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                      M{module.sequenceNo}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {module.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">{module.topic}</span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 whitespace-nowrap bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/50">
                    {module.estimatedHours || 8} hrs
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {module.description}
                </p>

                {/* Status Section */}
                <div className="bg-slate-900/70 rounded-lg p-3 border border-slate-700/50 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      Training:
                    </span>
                    <StatusBadge status={module.trainingStatus} />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                      Hands-on Lab:
                    </span>
                    <StatusBadge status={module.labRequired ? module.labStatus : 'WAIVED'} />
                  </div>

                  {module.evidenceUrl && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Lab Evidence:</span>
                      <a
                        href={module.evidenceUrl.startsWith('http') ? module.evidenceUrl : `https://${module.evidenceUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-medium"
                      >
                        Evidence Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedModule(module)}
                className="w-full py-2 px-3 bg-slate-700/80 hover:bg-amber-500 hover:text-slate-950 text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-600/50 hover:border-amber-400"
              >
                <span>Update Progress &amp; Evidence</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Update Progress Modal */}
      <EvidenceModal
        isOpen={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        moduleData={selectedModule}
        onSave={handleSaveProgress}
      />
    </div>
  );
};
