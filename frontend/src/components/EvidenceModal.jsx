import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Save, BookOpen, FlaskConical, Link2, FileText, CheckCircle2 } from 'lucide-react';

export const EvidenceModal = ({ isOpen, onClose, moduleData, onSave, isReadOnly = false }) => {
  const [trainingStatus, setTrainingStatus] = useState('NOT_STARTED');
  const [labStatus, setLabStatus] = useState('NOT_STARTED');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (moduleData) {
      setTrainingStatus(moduleData.trainingStatus || 'NOT_STARTED');
      setLabStatus(moduleData.labStatus || 'NOT_STARTED');
      setEvidenceUrl(moduleData.evidenceUrl || '');
      setEvidenceNotes(moduleData.evidenceNotes || '');
      setError('');
    }
  }, [moduleData]);

  if (!isOpen || !moduleData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If lab is required and marked completed, encourage evidence URL
    if (moduleData.labRequired && labStatus === 'COMPLETED' && !evidenceUrl.trim()) {
      setError('Please provide a valid evidence URL (e.g. GitHub repo, PR link, or CloudWatch log snippet) for completed labs.');
      return;
    }

    setSaving(true);
    try {
      await onSave(moduleData.moduleId, {
        trainingStatus,
        labStatus: moduleData.labRequired ? labStatus : 'WAIVED',
        evidenceUrl: evidenceUrl.trim(),
        evidenceNotes: evidenceNotes.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save progress update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
              M{moduleData.sequenceNo}
            </span>
            <div>
              <h2 className="text-base font-bold text-white truncate max-w-md">
                {moduleData.title}
              </h2>
              <p className="text-xs text-slate-400">{moduleData.topic} • {moduleData.estimatedHours || 8} hrs estimated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Module description */}
          {moduleData.description && (
            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Curriculum Scope: </span>
              {moduleData.description}
            </div>
          )}

          {/* Status Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Training Status */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                Training / Theory Status
              </label>
              {isReadOnly ? (
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-xs font-medium text-white">
                  {trainingStatus}
                </div>
              ) : (
                <select
                  value={trainingStatus}
                  onChange={(e) => setTrainingStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="NOT_STARTED">NOT_STARTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              )}
            </div>

            {/* Lab Status */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                Hands-on Lab Status
              </label>
              {!moduleData.labRequired ? (
                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-700/60 text-xs text-slate-400 italic">
                  No Lab Required for this module
                </div>
              ) : isReadOnly ? (
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-xs font-medium text-white">
                  {labStatus}
                </div>
              ) : (
                <select
                  value={labStatus}
                  onChange={(e) => setLabStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="NOT_STARTED">NOT_STARTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="WAIVED">WAIVED</option>
                </select>
              )}
            </div>
          </div>

          {/* Evidence URL */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                Lab Evidence Link (GitHub Repo / PR / CloudWatch / S3)
              </span>
              {evidenceUrl && (
                <a
                  href={evidenceUrl.startsWith('http') ? evidenceUrl : `https://${evidenceUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  Open Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>

            {isReadOnly ? (
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-xs text-slate-200 break-all">
                {evidenceUrl || <span className="text-slate-500 italic">No evidence link submitted</span>}
              </div>
            ) : (
              <input
                type="text"
                placeholder="https://github.com/my-org/aws-capstone-lab"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            )}
          </div>

          {/* Evidence Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Notes &amp; Lab Verification Summary
            </label>

            {isReadOnly ? (
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-xs text-slate-300 whitespace-pre-wrap min-h-[60px]">
                {evidenceNotes || <span className="text-slate-500 italic">No notes provided</span>}
              </div>
            ) : (
              <textarea
                rows={3}
                placeholder="Detail key architectural decisions, test verification commands, or VPC parameters..."
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            )}
          </div>

          {/* Footer actions */}
          <div className="pt-2 border-t border-slate-700/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>

            {!isReadOnly && (
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Progress'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
