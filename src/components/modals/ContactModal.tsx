import React, { useState } from 'react';
import { X, Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              ENTERPRISE & EARLY ACCESS
            </span>
            <h3 style={{ fontSize: '1.5rem', color: '#FFF', margin: '4px 0 0' }}>
              Connect with AETHERIS
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--text-pure)',
              cursor: 'pointer',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '6px' }}>Request Transmitted</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              An AETHERIS systems engineer will reach out to schedule your custom architecture review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Corporate / Academic Email *
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Organization / Team
              </label>
              <input
                type="text"
                placeholder="e.g. NextGen Autonomous Robotics"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Project Scope / Technical Inquiries
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about your workload latency targets, scale requirements, or edge deployments..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-field"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '6px' }}>
              Request Early Access & Technical Briefing <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
