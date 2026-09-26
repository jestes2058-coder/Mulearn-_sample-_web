import React from 'react';
import { Compass, Sparkles, CheckCircle2, ArrowRight, ExternalLink, Zap, Trophy, ShieldCheck } from 'lucide-react';

interface HowItWorksViewProps {
  onOpenAuth: (defaultTab?: 'login' | 'student-register' | 'volunteer-register') => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onOpenAuth }) => {
  return (
    <div className="max-w-page" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="badge badge-volunteer" style={{ marginBottom: '8px' }}>
          <Compass size={14} /> COMPLETE WALKTHROUGH
        </div>
        <h1 style={{ fontSize: '2.6rem', color: '#FFF', marginBottom: '8px' }}>
          How STRIDE Works
        </h1>
        <p style={{ color: 'var(--warm-white-dim)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          From creating your μLearn ID to conquering the 3,000 Verified Karma milestone and claiming your certificate.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Step 1 */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-blue-light)' }}>
              01
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>Register & Pick a Group</h3>
          </div>
          <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '14px' }}>
            Sign up with your personal student information, college name, branch, and μLearn username. Choose an available student group before capacity fills up!
          </p>
          <div style={{ background: 'rgba(51, 104, 160, 0.15)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
            ✓ Group capacity is strictly limited to ensure personal mentor attention.
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
              02
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>Explore μJourney Quests</h3>
          </div>
          <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '14px' }}>
            Browse hundreds of hands-on learning tasks across Web Development, Python, Open Source, Git, IoT, Cloud, and Soft Skills.
          </p>
          <a
            href="https://app.mulearn.org"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#38BDF8', fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
          >
            Explore μJourney on μLearn <ExternalLink size={13} />
          </a>
        </div>

        {/* Step 3 */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
              03
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>Submit Task Proofs</h3>
          </div>
          <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '14px' }}>
            Once a task is finished, submit your μLearn task link, claimed Karma points, detailed description, and screenshot proof directly from your Student Dashboard.
          </p>
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#FBBF24' }}>
            ⚠️ Duplicate task submissions are automatically prevented.
          </div>
        </div>

        {/* Step 4 */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>
              04
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>Verification & Ranking</h3>
          </div>
          <p style={{ color: 'var(--warm-white-subtle)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '14px' }}>
            Your assigned group volunteer performs Stage 1 review, followed by Admin Stage 2 verification. Approved Karma immediately credits to your score and climbs the leaderboard!
          </p>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#34D399' }}>
            🎉 Reach 3,000 Verified Karma to unlock your downloadable Certificate!
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => onOpenAuth('student-register')}
          className="btn-gold"
          style={{ padding: '14px 32px', fontSize: '1.05rem' }}
        >
          Begin Your STRIDE Registration <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
