import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from './StatCard';
import { StatusBadge } from './StatusBadge';
import { EvidenceModal } from './EvidenceModal';
import { Users, BookOpen, FlaskConical, Award, Download, Search, Filter, Eye, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const MentorDashboard = () => {
  const { user } = useAuth();
  const [graduates, setGraduates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mentorFilter, setMentorFilter] = useState('ALL');
  const [exporting, setExporting] = useState(false);

  // Inspector modal state for reviewing a specific graduate's modules
  const [inspectingGrad, setInspectingGrad] = useState(null);
  const [inspectingData, setInspectingData] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  // Deep module evidence modal
  const [selectedModule, setSelectedModule] = useState(null);

  const fetchCohortData = async () => {
    try {
      setLoading(true);
      setError('');
      const [gradsRes, statsRes] = await Promise.all([
        api.getMentorGraduates(),
        api.getCohortStats()
      ]);
      setGraduates(gradsRes);
      setStats(statsRes);
    } catch (err) {
      setError(err.message || 'Failed to fetch cohort data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohortData();
  }, []);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await api.downloadCsvExport();
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleInspectGraduate = async (grad) => {
    setInspectingGrad(grad);
    setInspectLoading(true);
    try {
      const details = await api.getMentorGraduateDetails(grad.id);
      setInspectingData(details);
    } catch (err) {
      alert('Failed to load graduate details: ' + err.message);
      setInspectingGrad(null);
    } finally {
      setInspectLoading(false);
    }
  };

  if (loading && graduates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading Cohort Tracker...</p>
        </div>
      </div>
    );
  }

  if (error && graduates.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Error Loading Mentor Dashboard</h3>
          <p className="text-xs text-rose-300 mt-1">{error}</p>
          <button
            onClick={fetchCohortData}
            className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filtering graduates
  const filteredGraduates = graduates.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || g.status.toUpperCase().replace(/\s+/g, '_') === statusFilter.toUpperCase().replace(/\s+/g, '_');
    const matchesMentor =
      mentorFilter === 'ALL' || g.mentorName === mentorFilter;

    return matchesSearch && matchesStatus && matchesMentor;
  });

  const mentorNames = ['ALL', ...new Set(graduates.map((g) => g.mentorName).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Mentor Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <span>Mentor Cohort Management Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Monitor training completion, evaluate hands-on AWS lab evidence, and export progress reports across the entire 20-person graduate cohort.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Exporting...' : 'Export Progress (CSV)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cohort KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Graduate Cohort"
          value={`${stats?.totalGraduates || 20} Learners`}
          subtext={`${stats?.completedCount || 0} completed • ${stats?.onTrackCount || 0} on track`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Cohort Avg Training"
          value={`${stats?.cohortAvgTrainingPercentage || 0}%`}
          progress={stats?.cohortAvgTrainingPercentage || 0}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Cohort Avg Labs"
          value={`${stats?.cohortAvgLabPercentage || 0}%`}
          progress={stats?.cohortAvgLabPercentage || 0}
          icon={FlaskConical}
          color="amber"
        />
        <StatCard
          title="Submitted Lab Evidence"
          value={`${stats?.totalEvidenceSubmitted || 0} Artifacts`}
          subtext="Verified repositories &amp; logs"
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Cohort Status Breakdown Bar */}
      <div className="bg-slate-800/80 backdrop-blur border border-slate-700/70 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cohort Distribution:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            Completed: {stats?.completedCount || 0}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
            On Track: {stats?.onTrackCount || 0}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
            Behind: {stats?.behindCount || 0}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-700/40 text-slate-400 border border-slate-600/30 font-semibold">
            Not Started: {stats?.notStartedCount || 0}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search graduates by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Mentor filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Mentor:</span>
            <select
              value={mentorFilter}
              onChange={(e) => setMentorFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {mentorNames.map((m) => (
                <option key={m} value={m}>{m === 'ALL' ? 'All Mentors' : m}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_TRACK">On Track</option>
              <option value="BEHIND">Behind</option>
              <option value="NOT_STARTED">Not Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Graduate Cohort Records</span>
            <span className="text-xs font-normal text-slate-400">
              ({filteredGraduates.length} of {graduates.length})
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Graduate Learner</th>
                <th className="py-3.5 px-4">Assigned Mentor</th>
                <th className="py-3.5 px-4">Training Completion</th>
                <th className="py-3.5 px-4">Hands-on Labs</th>
                <th className="py-3.5 px-4">Overall Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-200">
              {filteredGraduates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No graduates matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredGraduates.map((grad) => (
                  <tr key={grad.id} className="hover:bg-slate-700/30 transition-colors">
                    {/* Graduate Info */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-white">{grad.name}</div>
                      <div className="text-[11px] text-slate-400">{grad.email}</div>
                    </td>

                    {/* Mentor */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2 py-1 rounded bg-slate-900/60 border border-slate-700/50 text-[11px]">
                        {grad.mentorName}
                      </span>
                    </td>

                    {/* Training Progress */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${grad.trainingPercentage}%` }}
                          />
                        </div>
                        <span className="font-semibold">{grad.trainingPercentage}%</span>
                        <span className="text-slate-400 text-[10px]">({grad.trainingCompleted}/{grad.totalModules})</span>
                      </div>
                    </td>

                    {/* Lab Progress */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full"
                            style={{ width: `${grad.labPercentage}%` }}
                          />
                        </div>
                        <span className="font-semibold">{grad.labPercentage}%</span>
                        <span className="text-slate-400 text-[10px]">({grad.labCompleted}/{grad.labRequiredTotal})</span>
                      </div>
                    </td>

                    {/* Overall Score */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-amber-400 text-sm">
                        {grad.overallPercentage}%
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={grad.status} />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleInspectGraduate(grad)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/80 hover:bg-amber-500 hover:text-slate-950 text-slate-200 rounded-lg text-xs font-semibold transition-all border border-slate-600/50 hover:border-amber-400"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graduate Inspector Modal */}
      {inspectingGrad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{inspectingGrad.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Assigned: {inspectingGrad.mentorName}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{inspectingGrad.email} • Overall Progress: {inspectingGrad.overallPercentage}%</p>
              </div>

              <button
                onClick={() => setInspectingGrad(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {inspectLoading ? (
                <div className="py-12 flex justify-center items-center">
                  <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Curriculum &amp; Submitted Lab Evidence
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {inspectingData?.modules?.map((m) => (
                      <div
                        key={m.moduleId}
                        className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center">
                                M{m.sequenceNo}
                              </span>
                              <h4 className="text-xs font-bold text-white line-clamp-1">{m.title}</h4>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">{m.topic}</span>
                          </div>

                          <div className="space-y-1.5 my-3 text-xs bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/40">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Training:</span>
                              <StatusBadge status={m.trainingStatus} />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Lab:</span>
                              <StatusBadge status={m.labRequired ? m.labStatus : 'WAIVED'} />
                            </div>
                          </div>

                          {m.evidenceNotes && (
                            <p className="text-[11px] text-slate-300 italic mb-2 line-clamp-2">
                              "{m.evidenceNotes}"
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          {m.evidenceUrl ? (
                            <a
                              href={m.evidenceUrl.startsWith('http') ? m.evidenceUrl : `https://${m.evidenceUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 text-xs font-medium inline-flex items-center gap-1"
                            >
                              Open Evidence <Eye className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-500 text-xs italic">No evidence link</span>
                          )}

                          <button
                            onClick={() => setSelectedModule(m)}
                            className="text-xs text-slate-300 hover:text-white underline"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-800/90 border-t border-slate-700/80 flex justify-end">
              <button
                onClick={() => setInspectingGrad(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Read-only module inspection modal */}
      {selectedModule && (
        <EvidenceModal
          isOpen={!!selectedModule}
          onClose={() => setSelectedModule(null)}
          moduleData={selectedModule}
          isReadOnly={true}
        />
      )}
    </div>
  );
};
