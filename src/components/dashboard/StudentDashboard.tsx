import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KarmaSubmission } from '../../types';
import {
  Award,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Trophy,
  Users,
  Bell,
  HelpCircle,
  FileText,
  User,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';
import { CertificateModal } from '../common/CertificateModal';
import confetti from 'canvas-confetti';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    currentStudentStats,
    submissions,
    submitTask,
    eventSettings,
    eventPhase,
    leaderboard,
    groups,
    allUsers,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Submit Task Form State
  const [taskForm, setTaskForm] = useState({
    task_name: '',
    mulearn_task_link: '',
    claimed_karma: 200,
    description: '',
    proof_url: '',
    proof_filename: '',
    original_submission_id: '',
  });

  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Resubmit Modal
  const [resubmittingTask, setResubmittingTask] = useState<KarmaSubmission | null>(null);

  if (!currentUser || currentUser.role !== 'STUDENT') {
    return (
      <div className="max-w-page" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Student Access Required</h2>
        <p style={{ color: 'var(--warm-white-dim)', marginTop: '8px' }}>
          Please sign in with a registered student account.
        </p>
      </div>
    );
  }

  const studentSubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.task_name.trim()) {
      setSubmitStatus({ success: false, message: 'Please enter a Task Name.' });
      return;
    }
    if (!taskForm.mulearn_task_link.trim() || !taskForm.mulearn_task_link.includes('http')) {
      setSubmitStatus({ success: false, message: 'Please provide a valid μLearn Task Link.' });
      return;
    }
    if (!taskForm.description.trim()) {
      setSubmitStatus({ success: false, message: 'Please describe the work you completed.' });
      return;
    }
    if (taskForm.claimed_karma <= 0) {
      setSubmitStatus({ success: false, message: 'Claimed Karma must be greater than 0.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      const res = submitTask({
        task_name: taskForm.task_name,
        mulearn_task_link: taskForm.mulearn_task_link,
        claimed_karma: taskForm.claimed_karma,
        description: taskForm.description,
        proof_url: taskForm.proof_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
        proof_filename: taskForm.proof_filename || 'task_proof_evidence.png',
        original_submission_id: taskForm.original_submission_id || undefined,
      });

      setSubmitStatus(res);
      if (res.success) {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        setTaskForm({
          task_name: '',
          mulearn_task_link: '',
          claimed_karma: 200,
          description: '',
          proof_url: '',
          proof_filename: '',
          original_submission_id: '',
        });
        setResubmittingTask(null);
      }
    } catch (err: any) {
      setSubmitStatus({ success: false, message: err.message || 'Submission failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startResubmit = (sub: KarmaSubmission) => {
    setTaskForm({
      task_name: sub.task_name,
      mulearn_task_link: sub.mulearn_task_link,
      claimed_karma: sub.claimed_karma,
      description: `Resubmission: ${sub.description}`,
      proof_url: sub.proof_url || '',
      proof_filename: sub.proof_filename || '',
      original_submission_id: sub.id,
    });
    setResubmittingTask(sub);
    setActiveTab('submit-task');
  };

  const getStatusBadge = (status: KarmaSubmission['status']) => {
    switch (status) {
      case 'PENDING_VOLUNTEER_REVIEW':
        return <span className="badge badge-pending">🟡 Pending Volunteer Review</span>;
      case 'VOLUNTEER_APPROVED':
      case 'PENDING_ADMIN_REVIEW':
        return <span className="badge badge-volunteer">🔵 Pending Admin Review</span>;
      case 'VERIFIED':
        return <span className="badge badge-verified">🟢 Verified</span>;
      case 'REJECTED':
        return <span className="badge badge-rejected">🔴 Rejected</span>;
      case 'RESUBMITTED':
        return <span className="badge badge-resubmitted">🟣 Resubmitted</span>;
      default:
        return <span className="badge badge-pending">{status}</span>;
    }
  };

  return (
    <div className="max-w-page" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
      {/* Header Banner */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-cyan) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)',
              fontWeight: 900,
              fontSize: '1.4rem',
              color: '#FFF',
            }}
          >
            {currentUser.full_name[0]}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.6rem', color: '#FFF', margin: 0 }}>
                {currentUser.full_name}
              </h1>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                {currentUser.registration_id}
              </span>
            </div>
            <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              {currentStudentStats.assignedGroup?.name || 'Group Alpha'} • {currentUser.college} • @{currentUser.mulearn_username}
            </p>
          </div>
        </div>

        {/* Qualification Status Badge */}
        <div>
          {currentStudentStats.isQualified ? (
            <div
              className="badge badge-qualified"
              style={{ padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer' }}
              onClick={() => setIsCertModalOpen(true)}
            >
              <Award size={18} /> ✅ 3,000 KARMA QUALIFIED
            </div>
          ) : (
            <div className="badge badge-not-qualified" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> ❌ NOT QUALIFIED ({currentStudentStats.verifiedKarma} / 3,000)
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="tabs-header" style={{ marginBottom: '24px' }}>
        {[
          { id: 'overview', label: 'Overview', icon: <Zap size={16} /> },
          { id: 'profile', label: 'My Profile', icon: <User size={16} /> },
          { id: 'submit-task', label: 'Submit Task', icon: <Upload size={16} /> },
          { id: 'history', label: `Submissions (${studentSubmissions.length})`, icon: <FileText size={16} /> },
          { id: 'karma', label: 'Karma Breakdown', icon: <TrendingUp size={16} /> },
          { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={16} /> },
          { id: 'my-group', label: 'My Group', icon: <Users size={16} /> },
          { id: 'certificate', label: 'Certificate', icon: <Award size={16} /> },
          { id: 'help', label: 'Help & Rules', icon: <HelpCircle size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top 4 Quick Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="stat-card">
              <span className="stat-label">Verified Karma</span>
              <span className="stat-value" style={{ color: '#10B981' }}>
                {currentStudentStats.verifiedKarma.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                {currentStudentStats.isQualified ? 'Qualification Met!' : `${3000 - currentStudentStats.verifiedKarma} to qualify`}
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Pending Reviews</span>
              <span className="stat-value" style={{ color: '#F59E0B' }}>
                {currentStudentStats.pendingKarma.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                Awaiting Volunteer / Admin
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Current Rank</span>
              <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
                {currentStudentStats.rank ? `#${currentStudentStats.rank}` : 'Unranked'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                On Live Student Leaderboard
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Assigned Group</span>
              <span className="stat-value" style={{ fontSize: '1.25rem', color: '#FFF' }}>
                {currentStudentStats.assignedGroup?.name || 'Group Alpha'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                {currentStudentStats.assignedVolunteers.length > 0
                  ? `Mentor: ${currentStudentStats.assignedVolunteers[0].full_name}`
                  : 'Assigned Mentors Active'}
              </span>
            </div>
          </div>

          {/* Animated Qualification Meter Card */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              border: currentStudentStats.isQualified ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
              background: currentStudentStats.isQualified
                ? 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15) 0%, rgba(14, 23, 38, 0.9) 100%)'
                : 'var(--bg-card)',
            }}
          >
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>
                  3,000 Karma Qualification Meter
                </h3>
                <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  {currentStudentStats.qualificationPercent}% towards official STRIDE 2027 completion certificate
                </p>
              </div>

              {currentStudentStats.isQualified && (
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Award size={16} /> View Certificate
                </button>
              )}
            </div>

            <div className="progress-track" style={{ height: '20px', marginBottom: '12px' }}>
              <div
                className={`progress-fill ${currentStudentStats.isQualified ? 'progress-fill-gold' : ''}`}
                style={{ width: `${currentStudentStats.qualificationPercent}%` }}
              />
            </div>

            <div className="flex-between" style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--warm-white-subtle)' }}>
                Current Verified: <strong style={{ color: '#10B981' }}>{currentStudentStats.verifiedKarma} Karma</strong>
              </span>
              <span style={{ color: 'var(--accent-gold)' }}>
                Required Threshold: <strong>3,000 Karma</strong>
              </span>
            </div>
          </div>

          {/* Recent Submissions Quick Preview */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#FFF', margin: 0 }}>Recent Task Submissions</h3>
              <button onClick={() => setActiveTab('submit-task')} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                + Submit New Task
              </button>
            </div>

            {studentSubmissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--warm-white-dim)' }}>
                <Upload size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ fontWeight: 600, color: 'var(--warm-white)' }}>No tasks submitted yet.</p>
                <p style={{ fontSize: '0.85rem' }}>Complete your first μJourney quest and start earning Karma!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {studentSubmissions.slice(0, 3).map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: '#FFF', margin: '0 0 4px 0' }}>
                        {sub.task_name}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--warm-white-dim)' }}>
                        Claimed: <strong style={{ color: 'var(--accent-cyan)' }}>+{sub.claimed_karma} Karma</strong> • {new Date(sub.submitted_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getStatusBadge(sub.status)}
                      {sub.status === 'REJECTED' && (
                        <button
                          onClick={() => startResubmit(sub)}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }}
                        >
                          <RotateCcw size={12} /> Submit Again
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '20px' }}>Student Profile Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Full Name
              </span>
              <strong style={{ color: '#FFF', fontSize: '1.05rem' }}>{currentUser.full_name}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Official Registration ID
              </span>
              <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {currentUser.registration_id}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Email Address
              </span>
              <span style={{ color: 'var(--warm-white)' }}>{currentUser.email}</span>
            </div>

            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Phone Number
              </span>
              <span style={{ color: 'var(--warm-white)' }}>{currentUser.phone}</span>
            </div>

            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                College
              </span>
              <span style={{ color: 'var(--warm-white)' }}>{currentUser.college}</span>
            </div>

            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Branch & Semester
              </span>
              <span style={{ color: 'var(--warm-white)' }}>
                {currentUser.branch} ({currentUser.semester})
              </span>
            </div>

            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Student ID / Admission No
              </span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{currentUser.student_id}</span>
            </div>

            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                μLearn Username
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8' }}>
                @{currentUser.mulearn_username}
              </span>
            </div>

            <div>
              <span style={{ color: 'var(--warm-white-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Locked Group Assignment
              </span>
              <strong style={{ color: '#10B981' }}>
                {currentStudentStats.assignedGroup?.name || 'Group Alpha'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUBMIT TASK */}
      {activeTab === 'submit-task' && (
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <div className="badge badge-volunteer" style={{ marginBottom: '8px' }}>
              <Upload size={14} /> μJOURNEY TASK SUBMISSION
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFF', margin: 0 }}>
              {resubmittingTask ? `Resubmit Task: ${resubmittingTask.task_name}` : 'Submit μJourney Task for Verification'}
            </h2>
            <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.88rem', marginTop: '6px' }}>
              Submissions undergo Stage 1 review by your group volunteer followed by Stage 2 Admin verification.
            </p>
          </div>

          {submitStatus && (
            <div
              style={{
                background: submitStatus.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: submitStatus.success ? '1px solid #10B981' : '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                color: submitStatus.success ? '#34D399' : '#FCA5A5',
                fontSize: '0.88rem',
              }}
            >
              {submitStatus.success ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              <span>{submitStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Task Name *
              </label>
              <input
                type="text"
                placeholder="e.g. μJourney: Setup GitHub & Markdown Profile"
                value={taskForm.task_name}
                onChange={(e) => setTaskForm({ ...taskForm, task_name: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  μLearn Task URL / Reference Link *
                </label>
                <input
                  type="url"
                  placeholder="https://app.mulearn.org/tasks/..."
                  value={taskForm.mulearn_task_link}
                  onChange={(e) => setTaskForm({ ...taskForm, mulearn_task_link: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Claimed Karma Points *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={taskForm.claimed_karma}
                  onChange={(e) => setTaskForm({ ...taskForm, claimed_karma: Number(e.target.value) })}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Description of Completed Work *
              </label>
              <textarea
                rows={4}
                placeholder="Describe your implementation, links to repositories, live deployments, and what you learned..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="input-field"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            {/* Proof Upload Simulation / URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Proof Screenshot / Evidence URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or uploaded screenshot link"
                value={taskForm.proof_url}
                onChange={(e) => setTaskForm({ ...taskForm, proof_url: e.target.value })}
                className="input-field"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--warm-white-dim)', marginTop: '4px', display: 'block' }}>
                Secure file validation: Only PNG, JPG, or PDF proof assets are accepted.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            >
              {isSubmitting ? 'Submitting to Volunteer Queue...' : 'Submit Task for Verification'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SUBMISSION HISTORY */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <h2 style={{ fontSize: '1.6rem', color: '#FFF', margin: 0 }}>Submission History & Review Log</h2>
            <span className="badge badge-volunteer">{studentSubmissions.length} Total Submissions</span>
          </div>

          {studentSubmissions.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--warm-white-dim)' }}>
              <FileText size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <h3 style={{ color: '#FFF', marginBottom: '6px' }}>No Tasks Submitted Yet</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 16px' }}>
                Complete μJourney quests on μLearn and submit your proof evidence.
              </p>
              <button onClick={() => setActiveTab('submit-task')} className="btn-primary">
                Submit Your First Task
              </button>
            </div>
          ) : (
            studentSubmissions.map((sub) => (
              <div key={sub.id} className="glass-panel" style={{ padding: '24px' }}>
                <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#FFF', margin: '0 0 4px 0' }}>
                      {sub.task_name}
                    </h3>
                    <a
                      href={sub.mulearn_task_link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      View μLearn Task Reference <ExternalLink size={12} />
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#10B981', fontSize: '1.1rem' }}>
                      +{sub.claimed_karma} Karma
                    </span>
                    {getStatusBadge(sub.status)}
                  </div>
                </div>

                <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  {sub.description}
                </p>

                {/* Review Timeline / Rejection Reason */}
                {sub.reviews && sub.reviews.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '10px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      borderLeft: sub.status === 'REJECTED' ? '4px solid #EF4444' : '4px solid #10B981',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warm-white-dim)', textTransform: 'uppercase' }}>
                      Verification Review Feedback
                    </span>
                    {sub.reviews.map((rev) => (
                      <div key={rev.id} style={{ fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <strong style={{ color: rev.decision === 'APPROVE' ? '#10B981' : '#EF4444' }}>
                            {rev.stage === 'VOLUNTEER' ? 'Stage 1 (Volunteer)' : 'Stage 2 (Admin)'}: {rev.decision}
                          </strong>
                          <span style={{ color: 'var(--warm-white-dim)' }}>by {rev.reviewer_name}</span>
                        </div>
                        <p style={{ color: 'var(--warm-white)', margin: 0, fontStyle: 'italic' }}>
                          "{rev.reason}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resubmit Action Button */}
                {sub.status === 'REJECTED' && (
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => startResubmit(sub)}
                      className="btn-gold"
                      style={{ padding: '8px 18px', fontSize: '0.85rem', gap: '6px' }}
                    >
                      <RotateCcw size={14} /> Correct & Submit Again
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: KARMA BREAKDOWN */}
      {activeTab === 'karma' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '16px' }}>Karma Ledger Summary</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="stat-card">
                <span className="stat-label">Total Verified</span>
                <span className="stat-value" style={{ color: '#10B981' }}>
                  {currentStudentStats.verifiedKarma}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Pending Review</span>
                <span className="stat-value" style={{ color: '#F59E0B' }}>
                  {currentStudentStats.pendingKarma}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Rejected Karma</span>
                <span className="stat-value" style={{ color: '#EF4444' }}>
                  {currentStudentStats.rejectedKarma}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Karma Goal</span>
                <span className="stat-value" style={{ color: 'var(--accent-gold)' }}>
                  3,000
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--warm-white-dim)', lineHeight: 1.6 }}>
              Karma points are only granted upon successful completion of the two-stage verification process. Once verified, Karma immediately updates your individual score, your group's total standing, and volunteer performance.
            </p>
          </div>
        </div>
      )}

      {/* TAB 6: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '16px' }}>Live Student Standings</h2>
          <table className="stride-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Group</th>
                <th style={{ textAlign: 'right' }}>Verified Karma</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((l) => {
                const isYou = l.student_id === currentUser.id;
                return (
                  <tr
                    key={l.student_id}
                    style={{
                      background: isYou ? 'rgba(51, 104, 160, 0.25)' : undefined,
                      borderLeft: isYou ? '4px solid var(--accent-cyan)' : 'none',
                    }}
                  >
                    <td style={{ fontWeight: 800, color: l.rank <= 3 ? '#F59E0B' : 'inherit' }}>
                      {l.rank === 1 ? '🥇 #1' : l.rank === 2 ? '🥈 #2' : l.rank === 3 ? '🥉 #3' : `#${l.rank}`}
                    </td>
                    <td>
                      <strong>{l.student_name}</strong> {isYou && <span className="badge badge-verified">YOU</span>}
                    </td>
                    <td>{l.group_name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#10B981' }}>
                      {l.verified_karma.toLocaleString()}
                    </td>
                    <td>
                      {l.is_qualified ? (
                        <span className="badge badge-qualified">QUALIFIED</span>
                      ) : (
                        <span className="badge badge-not-qualified">IN PROGRESS</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 7: MY GROUP */}
      {activeTab === 'my-group' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div className="flex-between" style={{ marginBottom: '18px' }}>
            <div>
              <span className="badge badge-volunteer" style={{ marginBottom: '6px' }}>YOUR ENROLLED GROUP</span>
              <h2 style={{ fontSize: '1.8rem', color: '#FFF', margin: 0 }}>
                {currentStudentStats.assignedGroup?.name || 'Group Alpha'}
              </h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)', textTransform: 'uppercase' }}>
                Total Group Karma
              </span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#10B981' }}>
                {currentStudentStats.assignedGroup?.total_karma?.toLocaleString() || '6,100'} Karma
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--warm-white-subtle)', marginBottom: '24px' }}>
            Work together with your group peers to elevate your group rank and boost your assigned volunteers towards the Top Volunteer recognition!
          </p>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '12px' }}>Assigned μLearn Volunteer Mentors</h4>
            {currentStudentStats.assignedVolunteers.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {currentStudentStats.assignedVolunteers.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      background: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                    }}
                  >
                    <strong style={{ color: '#FFF', display: 'block' }}>{v.full_name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                      @{v.mulearn_username} • {v.college}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--warm-white-dim)', fontSize: '0.85rem' }}>
                Volunteer mentors will be allocated by the administration.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: CERTIFICATE */}
      {activeTab === 'certificate' && (
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: currentStudentStats.isQualified ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: currentStudentStats.isQualified ? '2px solid #F59E0B' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Award size={32} color={currentStudentStats.isQualified ? '#F59E0B' : 'var(--warm-white-dim)'} />
          </div>

          <h2 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '8px' }}>
            STRIDE 2027 Official Certificate
          </h2>

          {currentStudentStats.isQualified ? (
            <div>
              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px' }}>
                Congratulations! You have earned <strong>{currentStudentStats.verifiedKarma} Verified Karma</strong> and successfully qualified for STRIDE 2027 recognition.
              </p>
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="btn-gold"
                style={{ padding: '12px 28px', fontSize: '1rem', gap: '8px' }}
              >
                <Award size={18} /> Open & Download Certificate
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 20px' }}>
                You need <strong>{3000 - currentStudentStats.verifiedKarma} more Verified Karma</strong> to unlock your certificate. Submit completed μJourney tasks to reach the 3,000 threshold!
              </p>
              <div className="badge badge-pending">Locked • Requires 3,000 Verified Karma</div>
            </div>
          )}
        </div>
      )}

      {/* TAB 9: HELP & RULES */}
      {activeTab === 'help' && (
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#FFF', marginBottom: '16px' }}>Student Challenge Guide</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--warm-white-subtle)' }}>
            <p>
              • <strong>Qualification:</strong> Reach at least 3,000 Verified Karma before September 5, 2027.
            </p>
            <p>
              • <strong>Submission Process:</strong> Paste your public μLearn task link and screenshot proof. Assigned volunteers review Stage 1, followed by Admin Stage 2 verification.
            </p>
            <p>
              • <strong>Rejections:</strong> If rejected, view reviewer comments, make the required corrections, and click "Submit Again".
            </p>
            <p>
              • <strong>Group Policy:</strong> Your group assignment is permanent and cannot be modified.
            </p>
          </div>
        </div>
      )}

      {/* Certificate Modal View */}
      {currentUser && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          user={currentUser}
          verifiedKarma={currentStudentStats.verifiedKarma}
          groupName={currentStudentStats.assignedGroup?.name}
          type={currentStudentStats.rank === 1 ? 'TOP_STUDENT' : 'PARTICIPANT'}
        />
      )}
    </div>
  );
};
