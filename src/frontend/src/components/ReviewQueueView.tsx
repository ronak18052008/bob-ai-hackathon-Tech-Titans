import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  ArrowRight,
  Filter,
  FileText,
} from 'lucide-react';

export const ReviewQueueView: React.FC = () => {
  const { reviewQueue, setReviewQueue, addAuditLog, setSelectedPatient, patients, setActiveTab } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredItems =
    filterCategory === 'ALL'
      ? reviewQueue
      : reviewQueue.filter((item) => item.category === filterCategory);

  const handleAction = (id: string, newStatus: 'Verified' | 'Rejected' | 'Snoozed') => {
    setReviewQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    const item = reviewQueue.find((i) => i.id === id);
    addAuditLog(`REVIEW_${newStatus.toUpperCase()}`, `Doctor ${newStatus.toLowerCase()} item: ${item?.title}`);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Medication conflicts':
        return 'bg-error-soft text-error border-error/30';
      case 'Missing evidence':
        return 'bg-warning-soft text-warning border-warning/30';
      case 'Temporal anomalies':
        return 'bg-ai-soft text-ai border-ai/30';
      case 'Conflicting documents':
        return 'bg-error-soft text-error border-error/30';
      default:
        return 'bg-primary-soft text-primary border-primary/30';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Clinical Verification &amp; Governance
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Doctor Review Queue
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Audit AI-synthesized claims, resolve conflicting document pairs, and verify low-confidence records.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-text-muted">Pending Audits:</span>
          <span className="px-2.5 py-1 rounded-full bg-primary font-bold text-white">
            {reviewQueue.filter((i) => i.status === 'Pending').length} Pending
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto text-xs pb-1">
        {['ALL', 'Medication conflicts', 'Missing evidence', 'Conflicting documents', 'Temporal anomalies'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors font-medium ${
                filterCategory === cat
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface border-border text-text-muted hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.status === 'Pending'
                ? 'border-border bg-surface shadow-subtle'
                : 'border-border/60 bg-surface-secondary/40 opacity-70'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs text-text-muted font-semibold">
                    Patient:{' '}
                    <strong className="text-text-primary hover:underline cursor-pointer">
                      {item.patientName}
                    </strong>
                  </span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {item.createdAt.split('T')[0]}
                  </span>
                </div>

                <h3 className="font-bold text-base text-text-primary">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.details}</p>

                <div className="text-[11px] text-text-muted flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Assigned to: {item.assignedTo}</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col space-y-2 shrink-0 md:w-44">
                {item.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'Verified')}
                      className="w-full px-3 py-1.5 rounded-lg bg-success hover:bg-success/90 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify &amp; Accept</span>
                    </button>

                    <button
                      onClick={() => handleAction(item.id, 'Rejected')}
                      className="w-full px-3 py-1.5 rounded-lg bg-error hover:bg-error/90 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject AI Claim</span>
                    </button>

                    <button
                      onClick={() => handleAction(item.id, 'Snoozed')}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-text-secondary text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Snooze</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2 rounded-lg bg-surface border border-border">
                    <span className="text-[10px] uppercase font-bold text-text-muted">Resolved</span>
                    <div className="text-xs font-bold text-primary">{item.status}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReviewQueueView;
