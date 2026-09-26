import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KarmaSubmission } from '../../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  Search,
  MessageSquare,
  FileCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VolunteerDashboard: React.FC = () => {
  const {
    currentUser,
    submissions,
    reviewSubmissionVolunteer,
    groupRankings,
    allUsers,
    announcements,
  } = useApp();

  const [selectedGroupId, setSelectedGroupId] = useState<string>('ALL');
  const [rejectingSub, setRejectingSub] = useState<KarmaSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'students' | 'groups' | 'announcements'>('reviews');

  if (!currentUser || currentUser.role !== 'VOLUNTEER') {
    return (
      <div className="max-w-page" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Volunteer Access Required</h2>
        <p style={{ color: 'var(--warm-white-dim)', marginTop: '8px' }}>
          Please sign in with a registered volunteer mentor account.
        </p>
      </div>
    );
  }

  const assignedGroupIds = currentUser.assigned_group_ids || [];
  const assignedGroups = groupRankings.filter((g) => assignedGroupIds.includes(g.id));

  // Submissions requiring Stage 1 review for assigned groups
  const pendingReviews = submissions.filter((s) => {
    const isStage1 = s.status === 'PENDING_VOLUNTEER_REVIEW' || s.status === 'RESUBMITTED';
    const isInAssignedGroup =
      assignedGroupIds.length === 0 || assignedGroupIds.includes(s.group_id);
    const matchesFilter = selectedGroupId === 'ALL' || s.group_id === selectedGroupId;
    return isStage1 && isInAssignedGroup && matchesFilter;
  });

  // Students in assigned groups
  const assignedStudents = allUsers.filter(
    (u) =>
      u.role === 'STUDENT' &&
      (assignedGroupIds.length === 0 || (u.group_id && assignedGroupIds.includes(u.group_id)))
  );

  const handleApprove = (submissionId: string, taskName: string) => {
    reviewSubmissionVolunteer(submissionId, 'APPROVE');
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
  };

  const handleConfirmReject = () => {
    if (!rejectingSub) return;
    if (!rejectReason.trim()) {
      alert('Please provide a mandatory rejection reason explaining what the student needs to fix.');
      return;
    }
    reviewSubmissionVolunteer(rejectingSub.id, 'REJECT', rejectReason.trim());
    setRejectingSub(null);
    setRejectReason('');
  };

  const totalAssignedKarma = assignedGroups.reduce((sum, g) => sum + (g.total_karma || 0), 0);

  return (
    <div className="max-w-page" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
      {/* Volunteer Header */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-volunteer">VOLUNTEER MENTOR PORTAL</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--warm-white-dim)' }}>
              {currentUser.registration_id}
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#FFF', margin: '6px 0 2px' }}>
            {currentUser.full_name}
          </h1>
          <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem', margin: 0 }}>
            {currentUser.college} • @{currentUser.mulearn_username}
          </p>
        </div>

        {/* Volunteer Stats */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="stat-card" style={{ padding: '12px 18px' }}>
            <span className="stat-label">Assigned Groups</span>
            <span className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)' }}>
              {assignedGroups.length}
            </span>
          </div>
          <div className="stat-card" style={{ padding: '12px 18px' }}>
            <span className="stat-label">Total Group Karma</span>
            <span className="stat-value" style={{ fontSize: '1.4rem', color: '#10B981' }}>
              {totalAssignedKarma.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header" style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
        >
          <FileCheck size={16} /> Stage 1 Review Queue ({pendingReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
        >
          <Users size={16} /> Assigned Students ({assignedStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
        >
          <TrendingUp size={16} /> Group Performance
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
        >
          <Sparkles size={16} /> Announcements
        </button>
      </div>

      {/* TAB 1: STAGE 1 REVIEW QUEUE */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Group Filter */}
          {assignedGroups.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--warm-white-dim)' }}>Filter by Group:</span>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="input-field"
                style={{ width: 'auto' }}
              >
                <option value="ALL">All Assigned Groups</option>
                {assignedGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {pendingReviews.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--warm-white-dim)' }}>
              <CheckCircle2 size={48} color="#10B981" style={{ opacity: 0.5, marginBottom: '12px' }} />
              <h3 style={{ color: '#FFF', marginBottom: '6px' }}>Stage 1 Review Queue Clear!</h3>
              <p style={{ fontSize: '0.9rem' }}>
                All student submissions in your assigned groups have been reviewed.
              </p>
            </div>
          ) : (
            pendingReviews.map((sub) => (
              <div key={sub.id} className="glass-panel" style={{ padding: '24px' }}>
                <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-pending">Stage 1 Review</span>
                      <strong style={{ color: '#FFF', fontSize: '1.2rem' }}>{sub.task_name}</strong>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--warm-white-dim)' }}>
                      Student: <strong style={{ color: 'var(--warm-white)' }}>{sub.student_name}</strong> • Group: <strong style={{ color: 'var(--accent-cyan)' }}>{sub.group_name}</strong> • @{sub.student_mulearn}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>
                      +{sub.claimed_karma} KARMA
                    </span>
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <p style={{ color: 'var(--warm-white)', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                    {sub.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem' }}>
                    <a
                      href={sub.mulearn_task_link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#38BDF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ExternalLink size={14} /> Open μLearn Task Link
                    </a>
                    {sub.proof_url && (
                      <a
                        href={sub.proof_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#F59E0B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ExternalLink size={14} /> View Proof Screenshot / File
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setRejectingSub(sub);
                      setRejectReason('');
                    }}
                    className="btn-secondary"
                    style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)', gap: '6px' }}
                  >
                    <XCircle size={16} /> Reject Submission
                  </button>
                  <button
                    onClick={() => handleApprove(sub.id, sub.task_name)}
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', gap: '6px' }}
                  >
                    <CheckCircle2 size={16} /> Approve (Advance to Admin)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ASSIGNED STUDENTS */}
      {activeTab === 'students' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '16px' }}>
            Assigned Group Students
          </h2>
          <table className="stride-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Student Name</th>
                <th>Group</th>
                <th>College</th>
                <th>μLearn ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedStudents.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {s.registration_id}
                  </td>
                  <td>
                    <strong style={{ color: '#FFF' }}>{s.full_name}</strong>
                  </td>
                  <td>{assignedGroups.find((g) => g.id === s.group_id)?.name || 'Group Alpha'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--warm-white-dim)' }}>{s.college}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>@{s.mulearn_username}</td>
                  <td>
                    <span className="badge badge-verified">ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: GROUP PERFORMANCE */}
      {activeTab === 'groups' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {assignedGroups.map((grp) => (
            <div key={grp.id} className="glass-panel" style={{ padding: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0 }}>{grp.name}</h3>
                <span className="badge badge-verified">LIVE STANDING</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <div className="flex-between">
                  <span style={{ color: 'var(--warm-white-dim)' }}>Total Verified Karma:</span>
                  <strong style={{ color: '#10B981', fontSize: '1.1rem' }}>
                    {grp.total_karma?.toLocaleString()}
                  </strong>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--warm-white-dim)' }}>Enrolled Students:</span>
                  <span>{grp.member_count} / {grp.capacity}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--warm-white-dim)' }}>Qualified (3K+ Karma):</span>
                  <span style={{ color: '#38BDF8', fontWeight: 700 }}>{grp.qualified_count} Students</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--warm-white-dim)' }}>Top Performer:</span>
                  <strong style={{ color: '#F59E0B' }}>{grp.top_student_name || 'None'}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map((ann) => (
            <div key={ann.id} className="glass-panel" style={{ padding: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FFF', margin: 0 }}>{ann.title}</h3>
                <span className="badge badge-pending">{ann.priority.toUpperCase()}</span>
              </div>
              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {ann.content}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)', marginTop: '8px', display: 'block' }}>
                Published by {ann.created_by_name} • {new Date(ann.published_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingSub && (
        <div className="modal-backdrop" onClick={() => setRejectingSub(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#EF4444', marginBottom: '8px' }}>
              Reject Task Submission
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--warm-white-dim)', marginBottom: '16px' }}>
              Provide constructive feedback to {rejectingSub.student_name} explaining what is missing or needs correction so they can fix and resubmit.
            </p>

            <textarea
              rows={4}
              placeholder="e.g. The Figma share link is set to private. Please change link permissions to public view and resubmit..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="input-field"
              style={{ marginBottom: '16px', resize: 'vertical' }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectingSub(null)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="btn-primary"
                style={{ background: '#EF4444', borderColor: '#DC2626' }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
