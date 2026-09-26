import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, AlertTriangle, CheckCircle2, MessageSquare, ExternalLink, Search } from 'lucide-react';

export const ModeratorDashboard: React.FC = () => {
  const { currentUser, submissions, logAuditAction } = useApp();
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [modNote, setModNote] = useState<{ [id: string]: string }>({});

  if (!currentUser || (currentUser.role !== 'MODERATOR' && currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return (
      <div className="max-w-page" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Moderator Access Required</h2>
      </div>
    );
  }

  const handleFlagSubmission = (subId: string, studentName: string) => {
    if (!flaggedIds.includes(subId)) {
      setFlaggedIds([...flaggedIds, subId]);
      logAuditAction('MODERATOR_FLAG', 'SUBMISSION', subId, `Moderator ${currentUser.full_name} flagged submission from ${studentName} for suspicious proof link.`);
      alert(`Submission #${subId} flagged for senior admin investigation.`);
    }
  };

  return (
    <div className="max-w-page" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-volunteer">MODERATION QUEUE</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--warm-white-dim)', fontFamily: 'var(--font-mono)' }}>
            {currentUser.registration_id}
          </span>
        </div>
        <h1 style={{ fontSize: '1.8rem', color: '#FFF', margin: '6px 0 2px' }}>
          Moderator {currentUser.full_name}
        </h1>
        <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem', margin: 0 }}>
          Inspect task proof links, flag irregularities, and protect competition integrity.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#FFF' }}>All Active Submissions Stream</h2>

        {submissions.map((sub) => {
          const isFlagged = flaggedIds.includes(sub.id);
          return (
            <div key={sub.id} className="glass-panel" style={{ padding: '20px', borderColor: isFlagged ? '#EF4444' : undefined }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <div>
                  <strong style={{ color: '#FFF', fontSize: '1.1rem' }}>{sub.task_name}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--warm-white-dim)' }}>
                    Student: {sub.student_name} ({sub.group_name}) • Claimed: +{sub.claimed_karma} Karma
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-pending">{sub.status}</span>
                  {isFlagged && <span className="badge badge-rejected">⚠️ FLAGGED</span>}
                </div>
              </div>

              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.85rem', marginBottom: '12px' }}>
                {sub.description}
              </p>

              <div className="flex-between" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <a
                  href={sub.mulearn_task_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ExternalLink size={13} /> Check μLearn Link
                </a>

                <button
                  onClick={() => handleFlagSubmission(sub.id, sub.student_name)}
                  disabled={isFlagged}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#EF4444', gap: '4px' }}
                >
                  <AlertTriangle size={13} /> {isFlagged ? 'Flagged' : 'Flag Suspicious Link'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
