import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, Group } from '../../types';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Lock,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentRegistrationFormProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { groups, registerStudent, isRegistrationOpen } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    full_name: '',
    college: '',
    branch: '',
    semester: 'Semester 1',
    phone: '',
    email: '',
    student_id: '',
    mulearn_username: '',
    password: '',
    confirm_password: '',
    group_id: '',
  });

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);

  const activeGroups = groups.filter((g) => g.status === 'ACTIVE');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handleSelectGroup = (group: Group) => {
    const isFull = (group.member_count || 0) >= group.capacity;
    if (isFull) {
      setErrorMessage(`Group "${group.name}" is already at full capacity (${group.capacity}/${group.capacity}). Please select another group.`);
      return;
    }
    setFormData({ ...formData, group_id: group.id });
    setSelectedGroup(group);
    setErrorMessage(null);
  };

  const validateStep1 = () => {
    if (!formData.full_name.trim()) return 'Please enter your Full Name.';
    if (!formData.college.trim()) return 'Please enter your College Name.';
    if (!formData.branch.trim()) return 'Please enter your Branch of study.';
    if (!formData.phone.trim()) return 'Please enter a valid Phone Number.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid Email address.';
    if (!formData.student_id.trim()) return 'Please enter your Student ID / Admission Number.';
    if (!formData.mulearn_username.trim()) return 'Please enter your μLearn ID / Username.';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.password || formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirm_password) return 'Passwords do not match.';
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setErrorMessage(null);
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setErrorMessage(null);
      setStep(3);
    } else if (step === 3) {
      if (!formData.group_id) {
        setErrorMessage('Please choose an available student group to continue.');
        return;
      }
      setErrorMessage(null);
      setStep(4);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await registerStudent({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        branch: formData.branch,
        semester: formData.semester,
        student_id: formData.student_id,
        mulearn_username: formData.mulearn_username,
        password: formData.password,
        group_id: formData.group_id,
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.message);
        setIsSubmitting(false);
        return;
      }

      setRegisteredUser(res.user);
      setStep(5);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRegistrationOpen) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 20px' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertCircle size={28} color="#EF4444" />
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Registration Currently Closed</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--warm-white-dim)', maxWidth: '400px', margin: '0 auto 20px' }}>
          STRIDE 2027 registrations are only active during the configured registration window (20 July – 22 August 2027) unless overridden by Super Admin.
        </p>
        <button onClick={onSwitchToLogin} className="btn-secondary">
          Sign In with Existing Account
        </button>
      </div>
    );
  }

  // Step 5: Success Screen
  if (step === 5 && registeredUser) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '2px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle2 size={36} color="#10B981" />
        </div>

        <div className="badge badge-verified" style={{ marginBottom: '12px', fontSize: '0.85rem' }}>
          🟢 REGISTERED
        </div>

        <h2 style={{ fontSize: '1.6rem', color: '#FFF', marginBottom: '8px' }}>
          Welcome to STRIDE, {registeredUser.full_name}!
        </h2>

        <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Your student registration has been confirmed. You are officially enrolled in the challenge.
        </p>

        {/* Registration ID Banner */}
        <div
          style={{
            background: 'rgba(51, 104, 160, 0.18)',
            border: '1px solid var(--border-active)',
            borderRadius: '12px',
            padding: '16px',
            maxWidth: '380px',
            margin: '0 auto 24px',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)', textTransform: 'uppercase', display: 'block' }}>
            Official Registration ID
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {registeredUser.registration_id}
          </span>
          <div style={{ fontSize: '0.78rem', color: 'var(--warm-white-subtle)', marginTop: '6px' }}>
            Group: <strong style={{ color: '#FFF' }}>{selectedGroup?.name}</strong>
          </div>
        </div>

        <button
          onClick={() => onSuccess(registeredUser)}
          className="btn-primary"
          style={{ width: '100%', maxWidth: '340px', padding: '12px' }}
        >
          Enter Student Dashboard <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Wizard Progress Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        {[
          { num: 1, label: 'Personal Info' },
          { num: 2, label: 'Security' },
          { num: 3, label: 'Group Picker' },
          { num: 4, label: 'Confirm' },
        ].map((s) => (
          <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step === s.num ? 'var(--primary-blue)' : step > s.num ? '#10B981' : 'rgba(255, 255, 255, 0.08)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: step === s.num ? '2px solid var(--accent-cyan)' : 'none',
              }}
            >
              {step > s.num ? <CheckCircle2 size={16} /> : s.num}
            </div>
            <span style={{ fontSize: '0.7rem', color: step >= s.num ? 'var(--warm-white)' : 'var(--warm-white-dim)', textAlign: 'center' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '18px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: '#FCA5A5',
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Personal Info */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="e.g. Rahul Nair"
              value={formData.full_name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98460 00000"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                College Name *
              </label>
              <input
                type="text"
                name="college"
                placeholder="e.g. Model Engineering College"
                value={formData.college}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                Branch / Department *
              </label>
              <input
                type="text"
                name="branch"
                placeholder="e.g. Computer Science"
                value={formData.branch}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                Semester *
              </label>
              <select name="semester" value={formData.semester} onChange={handleChange} className="input-field">
                <option value="Semester 1">Semester 1 (First Year)</option>
                <option value="Semester 2">Semester 2 (First Year)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                Student ID / Adm No *
              </label>
              <input
                type="text"
                name="student_id"
                placeholder="e.g. MEC27CS042"
                value={formData.student_id}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                μLearn Username *
              </label>
              <input
                type="text"
                name="mulearn_username"
                placeholder="e.g. rahul_mulearn"
                value={formData.mulearn_username}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Next: Account Password <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 2: Security */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
              Create Password *
            </label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Re-enter password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={handleNext} className="btn-primary" style={{ flex: 2 }}>
              Next: Select Group <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Group Selection */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Select Your STRIDE Group</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--warm-white-dim)' }}>
              Choose an active group with available capacity. Each group collaborates with assigned μLearn volunteers.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
            {activeGroups.map((grp) => {
              const currentMembers = grp.member_count || 0;
              const isFull = currentMembers >= grp.capacity;
              const isSelected = formData.group_id === grp.id;

              return (
                <div
                  key={grp.id}
                  onClick={() => !isFull && handleSelectGroup(grp)}
                  style={{
                    background: isSelected
                      ? 'rgba(51, 104, 160, 0.3)'
                      : isFull
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected
                      ? '2px solid var(--accent-cyan)'
                      : isFull
                      ? '1px solid rgba(239, 68, 68, 0.3)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    cursor: isFull ? 'not-allowed' : 'pointer',
                    opacity: isFull ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFF' }}>{grp.name}</span>
                      {isSelected && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                          [SELECTED]
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--warm-white-dim)' }}>
                      Capacity: {currentMembers} / {grp.capacity} students
                    </span>
                  </div>

                  <div>
                    {isFull ? (
                      <span className="badge badge-full">⚠️ FULL</span>
                    ) : (
                      <span className="badge badge-available">🟢 AVAILABLE</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1 }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={handleNext} disabled={!formData.group_id} className="btn-primary" style={{ flex: 2 }}>
              Review & Confirm <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Warning & Final Confirmation */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Strict Group Warning Card */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.14)',
              border: '1.5px solid #F59E0B',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
            }}
          >
            <AlertTriangle size={24} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#F59E0B', fontSize: '0.95rem', margin: '0 0 6px 0', fontWeight: 800 }}>
                ⚠️ IMPORTANT GROUP LOCK NOTICE
              </h4>
              <p style={{ color: 'var(--warm-white)', fontSize: '0.84rem', lineHeight: 1.5, margin: 0 }}>
                <strong>Your selected group cannot be changed after registration.</strong> Please double-check your group selection before continuing. Only authorized administrators may modify group assignments after this step.
              </p>
            </div>
          </div>

          {/* Registration Summary Card */}
          <div
            style={{
              background: 'rgba(14, 23, 38, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div className="flex-between">
              <span style={{ color: 'var(--warm-white-dim)' }}>Name:</span>
              <strong style={{ color: '#FFF' }}>{formData.full_name}</strong>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--warm-white-dim)' }}>Email:</span>
              <span>{formData.email}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--warm-white-dim)' }}>College:</span>
              <span>{formData.college}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--warm-white-dim)' }}>μLearn Username:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{formData.mulearn_username}</span>
            </div>
            <div className="flex-between" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <span style={{ color: 'var(--warm-white-dim)' }}>Assigned Group:</span>
              <strong style={{ color: '#10B981', fontSize: '0.95rem' }}>{selectedGroup?.name}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(3)} className="btn-secondary" style={{ flex: 1 }}>
              <ArrowLeft size={16} /> Change Group
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="btn-gold"
              style={{ flex: 2, padding: '12px' }}
            >
              {isSubmitting ? 'Registering...' : 'I Confirm — Register Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
