import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRegistrationForm } from '../registration/StudentRegistrationForm';
import { VolunteerRegistrationForm } from '../registration/VolunteerRegistrationForm';
import { X, LogIn, UserPlus, HeartHandshake, AlertTriangle, ArrowRight } from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'student-register' | 'volunteer-register';
  onSuccessRedirect: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  onSuccessRedirect,
}) => {
  const { login } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'student-register' | 'volunteer-register'>(defaultTab);

  React.useEffect(() => {
    if (isOpen && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Please enter your registered email address.');
      return;
    }

    try {
      setIsLoggingIn(true);
      setLoginError(null);
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.message);
        setIsLoggingIn(false);
        return;
      }
      onSuccessRedirect();
      onClose();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegistrationSuccess = (user: UserProfile) => {
    setTimeout(() => {
      onSuccessRedirect();
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: activeTab === 'login' ? '460px' : '580px', width: '94vw' }}
      >
        {/* Header Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(51, 104, 160, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              style={{
                background: activeTab === 'login' ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === 'login' ? '#FFF' : 'var(--warm-white-dim)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <LogIn size={15} /> Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('student-register');
                setLoginError(null);
              }}
              style={{
                background: activeTab === 'student-register' ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === 'student-register' ? '#FFF' : 'var(--warm-white-dim)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <UserPlus size={15} /> Student
            </button>
            <button
              onClick={() => {
                setActiveTab('volunteer-register');
                setLoginError(null);
              }}
              style={{
                background: activeTab === 'volunteer-register' ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === 'volunteer-register' ? '#FFF' : 'var(--warm-white-dim)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <HeartHandshake size={15} /> Volunteer
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--warm-white)',
              cursor: 'pointer',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '6px' }}>
                  Sign In to STRIDE
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--warm-white-dim)' }}>
                  Access your Student, Volunteer, or Admin challenge portal.
                </p>
              </div>

              {loginError && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    fontSize: '0.84rem',
                    color: '#FCA5A5',
                  }}
                >
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                  Registered Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul.nair27@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                {isLoggingIn ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--warm-white-dim)' }}>
                  Don't have an account yet?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('student-register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Register as Student
                </button>
              </div>
            </form>
          )}

          {activeTab === 'student-register' && (
            <StudentRegistrationForm
              onSuccess={handleRegistrationSuccess}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}

          {activeTab === 'volunteer-register' && (
            <VolunteerRegistrationForm
              onSuccess={handleRegistrationSuccess}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
