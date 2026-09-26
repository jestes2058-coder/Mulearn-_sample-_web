import React from 'react';
import { Sparkles, Mail, ArrowUp, ShieldCheck, Trophy, Users, Award, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FooterProps {
  setActiveView: (view: string) => void;
  onOpenAuth: (defaultTab?: 'login' | 'student-register' | 'volunteer-register') => void;
  onOpenSupabaseConfig: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onOpenAuth, onOpenSupabaseConfig }) => {
  const { eventSettings, isSupabaseConnected } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (view: string) => {
    setActiveView(view);
    scrollToTop();
  };

  return (
    <footer
      style={{
        background: '#02050D',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '64px',
        paddingBottom: '40px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="max-w-container" style={{ padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Col 1: Brand & Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
                  padding: '2px',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/stride-logo.jpg"
                    alt="STRIDE Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.45)' }}
                  />
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: '#FFF',
                    letterSpacing: '0.04em',
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  STRIDE
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  μLearn
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              The official practical skill development and quest platform for first-year students. Complete μJourney tasks, earn verified Karma, and compete on the live transparent leaderboard.
            </p>

            {/* Live Operational Status Indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: '#10B981',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <span>{isSupabaseConnected ? 'Supabase Live • Online' : 'Local State Engine • Active'}</span>
            </div>
          </div>

          {/* Col 2: Challenge Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              Challenge Sections
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <button onClick={() => handleNav('home')} className="footer-link-btn">
                Home Overview
              </button>
              <button onClick={() => handleNav('how-it-works')} className="footer-link-btn">
                How It Works (4 Steps)
              </button>
              <button onClick={() => handleNav('groups')} className="footer-link-btn">
                Groups & Capacity Tracker
              </button>
              <button onClick={() => handleNav('leaderboard')} className="footer-link-btn">
                Live Student Leaderboard
              </button>
              <button onClick={() => handleNav('rules')} className="footer-link-btn">
                Rules & Karma Qualification
              </button>
              <button onClick={() => handleNav('timeline')} className="footer-link-btn">
                Event Timeline (Aug - Sep 2027)
              </button>
            </div>
          </div>

          {/* Col 3: Portals & Registration */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              Portals & Verification
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <button onClick={() => onOpenAuth('student-register')} className="footer-link-btn">
                Student Registration
              </button>
              <button onClick={() => onOpenAuth('volunteer-register')} className="footer-link-btn">
                Volunteer Mentor Registration
              </button>
              <button onClick={() => onOpenAuth('login')} className="footer-link-btn">
                Participant & Staff Sign In
              </button>
              <button onClick={onOpenSupabaseConfig} className="footer-link-btn">
                Supabase SQL Database Config
              </button>
              <a
                href="https://mulearn.org"
                target="_blank"
                rel="noreferrer"
                className="footer-link-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Official μLearn Website <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Col 4: Important Event Dates */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              Event Schedule
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Calendar size={15} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FFF' }}>Registration Period:</strong>
                  <div>20 July 2027 – 22 August 2027</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Trophy size={15} color="var(--accent-amber)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FFF' }}>STRIDE Event Dates:</strong>
                  <div>25 August 2027 – 5 September 2027</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={15} color="var(--accent-indigo)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FFF' }}>Timezone:</strong>
                  <div>Asia/Kolkata (IST, UTC+5:30)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
          }}
        >
          <div>
            © 2027 STRIDE Challenge Platform. Powered by μLearn Community. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Minimum 3,000 Verified Karma for Certification</span>
            <button
              onClick={scrollToTop}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-high)',
                borderRadius: '8px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
            >
              Back to Top <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-body);
          font-size: 0.88rem;
          text-align: left;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s ease;
        }
        .footer-link-btn:hover {
          color: var(--accent-cyan);
        }
      `}</style>
    </footer>
  );
};
