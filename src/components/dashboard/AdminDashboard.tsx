import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KarmaSubmission, UserProfile, UserRole, Group, Certificate } from '../../types';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Users,
  Layers,
  Settings,
  FileSpreadsheet,
  History,
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Award,
  ExternalLink,
  Sparkles,
  Zap,
  Calendar,
  AlertTriangle,
  Download,
  Check,
} from 'lucide-react';
import { CertificateModal } from '../common/CertificateModal';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    allUsers,
    groups,
    submissions,
    reviewSubmissionAdmin,
    adminOverrideSubmission,
    createGroup,
    updateGroupCapacity,
    renameGroup,
    toggleGroupStatus,
    assignVolunteerToGroup,
    removeVolunteerFromGroup,
    deleteGroup,
    setUserStatus,
    changeUserRole,
    announcements,
    createAnnouncement,
    deleteAnnouncement,
    auditLogs,
    exportDataCSV,
    eventSettings,
    updateEventSettings,
    leaderboard,
    generateCertificateForStudent,
  } = useApp();

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'verification' | 'users' | 'groups' | 'announcements' | 'certificates' | 'audit' | 'settings'
  >('analytics');

  // Stage 2 Admin Verification Queue
  const adminPendingSubmissions = submissions.filter(
    (s) => s.status === 'PENDING_ADMIN_REVIEW' || s.status === 'VOLUNTEER_APPROVED'
  );

  // Admin Review Modal States
  const [rejectingSub, setRejectingSub] = useState<KarmaSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // User Manager Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Group Creation Form
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCapacity, setNewGroupCapacity] = useState(500);
  const [editingCapacityGroupId, setEditingCapacityGroupId] = useState<string | null>(null);
  const [editCapacityVal, setEditCapacityVal] = useState<number>(500);

  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  // Selected Student for Certificate Modal
  const [certStudent, setCertStudent] = useState<UserProfile | null>(null);

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return (
      <div className="max-w-page" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Administrator Access Required</h2>
        <p style={{ color: 'var(--warm-white-dim)', marginTop: '8px' }}>
          Please sign in with authorized Administrative credentials.
        </p>
      </div>
    );
  }

  // Analytics Computations
  const totalStudents = allUsers.filter((u) => u.role === 'STUDENT').length;
  const totalVolunteers = allUsers.filter((u) => u.role === 'VOLUNTEER').length;
  const verifiedSubmissions = submissions.filter((s) => s.status === 'VERIFIED');
  const totalVerifiedKarma = verifiedSubmissions.reduce((sum, s) => sum + s.claimed_karma, 0);
  const totalClaimedKarma = submissions.reduce((sum, s) => sum + s.claimed_karma, 0);
  const qualifiedStudentsCount = leaderboard.filter((l) => l.is_qualified).length;
  const qualificationRate = totalStudents > 0 ? Math.round((qualifiedStudentsCount / totalStudents) * 100) : 0;

  // Filtered Users List
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.registration_id.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.mulearn_username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.college.toLowerCase().includes(userSearch.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const res = createGroup(newGroupName, newGroupCapacity);
    if (res.success) {
      setNewGroupName('');
      setNewGroupCapacity(500);
    } else {
      alert(res.message);
    }
  };

  const handleAdminApprove = (submissionId: string) => {
    reviewSubmissionAdmin(submissionId, 'APPROVE');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleConfirmAdminReject = () => {
    if (!rejectingSub) return;
    if (!rejectReason.trim()) {
      alert('Please provide a mandatory rejection reason.');
      return;
    }
    reviewSubmissionAdmin(rejectingSub.id, 'REJECT', rejectReason.trim());
    setRejectingSub(null);
    setRejectReason('');
  };

  const handleCreateAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    createAnnouncement(annTitle, annContent, annPriority);
    setAnnTitle('');
    setAnnContent('');
    alert('Announcement published and broadcasted!');
  };

  return (
    <div className="max-w-page" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
      {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className={isSuperAdmin ? 'badge badge-rejected' : 'badge badge-admin'}>
              {isSuperAdmin ? '👑 SUPER ADMIN CONTROL HUB' : '⚙️ EVENT ADMIN PORTAL'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--warm-white-dim)' }}>
              {currentUser.registration_id}
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#FFF', margin: 0 }}>
            {currentUser.full_name}
          </h1>
          <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem', margin: '2px 0 0' }}>
            Full Event Management • 2-Stage Verification • Security & RBAC Enforcement
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => exportDataCSV('STUDENTS')}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="tabs-header" style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          <BarChart3 size={16} /> Analytics & Metrics
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`tab-btn ${activeTab === 'verification' ? 'active' : ''}`}
        >
          <CheckCircle2 size={16} /> Stage 2 Verification ({adminPendingSubmissions.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          <Users size={16} /> User Directory ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
        >
          <Layers size={16} /> Group Management ({groups.length})
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
        >
          <Sparkles size={16} /> Announcements
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
        >
          <Award size={16} /> Certificates Hub
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
        >
          <History size={16} /> Audit Logs ({auditLogs.length})
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={16} /> Event Settings & Overrides
          </button>
        )}
      </div>

      {/* TAB 1: ANALYTICS HUB */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="stat-card">
              <span className="stat-label">Total Students</span>
              <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
                {totalStudents}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                Across {groups.length} Groups
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Volunteers</span>
              <span className="stat-value" style={{ color: '#3B82F6' }}>
                {totalVolunteers}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                Mentoring active cohorts
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Verified Karma</span>
              <span className="stat-value" style={{ color: '#10B981' }}>
                {totalVerifiedKarma.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                Of {totalClaimedKarma.toLocaleString()} Claimed
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">3K+ Qualified Students</span>
              <span className="stat-value" style={{ color: '#F59E0B' }}>
                {qualifiedStudentsCount} ({qualificationRate}%)
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                Target: 3,000 Karma
              </span>
            </div>
          </div>

          {/* Submission Funnel Breakdown */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '16px' }}>
              Submission Pipeline & Verification Funnel
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)', display: 'block' }}>Total Submissions</span>
                <strong style={{ fontSize: '1.4rem', color: '#FFF' }}>{submissions.length}</strong>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: '#F59E0B', display: 'block' }}>Stage 1 (Volunteer Queue)</span>
                <strong style={{ fontSize: '1.4rem', color: '#F59E0B' }}>
                  {submissions.filter((s) => s.status === 'PENDING_VOLUNTEER_REVIEW').length}
                </strong>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: '#38BDF8', display: 'block' }}>Stage 2 (Admin Queue)</span>
                <strong style={{ fontSize: '1.4rem', color: '#38BDF8' }}>
                  {submissions.filter((s) => s.status === 'PENDING_ADMIN_REVIEW' || s.status === 'VOLUNTEER_APPROVED').length}
                </strong>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'block' }}>Verified & Credited</span>
                <strong style={{ fontSize: '1.4rem', color: '#10B981' }}>
                  {submissions.filter((s) => s.status === 'VERIFIED').length}
                </strong>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: '#EF4444', display: 'block' }}>Rejected Submissions</span>
                <strong style={{ fontSize: '1.4rem', color: '#EF4444' }}>
                  {submissions.filter((s) => s.status === 'REJECTED').length}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAGE 2 KARMA VERIFICATION */}
      {activeTab === 'verification' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="flex-between">
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>
                Stage 2 Final Admin Review Queue
              </h2>
              <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                These submissions have passed Stage 1 Volunteer checks and await final ledger credit.
              </p>
            </div>
            <span className="badge badge-admin">{adminPendingSubmissions.length} Pending Approval</span>
          </div>

          {adminPendingSubmissions.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--warm-white-dim)' }}>
              <CheckCircle2 size={48} color="#10B981" style={{ opacity: 0.5, marginBottom: '12px' }} />
              <h3 style={{ color: '#FFF', marginBottom: '6px' }}>Admin Verification Queue Clear!</h3>
              <p style={{ fontSize: '0.9rem' }}>All approved volunteer submissions have been finalized.</p>
            </div>
          ) : (
            adminPendingSubmissions.map((sub) => (
              <div key={sub.id} className="glass-panel" style={{ padding: '24px' }}>
                <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-volunteer">Passed Stage 1</span>
                      <strong style={{ color: '#FFF', fontSize: '1.25rem' }}>{sub.task_name}</strong>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--warm-white-dim)' }}>
                      Student: <strong style={{ color: '#FFF' }}>{sub.student_name}</strong> ({sub.group_name}) • @{sub.student_mulearn}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: '#10B981' }}>
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
                        <ExternalLink size={14} /> View Proof Screenshot
                      </a>
                    )}
                  </div>
                </div>

                {/* Volunteer Notes */}
                {sub.reviews && sub.reviews.length > 0 && (
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '16px' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>Volunteer Note: </span>
                    <span style={{ color: 'var(--warm-white)' }}>
                      {sub.reviews[sub.reviews.length - 1].reason} (by {sub.reviews[sub.reviews.length - 1].reviewer_name})
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setRejectingSub(sub);
                      setRejectReason('');
                    }}
                    className="btn-secondary"
                    style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  >
                    <XCircle size={16} /> Reject Submission
                  </button>
                  <button
                    onClick={() => handleAdminApprove(sub.id)}
                    className="btn-gold"
                    style={{ gap: '6px' }}
                  >
                    <CheckCircle2 size={16} /> Final Verify & Credit Karma
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filters */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-white-dim)' }} />
              <input
                type="text"
                placeholder="Search by name, email, admission ID, college..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px' }}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="VOLUNTEER">Volunteers</option>
              <option value="MODERATOR">Moderators</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">Super Admins</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          {/* Table */}
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table className="stride-table">
              <thead>
                <tr>
                  <th>Reg ID</th>
                  <th>Name & Contact</th>
                  <th>Role</th>
                  <th>College & Branch</th>
                  <th>Group</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isBlocked = u.status === 'BLOCKED';
                  const assignedGrp = groups.find((g) => g.id === u.group_id);

                  return (
                    <tr key={u.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.82rem' }}>
                        {u.registration_id}
                      </td>
                      <td>
                        <strong style={{ color: '#FFF' }}>{u.full_name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                          {u.email} • {u.phone}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-volunteer">{u.role}</span>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        <div>{u.college}</div>
                        <span style={{ color: 'var(--warm-white-dim)' }}>{u.branch}</span>
                      </td>
                      <td>{assignedGrp?.name || '—'}</td>
                      <td>
                        {isBlocked ? (
                          <span className="badge badge-rejected">BLOCKED</span>
                        ) : (
                          <span className="badge badge-verified">ACTIVE</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {isBlocked ? (
                            <button
                              onClick={() => setUserStatus(u.id, 'ACTIVE', 'Admin unblocked account')}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#10B981' }}
                              title="Unblock User"
                            >
                              <Unlock size={14} /> Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => setUserStatus(u.id, 'BLOCKED', 'Admin security block')}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#EF4444' }}
                              title="Block User"
                            >
                              <Lock size={14} /> Block
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GROUP MANAGEMENT */}
      {activeTab === 'groups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Create Group Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '14px' }}>Create New Student Group</h3>
            <form onSubmit={handleCreateGroup} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Group Name (e.g. Group Omega)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="input-field"
                style={{ flex: 2, minWidth: '200px' }}
                required
              />
              <input
                type="number"
                placeholder="Capacity (e.g. 500)"
                value={newGroupCapacity}
                onChange={(e) => setNewGroupCapacity(Number(e.target.value))}
                className="input-field"
                style={{ flex: 1, minWidth: '120px' }}
                min="1"
                required
              />
              <button type="submit" className="btn-primary" style={{ gap: '6px' }}>
                <Plus size={16} /> Create Group
              </button>
            </form>
          </div>

          {/* Group List & Capacity Controls */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '16px' }}>Active Groups & Mentorship Allocations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {groups.map((grp) => {
                const memberCount = allUsers.filter((u) => u.group_id === grp.id).length;
                const isFull = memberCount >= grp.capacity;

                return (
                  <div
                    key={grp.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: '#FFF', fontSize: '1.1rem' }}>{grp.name}</strong>
                        {isFull ? (
                          <span className="badge badge-full">⚠️ FULL</span>
                        ) : (
                          <span className="badge badge-available">🟢 AVAILABLE</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--warm-white-dim)' }}>
                        Capacity: {memberCount} / {grp.capacity} students enrolled
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {editingCapacityGroupId === grp.id ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="number"
                            value={editCapacityVal}
                            onChange={(e) => setEditCapacityVal(Number(e.target.value))}
                            className="input-field"
                            style={{ width: '80px', padding: '6px' }}
                            min="1"
                          />
                          <button
                            onClick={() => {
                              updateGroupCapacity(grp.id, editCapacityVal);
                              setEditingCapacityGroupId(null);
                            }}
                            className="btn-primary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCapacityGroupId(grp.id);
                            setEditCapacityVal(grp.capacity);
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
                        >
                          <Edit2 size={13} /> Edit Capacity
                        </button>
                      )}

                      {isSuperAdmin && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete group "${grp.name}"?`)) {
                              const res = deleteGroup(grp.id);
                              if (!res.success) alert(res.message);
                            }
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#EF4444' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '14px' }}>Broadcast New Announcement</h3>
            <form onSubmit={handleCreateAnn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                placeholder="Announcement Title"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="input-field"
                required
              />
              <textarea
                rows={3}
                placeholder="Announcement message content to broadcast to all participants..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                className="input-field"
                required
              />
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="input-field"
                  style={{ width: 'auto' }}
                >
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Announcement</option>
                </select>
                <button type="submit" className="btn-gold" style={{ padding: '10px 20px' }}>
                  Publish & Broadcast
                </button>
              </div>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '16px' }}>Published Announcements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {announcements.map((ann) => (
                <div key={ann.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px' }}>
                  <div className="flex-between">
                    <h4 style={{ color: '#FFF', margin: '0 0 4px 0' }}>{ann.title}</h4>
                    <span className="badge badge-pending">{ann.priority}</span>
                  </div>
                  <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.88rem', margin: 0 }}>{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CERTIFICATES HUB */}
      {activeTab === 'certificates' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>Certificates Hub</h2>
              <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem' }}>
                Participants reaching 3,000+ Verified Karma qualify for official digital certificate generation.
              </p>
            </div>
          </div>

          <table className="stride-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Group</th>
                <th>Verified Karma</th>
                <th>Eligibility</th>
                <th style={{ textAlign: 'right' }}>Certificate Action</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((l) => {
                const student = allUsers.find((u) => u.id === l.student_id);
                return (
                  <tr key={l.student_id}>
                    <td>#{l.rank}</td>
                    <td>
                      <strong style={{ color: '#FFF' }}>{l.student_name}</strong>
                    </td>
                    <td>{l.group_name}</td>
                    <td style={{ fontWeight: 800, color: '#10B981' }}>{l.verified_karma} Karma</td>
                    <td>
                      {l.is_qualified ? (
                        <span className="badge badge-qualified">QUALIFIED (3K+)</span>
                      ) : (
                        <span className="badge badge-not-qualified">IN PROGRESS</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => student && setCertStudent(student)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
                      >
                        <Award size={14} /> Preview Certificate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>System Audit Trail</h2>
            <button onClick={() => exportDataCSV('AUDIT_LOGS')} className="btn-secondary" style={{ fontSize: '0.8rem', gap: '6px' }}>
              <Download size={14} /> Export Audit CSV
            </button>
          </div>

          <table className="stride-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--warm-white-dim)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <strong style={{ color: '#FFF' }}>{log.actor_name}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', display: 'block' }}>
                      {log.actor_role}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-volunteer">{log.action}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--warm-white-subtle)' }}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 8: EVENT SETTINGS & OVERRIDES (Super Admin Only) */}
      {isSuperAdmin && activeTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#FFF', marginBottom: '8px' }}>
            Event Lifecycle Configuration & Overrides
          </h2>
          <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Dynamic settings configure the live countdown, submission gates, and qualification thresholds.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Qualification Karma Threshold
                </label>
                <input
                  type="number"
                  value={eventSettings.qualification_karma}
                  onChange={(e) => updateEventSettings({ qualification_karma: Number(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Default Group Capacity
                </label>
                <input
                  type="number"
                  value={eventSettings.default_group_capacity}
                  onChange={(e) => updateEventSettings({ default_group_capacity: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Registration Open Date
                </label>
                <input
                  type="text"
                  value={eventSettings.registration_start}
                  onChange={(e) => updateEventSettings({ registration_start: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Registration End Date
                </label>
                <input
                  type="text"
                  value={eventSettings.registration_end}
                  onChange={(e) => updateEventSettings({ registration_end: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Event Start Date
                </label>
                <input
                  type="text"
                  value={eventSettings.event_start}
                  onChange={(e) => updateEventSettings({ event_start: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Event End Date
                </label>
                <input
                  type="text"
                  value={eventSettings.event_end}
                  onChange={(e) => updateEventSettings({ event_end: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Rejection Modal */}
      {rejectingSub && (
        <div className="modal-backdrop" onClick={() => setRejectingSub(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#EF4444', marginBottom: '8px' }}>
              Admin Rejection Notice
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--warm-white-dim)', marginBottom: '16px' }}>
              Provide explicit rejection reason for {rejectingSub.student_name}.
            </p>

            <textarea
              rows={4}
              placeholder="e.g. μLearn link does not match the claimed quest task requirements. Please correct link and resubmit..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="input-field"
              style={{ marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectingSub(null)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleConfirmAdminReject}
                className="btn-primary"
                style={{ background: '#EF4444', borderColor: '#DC2626' }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {certStudent && (
        <CertificateModal
          isOpen={Boolean(certStudent)}
          onClose={() => setCertStudent(null)}
          user={certStudent}
          verifiedKarma={
            submissions
              .filter((s) => s.student_id === certStudent.id && s.status === 'VERIFIED')
              .reduce((sum, s) => sum + s.claimed_karma, 0)
          }
          groupName={groups.find((g) => g.id === certStudent.group_id)?.name}
          type="PARTICIPANT"
        />
      )}
    </div>
  );
};
