import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import { User, Mail, Phone, BookOpen, GraduationCap, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VolunteerRegistrationFormProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export const VolunteerRegistrationForm: React.FC<VolunteerRegistrationFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { registerVolunteer } = useApp();

  const [formData, setFormData] = useState({
    full_name: '',
    college: '',
    branch: '',
    semester: 'Semester 5',
    phone: '',
    email: '',
    student_id: '',
    mulearn_username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredVolunteer, setRegisteredVolunteer] = useState<UserProfile | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) return setErrorMessage('Please enter your Full Name.');
    if (!formData.email.trim()) return setErrorMessage('Please enter your Email address.');
    if (!formData.phone.trim()) return setErrorMessage('Please enter your Phone Number.');
    if (!formData.college.trim()) return setErrorMessage('Please enter your College Name.');
    if (!formData.mulearn_username.trim()) return setErrorMessage('Please enter your μLearn Username.');
    if (!formData.password || formData.password.length < 6) return setErrorMessage('Password must be at least 6 characters.');

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await registerVolunteer({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        branch: formData.branch,
        semester: formData.semester,
        student_id: formData.student_id || 'VOL-REG',
        mulearn_username: formData.mulearn_username,
        password: formData.password,
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.message);
        setIsSubmitting(false);
        return;
      }

      setRegisteredVolunteer(res.user);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      setErrorMessage(err.message || 'Volunteer registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registeredVolunteer) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '2px solid #3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <CheckCircle2 size={36} color="#3B82F6" />
        </div>

        <div className="badge badge-volunteer" style={{ marginBottom: '12px', fontSize: '0.85rem' }}>
          VOLUNTEER REGISTERED
        </div>

        <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '8px' }}>
          Welcome, Volunteer {registeredVolunteer.full_name}!
        </h2>

        <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Your volunteer account has been created. Your registration ID is{' '}
          <strong style={{ color: 'var(--accent-cyan)' }}>{registeredVolunteer.registration_id}</strong>. An administrator will assign groups to your dashboard.
        </p>

        <button
          onClick={() => onSuccess(registeredVolunteer)}
          className="btn-primary"
          style={{ width: '100%', maxWidth: '340px', padding: '12px' }}
        >
          Enter Volunteer Dashboard <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          fontSize: '0.82rem',
          color: 'var(--warm-white)',
        }}
      >
        <ShieldCheck size={20} color="#3B82F6" style={{ flexShrink: 0 }} />
        <span>
          Volunteers mentor student groups, review Stage 1 task submissions, and compete for <strong>Top Volunteer</strong> honors!
        </span>
      </div>

      {errorMessage && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px',
            padding: '10px 14px',
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

      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
          Full Name *
        </label>
        <input
          type="text"
          name="full_name"
          placeholder="e.g. Alex Mathew"
          value={formData.full_name}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            placeholder="volunteer@mulearn.org"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 94471 00000"
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
            College *
          </label>
          <input
            type="text"
            name="college"
            placeholder="e.g. TKM College of Eng"
            value={formData.college}
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
            placeholder="e.g. alex_mathew_mu"
            value={formData.mulearn_username}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
            Branch / Department
          </label>
          <input
            type="text"
            name="branch"
            placeholder="e.g. Computer Science"
            value={formData.branch}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
            Semester / Year
          </label>
          <input
            type="text"
            name="semester"
            placeholder="e.g. Semester 5"
            value={formData.semester}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
          Password *
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
        style={{ width: '100%', marginTop: '6px', padding: '12px' }}
      >
        {isSubmitting ? 'Creating Account...' : 'Register as STRIDE Volunteer'} <ArrowRight size={16} />
      </button>
    </form>
  );
};
